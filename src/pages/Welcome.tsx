import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const logoSymbol = "/lovable-uploads/7801ec04-08a5-4b37-8a18-4be9c223bb2b.png";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Logo - Apenas o brasão centralizado como splash screen */}
        <div className="flex justify-center mb-8">
          <img 
            src={logoSymbol} 
            alt="Igreja Assembleia de Deus Bon Pastor" 
            className="h-40 w-auto"
          />
        </div>

        {/* Título Principal */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">
            App da Igreja
          </h1>
          <p className="text-lg text-white/90">
            Assembleia de Deus Bon Pastor
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="space-y-4 pt-8">
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-primary hover:shadow-divine transition-all duration-300 text-black font-semibold py-3"
          >
            Entrar
          </Button>
          
          <Button
            onClick={() => navigate('/register')}
            variant="outline"
            className="w-full border-white text-white hover:bg-white hover:text-primary transition-all duration-300 py-3"
          >
            Cadastrar-se
          </Button>
        </div>

        {/* Botão Admin (oculto) */}
        <div className="pt-4">
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            className="text-xs text-white/50 hover:text-white/80"
          >
            Área Administrativa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;