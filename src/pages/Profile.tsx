import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Settings } from 'lucide-react';

export default function Profile() {
  const { profile, userRoles } = useAuth();

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Профиль
        </h1>
        <p className="text-muted-foreground text-lg">
          Настройки вашего аккаунта
        </p>
      </div>

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Информация о пользователе</CardTitle>
            <CardDescription>Ваши данные в системе</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Имя</label>
              <p className="text-lg">{profile.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg">{profile.email}</p>
            </div>
            {profile.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Телефон</label>
                <p className="text-lg">{profile.phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Роли</label>
              <div className="flex gap-2 mt-1">
                {userRoles.map((role) => (
                  <span key={role} className="px-3 py-1 text-sm font-medium rounded-lg bg-primary/10 text-primary">
                    {role === 'super_admin' ? 'Супер-админ' : role === 'manager' ? 'Менеджер' : 'Стажер'}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="p-12 text-center">
        <Settings className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <CardTitle className="text-2xl mb-2">Настройки в разработке</CardTitle>
        <CardDescription>
          Скоро здесь появятся настройки профиля
        </CardDescription>
      </Card>
    </div>
  );
}
