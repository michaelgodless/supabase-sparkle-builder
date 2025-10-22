import { useState, useEffect } from 'react';
import { RotateCcw, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type PropertyStatus = Database['public']['Enums']['property_status'];

interface PropertyWithPhotos extends Property {
  property_photos?: Array<{ photo_url: string; display_order: number }>;
  property_categories?: { name: string; code: string };
  property_action_categories?: { name: string; code: string };
  property_areas?: { name: string; full_name: string | null };
  deleted_by_profile?: Array<{ full_name: string; avatar_url: string | null }>;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export default function Trash() {
  const [properties, setProperties] = useState<PropertyWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, userRoles } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const canAccessTrash = isAdmin || userRoles.includes('manager');

  useEffect(() => {
    if (user && canAccessTrash) {
      fetchDeletedProperties();
    }
  }, [user, canAccessTrash]);

  const fetchDeletedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_photos(photo_url, display_order),
          property_categories(name, code),
          property_action_categories(name, code),
          property_areas(name, full_name),
          deleted_by_profile:profiles!properties_deleted_by_fkey(full_name, avatar_url)
        `)
        .eq('status', 'deleted')
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching deleted properties:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось загрузить удаленные объявления',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    if (!confirm('Вы уверены, что хотите восстановить это объявление?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: 'no_ads',
          deleted_at: null,
          deleted_by: null
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Объявление восстановлено',
      });
      fetchDeletedProperties();
    } catch (error) {
      console.error('Error restoring property:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось восстановить объявление',
      });
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Только супер админ может удалять объявления навсегда',
      });
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить это объявление навсегда? Это действие нельзя отменить!')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Объявление удалено навсегда',
      });
      fetchDeletedProperties();
    } catch (error) {
      console.error('Error permanently deleting property:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось удалить объявление',
      });
    }
  };

  if (!canAccessTrash) {
    return (
      <div className="container mx-auto p-6">
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">Доступ запрещен</h3>
          <p className="text-muted-foreground">
            У вас нет прав для просмотра корзины
          </p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Корзина</h1>
          <p className="text-muted-foreground mt-2">
            Удаленные объявления можно восстановить
          </p>
        </div>
      </div>

      {properties.length === 0 ? (
        <Card className="p-12 text-center">
          <Trash2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Корзина пуста</h3>
          <p className="text-muted-foreground">
            Здесь будут отображаться удаленные объявления
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {property.property_photos && property.property_photos.length > 0 && (
                <div className="aspect-video bg-muted overflow-hidden relative">
                  <img
                    src={property.property_photos.sort((a, b) => a.display_order - b.display_order)[0].photo_url}
                    alt={property.address}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Trash2 className="h-12 w-12 text-white" />
                  </div>
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">
                      #{property.property_number}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      {(property as any).property_action_categories && (
                        <p className="text-xs text-muted-foreground">
                          {(property as any).property_action_categories.name}
                        </p>
                      )}
                      {(property as any).property_categories && (
                        <p className="text-xs text-muted-foreground">
                          • {(property as any).property_categories.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>{property.address}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Цена:</span>
                    <span className="font-semibold">
                      {property.price.toLocaleString()} {property.currency}
                    </span>
                  </div>
                  {property.deleted_at && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Удалено:</span>
                      <span>{format(new Date(property.deleted_at), 'dd MMM yyyy, HH:mm', { locale: ru })}</span>
                    </div>
                  )}
                  {property.deleted_by_profile && property.deleted_by_profile.length > 0 && (
                    <div className="flex items-center gap-2 text-xs pt-2 border-t">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={property.deleted_by_profile[0].avatar_url || ''} />
                        <AvatarFallback className="text-xs">
                          {property.deleted_by_profile[0].full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-muted-foreground">
                        {property.deleted_by_profile[0].full_name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Просмотр
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleRestore(property.id)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Восстановить
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handlePermanentDelete(property.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
