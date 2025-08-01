import { Youtube, Instagram, Facebook, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SocialLinks = () => {
  const socialLinks = [
    {
      name: "YouTube",
      url: "https://www.youtube.com/@adbompastorbcn",
      icon: Youtube,
      color: "hover:text-red-600",
      description: "Cultos e conteúdo espiritual"
    },
    {
      name: "Instagram", 
      url: "https://www.instagram.com/adbonpastor_bcn/",
      icon: Instagram,
      color: "hover:text-pink-600",
      description: "Acompanhe nosso dia a dia"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/AdBonBarcelona/",
      icon: Facebook,
      color: "hover:text-blue-600", 
      description: "Comunidade e eventos"
    },
    {
      name: "Localização",
      url: "https://www.google.com/maps/place/Iglesia+Asamblea+de+Dios+-+Min.+Bon+pastor/@41.426059,2.2071051,17z/data=!3m1!4b1!4m6!3m5!1s0x12a4bdb157d93529:0x3b07afa4356b82fd!8m2!3d41.426059!4d2.2071051!16s%2Fg%2F11pv0ngtd_?hl=es",
      icon: MapPin,
      color: "hover:text-green-600",
      description: "Visite nossa igreja"
    }
  ];

  const churchInfo = {
    phone: "+34 642 744 693",
    address: "Carrer de la Indústria, 123",
    city: "08025 Barcelona",
    country: "España"
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <Phone className="w-5 h-5 mr-2" />
          Contato e Redes Sociais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Church Info */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Informações de Contato</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              {churchInfo.phone}
            </p>
            <p className="flex items-start">
              <MapPin className="w-4 h-4 mr-2 mt-0.5" />
              <span>
                {churchInfo.address}<br />
                {churchInfo.city}<br />
                {churchInfo.country}
              </span>
            </p>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Siga-nos</h4>
          <div className="grid grid-cols-1 gap-3">
            {socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => window.open(link.url, '_blank')}
                className={`w-full justify-start h-auto p-4 transition-colors ${link.color}`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">{link.name}</div>
                  <div className="text-xs text-muted-foreground">{link.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialLinks;