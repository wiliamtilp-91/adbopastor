import { Card, CardContent } from "@/components/ui/card";
import logoAssembleia from "@/assets/logo-assembleia-bon-pastor.png";
import { Calendar, CreditCard, User, Church } from "lucide-react";

interface MemberCardProps {
  member: {
    fullName: string;
    documentType: string;
    documentNumber: string;
    churchName: string;
    memberId: string;
    registrationDate: string;
    profilePhoto?: string;
  };
}

const MemberCard = ({ member }: MemberCardProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-primary/5 to-secondary/10 border-2 border-primary/20 shadow-divine">
      <CardContent className="p-6">
        {/* Logo da Igreja */}
        <div className="flex justify-center mb-4">
          <img 
            src={logoAssembleia} 
            alt="Assembleia de Deus Bon Pastor" 
            className="h-16 w-16 object-contain"
          />
        </div>
        
        {/* Título do Cartão */}
        <div className="text-center mb-6">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wide">
            Cartão de Membro
          </h2>
          <h3 className="text-xs text-muted-foreground mt-1">
            Assembleia de Deus Bon Pastor
          </h3>
        </div>

        {/* Foto de Perfil */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30">
            {member.profilePhoto ? (
              <img 
                src={member.profilePhoto} 
                alt="Foto de perfil" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Informações do Membro */}
        <div className="space-y-3 text-sm">
          <div className="text-center">
            <p className="font-bold text-foreground text-lg">{member.fullName}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center">
              <CreditCard className="w-3 h-3 mr-2 text-primary" />
              <span className="text-muted-foreground">ID:</span>
            </div>
            <div className="text-right font-mono">
              {member.memberId}
            </div>
            
            <div className="flex items-center">
              <User className="w-3 h-3 mr-2 text-primary" />
              <span className="text-muted-foreground">{member.documentType}:</span>
            </div>
            <div className="text-right font-mono">
              {member.documentNumber}
            </div>
            
            <div className="flex items-center">
              <Church className="w-3 h-3 mr-2 text-primary" />
              <span className="text-muted-foreground">Igreja:</span>
            </div>
            <div className="text-right">
              {member.churchName}
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-2 text-primary" />
              <span className="text-muted-foreground">Cadastro:</span>
            </div>
            <div className="text-right">
              {new Date(member.registrationDate).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
        
        {/* Rodapé */}
        <div className="mt-6 pt-4 border-t border-primary/20 text-center">
          <p className="text-xs text-muted-foreground">
            Este cartão é válido apenas com documento oficial
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberCard;