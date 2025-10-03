import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function Admin() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Управление пользователями
        </h1>
        <p className="text-muted-foreground text-lg">
          Администрирование системы
        </p>
      </div>

      <Card className="p-12 text-center">
        <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <CardTitle className="text-2xl mb-2">Раздел в разработке</CardTitle>
        <CardDescription>
          Скоро здесь появится панель управления пользователями
        </CardDescription>
      </Card>
    </div>
  );
}
