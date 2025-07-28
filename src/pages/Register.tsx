import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus, ArrowLeft, UserPlus, Send, Camera, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoAssembleia from "@/assets/logo-assembleia-bon-pastor.png";
import MemberCard from "@/components/MemberCard";

interface FamilyMember {
  id: string;
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  churchName: string;
  documentType: string;
  documentNumber: string;
  profilePhoto?: File;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showMemberCard, setShowMemberCard] = useState(false);
  const [generatedMember, setGeneratedMember] = useState<any>(null);
  
  const [mainMember, setMainMember] = useState({
    fullName: "",
    birthDate: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Brasil",
    churchName: "",
    documentType: "CPF",
    documentNumber: "",
    profilePhoto: null as File | null,
  });

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: "",
      birthDate: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      zipCode: "",
      country: "Brasil",
      churchName: "",
      documentType: "CPF",
      documentNumber: "",
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

  const generateMemberId = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gerar dados do cartão de membro
    const memberData = {
      ...mainMember,
      memberId: generateMemberId(),
      registrationDate: new Date().toISOString(),
      profilePhoto: mainMember.profilePhoto ? URL.createObjectURL(mainMember.profilePhoto) : undefined
    };
    
    setGeneratedMember(memberData);
    setShowMemberCard(true);
    
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Seu cartão de membro foi gerado.",
    });
  };

  const renderMemberForm = (
    member: any, 
    updateFunction: (field: string, value: string | File) => void,
    title: string,
    onRemove?: () => void,
    isMainMember = false
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
        {/* Foto de perfil - apenas para membro principal */}
        {isMainMember && (
          <div className="mb-6">
            <Label>Foto de perfil</Label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-dashed border-primary/30">
                {member.profilePhoto ? (
                  <img 
                    src={URL.createObjectURL(member.profilePhoto)} 
                    alt="Preview" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) updateFunction('profilePhoto', file);
                  }}
                  className="hidden"
                  id={`photo-${title}`}
                />
                <Label htmlFor={`photo-${title}`} className="cursor-pointer">
                  <Button type="button" variant="outline" asChild>
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      Escolher foto
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
          </div>
        )}

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
            <Label htmlFor={`address-${title}`}>Endereço *</Label>
            <Input
              id={`address-${title}`}
              value={member.address}
              onChange={(e) => updateFunction('address', e.target.value)}
              placeholder="Rua e número"
              required
            />
          </div>
          <div>
            <Label htmlFor={`city-${title}`}>Cidade *</Label>
            <Input
              id={`city-${title}`}
              value={member.city}
              onChange={(e) => updateFunction('city', e.target.value)}
              placeholder="Cidade"
              required
            />
          </div>
          <div>
            <Label htmlFor={`zipCode-${title}`}>CEP *</Label>
            <Input
              id={`zipCode-${title}`}
              value={member.zipCode}
              onChange={(e) => updateFunction('zipCode', e.target.value)}
              placeholder="00000-000"
              required
            />
          </div>
          <div>
            <Label htmlFor={`country-${title}`}>País *</Label>
            <Select value={member.country} onValueChange={(value) => updateFunction('country', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Brasil">Brasil</SelectItem>
                <SelectItem value="Argentina">Argentina</SelectItem>
                <SelectItem value="Chile">Chile</SelectItem>
                <SelectItem value="Uruguai">Uruguai</SelectItem>
                <SelectItem value="Paraguai">Paraguai</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor={`churchName-${title}`}>Igreja de origem *</Label>
            <Input
              id={`churchName-${title}`}
              value={member.churchName}
              onChange={(e) => updateFunction('churchName', e.target.value)}
              placeholder="Nome da sua igreja"
              required
            />
          </div>
          <div>
            <Label htmlFor={`documentType-${title}`}>Tipo de documento *</Label>
            <Select value={member.documentType} onValueChange={(value) => updateFunction('documentType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CPF">CPF (Brasil)</SelectItem>
                <SelectItem value="DNI">DNI (Argentina)</SelectItem>
                <SelectItem value="NIE">NIE (Espanha)</SelectItem>
                <SelectItem value="Passaporte">Passaporte</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor={`documentNumber-${title}`}>Número do documento *</Label>
            <Input
              id={`documentNumber-${title}`}
              value={member.documentNumber}
              onChange={(e) => updateFunction('documentNumber', e.target.value)}
              placeholder="Número do documento"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (showMemberCard && generatedMember) {
    return (
      <div className="min-h-screen bg-gradient-peaceful p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <img 
              src={logoAssembleia} 
              alt="Logo da Igreja" 
              className="h-20 w-20 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-primary mb-2">Parabéns!</h1>
            <p className="text-muted-foreground">Seu cartão de membro foi gerado com sucesso</p>
          </div>
          
          <MemberCard member={generatedMember} />
          
          <div className="flex justify-center space-x-4 mt-8">
            <Button 
              variant="outline"
              onClick={() => setShowMemberCard(false)}
            >
              Voltar ao cadastro
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-primary"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Ir para Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <img 
            src={logoAssembleia} 
            alt="Logo da Igreja" 
            className="h-12 w-12 mr-4"
          />
          <div className="flex-1">
            <div className="flex items-center">
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
            <p className="text-muted-foreground mt-1">Assembleia de Deus Bon Pastor</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main member form */}
          {renderMemberForm(
            mainMember,
            (field, value) => setMainMember({ ...mainMember, [field]: value }),
            "Dados principais",
            undefined,
            true
          )}

          {/* Family members */}
          {familyMembers.map((member) => 
            renderMemberForm(
              member,
              (field, value) => updateFamilyMember(member.id, field as keyof FamilyMember, value as string),
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