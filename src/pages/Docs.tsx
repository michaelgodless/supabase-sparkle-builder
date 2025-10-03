import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function Docs() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Документация
        </h1>
        <p className="text-muted-foreground text-lg">
          Инструкции и справочные материалы
        </p>
      </div>

      <Card className="p-12 text-center">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <CardTitle className="text-2xl mb-2">Раздел в разработке</CardTitle>
        <CardDescription>
          Скоро здесь появится база знаний и инструкции
        </CardDescription>
      </Card>
    </div>
  );
}
