import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, MapPin, Building2, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PropertyStatus = Database['public']['Enums']['property_status'];

interface PropertyWithPhotos extends Property {
  property_photos?: Array<{ photo_url: string; display_order: number }>;
  property_categories?: { name: string; code: string };
  property_action_categories?: { name: string; code: string };
  property_areas?: { name: string; full_name: string | null };
  property_conditions?: { name: string; code: string };
  is_featured?: boolean;
  featured_order?: number;
}

export default function MyProperties() {
  const [properties, setProperties] = useState<PropertyWithPhotos[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchMyProperties();
    }
  }, [user]);

  const fetchMyProperties = async () => {
    if (!user?.id) return;

    try {
      // Fetch properties created by user
      const { data: ownedData, error: ownedError } = await supabase
        .from('properties')
        .select(`
          *,
          property_photos(photo_url, display_order),
          property_categories(name, code),
          property_action_categories(name, code),
          property_areas(name, full_name),
          property_conditions(name, code)
        `)
        .eq('created_by', user.id)
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });

      if (ownedError) throw ownedError;

      // Fetch properties where user is a collaborator
      const { data: collaboratorData, error: collaboratorError } = await supabase
        .from('property_collaborators')
        .select('property_id')
        .eq('user_id', user.id);

      if (collaboratorError) throw collaboratorError;

      const collaboratorPropertyIds = collaboratorData?.map(c => c.property_id) || [];

      let collaboratorProperties: any[] = [];
      if (collaboratorPropertyIds.length > 0) {
        const { data: collabData, error: collabError } = await supabase
          .from('properties')
          .select(`
            *,
            property_photos(photo_url, display_order),
            property_categories(name, code),
            property_action_categories(name, code),
            property_areas(name, full_name),
            property_conditions(name, code)
          `)
          .in('id', collaboratorPropertyIds)
          .neq('status', 'deleted')
          .order('created_at', { ascending: false });

        if (collabError) throw collabError;
        collaboratorProperties = collabData || [];
      }

      // Combine and deduplicate properties
      const allProperties = [...(ownedData || []), ...collaboratorProperties];
      const uniqueProperties = allProperties.filter((property, index, self) =>
        index === self.findIndex((p) => p.id === property.id)
      );
      
      // Fetch featured properties info
      const { data: featuredData } = await supabase
        .from('featured_properties')
        .select('property_id, display_order');
      
      const featuredMap = new Map(
        (featuredData || []).map(f => [f.property_id, f.display_order])
      );
      
      const propertiesWithFeatured = uniqueProperties.map(p => ({
        ...p,
        is_featured: featuredMap.has(p.id),
        featured_order: featuredMap.get(p.id)
      }));
      
      setProperties(propertiesWithFeatured);
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
    if (!confirm('Вы уверены, что хотите переместить это объявление в корзину?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: 'deleted',
          deleted_at: new Date().toISOString(),
          deleted_by: user?.id
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Объявление перемещено в корзину',
      });
      fetchMyProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось переместить объявление в корзину',
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: PropertyStatus) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Статус обновлен',
      });
      fetchMyProperties();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
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

  const toggleFeatured = async (propertyId: string, isFeatured: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Только супер админ может управлять избранными объявлениями',
      });
      return;
    }

    try {
      if (isFeatured) {
        // Remove from featured
        const { error } = await supabase
          .from('featured_properties')
          .delete()
          .eq('property_id', propertyId);

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: 'Убрано из избранного',
        });
      } else {
        // Check if we have less than 5 featured
        const { data: existingFeatured } = await supabase
          .from('featured_properties')
          .select('id');

        if ((existingFeatured || []).length >= 5) {
          toast({
            variant: 'destructive',
            title: 'Ошибка',
            description: 'Максимум 5 избранных объявлений. Удалите одно, чтобы добавить новое.',
          });
          return;
        }

        // Get next available order
        const { data: featuredOrders } = await supabase
          .from('featured_properties')
          .select('display_order');

        const usedOrders = (featuredOrders || []).map(f => f.display_order);
        const nextOrder = [1, 2, 3, 4, 5].find(n => !usedOrders.includes(n)) || 1;

        const { error } = await supabase
          .from('featured_properties')
          .insert({
            property_id: propertyId,
            display_order: nextOrder,
            created_by: user?.id
          });

        if (error) throw error;

        toast({
          title: 'Успешно',
          description: `Добавлено в избранное (позиция ${nextOrder})`,
        });
      }

      fetchMyProperties();
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить статус избранного',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredProperties = statusFilter === 'all' 
    ? properties 
    : properties.filter(p => p.status === statusFilter);

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

      <div className="flex gap-4 items-center">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Фильтр по статусу" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все</SelectItem>
            <SelectItem value="published">Опубликовано</SelectItem>
            <SelectItem value="no_ads">Без рекламы</SelectItem>
            <SelectItem value="sold">Продано</SelectItem>
            <SelectItem value="deleted">Удалено</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          Найдено: {filteredProperties.length}
        </span>
      </div>

      {filteredProperties.length === 0 ? (
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
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/properties/${property.id}`)}>
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
                  <Select 
                    value={property.status} 
                    onValueChange={(value) => handleStatusChange(property.id, value as PropertyStatus)}
                  >
                    <SelectTrigger 
                      className="w-[140px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent onClick={(e) => e.stopPropagation()}>
                      <SelectItem value="published">Опубликовано</SelectItem>
                      <SelectItem value="no_ads">Без рекламы</SelectItem>
                      <SelectItem value="sold">Продано</SelectItem>
                      <SelectItem value="deleted">Удалено</SelectItem>
                    </SelectContent>
                  </Select>
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
                  {property.property_size && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Площадь:</span>
                      <span className="font-medium">{property.property_size} м²</span>
                    </div>
                  )}
                  {(property as any).property_areas && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Район:</span>
                      <span className="font-medium">{(property as any).property_areas.name}</span>
                    </div>
                  )}
                  {(property as any).property_conditions && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Состояние:</span>
                      <span className="font-medium">{(property as any).property_conditions.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/properties/${property.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Просмотр
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/properties/${property.id}/edit`);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(property.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {isAdmin && property.status === 'published' && (
                    <Button
                      variant={property.is_featured ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => toggleFeatured(property.id, property.is_featured || false, e)}
                      className={property.is_featured ? "bg-primary" : ""}
                    >
                      <Star className={`h-4 w-4 ${property.is_featured ? 'fill-current' : ''}`} />
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
