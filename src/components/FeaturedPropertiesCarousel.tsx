import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Bed, Maximize } from "lucide-react";

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
  property_photos: { photo_url: string }[];
}

export function FeaturedPropertiesCarousel() {
  const [featured, setFeatured] = useState<FeaturedProperty[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from("featured_properties")
        .select(`
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
        `)
        .order("display_order", { ascending: true });

      if (error) throw error;

      // Fetch photos for each property
      const propertiesWithPhotos = await Promise.all(
        (data || []).map(async (item) => {
          const { data: photos } = await supabase
            .from("property_photos")
            .select("photo_url")
            .eq("property_id", item.property_id)
            .order("display_order", { ascending: true })
            .limit(1);

          return {
            ...item,
            property_photos: photos || [],
          };
        })
      );

      setFeatured(propertiesWithPhotos as any);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  useEffect(() => {
    if (featured.length === 0) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (loading || featured.length === 0) {
    return null;
  }

  const currentProperty = featured[currentIndex];
  const property = currentProperty.properties as Property;
  const photoUrl = currentProperty.property_photos[0]?.photo_url;

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-3">
            Рекомендуемые объекты
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Избранная недвижимость
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all shadow-xl">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-64 md:h-full min-h-[300px] bg-muted">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={`Объект ${property.property_number}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                    <MapPin className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    №{property.property_number}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-primary">
                        {property.price.toLocaleString("ru-RU")}
                      </span>
                      <span className="text-xl text-muted-foreground">
                        {property.currency}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{property.address}</p>
                  </div>

                  <div className="flex gap-4 pt-2">
                    {property.property_rooms && (
                      <div className="flex items-center gap-2 text-sm">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {property.property_rooms === "studio"
                            ? "Студия"
                            : `${property.property_rooms} комн.`}
                        </span>
                      </div>
                    )}
                    {property.property_size && (
                      <div className="flex items-center gap-2 text-sm">
                        <Maximize className="h-4 w-4 text-muted-foreground" />
                        <span>{property.property_size} м²</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    onClick={() => navigate(`/properties/${property.id}/public`)}
                    className="w-full bg-gradient-to-r from-primary to-primary-hover hover:opacity-90"
                    size="lg"
                  >
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Navigation Buttons */}
          {featured.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {featured.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Перейти к объявлению ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
