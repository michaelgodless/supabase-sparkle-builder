import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-gradient-primary shadow-lg">
              <Building2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CRM Estate
          </CardTitle>
          <CardDescription className="text-lg">
            Система управления недвижимостью
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="manager@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          
          <div className="mt-6 p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium mb-2">Демо доступы:</p>
            <p className="text-xs text-muted-foreground">
              Для входа в систему используйте свои учетные данные
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
