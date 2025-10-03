import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, MapPin, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface PropertyWithPhotos extends Property {
  property_photos?: Array<{ photo_url: string; display_order: number }>;
}

export default function MyProperties() {
  const [properties, setProperties] = useState<PropertyWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMyProperties();
    }
  }, [user]);

  const fetchMyProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_photos(photo_url, display_order)
        `)
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось загрузить объявления',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это объявление?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Объявление удалено',
      });
      fetchMyProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось удалить объявление',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      published: <Badge className="bg-green-500">Опубликовано</Badge>,
      no_ads: <Badge variant="secondary">Без рекламы</Badge>,
      deleted: <Badge variant="destructive">Удалено</Badge>,
      sold: <Badge className="bg-blue-500">Продано</Badge>,
    };
    return badges[status as keyof typeof badges] || null;
  };

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
          <h1 className="text-3xl font-bold text-foreground">Мои объявления</h1>
          <p className="text-muted-foreground mt-2">
            Управляйте вашими объявлениями о недвижимости
          </p>
        </div>
        <Button onClick={() => navigate('/properties/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Новое объявление
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Нет объявлений</h3>
          <p className="text-muted-foreground mb-4">
            Создайте первое объявление, чтобы начать работу
          </p>
          <Button onClick={() => navigate('/properties/new')}>
            Создать объявление
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {property.property_photos && property.property_photos.length > 0 && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img
                    src={property.property_photos.sort((a, b) => a.display_order - b.display_order)[0].photo_url}
                    alt={property.address}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      #{property.property_number}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {property.category}
                    </p>
                  </div>
                  {getStatusBadge(property.status)}
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{property.address}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Цена:</span>
                    <span className="font-semibold">
                      {property.price.toLocaleString()} {property.currency}
                    </span>
                  </div>
                  {property.total_area && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Площадь:</span>
                      <span className="font-medium">{property.total_area} м²</span>
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
                    onClick={() => navigate(`/properties/${property.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
