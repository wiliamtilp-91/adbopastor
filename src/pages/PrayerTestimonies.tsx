import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Heart, Send, Clock, CheckCircle, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PrayerRequest {
  id: string;
  name: string;
  request: string;
  date: string;
  status: 'pending' | 'approved';
  category: 'healing' | 'family' | 'work' | 'spiritual' | 'other';
}

interface Testimony {
  id: string;
  name: string;
  testimony: string;
  date: string;
  status: 'pending' | 'approved';
  approved: boolean;
}

const PrayerTestimonies = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [prayerRequests] = useState<PrayerRequest[]>([
    {
      id: '1',
      name: 'Maria Silva',
      request: 'Peço oração pela saúde da minha mãe que está internada. Que Deus a fortaleça e cure completamente.',
      date: '2024-01-24',
      status: 'approved',
      category: 'healing'
    },
    {
      id: '2',
      name: 'João Santos',
      request: 'Oração pelo meu emprego. Estou desempregado há 3 meses e preciso do direcionamento de Deus.',
      date: '2024-01-23',
      status: 'approved',
      category: 'work'
    },
    {
      id: '3',
      name: 'Ana Costa',
      request: 'Peço oração pela restauração do meu casamento. Que Deus toque o coração do meu esposo.',
      date: '2024-01-22',
      status: 'approved',
      category: 'family'
    },
    {
      id: '4',
      name: 'Carlos Lima',
      request: 'Oração pela minha vida espiritual. Quero ter mais intimidade com Deus em oração e na Palavra.',
      date: '2024-01-21',
      status: 'approved',
      category: 'spiritual'
    }
  ]);

  const [testimonies] = useState<Testimony[]>([
    {
      id: '1',
      name: 'Fernanda Oliveira',
      testimony: 'Deus curou minha filha de uma doença grave! Os médicos não acreditam, mas nosso Deus é fiel. Glória a Deus!',
      date: '2024-01-25',
      status: 'approved',
      approved: true
    },
    {
      id: '2',
      name: 'Roberto Alves',
      testimony: 'Consegui um emprego depois de 6 meses orando! Deus abriu as portas no momento certo. Ele é fiel!',
      date: '2024-01-20',
      status: 'approved',
      approved: true
    },
    {
      id: '3',
      name: 'Juliana Pereira',
      testimony: 'Meu casamento foi restaurado! Depois de tanto orar, Deus tocou o coração do meu marido. Louvado seja o Senhor!',
      date: '2024-01-18',
      status: 'approved',
      approved: true
    }
  ]);

  const [newPrayerRequest, setNewPrayerRequest] = useState({
    name: '',
    request: '',
    category: 'other' as PrayerRequest['category']
  });

  const [newTestimony, setNewTestimony] = useState({
    name: '',
    testimony: ''
  });

  const handleSubmitPrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerRequest.name || !newPrayerRequest.request) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pedido de oração enviado!",
      description: "Seu pedido foi enviado e nossa equipe estará orando por você.",
    });
    
    setNewPrayerRequest({ name: '', request: '', category: 'other' });
  };

  const handleSubmitTestimony = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimony.name || !newTestimony.testimony) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Testemunho enviado!",
      description: "Seu testemunho foi enviado e aguarda aprovação para publicação.",
    });
    
    setNewTestimony({ name: '', testimony: '' });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      healing: 'bg-green-500',
      family: 'bg-blue-500',
      work: 'bg-orange-500',
      spiritual: 'bg-purple-500',
      other: 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      healing: 'Cura',
      family: 'Família',
      work: 'Trabalho',
      spiritual: 'Espiritual',
      other: 'Outros'
    };
    return labels[category as keyof typeof labels] || 'Outros';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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
              <h1 className="text-2xl font-bold text-primary-foreground">Oração e Testemunhos</h1>
              <p className="text-primary-foreground/80">Compartilhe pedidos de oração e testemunhos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Tabs defaultValue="prayer-requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="prayer-requests">Pedidos de Oração</TabsTrigger>
            <TabsTrigger value="testimonies">Testemunhos</TabsTrigger>
            <TabsTrigger value="submit">Enviar</TabsTrigger>
          </TabsList>

          {/* Prayer Requests Tab */}
          <TabsContent value="prayer-requests">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Heart className="w-16 h-16 mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold text-primary mb-2">Pedidos de Oração</h2>
                <p className="text-muted-foreground">
                  Unidos em oração pela nossa comunidade
                </p>
              </div>

              {prayerRequests.map((request) => (
                <Card key={request.id} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-primary mr-2" />
                        <span className="font-semibold text-foreground">{request.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getCategoryColor(request.category)} text-white`}>
                          {getCategoryLabel(request.category)}
                        </Badge>
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(request.date)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {request.request}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Testimonies Tab */}
          <TabsContent value="testimonies">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 mx-auto text-accent mb-4" />
                <h2 className="text-2xl font-bold text-primary mb-2">Testemunhos</h2>
                <p className="text-muted-foreground">
                  Celebrando as maravilhas que Deus tem feito
                </p>
              </div>

              {testimonies.map((testimony) => (
                <Card key={testimony.id} className="border-0 shadow-lg bg-gradient-to-r from-accent/5 to-accent/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-accent mr-2" />
                        <span className="font-semibold text-foreground">{testimony.name}</span>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Aprovado
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {testimony.testimony}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDate(testimony.date)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Submit Tab */}
          <TabsContent value="submit">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Submit Prayer Request */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <Heart className="w-5 h-5 mr-2" />
                    Enviar Pedido de Oração
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitPrayer} className="space-y-4">
                    <div>
                      <Label htmlFor="prayer-name">Seu nome *</Label>
                      <Input
                        id="prayer-name"
                        value={newPrayerRequest.name}
                        onChange={(e) => setNewPrayerRequest({ ...newPrayerRequest, name: e.target.value })}
                        placeholder="Digite seu nome"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="prayer-category">Categoria</Label>
                      <select 
                        className="w-full p-2 border border-input rounded-md bg-background"
                        value={newPrayerRequest.category}
                        onChange={(e) => setNewPrayerRequest({ ...newPrayerRequest, category: e.target.value as PrayerRequest['category'] })}
                      >
                        <option value="healing">Cura</option>
                        <option value="family">Família</option>
                        <option value="work">Trabalho</option>
                        <option value="spiritual">Espiritual</option>
                        <option value="other">Outros</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="prayer-request">Pedido de oração *</Label>
                      <Textarea
                        id="prayer-request"
                        value={newPrayerRequest.request}
                        onChange={(e) => setNewPrayerRequest({ ...newPrayerRequest, request: e.target.value })}
                        placeholder="Compartilhe seu pedido de oração..."
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-primary hover:shadow-divine transition-all duration-300">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Pedido
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Submit Testimony */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-accent flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Enviar Testemunho
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTestimony} className="space-y-4">
                    <div>
                      <Label htmlFor="testimony-name">Seu nome *</Label>
                      <Input
                        id="testimony-name"
                        value={newTestimony.name}
                        onChange={(e) => setNewTestimony({ ...newTestimony, name: e.target.value })}
                        placeholder="Digite seu nome"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="testimony-content">Seu testemunho *</Label>
                      <Textarea
                        id="testimony-content"
                        value={newTestimony.testimony}
                        onChange={(e) => setNewTestimony({ ...newTestimony, testimony: e.target.value })}
                        placeholder="Conte como Deus agiu em sua vida..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      * Testemunhos passam por aprovação antes da publicação
                    </p>
                    
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Testemunho
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PrayerTestimonies;