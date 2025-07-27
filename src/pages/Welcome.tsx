import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import churchBackground from "@/assets/church-background.jpg";
import { Cross, Heart, Users } from "lucide-react";

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
            {/* Logo/Icon area */}
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-gradient-primary rounded-full shadow-golden">
                <Cross className="w-12 h-12 text-primary-foreground" />
              </div>
            </div>
            
            {/* App Title */}
            <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-holy bg-clip-text text-transparent">
              App da Igreja
            </h1>
            
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;