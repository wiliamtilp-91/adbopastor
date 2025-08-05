import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Home, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HomeWorshipSession {
  id: string;
  title: string;
  description: string;
  study_material_url: string;
  date: string;
  is_active: boolean;
}

export default function HomeWorship() {
  const [sessions, setSessions] = useState<HomeWorshipSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('home_worship_sessions')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Erro ao carregar sessões de culto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Culto nos Lares
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fortalecendo a fé em família através da palavra de Deus
          </p>
        </div>

        {/* Hero Section */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-primary/5 to-purple-100/50 dark:from-primary/10 dark:to-purple-900/20">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-primary">
                  Transforme seu lar em um lugar de adoração
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  O culto nos lares é uma oportunidade única para fortalecer os laços familiares através da 
                  palavra de Deus. Reunimos nossas famílias para compartilhar momentos de oração, louvor e 
                  estudo bíblico, criando memórias eternas e edificando nossa fé juntos.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span>Para toda a família</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Flexível aos horários</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/placeholder.svg" 
                  alt="Família reunida em casa para culto"
                  className="rounded-lg shadow-lg w-full h-64 object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : sessions.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma sessão disponível</h3>
                <p className="text-muted-foreground">
                  Em breve teremos novos materiais para os cultos nos lares.
                </p>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{session.title}</CardTitle>
                  {session.date && (
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(session.date).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {session.description}
                  </p>
                  {session.study_material_url && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(session.study_material_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Acessar Material
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Call to Action */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-4">
              Participe dos Cultos nos Lares
            </h3>
            <p className="mb-6 opacity-90">
              Entre em contato conosco para mais informações sobre como participar 
              ou organizar um culto no seu lar.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
            >
              Falar no WhatsApp
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}