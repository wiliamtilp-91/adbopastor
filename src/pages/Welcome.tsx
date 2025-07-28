import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import churchBackground from "@/assets/church-background.jpg";
import logoAssembleia from "@/assets/logo-assembleia-bon-pastor.png";
import { Cross, Heart, Users, Settings } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${churchBackground})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/20 to-primary/60"></div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card/95 backdrop-blur-sm shadow-divine border-0 rounded-3xl overflow-hidden">
          <div className="p-8 text-center">
            {/* Logo da Igreja */}
            <div className="mb-6 flex justify-center">
              <img 
                src={logoAssembleia} 
                alt="Assembleia de Deus Bon Pastor" 
                className="h-24 w-24 object-contain drop-shadow-lg"
              />
            </div>
            
            {/* App Title */}
            <h1 className="text-3xl font-bold text-foreground mb-1 bg-gradient-holy bg-clip-text text-transparent">
              Assembleia de Deus
            </h1>
            <h2 className="text-2xl font-semibold text-primary mb-2">
              Bon Pastor
            </h2>
            
            {/* Subtitle */}
            <p className="text-muted-foreground mb-8 text-lg">
              Conectando nossa comunidade em fé e amor
            </p>
            
            {/* Action buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:shadow-divine transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                <Users className="w-5 h-5 mr-2" />
                Entrar
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full h-12 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => navigate('/register')}
              >
                <Heart className="w-5 h-5 mr-2" />
                Cadastrar-se
              </Button>
            </div>
            
            {/* Bottom message */}
            <p className="text-sm text-muted-foreground mt-6">
              "Onde dois ou três se reúnem em meu nome, ali eu estou no meio deles."
              <br />
              <span className="font-semibold">Mateus 18:20</span>
            </p>
            
            {/* Admin Access */}
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/admin')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-3 h-3 mr-1" />
                Área Administrativa
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;