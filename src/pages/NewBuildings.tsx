import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function NewBuildings() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Новостройки
        </h1>
        <p className="text-muted-foreground text-lg">
          База новостроек и жилых комплексов
        </p>
      </div>

      <Card className="p-12 text-center">
        <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <CardTitle className="text-2xl mb-2">Раздел в разработке</CardTitle>
        <CardDescription>
          Скоро здесь появится база новостроек
        </CardDescription>
      </Card>
    </div>
  );
}
