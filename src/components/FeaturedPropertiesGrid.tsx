import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Bed, Maximize } from "lucide-react";
interface Property {
  id: string;
  property_number: number;
  price: number;
  currency: string;
  address: string;
  property_rooms: string | null;
  property_size: number | null;
  property_category_id: string | null;
  property_subcategory_id: string | null;
  property_action_category_id: string | null;
}
interface FeaturedProperty {
  id: string;
  property_id: string;
  display_order: number;
  properties: Property;
  property_photos: {
    photo_url: string;
  }[];
}
export function FeaturedPropertiesGrid() {
  const [featured, setFeatured] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchFeaturedProperties();
  }, []);
  const fetchFeaturedProperties = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from("featured_properties").select(`
          id,
          property_id,
          display_order,
          properties:property_id (
            id,
            property_number,
            price,
            currency,
            address,
            property_rooms,
            property_size,
            property_category_id,
            property_subcategory_id,
            property_action_category_id
          )
        `).order("display_order", {
        ascending: true
      });
      if (error) throw error;
      const propertiesWithPhotos = await Promise.all((data || []).map(async item => {
        const {
          data: photos
        } = await supabase.from("property_photos").select("photo_url").eq("property_id", item.property_id).order("display_order", {
          ascending: true
        }).limit(1);
        return {
          ...item,
          property_photos: photos || []
        };
      }));
      setFeatured(propertiesWithPhotos as any);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading || featured.length === 0) {
    return null;
  }
  return <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3 bg-amber-500">
            Рекомендуемые объекты
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Лучшие предложения</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {featured.map(item => {
          const property = item.properties as Property;
          const photoUrl = item.property_photos[0]?.photo_url;
          return <Card key={item.id} className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer" onClick={() => navigate(`/properties/${property.id}/public`)}>
                <div className="relative h-48 bg-muted overflow-hidden">
                  {photoUrl ? <img src={photoUrl} alt={`Объект ${property.property_number}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                      <MapPin className="h-12 w-12 text-muted-foreground" />
                    </div>}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary text-primary-foreground shadow-lg">№{property.property_number}</Badge>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-primary">{property.price.toLocaleString("ru-RU")}</span>
                    <span className="text-sm text-muted-foreground">{property.currency}</span>
                  </div>

                  <div className="flex items-start gap-2 text-muted-foreground min-h-[40px]">
                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p className="text-sm line-clamp-2">{property.address}</p>
                  </div>

                  <div className="flex gap-4 pt-2 border-t border-border">
                    {property.property_rooms && <div className="flex items-center gap-1.5 text-sm">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {property.property_rooms === "studio" ? "Студия" : `${property.property_rooms} комн.`}
                        </span>
                      </div>}
                    {property.property_size && <div className="flex items-center gap-1.5 text-sm">
                        <Maximize className="h-4 w-4 text-muted-foreground" />
                        <span>{property.property_size} м²</span>
                      </div>}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary-hover hover:opacity-90" onClick={e => {
                e.stopPropagation();
                navigate(`/properties/${property.id}/public`);
              }}>
                    Подробнее
                  </Button>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </section>;
}