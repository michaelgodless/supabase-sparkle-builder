import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

export default function Audit() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Аудит действий
        </h1>
        <p className="text-muted-foreground text-lg">
          История изменений и действий пользователей
        </p>
      </div>

      <Card className="p-12 text-center">
        <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <CardTitle className="text-2xl mb-2">Раздел в разработке</CardTitle>
        <CardDescription>
          Скоро здесь появится журнал аудита
        </CardDescription>
      </Card>
    </div>
  );
}
