import { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ViewingStatus } from '@/types/database';

interface ViewingWithDetails {
  id: string;
  scheduled_at: string;
  status: string;
  notes?: string;
  created_at: string;
  property: {
    id: string;
    property_number: number;
    address: string;
    price: number;
    currency: string;
    property_categories: {
      name: string;
      code: string;
    } | null;
  };
  assigner: {
    full_name: string;
  };
}

export default function Viewings() {
  const [viewings, setViewings] = useState<ViewingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed'>('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchViewings();
    }
  }, [user, filter]);

  const fetchViewings = async () => {
    try {
      let query = supabase
        .from('viewings')
        .select(`
          id,
          scheduled_at,
          status,
          notes,
          created_at,
          property:properties (
            id,
            property_number,
            address,
            price,
            currency,
            property_categories (
              name,
              code
            )
          ),
          assigner:profiles!viewings_assigned_by_fkey (
            full_name
          )
        `)
        .eq('assigned_by', user?.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setViewings(data as any || []);
    } catch (error) {
      console.error('Error fetching viewings:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось загрузить показы',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateViewingStatus = async (id: string, status: ViewingStatus) => {
    try {
      const { error } = await supabase
        .from('viewings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Статус показа обновлен',
      });
      fetchViewings();
    } catch (error) {
      console.error('Error updating viewing:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить статус',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: <Badge className="bg-blue-500">Запланирован</Badge>,
      completed: <Badge className="bg-green-500">Завершен</Badge>,
      cancelled: <Badge variant="destructive">Отменен</Badge>,
      rescheduled: <Badge className="bg-yellow-500">Перенесен</Badge>,
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
          <h1 className="text-3xl font-bold text-foreground">Мои показы</h1>
          <p className="text-muted-foreground mt-2">
            Управление запланированными показами недвижимости
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Все
          </Button>
          <Button
            variant={filter === 'scheduled' ? 'default' : 'outline'}
            onClick={() => setFilter('scheduled')}
          >
            Запланированные
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Завершенные
          </Button>
        </div>
      </div>

      {viewings.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Нет показов</h3>
          <p className="text-muted-foreground">
            У вас пока нет запланированных показов
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewings.map((viewing) => (
            <Card key={viewing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">
                      #{viewing.property.property_number}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {viewing.property.property_categories?.name || 'Не указано'}
                    </p>
                  </div>
                  {getStatusBadge(viewing.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(viewing.scheduled_at), 'dd MMMM yyyy, HH:mm', {
                        locale: ru,
                      })}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span>{viewing.property.address}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{viewing.assigner.full_name}</span>
                  </div>
                </div>

                {viewing.notes && (
                  <p className="text-sm text-muted-foreground border-t pt-3">
                    {viewing.notes}
                  </p>
                )}

                {viewing.status === 'scheduled' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => updateViewingStatus(viewing.id, 'completed')}
                    >
                      Завершить
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => updateViewingStatus(viewing.id, 'cancelled')}
                    >
                      Отменить
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
