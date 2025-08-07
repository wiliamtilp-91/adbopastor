import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { 
  Calendar, 
  Video, 
  Bell, 
  Images, 
  Book, 
  Heart,
  Users,
  Church,
  LogOut,
  MapPin,
  Shield,
  Home
} from "lucide-react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import SocialLinks from "@/components/SocialLinks";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAdminCheck();

  // Auto redirect admin users to admin dashboard
  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate('/admin-dashboard');
    }
  }, [isAdmin, isLoading, navigate]);

  const menuItems = [
    {
      title: "Calendário de Eventos",
      description: "Cultos, reuniões e atividades",
      icon: Calendar,
      path: "/calendar",
      color: "bg-blue-500"
    },
    {
      title: "Cultos Online",
      description: "Assista aos cultos ao vivo",
      icon: Video,
      path: "/live-services",
      color: "bg-red-500"
    },
    {
      title: "Comunicados",
      description: "Avisos importantes da igreja",
      icon: Bell,
      path: "/announcements",
      color: "bg-amber-500"
    },
    {
      title: "Galeria de Fotos",
      description: "Momentos especiais da igreja",
      icon: Images,
      path: "/gallery",
      color: "bg-green-500"
    },
    {
      title: "Escola Bíblica Dominical (EBD)",
      description: "Materiais e planos de leitura",
      icon: Book,
      path: "/bible-studies",
      color: "bg-purple-500"
    },
    {
      title: "Culto nos Lares",
      description: "Fortalecendo a fé em família",
      icon: Home,
      path: "/home-worship",
      color: "bg-orange-500"
    },
    {
      title: "Oração e Testemunhos",
      description: "Compartilhe pedidos e testemunhos",
      icon: Heart,
      path: "/prayer-testimonies",
      color: "bg-pink-500"
    },
    {
      title: "Retiro da Igreja",
      description: "Inscreva-se para o retiro 2026",
      icon: MapPin,
      path: "/retreat",
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Header */}
      <div className="bg-primary shadow-divine">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/7801ec04-08a5-4b37-8a18-4be9c223bb2b.png" 
                alt="Logo Igreja Assembleia de Deus Bon Pastor" 
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">Igreja Assembleia de Deus Bon Pastor</h1>
                <p className="text-primary-foreground/80">Bem-vindo de volta!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/profile')}
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Meu Perfil
              </Button>
              {isAdmin && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin-dashboard')}
                  className="bg-transparent border-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Card 
              key={index}
              className="hover:shadow-divine transition-all duration-300 cursor-pointer border-0 overflow-hidden group"
              onClick={() => navigate(item.path)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${item.color}`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="text-center bg-primary border-0">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
              <h3 className="text-2xl font-bold text-primary-foreground">250+</h3>
              <p className="text-primary-foreground/80">Membros ativos</p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-accent border-0">
            <CardContent className="pt-6">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-accent-foreground" />
              <h3 className="text-2xl font-bold text-accent-foreground">15</h3>
              <p className="text-accent-foreground/80">Eventos este mês</p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-secondary border-0">
            <CardContent className="pt-6">
              <Heart className="w-12 h-12 mx-auto mb-4 text-secondary-foreground" />
              <h3 className="text-2xl font-bold text-secondary-foreground">42</h3>
              <p className="text-secondary-foreground/80">Pedidos de oração</p>
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <div className="lg:row-span-1">
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;