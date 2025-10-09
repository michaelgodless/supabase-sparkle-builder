import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, Calendar, Star, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ROOM_OPTIONS } from '@/types/property';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AssignViewingDialog from '@/components/AssignViewingDialog';

interface PropertyWithPhotos extends Property {
  property_photos?: Array<{ photo_url: string; display_order: number }>;
  property_categories?: { name: string; code: string };
  property_subcategories?: { name: string; code: string };
  property_action_categories?: { name: string; code: string };
  property_areas?: { name: string; full_name: string | null };
  property_proposals?: { name: string; code: string };
  property_conditions?: { name: string; code: string };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PropertyWithPhotos[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingDialogOpen, setViewingDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<{ id: string; number: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [roomsFilter, setRoomsFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  
  const [actionCategories, setActionCategories] = useState<any[]>([]);
  const [propertyCategories, setPropertyCategories] = useState<any[]>([]);
  const [propertySubcategories, setPropertySubcategories] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
    fetchFilters();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFilters = async () => {
    try {
      const [actionsRes, categoriesRes, subcategoriesRes, areasRes, conditionsRes] = await Promise.all([
        supabase.from("property_action_categories").select("*"),
        supabase.from("property_categories").select("*"),
        supabase.from("property_subcategories").select("*").order("name"),
        supabase.from("property_areas").select("*").order("name"),
        supabase.from("property_conditions").select("*").order("name")
      ]);
      
      setActionCategories(actionsRes.data || []);
      setPropertyCategories(categoriesRes.data || []);
      setPropertySubcategories(subcategoriesRes.data || []);
      setAreas(areasRes.data || []);
      setConditions(conditionsRes.data || []);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_photos(photo_url, display_order),
          property_categories(name, code),
          property_subcategories(name, code),
          property_action_categories(name, code),
          property_areas(name, full_name),
          property_proposals(name, code),
          property_conditions(name, code)
        `)
        .in('status', ['published', 'no_ads'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setFavorites(new Set(data?.map(f => f.property_id) || []));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Войдите в систему для добавления в избранное',
      });
      return;
    }

    try {
      const isFavorite = favorites.has(propertyId);

      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('property_id', propertyId)
          .eq('user_id', user.id);

        if (error) throw error;

        setFavorites(prev => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });

        toast({
          title: 'Удалено',
          description: 'Объект удален из избранного',
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            property_id: propertyId,
            user_id: user.id,
            priority: 'medium'
          });

        if (error) throw error;

        setFavorites(prev => new Set([...prev, propertyId]));

        toast({
          title: 'Добавлено',
          description: 'Объект добавлен в избранное',
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить избранное',
      });
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      searchQuery === "" ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.property_number.toString().includes(searchQuery) ||
      property.property_areas?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction =
      actionFilter === "all" || property.property_action_category_id === actionFilter;
    
    const matchesCategory =
      categoryFilter === "all" || property.property_category_id === categoryFilter;
    
    const matchesSubcategory =
      subcategoryFilter === "all" || property.property_subcategory_id === subcategoryFilter;
    
    const matchesArea =
      areaFilter === "all" || property.property_area_id === areaFilter;
    
    const matchesRooms =
      roomsFilter === "all" || property.property_rooms === roomsFilter;
    
    const matchesCondition =
      conditionFilter === "all" || property.property_condition_id === conditionFilter;
    
    const minPriceNum = minPrice ? parseFloat(minPrice) : 0;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice =
      property.price >= minPriceNum && property.price <= maxPriceNum;

    return matchesSearch && matchesAction && matchesCategory && matchesSubcategory && matchesArea && matchesRooms && matchesCondition && matchesPrice;
  });

  const stats = [
    {
      title: 'Всего объявлений',
      value: properties.length,
      icon: Building2,
      color: 'text-primary',
    },
    {
      title: 'Опубликовано',
      value: properties.filter((p) => p.status === 'published').length,
      icon: TrendingUp,
      color: 'text-success',
    },
    {
      title: 'Без рекламы',
      value: properties.filter((p) => p.status === 'no_ads').length,
      icon: Calendar,
      color: 'text-warning',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-success/10 text-success';
      case 'no_ads':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published':
        return 'Опубликовано';
      case 'no_ads':
        return 'Без рекламы';
      case 'sold':
        return 'Продано';
      case 'deleted':
        return 'Удалено';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Дежурка
        </h1>
        <p className="text-muted-foreground text-lg">
          Все объявления агентства доступны для работы
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Поиск по адресу, номеру или району..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 h-12"
          />
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 h-12"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
          </Button>
        </div>

        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Action Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Тип предложения</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {actionCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Тип недвижимости</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {propertyCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Property Subcategory (Дежурка) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Подтип (Дежурка)</label>
                <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {propertySubcategories.map((subcat) => (
                      <SelectItem key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rooms */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Количество комнат</label>
                <Select value={roomsFilter} onValueChange={setRoomsFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {ROOM_OPTIONS.map((room) => (
                      <SelectItem key={room.value} value={room.value}>
                        {room.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Район</label>
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Состояние</label>
                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Все" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все</SelectItem>
                    {conditions.map((condition) => (
                      <SelectItem key={condition.id} value={condition.id}>
                        {condition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Цена от (USD)</label>
                <Input
                  type="number"
                  placeholder="Мин. цена"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>

              {/* Max Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Цена до (USD)</label>
                <Input
                  type="number"
                  placeholder="Макс. цена"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {/* Reset Filters */}
              <div className="lg:col-span-3 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setActionFilter("all");
                    setCategoryFilter("all");
                    setSubcategoryFilter("all");
                    setAreaFilter("all");
                    setRoomsFilter("all");
                    setConditionFilter("all");
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer" onClick={() => navigate(`/properties/${property.id}`)}>
            <div className="aspect-video bg-muted relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <div className="absolute top-4 right-4 z-20">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                >
                  <Star 
                    className={`h-4 w-4 ${favorites.has(property.id) ? 'fill-yellow-400 text-yellow-400' : ''}`}
                  />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 z-20">
                <Badge className={getStatusColor(property.status)}>
                  {getStatusText(property.status)}
                </Badge>
              </div>
              {property.property_photos && property.property_photos.length > 0 ? (
                <img
                  src={property.property_photos.sort((a, b) => a.display_order - b.display_order)[0].photo_url}
                  alt={property.address}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <img
                  src="/placeholder.svg"
                  alt={property.address}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              )}
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  № {property.property_number}
                </span>
                <div className="flex gap-2">
                  {(property as any).property_action_categories && (
                    <Badge variant="outline" className="text-xs">
                      {(property as any).property_action_categories.name}
                    </Badge>
                  )}
                  {(property as any).property_categories && (
                    <Badge variant="secondary" className="text-xs">
                      {(property as any).property_categories.name}
                    </Badge>
                  )}
                  {(property as any).property_subcategories && (
                    <Badge variant="outline" className="text-xs">
                      {(property as any).property_subcategories.name}
                    </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-xl line-clamp-1">{property.address}</CardTitle>
              <CardDescription className="line-clamp-2">
                {property.description || 'Описание отсутствует'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-bold text-primary">
                    ${property.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {property.currency}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                {property.property_size && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {property.property_size} м²
                  </span>
                )}
                {property.property_rooms && (
                  <span>• {property.property_rooms} комн.</span>
                )}
                {(property as any).property_floor_old && (
                  <span>• {(property as any).property_floor_old}{(property as any).property_floor_from_old ? `/${(property as any).property_floor_from_old}` : ''} эт.</span>
                )}
                {(property as any).property_areas && (
                  <span>• {(property as any).property_areas.name}</span>
                )}
              </div>

              <Button 
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProperty({ id: property.id, number: property.property_number });
                  setViewingDialogOpen(true);
                }}
              >
                Назначить показ
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <CardTitle className="text-2xl mb-2">Объявлений не найдено</CardTitle>
          <CardDescription>
            Попробуйте изменить параметры поиска
          </CardDescription>
        </Card>
      )}

      {selectedProperty && (
        <AssignViewingDialog
          open={viewingDialogOpen}
          onOpenChange={setViewingDialogOpen}
          propertyId={selectedProperty.id}
          propertyNumber={selectedProperty.number}
        />
      )}
    </div>
  );
}
