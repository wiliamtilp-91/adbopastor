import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, Users, Book } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'culto' | 'reuniao' | 'ensaio' | 'escola' | 'campanha' | 'ensino';
  location?: string;
}

const Calendar = () => {
  const navigate = useNavigate();
  
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Culto Dominical Matutino',
      date: '2024-01-28',
      time: '09:00',
      description: 'Culto principal de domingo pela manhã com pregação da Palavra e louvor.',
      type: 'culto',
      location: 'Templo Principal'
    },
    {
      id: '2',
      title: 'Escola Bíblica Dominical',
      date: '2024-01-28',
      time: '08:00',
      description: 'Estudo da Palavra de Deus para todas as idades. Tema: "O Amor de Cristo"',
      type: 'escola',
      location: 'Salas de Aula'
    },
    {
      id: '3',
      title: 'Culto de Oração',
      date: '2024-01-30',
      time: '19:30',
      description: 'Momento especial de oração pela igreja, família e nação.',
      type: 'culto',
      location: 'Templo Principal'
    },
    {
      id: '4',
      title: 'Reunião de Jovens',
      date: '2024-01-31',
      time: '19:00',
      description: 'Encontro dos jovens com louvor, palavra e comunhão.',
      type: 'reuniao',
      location: 'Salão de Jovens'
    },
    {
      id: '5',
      title: 'Ensaio do Coral',
      date: '2024-02-01',
      time: '19:00',
      description: 'Ensaio do coral da igreja para os próximos cultos.',
      type: 'ensaio',
      location: 'Sala de Música'
    },
    {
      id: '6',
      title: 'Campanha de Evangelização',
      date: '2024-02-03',
      time: '14:00',
      description: 'Saída evangelística no bairro. Participe levando o amor de Cristo!',
      type: 'campanha',
      location: 'Praça Central'
    },
    {
      id: '7',
      title: 'Culto de Ensino',
      date: '2024-02-05',
      time: '19:30',
      description: 'Culto especial de ensino bíblico. Tema: "A Vida Cristã Vitoriosa"',
      type: 'ensino',
      location: 'Templo Principal'
    }
  ]);

  const getEventTypeColor = (type: string) => {
    const colors = {
      culto: 'bg-blue-500',
      reuniao: 'bg-green-500',
      ensaio: 'bg-purple-500',
      escola: 'bg-amber-500',
      campanha: 'bg-red-500',
      ensino: 'bg-indigo-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getEventTypeIcon = (type: string) => {
    const icons = {
      culto: CalendarIcon,
      reuniao: Users,
      ensaio: Clock,
      escola: Book,
      campanha: MapPin,
      ensino: Book
    };
    const IconComponent = icons[type as keyof typeof icons] || CalendarIcon;
    return <IconComponent className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupEventsByDate = (events: Event[]) => {
    return events.reduce((groups, event) => {
      const date = event.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
      return groups;
    }, {} as Record<string, Event[]>);
  };

  const groupedEvents = groupEventsByDate(events);

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
              <h1 className="text-2xl font-bold text-primary-foreground">Calendário de Eventos</h1>
              <p className="text-primary-foreground/80">Acompanhe todas as atividades da igreja</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date}>
              <h2 className="text-xl font-bold text-primary mb-4 capitalize">
                {formatDate(date)}
              </h2>
              <div className="space-y-4">
                {dateEvents.map((event) => (
                  <Card key={event.id} className="border-0 shadow-lg hover:shadow-divine transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className={`p-2 rounded-full ${getEventTypeColor(event.type)} mr-3`}>
                              <div className="text-white">
                                {getEventTypeIcon(event.type)}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                              <div className="flex items-center text-muted-foreground text-sm">
                                <Clock className="w-4 h-4 mr-1" />
                                {event.time}
                                {event.location && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {event.location}
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{event.description}</p>
                        </div>
                        <Badge variant="secondary" className="ml-4 capitalize">
                          {event.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;