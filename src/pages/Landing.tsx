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
              Ваш навигатор в мире
              <br />
              <span className="text-secondary">недвижимости</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl">
              Профессиональное агентство недвижимости с командой опытных риелторов. Поможем найти, купить или продать вашу недвижимость
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/properties')}
                className="bg-secondary hover:bg-secondary-hover text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Смотреть объекты
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg backdrop-blur-sm"
              >
                О компании
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
              Почему выбирают нас?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Профессиональный подход и комплексное обслуживание на всех этапах сделки
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Команда профессионалов</h3>
                <p className="text-muted-foreground">
                  Опытные риелторы с глубоким знанием рынка недвижимости
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Юридическая чистота</h3>
                <p className="text-muted-foreground">
                  Полная проверка документов и сопровождение сделки на всех этапах
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Индивидуальный подход</h3>
                <p className="text-muted-foreground">
                  Персональный менеджер и организация показов в удобное время
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Быстрые сделки</h3>
                <p className="text-muted-foreground">
                  Оперативный поиск покупателей и проведение сделок в короткие сроки
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
                Полный спектр услуг
              </h2>
              <p className="text-lg text-muted-foreground">
                Navigator House — это ваш надежный партнер в мире недвижимости
              </p>
              
              <div className="space-y-4">
                {[
                  "Продажа и покупка квартир, домов, коммерческой недвижимости",
                  "Аренда жилой и коммерческой недвижимости",
                  "Юридическое сопровождение сделок",
                  "Помощь в оформлении ипотеки",
                  "Консультации по инвестициям в недвижимость",
                  "Оценка рыночной стоимости объектов"
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
                        <Users className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Опыт</h4>
                        <p className="text-sm text-muted-foreground">Более 10 лет на рынке</p>
                      </div>
                    </div>
                    <div className="h-px bg-border"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Надежность</h4>
                        <p className="text-sm text-muted-foreground">1000+ успешных сделок</p>
                      </div>
                    </div>
                    <div className="h-px bg-border"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">Качество</h4>
                        <p className="text-sm text-muted-foreground">Индивидуальный подход</p>
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
              Готовы найти недвижимость мечты?
            </h2>
            <p className="text-xl text-white/90">
              Наши специалисты помогут вам на каждом этапе
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/properties')}
                className="bg-secondary hover:bg-secondary-hover text-white px-10 py-7 text-xl shadow-2xl hover:shadow-secondary/50 transition-all"
              >
                Смотреть объекты
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/login')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 px-10 py-7 text-xl backdrop-blur-sm"
              >
                Войти
              </Button>
            </div>
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