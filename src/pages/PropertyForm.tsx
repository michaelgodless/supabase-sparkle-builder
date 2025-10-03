import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function PropertyForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    address: '',
    area: '',
    deal_type: 'sale',
    category: 'apartment',
    price: '',
    currency: 'USD',
    description: '',
    owner_name: '',
    owner_contacts: '',
    rooms_count: '',
    total_area: '',
    floor: '',
    total_floors: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('properties').insert({
        address: formData.address,
        area: formData.area,
        deal_type: formData.deal_type as 'sale' | 'rent' | 'exchange',
        category: formData.category as 'apartment' | 'house' | 'commercial' | 'land' | 'garage',
        price: parseFloat(formData.price),
        currency: formData.currency,
        description: formData.description || null,
        owner_name: formData.owner_name,
        owner_contacts: formData.owner_contacts,
        rooms_count: formData.rooms_count ? parseInt(formData.rooms_count) : null,
        total_area: formData.total_area ? parseFloat(formData.total_area) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
        created_by: user.id,
        status: 'no_ads' as const,
      });

      if (error) throw error;

      toast({
        title: 'Успешно',
        description: 'Объявление создано',
      });

      navigate('/my-properties');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/my-properties')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Создать объявление
          </h1>
          <p className="text-muted-foreground text-lg">
            Добавление нового объекта недвижимости
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Информация об объекте</CardTitle>
            <CardDescription>Заполните основные данные</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Адрес *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Район *</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deal_type">Тип сделки *</Label>
                <Select value={formData.deal_type} onValueChange={(value) => setFormData({ ...formData, deal_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Продажа</SelectItem>
                    <SelectItem value="rent">Аренда</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Категория *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Квартира</SelectItem>
                    <SelectItem value="house">Дом</SelectItem>
                    <SelectItem value="land">Участок</SelectItem>
                    <SelectItem value="commercial">Коммерция</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Цена *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Валюта</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="KGS">KGS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rooms_count">Комнаты</Label>
                <Input
                  id="rooms_count"
                  type="number"
                  value={formData.rooms_count}
                  onChange={(e) => setFormData({ ...formData, rooms_count: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_area">Площадь (м²)</Label>
                <Input
                  id="total_area"
                  type="number"
                  step="0.01"
                  value={formData.total_area}
                  onChange={(e) => setFormData({ ...formData, total_area: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Этаж</Label>
                <Input
                  id="floor"
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_floors">Этажность</Label>
                <Input
                  id="total_floors"
                  type="number"
                  value={formData.total_floors}
                  onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_name">ФИО собственника *</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_contacts">Контакты собственника *</Label>
                <Input
                  id="owner_contacts"
                  value={formData.owner_contacts}
                  onChange={(e) => setFormData({ ...formData, owner_contacts: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/my-properties')}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
