import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home, Filter } from "lucide-react";
import { ROOM_OPTIONS } from "@/types/property";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Property {
  id: string;
  property_number: number;
  price: number;
  currency: string;
  property_size: number | null;
  property_rooms: string | null;
  property_area_id: string | null;
  property_category_id: string | null;
  property_subcategory_id: string | null;
  property_action_category_id: string | null;
  property_condition_id: string | null;
  property_areas: { name: string } | null;
  property_categories: { name: string } | null;
  property_subcategories: { name: string } | null;
  property_action_categories: { name: string } | null;
  property_photos: { photo_url: string }[];
}

const ITEMS_PER_PAGE = 12;

export default function NewBuildings() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [roomsFilter, setRoomsFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [actionCategories, setActionCategories] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);

  useEffect(() => {
    fetchProperties();
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const [actionsRes, areasRes, conditionsRes] = await Promise.all([
        supabase.from("property_action_categories").select("*"),
        supabase.from("property_areas").select("*").order("name"),
        supabase.from("property_conditions").select("*").order("name")
      ]);
      
      setActionCategories(actionsRes.data || []);
      setAreas(areasRes.data || []);
      setConditions(conditionsRes.data || []);
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      // Get the "on_duty" subcategory ID
      const { data: subcategoryData } = await supabase
        .from("property_subcategories")
        .select("id")
        .eq("code", "on_duty")
        .single();

      if (!subcategoryData) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("properties")
        .select(`
          id,
          property_number,
          price,
          currency,
          property_size,
          property_rooms,
          property_area_id,
          property_category_id,
          property_subcategory_id,
          property_action_category_id,
          property_condition_id,
          property_areas (name),
          property_categories (name),
          property_subcategories (name),
          property_action_categories (name),
          property_photos (photo_url)
        `)
        .eq("status", "published")
        .eq("property_subcategory_id", subcategoryData.id)
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

    return matchesSearch && matchesAction && matchesArea && matchesRooms && matchesCondition && matchesPrice;
  });

  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, actionFilter, areaFilter, roomsFilter, conditionFilter, minPrice, maxPrice]);

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
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Дежурки</h1>
        <p className="text-muted-foreground mt-2">
          Каталог дежурных квартир
        </p>
      </div>

      {/* Filters */}
      <section className="py-6 bg-muted/30 border rounded-lg">
        <div className="px-4">
          <div className="space-y-4">
            {/* Search Bar and Filter Toggle */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск по номеру или району..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
              </Button>
            </div>

            {/* Collapsible Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t">
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
                      setSearchTerm("");
                      setActionFilter("all");
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
            )}
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section>
        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Дежурки не найдены</h3>
              <p className="text-muted-foreground">
                Попробуйте изменить параметры поиска
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProperties.map((property) => (
              <Card
                key={property.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}`)}
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
                      Дежурка
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
        )}
      </section>
    </div>
  );
}
