import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const bannerFull = "/lovable-uploads/b82043a6-913c-4f94-824a-0c4efbfc04e4.png";
const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Removido: splash com brasão para manter apenas o banner principal */}

        {/* Banner completo no topo */}
        <div className="w-full flex justify-center">
          <img
            src={bannerFull}
            alt="Banner oficial da Igreja Assembleia de Deus Bon Pastor"
            className="w-full max-w-2xl h-auto object-contain"
            loading="eager"
          />
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