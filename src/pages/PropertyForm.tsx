import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { 
  PropertyActionCategory, 
  PropertyCategory, 
  PropertyArea,
  PropertyProposal,
  PropertyCondition,
  PaymentType,
  DocumentType,
  CommunicationType,
  FurnitureType,
  ROOM_OPTIONS,
  generateFloorOptions
} from '@/types/property';

export default function PropertyForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Справочники
  const [actionCategories, setActionCategories] = useState<PropertyActionCategory[]>([]);
  const [propertyCategories, setPropertyCategories] = useState<PropertyCategory[]>([]);
  const [areas, setAreas] = useState<PropertyArea[]>([]);
  const [proposals, setProposals] = useState<PropertyProposal[]>([]);
  const [conditions, setConditions] = useState<PropertyCondition[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [communicationTypes, setCommunicationTypes] = useState<CommunicationType[]>([]);
  const [furnitureTypes, setFurnitureTypes] = useState<FurnitureType[]>([]);

  const floorOptions = generateFloorOptions();

  const [formData, setFormData] = useState({
    property_action_category_id: '',
    property_category_id: '',
    property_rooms: '',
    property_size: '',
    property_lot_size: '',
    property_area_id: '',
    property_proposal_id: '',
    property_condition_id: '',
    floor: '',
    total_floors: '',
    address: '',
    price: '',
    currency: 'USD',
    description: '',
    owner_name: '',
    owner_contacts: '',
  });

  const [selectedPaymentTypes, setSelectedPaymentTypes] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [selectedCommunications, setSelectedCommunications] = useState<string[]>([]);
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([]);

  // Загрузка справочников
  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      const [
        actionCategoriesRes,
        propertyCategoriesRes,
        areasRes,
        proposalsRes,
        conditionsRes,
        paymentTypesRes,
        documentTypesRes,
        communicationTypesRes,
        furnitureTypesRes,
      ] = await Promise.all([
        supabase.from('property_action_categories').select('*'),
        supabase.from('property_categories').select('*'),
        supabase.from('property_areas').select('*').order('name'),
        supabase.from('property_proposals').select('*'),
        supabase.from('property_conditions').select('*'),
        supabase.from('payment_types').select('*'),
        supabase.from('document_types').select('*'),
        supabase.from('communication_types').select('*'),
        supabase.from('furniture_types').select('*'),
      ]);

      if (actionCategoriesRes.data) setActionCategories(actionCategoriesRes.data);
      if (propertyCategoriesRes.data) setPropertyCategories(propertyCategoriesRes.data);
      if (areasRes.data) setAreas(areasRes.data);
      if (proposalsRes.data) setProposals(proposalsRes.data);
      if (conditionsRes.data) setConditions(conditionsRes.data);
      if (paymentTypesRes.data) setPaymentTypes(paymentTypesRes.data);
      if (documentTypesRes.data) setDocumentTypes(documentTypesRes.data);
      if (communicationTypesRes.data) setCommunicationTypes(communicationTypesRes.data);
      if (furnitureTypesRes.data) setFurnitureTypes(furnitureTypesRes.data);
    } catch (error) {
      console.error('Error loading reference data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Создание объявления (використовуємо type assertion до оновлення типів Supabase)
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          property_action_category_id: formData.property_action_category_id || null,
          property_category_id: formData.property_category_id || null,
          property_rooms: formData.property_rooms || null,
          property_size: formData.property_size ? parseFloat(formData.property_size) : null,
          property_lot_size: formData.property_lot_size ? parseFloat(formData.property_lot_size) : null,
          property_area_id: formData.property_area_id || null,
          property_proposal_id: formData.property_proposal_id || null,
          property_condition_id: formData.property_condition_id || null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
          address: formData.address,
          price: parseFloat(formData.price),
          currency: formData.currency,
          description: formData.description || null,
          owner_name: formData.owner_name,
          owner_contacts: formData.owner_contacts,
          created_by: user.id,
          status: 'no_ads' as const,
        } as any)
        .select()
        .single();

      if (propertyError) throw propertyError;
      if (!property) throw new Error('Property not created');

      // Добавление связей для множественных выборов
      const propertyId = property.id;

      if (selectedPaymentTypes.length > 0) {
        await supabase.from('property_payment_types').insert(
          selectedPaymentTypes.map(id => ({ property_id: propertyId, payment_type_id: id }))
        );
      }

      if (selectedDocuments.length > 0) {
        await supabase.from('property_document_types').insert(
          selectedDocuments.map(id => ({ property_id: propertyId, document_type_id: id }))
        );
      }

      if (selectedCommunications.length > 0) {
        await supabase.from('property_communication_types').insert(
          selectedCommunications.map(id => ({ property_id: propertyId, communication_type_id: id }))
        );
      }

      if (selectedFurniture.length > 0) {
        await supabase.from('property_furniture_types').insert(
          selectedFurniture.map(id => ({ property_id: propertyId, furniture_type_id: id }))
        );
      }

      toast({
        title: 'Успешно',
        description: 'Объявление создано',
      });

      navigate('/my-properties');
    } catch (error: any) {
      console.error('Create property error:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Условная логика: показывать поле площади участка только для домов и участков
  const showLotSize = formData.property_category_id && 
    propertyCategories.find(c => c.id === formData.property_category_id)?.code === 'houses_land';

  // Условная логика: скрывать документы для аренды
  const showDocuments = actionCategories.find(c => c.id === formData.property_action_category_id)?.code !== 'rent';

  // Условная логика: скрывать коммуникации и мебель для участков
  const showCommunications = formData.property_category_id && 
    propertyCategories.find(c => c.id === formData.property_category_id)?.code !== 'land';

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

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
            <CardDescription>Заполните все обязательные поля</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Группа 1: Категоризация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="property_action_category_id">Тип сделки *</Label>
                <Select 
                  value={formData.property_action_category_id} 
                  onValueChange={(value) => setFormData({ ...formData, property_action_category_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property_category_id">Тип недвижимости *</Label>
                <Select 
                  value={formData.property_category_id} 
                  onValueChange={(value) => setFormData({ ...formData, property_category_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property_rooms">Количество комнат</Label>
                <Select 
                  value={formData.property_rooms} 
                  onValueChange={(value) => setFormData({ ...formData, property_rooms: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="property_proposal_id">Тип предложения *</Label>
                <Select 
                  value={formData.property_proposal_id} 
                  onValueChange={(value) => setFormData({ ...formData, property_proposal_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {proposals.map(prop => (
                      <SelectItem key={prop.id} value={prop.id}>{prop.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Группа 2: Характеристики */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="property_size">Общая площадь (м²) *</Label>
                <Input
                  id="property_size"
                  type="number"
                  step="0.01"
                  value={formData.property_size}
                  onChange={(e) => setFormData({ ...formData, property_size: e.target.value })}
                  required
                />
              </div>

              {showLotSize && (
                <div className="space-y-2">
                  <Label htmlFor="property_lot_size">Площадь участка (соток)</Label>
                  <Input
                    id="property_lot_size"
                    type="number"
                    step="0.01"
                    value={formData.property_lot_size}
                    onChange={(e) => setFormData({ ...formData, property_lot_size: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="floor">Этаж</Label>
                <Select 
                  value={formData.floor} 
                  onValueChange={(value) => setFormData({ ...formData, floor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите этаж" />
                  </SelectTrigger>
                  <SelectContent>
                    {floorOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_floors">Этажность</Label>
                <Select 
                  value={formData.total_floors} 
                  onValueChange={(value) => setFormData({ ...formData, total_floors: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите" />
                  </SelectTrigger>
                  <SelectContent>
                    {floorOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Группа 3: Местоположение */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="property_area_id">Район</Label>
                <Select 
                  value={formData.property_area_id} 
                  onValueChange={(value) => setFormData({ ...formData, property_area_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите район" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.full_name || area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Адрес *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Группа 4: Цена */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Цена *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Валюта</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
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
            </div>

            {/* Группа 5: Состояние */}
            <div className="space-y-2">
              <Label htmlFor="property_condition_id">Состояние</Label>
              <Select 
                value={formData.property_condition_id} 
                onValueChange={(value) => setFormData({ ...formData, property_condition_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите состояние" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(cond => (
                    <SelectItem key={cond.id} value={cond.id}>{cond.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Группа 6: Множественные выборы */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Вид платежа</Label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentTypes.map(type => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`payment-${type.id}`}
                        checked={selectedPaymentTypes.includes(type.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPaymentTypes([...selectedPaymentTypes, type.id]);
                          } else {
                            setSelectedPaymentTypes(selectedPaymentTypes.filter(id => id !== type.id));
                          }
                        }}
                      />
                      <label htmlFor={`payment-${type.id}`} className="text-sm cursor-pointer">
                        {type.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {showDocuments && (
                <div className="space-y-2">
                  <Label>Документы</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {documentTypes.map(type => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`doc-${type.id}`}
                          checked={selectedDocuments.includes(type.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDocuments([...selectedDocuments, type.id]);
                            } else {
                              setSelectedDocuments(selectedDocuments.filter(id => id !== type.id));
                            }
                          }}
                        />
                        <label htmlFor={`doc-${type.id}`} className="text-sm cursor-pointer">
                          {type.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showCommunications && (
                <>
                  <div className="space-y-2">
                    <Label>Коммуникации</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {communicationTypes.map(type => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`comm-${type.id}`}
                            checked={selectedCommunications.includes(type.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCommunications([...selectedCommunications, type.id]);
                              } else {
                                setSelectedCommunications(selectedCommunications.filter(id => id !== type.id));
                              }
                            }}
                          />
                          <label htmlFor={`comm-${type.id}`} className="text-sm cursor-pointer">
                            {type.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Мебель</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {furnitureTypes.map(type => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`furn-${type.id}`}
                            checked={selectedFurniture.includes(type.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFurniture([...selectedFurniture, type.id]);
                              } else {
                                setSelectedFurniture(selectedFurniture.filter(id => id !== type.id));
                              }
                            }}
                          />
                          <label htmlFor={`furn-${type.id}`} className="text-sm cursor-pointer">
                            {type.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Группа 7: Описание */}
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Подробное описание объекта..."
              />
            </div>

            {/* Группа 8: Контакты собственника */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="+996 XXX XXX XXX"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="bg-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Сохранение...' : 'Сохранить объявление'}
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
