import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, MapPin, FileText, Lock, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface Profile {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
  document_type: string;
  document_number: string;
  birth_date: string;
  church_name: string;
  profile_photo_url: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    zip_code: "",
    document_type: "CPF",
    document_number: "",
    birth_date: "",
    church_name: "Assembleia de Deus Bon Pastor",
    profile_photo_url: ""
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
      await loadProfile(user.id);
    };

    getUser();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          zip_code: data.zip_code || "",
          document_type: data.document_type || "CPF",
          document_number: data.document_number || "",
          birth_date: data.birth_date || "",
          church_name: data.church_name || "Assembleia de Deus Bon Pastor",
          profile_photo_url: data.profile_photo_url || ""
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar perfil.",
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Seus dados foram salvos com sucesso.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar perfil.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Senha alterada!",
        description: "Sua senha foi atualizada com sucesso.",
      });
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao alterar senha.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar uma imagem para upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      setProfile({
        ...profile,
        profile_photo_url: data.publicUrl
      });

      toast({
        title: "Foto enviada!",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });

    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao fazer upload da imagem.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Dados Pessoais */}
          <Card className="shadow-divine border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <User className="w-5 h-5 mr-2" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nome Completo</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="pl-10 bg-muted"
                      title="O e-mail não pode ser alterado por questões de segurança"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={profile.birth_date}
                    onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document_type">Tipo de Documento</Label>
                  <select
                    id="document_type"
                    value={profile.document_type}
                    onChange={(e) => setProfile({ ...profile, document_type: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="CPF">CPF</option>
                    <option value="RG">RG</option>
                    <option value="CNH">CNH</option>
                    <option value="NIE">NIE (Espanha)</option>
                    <option value="DNI">DNI (Espanha)</option>
                    <option value="Passaporte">Passaporte</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document_number">Número do Documento</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="document_number"
                      value={profile.document_number}
                      onChange={(e) => setProfile({ ...profile, document_number: e.target.value })}
                      placeholder="000.000.000-00"
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-black font-semibold">
                  {loading ? "Salvando..." : "Salvar Dados"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="shadow-divine border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <MapPin className="w-5 h-5 mr-2" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Rua, número, bairro"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="Sua cidade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input
                    id="zip_code"
                    value={profile.zip_code}
                    onChange={(e) => setProfile({ ...profile, zip_code: e.target.value })}
                    placeholder="00000-000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="church_name">Igreja</Label>
                  <Input
                    id="church_name"
                    value={profile.church_name}
                    onChange={(e) => setProfile({ ...profile, church_name: e.target.value })}
                    placeholder="Nome da igreja"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Foto de Perfil */}
          <Card className="shadow-divine border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Camera className="w-5 h-5 mr-2" />
                Foto de Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.profile_photo_url && (
                  <div className="flex justify-center">
                    <img
                      src={profile.profile_photo_url}
                      alt="Foto de perfil"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    />
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Fazer Upload de Foto</Label>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Camera className="w-8 h-8 mb-2 text-primary/50" />
                          <p className="mb-2 text-sm text-primary/70">
                            <span className="font-semibold">Clique para enviar</span> ou arraste uma foto
                          </p>
                          <p className="text-xs text-primary/50">PNG, JPG ou JPEG (MAX. 10MB)</p>
                        </div>
                        <input 
                          id="file-upload" 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {uploading && (
                      <p className="text-sm text-primary/70 text-center">Enviando foto...</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile_photo_url">Ou cole uma URL da foto</Label>
                    <Input
                      id="profile_photo_url"
                      value={profile.profile_photo_url}
                      onChange={(e) => setProfile({ ...profile, profile_photo_url: e.target.value })}
                      placeholder="https://exemplo.com/foto.jpg"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alterar Senha */}
          <Card className="shadow-divine border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Lock className="w-5 h-5 mr-2" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Digite a nova senha"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirme a nova senha"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-black font-semibold">
                  {loading ? "Alterando..." : "Alterar Senha"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-center">
          <Button onClick={handleLogout} variant="destructive">
            Sair da Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;