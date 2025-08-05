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
      relationship: ""
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
              relationship: member.relationship
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
              relationship: member.relationship
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
          <div key={index} className="p-4 border rounded-lg space-y-3">
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label htmlFor={`name-${index}`}>Nome Completo</Label>
                <Input
                  id={`name-${index}`}
                  value={member.full_name}
                  onChange={(e) => updateFamilyMember(index, 'full_name', e.target.value)}
                  placeholder="Nome completo"
                />
              </div>
              
              <div>
                <Label htmlFor={`birth-${index}`}>Data de Nascimento</Label>
                <Input
                  id={`birth-${index}`}
                  type="date"
                  value={member.birth_date}
                  onChange={(e) => updateFamilyMember(index, 'birth_date', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`relationship-${index}`}>Parentesco</Label>
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