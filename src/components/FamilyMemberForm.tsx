import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FamilyMember {
  id?: string;
  full_name: string;
  birth_date: string;
  relationship: string;
  phone?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  country?: string;
  church_name?: string;
  document_type?: string;
  document_number?: string;
  ministry?: string;
  profile_photo_url?: string;
}

interface FamilyMemberFormProps {
  userId: string;
  familyMembers: FamilyMember[];
  onUpdate: (members: FamilyMember[]) => void;
}

export const FamilyMemberForm = ({ userId, familyMembers, onUpdate }: FamilyMemberFormProps) => {
  const [loading, setLoading] = useState(false);

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      full_name: "",
      birth_date: "",
      relationship: "",
      phone: "",
      address: "",
      city: "",
      zip_code: "",
      country: "Brasil",
      church_name: "",
      document_type: "dni",
      document_number: "",
      ministry: ""
    };
    onUpdate([...familyMembers, newMember]);
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...familyMembers];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const removeFamilyMember = async (index: number) => {
    const member = familyMembers[index];
    
    if (member.id) {
      // Delete from database if it has an ID
      try {
        const { error } = await supabase
          .from('family_members')
          .delete()
          .eq('id', member.id);

        if (error) throw error;
        
        toast.success("Familiar removido com sucesso!");
      } catch (error) {
        console.error('Error deleting family member:', error);
        toast.error("Erro ao remover familiar");
        return;
      }
    }

    const updated = familyMembers.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  const saveFamilyMembers = async () => {
    setLoading(true);
    try {
      const membersToSave = familyMembers.filter(member => 
        member.full_name && member.birth_date && member.relationship
      );

      for (const member of membersToSave) {
        if (member.id) {
          // Update existing member
          const { error } = await supabase
            .from('family_members')
            .update({
              full_name: member.full_name,
              birth_date: member.birth_date,
              relationship: member.relationship,
              phone: member.phone,
              address: member.address,
              city: member.city,
              zip_code: member.zip_code,
              country: member.country,
              church_name: member.church_name,
              document_type: member.document_type,
              document_number: member.document_number,
              ministry: member.ministry
            })
            .eq('id', member.id);

          if (error) throw error;
        } else {
          // Insert new member
          const { error } = await supabase
            .from('family_members')
            .insert({
              main_user_id: userId,
              full_name: member.full_name,
              birth_date: member.birth_date,
              relationship: member.relationship,
              phone: member.phone,
              address: member.address,
              city: member.city,
              zip_code: member.zip_code,
              country: member.country,
              church_name: member.church_name,
              document_type: member.document_type,
              document_number: member.document_number,
              ministry: member.ministry
            });

          if (error) throw error;
        }
      }

      toast.success("Familiares salvos com sucesso!");
      
      // Reload family members
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('main_user_id', userId);

      if (error) throw error;
      onUpdate(data || []);

    } catch (error) {
      console.error('Error saving family members:', error);
      toast.error("Erro ao salvar familiares");
    } finally {
      setLoading(false);
    }
  };

  const relationshipOptions = [
    { value: "spouse", label: "Cônjuge" },
    { value: "child", label: "Filho(a)" },
    { value: "parent", label: "Pai/Mãe" },
    { value: "sibling", label: "Irmão/Irmã" },
    { value: "other", label: "Outro" }
  ];

  return (
    <Card className="shadow-divine border-0">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <UserPlus className="w-5 h-5 mr-2" />
          Membros da Família
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {familyMembers.map((member, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Familiar {index + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFamilyMember(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${index}`}>Nome Completo *</Label>
                <Input
                  id={`name-${index}`}
                  value={member.full_name}
                  onChange={(e) => updateFamilyMember(index, 'full_name', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>
              
              <div>
                <Label htmlFor={`birth-${index}`}>Data de Nascimento *</Label>
                <Input
                  id={`birth-${index}`}
                  type="date"
                  value={member.birth_date}
                  onChange={(e) => updateFamilyMember(index, 'birth_date', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor={`phone-${index}`}>Telefone</Label>
                <Input
                  id={`phone-${index}`}
                  value={member.phone || ""}
                  onChange={(e) => updateFamilyMember(index, 'phone', e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <Label htmlFor={`address-${index}`}>Endereço</Label>
                <Input
                  id={`address-${index}`}
                  value={member.address || ""}
                  onChange={(e) => updateFamilyMember(index, 'address', e.target.value)}
                  placeholder="Rua e número"
                />
              </div>

              <div>
                <Label htmlFor={`city-${index}`}>Cidade</Label>
                <Input
                  id={`city-${index}`}
                  value={member.city || ""}
                  onChange={(e) => updateFamilyMember(index, 'city', e.target.value)}
                  placeholder="Cidade"
                />
              </div>

              <div>
                <Label htmlFor={`zipcode-${index}`}>CEP</Label>
                <Input
                  id={`zipcode-${index}`}
                  value={member.zip_code || ""}
                  onChange={(e) => updateFamilyMember(index, 'zip_code', e.target.value)}
                  placeholder="00000-000"
                />
              </div>

              <div>
                <Label htmlFor={`country-${index}`}>País</Label>
                <Select 
                  value={member.country || "Brasil"} 
                  onValueChange={(value) => updateFamilyMember(index, 'country', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o país" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Brasil">Brasil</SelectItem>
                    <SelectItem value="Espanha">Espanha</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Chile">Chile</SelectItem>
                    <SelectItem value="Uruguai">Uruguai</SelectItem>
                    <SelectItem value="Paraguai">Paraguai</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`church-${index}`}>Igreja de Origem</Label>
                <Input
                  id={`church-${index}`}
                  value={member.church_name || ""}
                  onChange={(e) => updateFamilyMember(index, 'church_name', e.target.value)}
                  placeholder="Nome da igreja"
                />
              </div>

              <div>
                <Label htmlFor={`doctype-${index}`}>Tipo de Documento</Label>
                <Select 
                  value={member.document_type || "dni"} 
                  onValueChange={(value) => updateFamilyMember(index, 'document_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dni">DNI</SelectItem>
                    <SelectItem value="nie">NIE</SelectItem>
                    <SelectItem value="passport">Passaporte</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor={`docnumber-${index}`}>Número do Documento</Label>
                <Input
                  id={`docnumber-${index}`}
                  value={member.document_number || ""}
                  onChange={(e) => updateFamilyMember(index, 'document_number', e.target.value)}
                  placeholder="Número do documento"
                />
              </div>

              <div>
                <Label htmlFor={`ministry-${index}`}>Ministério</Label>
                <Input
                  id={`ministry-${index}`}
                  value={member.ministry || ""}
                  onChange={(e) => updateFamilyMember(index, 'ministry', e.target.value)}
                  placeholder="Ministério da igreja"
                />
              </div>
              
              <div>
                <Label htmlFor={`relationship-${index}`}>Parentesco *</Label>
                <Select 
                  value={member.relationship} 
                  onValueChange={(value) => updateFamilyMember(index, 'relationship', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={addFamilyMember}
            className="flex-1"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Adicionar Familiar
          </Button>
          
          <Button
            onClick={saveFamilyMembers}
            disabled={loading}
            className="flex-1 bg-gradient-primary"
          >
            {loading ? "Salvando..." : "Salvar Familiares"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};