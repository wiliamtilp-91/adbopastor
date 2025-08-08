import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  full_name: string;
}

interface VolunteerRole {
  id: string;
  user_id: string;
  role_name: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

const roleOptions = [
  { value: "general_admin", label: "Administrador Geral" },
  { value: "media_admin", label: "Administrador de Mídia" },
  { value: "content_creator", label: "Criador de Conteúdo" },
  { value: "event_manager", label: "Gerenciador de Eventos" },
  { value: "study_coordinator", label: "Coordenador de Estudos" }
];

export const AdminVolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState<VolunteerRole[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVolunteers();
    fetchUsers();
  }, []);

const fetchVolunteers = async () => {
  try {
    const { data, error } = await supabase
      .from('volunteer_roles')
      .select('*');

    if (error) throw error;
    
    // Get profile data for volunteers
    const volunteersWithProfiles = await Promise.all(
      (data || []).map(async (volunteer) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', volunteer.user_id)
          .single();
        
        return {
          ...volunteer,
          profiles: profile || { full_name: 'Usuário não encontrado' }
        } as VolunteerRole;
      })
    );

    // Fetch general admins
    const { data: admins } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .eq('is_admin', true);

    const adminItems: VolunteerRole[] = (admins || []).map((a: any) => ({
      id: `admin-${a.user_id}`,
      user_id: a.user_id,
      role_name: 'general_admin',
      created_at: new Date().toISOString(),
      profiles: { full_name: a.full_name }
    }));
    
    setVolunteers([...adminItems, ...volunteersWithProfiles]);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    toast.error("Erro ao carregar voluntários");
  }
};

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .eq('is_admin', false);

      if (error) throw error;
      setUsers(data?.map(profile => ({
        id: profile.user_id,
        email: '',
        full_name: profile.full_name
      })) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Erro ao carregar usuários");
    }
  };

  const addVolunteer = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error("Selecione um usuário e um papel");
      return;
    }

setLoading(true);
try {
  if (selectedRole === 'general_admin') {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('user_id', selectedUser);
    if (updateError) throw updateError;
  } else {
    const { error } = await supabase
      .from('volunteer_roles')
      .insert({
        user_id: selectedUser,
        role_name: selectedRole
      });
    if (error) throw error;
  }

  toast.success("Permissão aplicada com sucesso!");
  setSelectedUser("");
  setSelectedRole("");
  fetchVolunteers();
} catch (error: any) {
  console.error('Error adding volunteer:', error);
  if (error.code === '23505') {
    toast.error("Este usuário já possui este papel");
  } else {
    toast.error("Erro ao aplicar permissão");
  }
} finally {
  setLoading(false);
}
  };

const removeVolunteer = async (id: string) => {
  try {
    if (id.startsWith('admin-')) {
      const userId = id.replace('admin-', '');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: false })
        .eq('user_id', userId);
      if (updateError) throw updateError;
      toast.success("Administrador geral removido!");
    } else {
      const { error } = await supabase
        .from('volunteer_roles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success("Voluntário removido com sucesso!");
    }
    fetchVolunteers();
  } catch (error) {
    console.error('Error removing volunteer:', error);
    toast.error("Erro ao remover permissão");
  }
};

  const getRoleLabel = (roleName: string) => {
    return roleOptions.find(option => option.value === roleName)?.label || roleName;
  };

const getRoleColor = (roleName: string) => {
  const colors: { [key: string]: string } = {
    general_admin: "bg-red-100 text-red-800",
    media_admin: "bg-blue-100 text-blue-800",
    content_creator: "bg-green-100 text-green-800",
    event_manager: "bg-purple-100 text-purple-800",
    study_coordinator: "bg-orange-100 text-orange-800"
  };
  return colors[roleName] || "bg-gray-100 text-gray-800";
};

  return (
    <Card className="shadow-divine border-0">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Users className="w-5 h-5 mr-2" />
          Gerenciamento de Voluntários
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Volunteer */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-medium">Adicionar Novo Voluntário</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Usuário</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um usuário" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Papel</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um papel" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={addVolunteer} 
                disabled={loading}
                className="w-full bg-gradient-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Adicionando..." : "Adicionar"}
              </Button>
            </div>
          </div>
        </div>

        {/* Current Volunteers */}
        <div className="space-y-4">
          <h3 className="font-medium">Voluntários Ativos</h3>
          {volunteers.length === 0 ? (
            <p className="text-muted-foreground">Nenhum voluntário cadastrado</p>
          ) : (
            <div className="grid gap-3">
              {volunteers.map((volunteer) => (
                <div key={volunteer.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">
                      {volunteer.profiles?.full_name || 'Usuário não encontrado'}
                    </span>
                    <Badge className={getRoleColor(volunteer.role_name)}>
                      {getRoleLabel(volunteer.role_name)}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeVolunteer(volunteer.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};