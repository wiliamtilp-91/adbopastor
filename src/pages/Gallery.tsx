import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Images, Calendar, Plus, Upload, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Photo {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  category: string;
  uploadedBy: string;
}

const Gallery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [photos] = useState<Photo[]>([
    {
      id: '1',
      title: 'Culto de Ação de Graças',
      description: 'Momentos especiais do nosso culto de ação de graças com toda a igreja reunida em gratidão.',
      date: '2024-01-21',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      category: 'Cultos',
      uploadedBy: 'Pastor João'
    },
    {
      id: '2',
      title: 'Batismo na Praia',
      description: 'Cerimônia de batismo realizada na praia com 15 novos membros declarando sua fé.',
      date: '2024-01-14',
      imageUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop',
      category: 'Batismos',
      uploadedBy: 'Irmã Maria'
    },
    {
      id: '3',
      title: 'Reunião de Jovens',
      description: 'Encontro dos jovens com louvor, palavra e muita comunhão entre os irmãos.',
      date: '2024-01-12',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
      category: 'Jovens',
      uploadedBy: 'Líder Ana'
    },
    {
      id: '4',
      title: 'Escola Bíblica Infantil',
      description: 'As crianças aprendendo sobre o amor de Jesus de forma lúdica e divertida.',
      date: '2024-01-07',
      imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
      category: 'Infantil',
      uploadedBy: 'Tia Sandra'
    },
    {
      id: '5',
      title: 'Casamento na Igreja',
      description: 'Cerimônia de casamento dos irmãos Carlos e Fernanda, que Deus abençoe esta união.',
      date: '2024-01-05',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
      category: 'Casamentos',
      uploadedBy: 'Fotógrafo oficial'
    },
    {
      id: '6',
      title: 'Ação Social',
      description: 'Distribuição de cestas básicas para famílias carentes da comunidade.',
      date: '2024-01-03',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop',
      category: 'Ação Social',
      uploadedBy: 'Ministério de Ação Social'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);

  const categories = ['all', 'Cultos', 'Batismos', 'Jovens', 'Infantil', 'Casamentos', 'Ação Social'];

  const filteredPhotos = selectedCategory === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const handleUpload = () => {
    setIsUploading(true);
    // Simular upload
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Fotos enviadas!",
        description: "Suas fotos foram enviadas e estão aguardando aprovação.",
      });
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Cultos': 'bg-blue-500',
      'Batismos': 'bg-cyan-500',
      'Jovens': 'bg-green-500',
      'Infantil': 'bg-yellow-500',
      'Casamentos': 'bg-pink-500',
      'Ação Social': 'bg-purple-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Header */}
      <div className="bg-gradient-primary shadow-divine">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold text-primary-foreground">Galeria de Fotos</h1>
                <p className="text-primary-foreground/80">Momentos especiais da nossa igreja</p>
              </div>
            </div>
            
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isUploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Enviar Fotos
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Filtrar por categoria:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${selectedCategory === category ? 'bg-primary' : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'}`}
              >
                {category === 'all' ? 'Todas' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="border-0 shadow-lg hover:shadow-divine transition-all duration-300 overflow-hidden group cursor-pointer">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={photo.imageUrl} 
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className={`${getCategoryColor(photo.category)} text-white`}>
                    {photo.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight">{photo.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {photo.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(photo.date)}
                  </div>
                  <span>Por: {photo.uploadedBy}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <Images className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhuma foto encontrada
            </h3>
            <p className="text-muted-foreground">
              Não há fotos nesta categoria ainda.
            </p>
          </div>
        )}

        {/* Upload Instructions */}
        <div className="mt-12">
          <Card className="bg-muted/50 border-0">
            <CardContent className="p-6 text-center">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Compartilhe seus momentos
              </h3>
              <p className="text-muted-foreground mb-4">
                Usuários autorizados podem enviar fotos dos eventos da igreja. 
                Todas as imagens passam por aprovação antes da publicação.
              </p>
              <p className="text-sm text-muted-foreground">
                Formatos aceitos: JPG, PNG, GIF | Tamanho máximo: 10MB
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Gallery;