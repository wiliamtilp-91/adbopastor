import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Bell, AlertTriangle, Info, Heart, Calendar, Clock } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'urgent' | 'info' | 'event' | 'prayer';
  isUrgent: boolean;
}

const Announcements = () => {
  const navigate = useNavigate();
  
  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Mudança de horário do culto dominical',
      content: 'Informamos que a partir do próximo domingo (28/01), o culto matutino passará a ser às 9h30 ao invés de 9h. O culto vespertino permanece às 19h.',
      date: '2024-01-25T10:30:00',
      type: 'urgent',
      isUrgent: true
    },
    {
      id: '2',
      title: 'Campanha de arrecadação de alimentos',
      content: 'Estamos arrecadando alimentos não perecíveis para as famílias carentes da nossa comunidade. Você pode trazer suas doações durante os cultos ou na secretaria da igreja.',
      date: '2024-01-24T14:20:00',
      type: 'info',
      isUrgent: false
    },
    {
      id: '3',
      title: 'Retiro da Igreja 2026 - Inscrições abertas',
      content: 'As inscrições para o Retiro da Igreja 2026 estão abertas! O evento será realizado no dia 01/05/2026 no Sítio Vale da Paz. Valor: R$ 350,00. Inscreva-se pelo app.',
      date: '2024-01-23T16:45:00',
      type: 'event',
      isUrgent: false
    },
    {
      id: '4',
      title: 'Pedido especial de oração',
      content: 'Pedimos oração especial pela saúde do Pastor João, que está internado para alguns exames. Vamos nos unir em oração pela sua recuperação completa.',
      date: '2024-01-22T09:15:00',
      type: 'prayer',
      isUrgent: true
    },
    {
      id: '5',
      title: 'Nova turma da Escola Bíblica',
      content: 'Está aberta uma nova turma da Escola Bíblica para iniciantes. As aulas começam no próximo domingo após o culto matutino. Inscrições na secretaria.',
      date: '2024-01-21T11:00:00',
      type: 'info',
      isUrgent: false
    },
    {
      id: '6',
      title: 'Ensaio especial do coral',
      content: 'Atenção membros do coral: teremos ensaio especial na próxima quinta-feira às 19h para preparação do louvor especial do domingo.',
      date: '2024-01-20T15:30:00',
      type: 'info',
      isUrgent: false
    }
  ]);

  const getAnnouncementIcon = (type: string) => {
    const icons = {
      urgent: AlertTriangle,
      info: Info,
      event: Calendar,
      prayer: Heart
    };
    return icons[type as keyof typeof icons] || Info;
  };

  const getAnnouncementColor = (type: string, isUrgent: boolean) => {
    if (isUrgent) return 'bg-red-500';
    
    const colors = {
      urgent: 'bg-red-500',
      info: 'bg-blue-500',
      event: 'bg-green-500',
      prayer: 'bg-purple-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays <= 7) return `${diffDays} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Separar anúncios urgentes dos normais
  const urgentAnnouncements = announcements.filter(a => a.isUrgent);
  const regularAnnouncements = announcements.filter(a => !a.isUrgent);

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Header */}
      <div className="bg-gradient-primary shadow-divine">
        <div className="max-w-4xl mx-auto px-4 py-6">
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
              <h1 className="text-2xl font-bold text-primary-foreground">Comunicados da Igreja</h1>
              <p className="text-primary-foreground/80">Fique por dentro de todas as novidades</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Urgent Announcements */}
        {urgentAnnouncements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Comunicados Urgentes
            </h2>
            <div className="space-y-4">
              {urgentAnnouncements.map((announcement) => {
                const IconComponent = getAnnouncementIcon(announcement.type);
                return (
                  <Card key={announcement.id} className="border-2 border-red-200 bg-red-50/50 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${getAnnouncementColor(announcement.type, announcement.isUrgent)}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{announcement.title}</h3>
                            <Badge className="bg-red-500 text-white">
                              URGENTE
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{announcement.content}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-1" />
                            {formatDate(announcement.date)} às {formatTime(announcement.date)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        <div>
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Todos os Comunicados
          </h2>
          <div className="space-y-4">
            {regularAnnouncements.map((announcement) => {
              const IconComponent = getAnnouncementIcon(announcement.type);
              return (
                <Card key={announcement.id} className="border-0 shadow-lg hover:shadow-divine transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${getAnnouncementColor(announcement.type, announcement.isUrgent)}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{announcement.title}</h3>
                          <Badge variant="secondary" className="capitalize">
                            {announcement.type === 'info' ? 'Informação' : 
                             announcement.type === 'event' ? 'Evento' :
                             announcement.type === 'prayer' ? 'Oração' : announcement.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{announcement.content}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(announcement.date)} às {formatTime(announcement.date)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Admin Note */}
        <div className="mt-12">
          <Card className="bg-muted/50 border-0">
            <CardContent className="p-6 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Notificações Automáticas
              </h3>
              <p className="text-muted-foreground">
                Você receberá notificações push automaticamente quando novos comunicados importantes forem publicados.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Announcements;