import { useState, useEffect } from 'react';
import { Heart, MapPin, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FavoriteWithProperty {
  id: string;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
  created_at: string;
  property: {
    id: string;
    property_number: number;
    address: string;
    price: number;
    currency: string;
    property_size?: number;
    status: string;
  };
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          priority,
          notes,
          created_at,
          property:properties (
            id,
            property_number,
            address,
            price,
            currency,
            property_size,
            status
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data as any || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось загрузить избранное',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Объект удален из избранного',
      });
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось удалить из избранного',
      });
    }
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: <Badge className="bg-red-500">Высокий</Badge>,
      medium: <Badge className="bg-yellow-500">Средний</Badge>,
      low: <Badge variant="secondary">Низкий</Badge>,
    };
    return badges[priority as keyof typeof badges] || null;
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Избранные объекты</h1>
        <p className="text-muted-foreground mt-2">
          Ваш список интересующих объектов недвижимости
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Нет избранных объектов</h3>
          <p className="text-muted-foreground mb-4">
            Добавляйте интересующие объекты в избранное для быстрого доступа
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Перейти к объявлениям
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      #{favorite.property.property_number}
                    </h3>
                  </div>
                  {getPriorityBadge(favorite.priority)}
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{favorite.property.address}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Цена:</span>
                    <span className="font-semibold">
                      {favorite.property.price.toLocaleString()} {favorite.property.currency}
                    </span>
                  </div>
                  {favorite.property.property_size && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Площадь:</span>
                      <span className="font-medium">{favorite.property.property_size} м²</span>
                    </div>
                  )}
                </div>

                {favorite.notes && (
                  <p className="text-sm text-muted-foreground border-t pt-3">
                    {favorite.notes}
                  </p>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate(`/properties/${favorite.property.id}`)}
                  >
                    Просмотр
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemove(favorite.id)}
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
