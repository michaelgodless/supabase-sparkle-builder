import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
interface Manager {
  id: string;
  full_name: string;
  avatar_url: string | null;
  description: string | null;
  phone: string | null;
}
export function ManagersSection() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchManagers();
  }, []);
  const fetchManagers = async () => {
    try {
      // First get user IDs with manager or super_admin role
      const {
        data: roleData,
        error: roleError
      } = await supabase.from("user_roles").select("user_id").in('role', ['manager', 'super_admin']);
      if (roleError) throw roleError;
      const managerIds = roleData?.map(r => r.user_id) || [];
      if (managerIds.length === 0) {
        setManagers([]);
        return;
      }

      // Then get profiles for those users
      const {
        data: profilesData,
        error: profilesError
      } = await supabase.from("profiles").select("id, full_name, avatar_url, description, phone").in('id', managerIds).eq('is_active', true);
      if (profilesError) throw profilesError;
      setManagers(profilesData || []);
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading || managers.length === 0) {
    return null;
  }
  return <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-3 bg-yellow-600">
            Наша команда
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Наши менеджеры
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Профессиональные специалисты готовы помочь вам найти идеальную недвижимость
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {managers.map(manager => {
          const initials = manager.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
          return <Card key={manager.id} className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardContent className="p-6 text-center space-y-4">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-background shadow-lg group-hover:scale-105 transition-transform">
                    <AvatarImage src={manager.avatar_url || undefined} alt={manager.full_name} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary-hover text-primary-foreground text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {manager.full_name}
                    </h3>
                    {manager.phone && <a href={`tel:${manager.phone}`} className="text-sm text-primary hover:underline">
                        {manager.phone}
                      </a>}
                  </div>

                  {manager.description && <p className="text-sm text-muted-foreground line-clamp-3">
                      {manager.description}
                    </p>}

                  <div className="pt-2">
                    <Badge variant="outline" className="gap-1.5">
                      <User className="h-3 w-3" />
                      Менеджер
                    </Badge>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </section>;
}