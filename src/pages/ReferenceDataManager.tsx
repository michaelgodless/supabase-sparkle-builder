import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type ReferenceItem = {
  id: string;
  name: string;
  created_at?: string;
};

type ReferenceType = "property_series" | "property_developers" | "property_areas";

const REFERENCE_LABELS = {
  property_series: "Серии",
  property_developers: "Застройщики",
  property_areas: "Районы",
};

export default function ReferenceDataManager() {
  const [activeTab, setActiveTab] = useState<ReferenceType>("property_series");
  const [items, setItems] = useState<ReferenceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<ReferenceItem | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchItems(activeTab);
  }, [activeTab]);

  const fetchItems = async (type: ReferenceType) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(type)
        .select("*")
        .order("name");

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newItemName.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите название",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editItem) {
        const { error } = await supabase
          .from(activeTab)
          .update({ name: newItemName.trim() })
          .eq("id", editItem.id);

        if (error) throw error;
        toast({ title: "Успешно обновлено" });
      } else {
        const { error } = await supabase
          .from(activeTab)
          .insert({ name: newItemName.trim() });

        if (error) throw error;
        toast({ title: "Успешно добавлено" });
      }

      setIsDialogOpen(false);
      setNewItemName("");
      setEditItem(null);
      fetchItems(activeTab);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Вы уверены что хотите удалить этот элемент?")) return;

    setLoading(true);
    try {
      const { error } = await supabase.from(activeTab).delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Успешно удалено" });
      fetchItems(activeTab);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());
        
        // Skip header if exists
        const startIndex = lines[0].toLowerCase().includes("name") || lines[0].toLowerCase().includes("название") ? 1 : 0;
        const names = lines.slice(startIndex).map((line) => {
          // Handle CSV with quotes and commas
          const name = line.split(",")[0].replace(/^"(.*)"$/, "$1").trim();
          return name;
        }).filter((name) => name);

        if (names.length === 0) {
          toast({
            title: "Ошибка",
            description: "Файл не содержит данных",
            variant: "destructive",
          });
          return;
        }

        setLoading(true);
        
        // Получаем существующие записи
        const { data: existing, error: fetchError } = await supabase
          .from(activeTab)
          .select("name");
        
        if (fetchError) throw fetchError;
        
        // Фильтруем только новые имена
        const existingNames = new Set(existing?.map(item => item.name.toLowerCase()) || []);
        const newNames = names.filter(name => !existingNames.has(name.toLowerCase()));
        
        if (newNames.length === 0) {
          toast({
            title: "Информация",
            description: "Все записи уже существуют в справочнике",
          });
          setLoading(false);
          return;
        }

        const { error } = await supabase
          .from(activeTab)
          .insert(newNames.map((name) => ({ name })));

        if (error) throw error;
        
        const skipped = names.length - newNames.length;
        toast({
          title: "Успешно импортировано",
          description: `Добавлено ${newNames.length} элементов${skipped > 0 ? `, пропущено дубликатов: ${skipped}` : ''}`,
        });
        fetchItems(activeTab);
      } catch (error: any) {
        toast({
          title: "Ошибка импорта",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 px-4 md:py-8">
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Управление справочниками</h1>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ReferenceType)}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="property_series" className="text-xs sm:text-sm">Серии</TabsTrigger>
              <TabsTrigger value="property_developers" className="text-xs sm:text-sm">Застройщики</TabsTrigger>
              <TabsTrigger value="property_areas" className="text-xs sm:text-sm">Районы</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditItem(null);
                      setNewItemName("");
                    }}
                    className="flex-1 sm:flex-none"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Добавить</span>
                    <span className="sm:hidden">Добавить</span>
                  </Button>
                </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editItem ? "Редактировать" : "Добавить"} {REFERENCE_LABELS[activeTab]}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Название</Label>
                        <Input
                          id="name"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          placeholder="Введите название"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSave} disabled={loading}>
                          Сохранить
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setEditItem(null);
                            setNewItemName("");
                          }}
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex-1 sm:flex-none">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleImport}
                    style={{ display: "none" }}
                    id={`import-${activeTab}`}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById(`import-${activeTab}`)?.click()}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Импорт CSV</span>
                    <span className="sm:hidden">Импорт</span>
                  </Button>
                </div>
            </div>
          </div>

          {(["property_series", "property_developers", "property_areas"] as ReferenceType[]).map((type) => (
            <TabsContent key={type} value={type} className="space-y-4">
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Название</TableHead>
                      <TableHead className="w-[100px] md:w-[120px]">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">
                          Загрузка...
                        </TableCell>
                      </TableRow>
                    ) : items.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center">
                          Нет данных
                        </TableCell>
                      </TableRow>
                    ) : (
                      items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 md:gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditItem(item);
                                  setNewItemName(item.name);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleDelete(item.id)}
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
