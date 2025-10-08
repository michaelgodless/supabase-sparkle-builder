import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Eye, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import navigatorLogo from "@/assets/navigator-house-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-hover to-primary/90">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZ6bS0yIDBoLTJ2Mmgydi0yem0tMiAwdi0yaC0ydjJoMnptMC0yaDJ2LTJoLTJ2MnptMiAwVjMwaDJ2MmgtMnptMCAyaDJ2Mmgtdi0yem0yIDB2Mmgydi0yaC0yem0wLTJ2LTJoMnYyaC0yem0yLTJoMnYyaC0ydi0yem0wIDJ2Mmgydi0yaC0yem0yIDBoMnYyaC0ydi0yem0wLTJ2LTJoMnYyaC0yem0yLTJoMnYyaC0ydi0yem0wIDJ2Mmgydi0yaC0yem0yIDBoMnYyaC0ydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <img 
              src={navigatorLogo} 
              alt="Navigator House" 
              className="h-24 w-auto mb-4 drop-shadow-2xl"
            />
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Навигатор в мире
              <br />
              <span className="text-secondary">недвижимости</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
              Профессиональная CRM-система для агентств недвижимости с автономными показами, защитой данных и полной прозрачностью процессов
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="bg-secondary hover:bg-secondary-hover text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Начать работу
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg backdrop-blur-sm"
              >
                Узнать больше
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Почему Navigator House?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Все инструменты для эффективной работы с недвижимостью в одной системе
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Защита данных</h3>
                <p className="text-muted-foreground">
                  Многоуровневая система безопасности с контролем доступа к конфиденциальной информации
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Автономные показы</h3>
                <p className="text-muted-foreground">
                  Система записи и управления показами объектов с автоматическим назначением менеджеров
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Управление командой</h3>
                <p className="text-muted-foreground">
                  Распределение ролей, отслеживание активности и аудит действий всех сотрудников
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Экономия времени</h3>
                <p className="text-muted-foreground">
                  Автоматизация рутинных процессов и быстрый доступ к актуальной базе объектов
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Полный контроль над вашим бизнесом
              </h2>
              <p className="text-lg text-muted-foreground">
                Navigator House — это не просто CRM, это комплексная экосистема для управления агентством недвижимости
              </p>
              
              <div className="space-y-4">
                {[
                  "База объектов с детальной информацией и фотографиями",
                  "Система показов с назначением ответственных менеджеров",
                  "Контроль доступа к конфиденциальным данным",
                  "Журнал аудита всех действий в системе",
                  "Управление избранными объектами",
                  "Адаптивный интерфейс для работы с любых устройств"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl"></div>
              <Card className="relative bg-card border-2">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Безопасность</h4>
                        <p className="text-sm text-muted-foreground">3 уровня доступа</p>
                      </div>
                    </div>
                    <div className="h-px bg-border"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Команда</h4>
                        <p className="text-sm text-muted-foreground">Неограниченно пользователей</p>
                      </div>
                    </div>
                    <div className="h-px bg-border"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Эффективность</h4>
                        <p className="text-sm text-muted-foreground">Автоматизация процессов</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-hover to-primary/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzZ6bS0yIDBoLTJ2Mmgydi0yem0tMiAwdi0yaC0ydjJoMnptMC0yaDJ2LTJoLTJ2MnptMiAwVjMwaDJ2MmgtMnptMCAyaDJ2Mmgtdi0yem0yIDB2Mmgydi0yaC0yem0wLTJ2LTJoMnYyaC0yem0yLTJoMnYyaC0ydi0yem0wIDJ2Mmgydi0yaC0yem0yIDBoMnYyaC0ydi0yem0wLTJ2LTJoMnYyaC0yem0yLTJoMnYyaC0ydi0yem0wIDJ2Mmgydi0yaC0yem0yIDBoMnYyaC0ydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Готовы начать работу с Navigator House?
            </h2>
            <p className="text-xl text-white/90">
              Присоединяйтесь к профессионалам рынка недвижимости уже сегодня
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="bg-secondary hover:bg-secondary-hover text-white px-10 py-7 text-xl shadow-2xl hover:shadow-secondary/50 transition-all"
            >
              Войти в систему
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src={navigatorLogo} 
                alt="Navigator House" 
                className="h-12 w-auto"
              />
              <div>
                <h3 className="font-semibold text-lg">Navigator House</h3>
                <p className="text-sm text-muted-foreground">Навигатор в мире недвижимости</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-muted-foreground">
                © 2024 Navigator House. Все права защищены.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;