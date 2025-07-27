import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    // Número da liderança da igreja (substitua pelo número real)
    const phoneNumber = "5511999999999"; // Formato: código do país + código da área + número
    const message = "Olá! Gostaria de falar com a liderança da igreja.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
      size="icon"
    >
      <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
      <span className="sr-only">Contatar liderança via WhatsApp</span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Falar com a liderança
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
      </div>
    </Button>
  );
};

export default WhatsAppButton;