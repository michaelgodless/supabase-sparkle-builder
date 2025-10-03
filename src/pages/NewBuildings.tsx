import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function NewBuildings() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Новостройки</h1>
        <p className="text-muted-foreground mt-2">
          База новостроек и жилых комплексов
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Требуется настройка базы данных</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">
            Для работы раздела "Новостройки" необходимо создать таблицу в базе данных со следующими полями:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm mb-4">
            <li>Название ЖК</li>
            <li>Застройщик</li>
            <li>Адрес/район</li>
            <li>Срок сдачи</li>
            <li>Планировки (связь с таблицей)</li>
            <li>Фотографии</li>
            <li>Прогресс строительства</li>
            <li>Контакты отдела продаж</li>
            <li>Цены</li>
            <li>Инфраструктура</li>
            <li>Координаты для карты</li>
          </ul>
          <p className="text-sm">
            После создания таблицы и настройки RLS политик, этот раздел будет автоматически функционировать.
          </p>
        </AlertDescription>
      </Alert>

      <Card className="p-12 text-center">
        <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Раздел требует настройки</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Для начала работы с новостройками необходимо выполнить миграцию базы данных.
          Обратитесь к разработчику или администратору системы.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" disabled>
            Создать новостройку
          </Button>
          <Button variant="outline" disabled>
            Импорт из файла
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Планируемый функционал:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">📋 Карточки ЖК</h4>
            <p className="text-sm text-muted-foreground">
              Детальная информация о каждом жилом комплексе с фото и описанием
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">🏗️ Прогресс строительства</h4>
            <p className="text-sm text-muted-foreground">
              Отслеживание этапов строительства с фотоотчетами
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">🗺️ Интеграция с картой</h4>
            <p className="text-sm text-muted-foreground">
              Расположение ЖК на карте с инфраструктурой района
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">📊 Планировки и цены</h4>
            <p className="text-sm text-muted-foreground">
              База планировок с актуальными ценами и наличием
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">📞 Контакты застройщика</h4>
            <p className="text-sm text-muted-foreground">
              Прямые контакты отдела продаж для быстрой связи
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">🔍 Фильтрация</h4>
            <p className="text-sm text-muted-foreground">
              Поиск по району, цене, сроку сдачи и другим параметрам
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold mb-3">Пример SQL миграции:</h3>
        <pre className="bg-background p-4 rounded-lg text-xs overflow-x-auto">
{`-- Создание таблицы новостроек
CREATE TABLE public.new_buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  developer TEXT NOT NULL,
  address TEXT NOT NULL,
  area_id UUID REFERENCES property_areas(id),
  completion_date DATE,
  construction_progress INTEGER DEFAULT 0,
  description TEXT,
  infrastructure TEXT[],
  sales_contacts JSONB,
  latitude NUMERIC,
  longitude NUMERIC,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS политики
ALTER TABLE public.new_buildings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view new buildings"
  ON public.new_buildings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Managers can create new buildings"
  ON public.new_buildings FOR INSERT
  TO authenticated
  WITH CHECK (
    has_any_role(auth.uid(), ARRAY['manager'::app_role, 'super_admin'::app_role])
  );`}
        </pre>
      </Card>
    </div>
  );
}
