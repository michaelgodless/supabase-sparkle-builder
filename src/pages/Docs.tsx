import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Video, FileText, HelpCircle, ChevronRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DocSection {
  id: string;
  title: string;
  content: string;
  category: 'instructions' | 'templates' | 'faq' | 'videos';
}

const documentation: DocSection[] = [
  {
    id: '1',
    title: 'Как создать новое объявление',
    content: `1. Перейдите в раздел "Мои объявления"
2. Нажмите кнопку "Добавить объявление"
3. Заполните все обязательные поля:
   - Тип сделки (продажа/аренда)
   - Категория недвижимости
   - Адрес
   - Цена
   - Контакты владельца
4. Загрузите фотографии (можно перетаскивать для изменения порядка)
5. Нажмите "Создать объявление"`,
    category: 'instructions',
  },
  {
    id: '2',
    title: 'Как назначить показ',
    content: `1. Откройте карточку объявления
2. В разделе "Показы" нажмите "Назначить показ"
3. Выберите дату и время
4. Добавьте заметки при необходимости
5. Сохраните показ
6. Вы получите уведомление перед назначенным временем`,
    category: 'instructions',
  },
  {
    id: '3',
    title: 'Управление ролями пользователей',
    content: `Только супер-администраторы могут управлять ролями:

Доступные роли:
- Супер Админ: полный доступ ко всем функциям
- Менеджер: может создавать объявления, назначать показы
- Стажер: ограниченный доступ для обучения

Как назначить роль:
1. Перейдите в "Управление пользователями"
2. Найдите пользователя
3. Нажмите кнопку с иконкой щита
4. Выберите роль из списка`,
    category: 'instructions',
  },
  {
    id: '4',
    title: 'Шаблон описания квартиры',
    content: `Продается [количество комнат]-комнатная квартира в [район/ЖК].

Характеристики:
- Площадь: [общая/жилая/кухня] кв.м
- Этаж: [номер] из [всего]
- Состояние: [ремонт/без ремонта]
- Мебель: [да/нет]
- Коммуникации: [список]

Инфраструктура:
- [школы, садики, магазины]

Документы: [готовы/в процессе]
Цена: [сумма] [валюта]
Торг [возможен/нет]`,
    category: 'templates',
  },
  {
    id: '5',
    title: 'Шаблон договора аренды',
    content: `ДОГОВОР АРЕНДЫ ЖИЛОГО ПОМЕЩЕНИЯ

г. [Город], [дата]

Арендодатель: [ФИО, паспортные данные]
Арендатор: [ФИО, паспортные данные]

Предмет договора: Квартира по адресу [адрес]

Срок аренды: с [дата] по [дата]
Стоимость: [сумма] в месяц
Коммунальные платежи: [кто оплачивает]

Обязанности сторон:
[список обязанностей]

Подписи сторон:
Арендодатель: _______
Арендатор: _______`,
    category: 'templates',
  },
  {
    id: '6',
    title: 'Как добавить объявление в избранное?',
    content: 'Нажмите на иконку сердца на карточке объявления. Все избранные объявления будут доступны в разделе "Избранное".',
    category: 'faq',
  },
  {
    id: '7',
    title: 'Почему не отображаются мои объявления?',
    content: `Возможные причины:
1. Проверьте статус объявления - оно должно быть "Опубликовано" или "Без рекламы"
2. Убедитесь, что вы вошли в систему под правильным аккаунтом
3. Попробуйте обновить страницу
4. Если проблема сохраняется, обратитесь к администратору`,
    category: 'faq',
  },
  {
    id: '8',
    title: 'Как изменить цену объявления?',
    content: 'Откройте объявление, нажмите кнопку "Редактировать", измените цену и сохраните изменения. История изменения цен сохраняется в системе.',
    category: 'faq',
  },
  {
    id: '9',
    title: 'Что делать если забыл пароль?',
    content: `1. На странице входа нажмите "Забыли пароль?"
2. Введите свой email
3. Проверьте почту - вам придет ссылка для сброса пароля
4. Перейдите по ссылке и создайте новый пароль`,
    category: 'faq',
  },
  {
    id: '10',
    title: 'Видео: Обзор системы',
    content: 'Полный обзор возможностей CRM для недвижимости. Длительность: 15 минут.\n\n[Здесь будет встроенное видео]',
    category: 'videos',
  },
];

export default function Docs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredDocs = documentation.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      activeCategory === 'all' || doc.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'instructions':
        return <BookOpen className="h-4 w-4" />;
      case 'templates':
        return <FileText className="h-4 w-4" />;
      case 'faq':
        return <HelpCircle className="h-4 w-4" />;
      case 'videos':
        return <Video className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'instructions':
        return 'Инструкция';
      case 'templates':
        return 'Шаблон';
      case 'faq':
        return 'FAQ';
      case 'videos':
        return 'Видео';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Документация</h1>
        <p className="text-muted-foreground mt-2">
          Инструкции, шаблоны и справочные материалы для работы с системой
        </p>
      </div>

      <Card className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск в документации..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="instructions">
              <BookOpen className="h-4 w-4 mr-2" />
              Инструкции
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="h-4 w-4 mr-2" />
              Шаблоны
            </TabsTrigger>
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="h-4 w-4 mr-2" />
              Видео
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            {filteredDocs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Ничего не найдено</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredDocs.map((doc) => (
                  <AccordionItem key={doc.id} value={doc.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        {getCategoryIcon(doc.category)}
                        <span className="font-medium">{doc.title}</span>
                        <Badge variant="secondary" className="ml-2">
                          {getCategoryLabel(doc.category)}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-4 pb-2 px-1">
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                            {doc.content}
                          </pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6 bg-muted/50">
        <div className="flex items-start gap-4">
          <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">Не нашли ответ?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Если у вас остались вопросы или вам нужна помощь, обратитесь к администратору системы.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
