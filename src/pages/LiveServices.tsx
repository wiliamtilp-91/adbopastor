import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, ExternalLink, Calendar, Clock, Users } from "lucide-react";

const LiveServices = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: "Culto Dominical ao Vivo",
      description: "Acompanhe nosso culto principal aos domingos às 9h e 19h",
      isLive: true,
      viewerCount: 245,
      nextService: "Hoje às 19:00",
      youtubeUrl: "https://youtube.com/channel/exemplo"
    },
    {
      id: 2,
      title: "Culto de Oração",
      description: "Culto de oração todas as quartas-feiras às 19:30",
      isLive: false,
      viewerCount: 0,
      nextService: "Quarta-feira às 19:30",
      youtubeUrl: "https://youtube.com/channel/exemplo"
    },
    {
      id: 3,
      title: "Reunião de Jovens",
      description: "Encontro dos jovens todas as sextas-feiras às 19h",
      isLive: false,
      viewerCount: 0,
      nextService: "Sexta-feira às 19:00",
      youtubeUrl: "https://youtube.com/channel/exemplo"
    }
  ];

  const recentServices = [
    {
      id: 1,
      title: "Culto Dominical - \"O Poder da Oração\"",
      date: "21/01/2024",
      duration: "1h 45min",
      views: 892,
      youtubeUrl: "https://youtube.com/watch?v=exemplo1"
    },
    {
      id: 2,
      title: "Culto de Ensino - \"Fé que Move Montanhas\"",
      date: "18/01/2024",
      duration: "1h 30min",
      views: 654,
      youtubeUrl: "https://youtube.com/watch?v=exemplo2"
    },
    {
      id: 3,
      title: "Culto de Oração - \"Buscando a Face de Deus\"",
      date: "17/01/2024",
      duration: "1h 15min",
      views: 432,
      youtubeUrl: "https://youtube.com/watch?v=exemplo3"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Header */}
      <div className="bg-gradient-primary shadow-divine">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="mr-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Cultos Online</h1>
              <p className="text-primary-foreground/80">Assista aos cultos ao vivo ou gravados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Live Services Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Transmissões Ao Vivo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="border-0 shadow-lg hover:shadow-divine transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Video className="w-5 h-5 text-primary mr-2" />
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </div>
                    {service.isLive && (
                      <Badge className="bg-red-500 text-white animate-pulse">
                        AO VIVO
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {service.nextService}
                    </div>
                    {service.isLive && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        {service.viewerCount} assistindo agora
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary hover:shadow-divine transition-all duration-300"
                    onClick={() => window.open(service.youtubeUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {service.isLive ? 'Assistir Agora' : 'Ir para Canal'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Services Section */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">Cultos Gravados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentServices.map((service) => (
              <Card key={service.id} className="border-0 shadow-lg hover:shadow-divine transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg leading-tight">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {service.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      {service.duration}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="w-4 h-4 mr-2" />
                      {service.views} visualizações
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    onClick={() => window.open(service.youtubeUrl, '_blank')}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Assistir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Channel Info */}
        <div className="mt-12">
          <Card className="bg-gradient-holy border-0 text-primary-foreground">
            <CardContent className="p-8 text-center">
              <Video className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Canal Oficial da Igreja</h3>
              <p className="mb-6 text-primary-foreground/80">
                Inscreva-se no nosso canal do YouTube para não perder nenhuma transmissão!
              </p>
              <Button 
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => window.open('https://youtube.com/channel/exemplo', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visitar Canal no YouTube
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveServices;