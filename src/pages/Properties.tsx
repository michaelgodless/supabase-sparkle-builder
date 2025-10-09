import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Home, Filter } from "lucide-react";
import { ROOM_OPTIONS } from "@/types/property";
import navigatorLogo from "@/assets/navigator-house-logo.png";

interface Property {
  id: string;
  property_number: number;
  price: number;
  currency: string;
  property_size: number | null;
  property_rooms: string | null;
  property_area_id: string | null;
  property_category_id: string | null;
  property_action_category_id: string | null;
  property_areas: { name: string } | null;
  property_categories: { name: string } | null;
  property_action_categories: { name: string } | null;
  property_photos: { photo_url: string }[];
}

const Properties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [roomsFilter, setRoomsFilter] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  
  const [actionCategories, setActionCategories] = useState<any[]>([]);
  const [propertyCategories, setPropertyCategories] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  useEffect(() => {
    fetchProperties();
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const [actionsRes, categoriesRes, areasRes] = await Promise.all([
        supabase.from("property_action_categories").select("*"),
        supabase.from("property_categories").select("*"),
        supabase.from("property_areas").select("*").order("name")
      ]);
      
      setActionCategories(actionsRes.data || []);
      setPropertyCategories(categoriesRes.data || []);
      setAreas(areasRes.data || []);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("properties_public")
        .select(`
          id,
          property_number,
          price,
          currency,
          property_size,
          property_rooms,
          property_area_id,
          property_category_id,
          property_action_category_id,
          property_areas (name),
          property_categories (name),
          property_action_categories (name),
          property_photos (photo_url)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      searchTerm === "" ||
      property.property_number.toString().includes(searchTerm) ||
      property.property_areas?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction =
      actionFilter === "all" || property.property_action_category_id === actionFilter;
    
    const matchesCategory =
      categoryFilter === "all" || property.property_category_id === categoryFilter;
    
    const matchesArea =
      areaFilter === "all" || property.property_area_id === areaFilter;
    
    const matchesRooms =
      roomsFilter === "all" || property.property_rooms === roomsFilter;
    
    const matchesPrice =
      property.price >= priceRange[0] && property.price <= priceRange[1];

    return matchesSearch && matchesAction && matchesCategory && matchesArea && matchesRooms && matchesPrice;
  });

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("ru-RU").format(price) + " " + currency;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src={navigatorLogo} alt="Navigator House" className="h-10 w-auto" />
              <div>
                <h1 className="font-semibold text-lg">Navigator House</h1>
                <p className="text-xs text-muted-foreground">Навигатор в мире недвижимости</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/login")}>
              Войти
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-hover to-primary/90 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Каталог недвижимости
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Найдите недвижимость вашей мечты из нашей актуальной базы объектов
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Фильтры</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search */}
              <div className="lg:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по номеру или району..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

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

              {/* Price Range */}
              <div className="space-y-2 lg:col-span-2">
                <label className="text-sm font-medium">
                  Цена: {new Intl.NumberFormat("ru-RU").format(priceRange[0])} - {new Intl.NumberFormat("ru-RU").format(priceRange[1])} USD
                </label>
                <Slider
                  min={0}
                  max={1000000}
                  step={10000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
              </div>
            </div>

            {/* Reset Filters */}
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setActionFilter("all");
                  setCategoryFilter("all");
                  setAreaFilter("all");
                  setRoomsFilter("all");
                  setPriceRange([0, 1000000]);
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredProperties.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Объекты не найдены</h3>
                <p className="text-muted-foreground">
                  Попробуйте изменить параметры поиска
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Card
                  key={property.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/properties/${property.id}/public`)}
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {property.property_photos?.[0] ? (
                      <img
                        src={property.property_photos[0].photo_url}
                        alt={`Объект №${property.property_number}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Home className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-primary-foreground">
                        {property.property_action_categories?.name || "—"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl">
                        Объект №{property.property_number}
                      </CardTitle>
                      <Badge variant="secondary">
                        {property.property_categories?.name || "—"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        {property.property_areas?.name || "Район не указан"}
                      </span>
                    </div>
                    {property.property_size && (
                      <p className="text-sm text-muted-foreground">
                        Площадь: {property.property_size} м²
                      </p>
                    )}
                    {property.property_rooms && (
                      <p className="text-sm text-muted-foreground">
                        Комнат: {property.property_rooms}
                      </p>
                    )}
                    <div className="pt-2 border-t">
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(property.price, property.currency)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={navigatorLogo} alt="Navigator House" className="h-10 w-auto" />
              <div>
                <h3 className="font-semibold">Navigator House</h3>
                <p className="text-sm text-muted-foreground">Навигатор в мире недвижимости</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Navigator House. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Properties;
