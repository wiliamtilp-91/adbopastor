import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Book, FileText, Video, Download, Play, Calendar, Users, Heart } from "lucide-react";

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'reading-plan';
  category: string;
  date: string;
  downloadUrl?: string;
  videoUrl?: string;
  author: string;
  duration?: string;
}

const BibleStudies = () => {
  const navigate = useNavigate();
  
  const [materials] = useState<StudyMaterial[]>([
    {
      id: '1',
      title: 'O Poder da Oração',
      description: 'Estudo completo sobre a importância e eficácia da oração na vida cristã.',
      type: 'pdf',
      category: 'Ensino',
      date: '2024-01-20',
      downloadUrl: '#',
      author: 'Pastor João Silva'
    },
    {
      id: '2',
      title: 'Relacionamentos Saudáveis no Casamento',
      description: 'Vídeo aula sobre como construir um casamento sólido baseado nos princípios bíblicos.',
      type: 'video',
      category: 'Casais',
      date: '2024-01-18',
      videoUrl: 'https://youtube.com/watch?v=exemplo',
      author: 'Pastor Carlos e Pastora Ana',
      duration: '45 min'
    },
    {
      id: '3',
      title: 'Plano de Leitura: Salmos',
      description: 'Plano de leitura de 30 dias pelo livro de Salmos com reflexões diárias.',
      type: 'reading-plan',
      category: 'Ensino',
      date: '2024-01-15',
      author: 'Ministério de Ensino'
    },
    {
      id: '4',
      title: 'Identidade em Cristo',
      description: 'Estudo direcionado aos jovens sobre como descobrir nossa verdadeira identidade em Jesus.',
      type: 'pdf',
      category: 'Jovens',
      date: '2024-01-12',
      downloadUrl: '#',
      author: 'Líder Ana Santos'
    },
    {
      id: '5',
      title: 'Finanças sob a Perspectiva Bíblica',
      description: 'Como administrar nossos recursos financeiros segundo os princípios da Palavra de Deus.',
      type: 'video',
      category: 'Casais',
      date: '2024-01-10',
      videoUrl: 'https://youtube.com/watch?v=exemplo2',
      author: 'Pastor Roberto',
      duration: '52 min'
    },
    {
      id: '6',
      title: 'Plano de Leitura: Novo Testamento',
      description: 'Plano de leitura anual do Novo Testamento com estudos semanais.',
      type: 'reading-plan',
      category: 'Ensino',
      date: '2024-01-08',
      author: 'Escola Bíblica'
    },
    {
      id: '7',
      title: 'Servindo com Alegria',
      description: 'Estudo sobre os diferentes ministérios da igreja e como servir com excelência.',
      type: 'pdf',
      category: 'Ensino',
      date: '2024-01-05',
      downloadUrl: '#',
      author: 'Pastor João Silva'
    },
    {
      id: '8',
      title: 'Paixão por Jesus',
      description: 'Série de vídeos para jovens sobre ter uma paixão genuína por Jesus Cristo.',
      type: 'video',
      category: 'Jovens',
      date: '2024-01-03',
      videoUrl: 'https://youtube.com/watch?v=exemplo3',
      author: 'Ministério de Jovens',
      duration: '38 min'
    }
  ]);

  const getTypeIcon = (type: string) => {
    const icons = {
      pdf: FileText,
      video: Video,
      'reading-plan': Book
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      pdf: 'bg-red-500',
      video: 'bg-blue-500',
      'reading-plan': 'bg-green-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Ensino': Book,
      'Jovens': Users,
      'Casais': Heart
    };
    return icons[category as keyof typeof icons] || Book;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filterByCategory = (category: string) => {
    if (category === 'all') return materials;
    return materials.filter(material => material.category === category);
  };

  const categories = [
    { key: 'all', label: 'Todos', icon: Book },
    { key: 'Ensino', label: 'Ensino', icon: Book },
    { key: 'Jovens', label: 'Jovens', icon: Users },
    { key: 'Casais', label: 'Casais', icon: Heart }
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
              <h1 className="text-2xl font-bold text-primary-foreground">Estudos Bíblicos</h1>
              <p className="text-primary-foreground/80">Materiais de estudo e crescimento espiritual</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger key={category.key} value={category.key} className="flex items-center">
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.key} value={category.key}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterByCategory(category.key).map((material) => {
                  const TypeIcon = getTypeIcon(material.type);
                  const CategoryIcon = getCategoryIcon(material.category);
                  
                  return (
                    <Card key={material.id} className="border-0 shadow-lg hover:shadow-divine transition-all duration-300">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`p-2 rounded-full ${getTypeColor(material.type)}`}>
                            <TypeIcon className="w-4 h-4 text-white" />
                          </div>
                          <Badge variant="secondary" className="flex items-center">
                            <CategoryIcon className="w-3 h-3 mr-1" />
                            {material.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">{material.title}</CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {material.description}
                        </p>
                        
                        <div className="space-y-2 mb-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(material.date)}
                          </div>
                          <div>Por: {material.author}</div>
                          {material.duration && (
                            <div>Duração: {material.duration}</div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          {material.type === 'pdf' && (
                            <Button 
                              className="w-full bg-gradient-primary hover:shadow-divine transition-all duration-300"
                              onClick={() => window.open(material.downloadUrl, '_blank')}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Baixar PDF
                            </Button>
                          )}
                          
                          {material.type === 'video' && (
                            <Button 
                              className="w-full bg-gradient-primary hover:shadow-divine transition-all duration-300"
                              onClick={() => window.open(material.videoUrl, '_blank')}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Assistir Vídeo
                            </Button>
                          )}
                          
                          {material.type === 'reading-plan' && (
                            <Button 
                              className="w-full bg-gradient-primary hover:shadow-divine transition-all duration-300"
                            >
                              <Book className="w-4 h-4 mr-2" />
                              Ver Plano
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Study Plan Section */}
        <div className="mt-12">
          <Card className="bg-gradient-holy border-0 text-primary-foreground">
            <CardContent className="p-8 text-center">
              <Book className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Plano de Estudos 2024</h3>
              <p className="mb-6 text-primary-foreground/80">
                Participe do nosso plano anual de estudos bíblicos organizados por temas e dificuldade.
              </p>
              <Button 
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Ver Plano Completo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BibleStudies;