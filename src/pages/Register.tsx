import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus, ArrowLeft, UserPlus, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FamilyMember {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  address: string;
  churchName: string;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  const [mainMember, setMainMember] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
    cpf: "",
    address: "",
    churchName: "",
  });

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: "",
      email: "",
      phone: "",
      birthDate: "",
      cpf: "",
      address: "",
      churchName: "",
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(familyMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cadastro enviado com sucesso!",
      description: "Sua solicitação está sendo processada pela liderança.",
    });
    navigate('/');
  };

  const renderMemberForm = (
    member: any, 
    updateFunction: (field: string, value: string) => void,
    title: string,
    onRemove?: () => void
  ) => (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-primary flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
          {onRemove && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRemove}
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Remover
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`fullName-${title}`}>Nome completo *</Label>
            <Input
              id={`fullName-${title}`}
              value={member.fullName}
              onChange={(e) => updateFunction('fullName', e.target.value)}
              placeholder="Nome completo"
              required
            />
          </div>
          <div>
            <Label htmlFor={`email-${title}`}>E-mail *</Label>
            <Input
              id={`email-${title}`}
              type="email"
              value={member.email}
              onChange={(e) => updateFunction('email', e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>
          <div>
            <Label htmlFor={`phone-${title}`}>Telefone *</Label>
            <Input
              id={`phone-${title}`}
              value={member.phone}
              onChange={(e) => updateFunction('phone', e.target.value)}
              placeholder="(11) 99999-9999"
              required
            />
          </div>
          <div>
            <Label htmlFor={`birthDate-${title}`}>Data de nascimento *</Label>
            <Input
              id={`birthDate-${title}`}
              type="date"
              value={member.birthDate}
              onChange={(e) => updateFunction('birthDate', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor={`cpf-${title}`}>CPF (opcional)</Label>
            <Input
              id={`cpf-${title}`}
              value={member.cpf}
              onChange={(e) => updateFunction('cpf', e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <Label htmlFor={`churchName-${title}`}>Nome da igreja *</Label>
            <Input
              id={`churchName-${title}`}
              value={member.churchName}
              onChange={(e) => updateFunction('churchName', e.target.value)}
              placeholder="Nome da sua igreja"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor={`address-${title}`}>Endereço completo *</Label>
          <Input
            id={`address-${title}`}
            value={member.address}
            onChange={(e) => updateFunction('address', e.target.value)}
            placeholder="Rua, número, bairro, cidade - Estado"
            required
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-peaceful p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4 hover:bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-primary">Cadastro de Membros</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main member form */}
          {renderMemberForm(
            mainMember,
            (field, value) => setMainMember({ ...mainMember, [field]: value }),
            "Dados principais"
          )}

          {/* Family members */}
          {familyMembers.map((member) => 
            renderMemberForm(
              member,
              (field, value) => updateFamilyMember(member.id, field as keyof FamilyMember, value),
              `Membro da família`,
              () => removeFamilyMember(member.id)
            )
          )}

          {/* Add family member button */}
          <div className="mb-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={addFamilyMember}
              className="w-full border-dashed border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adicionar membro da família
            </Button>
          </div>

          {/* Submit button */}
          <div className="text-center">
            <Button 
              type="submit" 
              className="w-full md:w-auto px-8 py-3 text-lg bg-gradient-primary hover:shadow-divine transition-all duration-300"
            >
              <Send className="w-5 h-5 mr-2" />
              Enviar cadastro
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;