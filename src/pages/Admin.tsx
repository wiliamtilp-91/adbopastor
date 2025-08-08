import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Edit, Trash2, Download, Users, ArrowLeft, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoAssembleia from "@/assets/logo-assembleia-bon-pastor.png";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - em produção seria vindo do backend
  const mockMembers = [
    {
      id: "001",
      fullName: "João Silva Santos",
      email: "joao@email.com",
      phone: "(11) 99999-9999",
      birthDate: "1990-05-15",
      documentType: "CPF",
      documentNumber: "123.456.789-00",
      address: "Rua das Flores, 123",
      city: "São Paulo",
      zipCode: "01234-567",
      country: "Brasil",
      churchName: "Assembleia de Deus Bon Pastor",
      registrationDate: "2024-01-15"
    },
    {
      id: "002", 
      fullName: "Maria Oliveira",
      email: "maria@email.com",
      phone: "(11) 88888-8888",
      birthDate: "1985-08-22",
      documentType: "CPF",
      documentNumber: "987.654.321-00",
      address: "Av. Principal, 456",
      city: "São Paulo", 
      zipCode: "01234-890",
      country: "Brasil",
      churchName: "Igreja Local",
      registrationDate: "2024-01-20"
    }
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Login with email and password
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        toast({
          title: "Erro de autenticação",
          description: "E-mail ou senha incorretos.",
          variant: "destructive"
        });
        return;
      }

      if (!user) {
        toast({
          title: "Erro de autenticação",
          description: "Usuário não encontrado.",
          variant: "destructive"
        });
        return;
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        toast({
          title: "Erro",
          description: "Erro ao verificar permissões.",
          variant: "destructive"
        });
        return;
      }

      if (profile?.is_admin) {
        // Redirect to new admin dashboard
        navigate('/admin-dashboard');
      } else {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissões de administrador.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado durante o login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (memberId: string) => {
    toast({
      title: "Função em desenvolvimento",
      description: `Editar membro ID: ${memberId}`
    });
  };

  const handleDelete = (memberId: string) => {
    toast({
      title: "Função em desenvolvimento", 
      description: `Excluir membro ID: ${memberId}`
    });
  };

  const handleExport = () => {
    toast({
      title: "Exportando dados",
      description: "O arquivo será baixado em instantes"
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img 
              src={logoAssembleia} 
              alt="Logo da Igreja" 
              className="h-16 w-16 mx-auto mb-4"
            />
            <CardTitle className="text-2xl text-primary flex items-center justify-center">
              <Lock className="w-6 h-6 mr-2" />
              Área Administrativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>
              <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <div className="flex items-center justify-between">
                <Button 
                  type="button" 
                  variant="link"
                  onClick={() => navigate('/forgot-password')}
                  className="px-0"
                >
                  Esqueci minha senha
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className=""
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Header */}
      <div className="bg-gradient-primary shadow-divine">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src={logoAssembleia} 
                alt="Logo da Igreja" 
                className="h-10 w-10"
              />
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">Painel Administrativo</h1>
                <p className="text-primary-foreground/80">Gestão de membros</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleExport}
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAuthenticated(false);
                  navigate('/');
                }}
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary mr-4" />
                <div>
                  <p className="text-2xl font-bold">{mockMembers.length}</p>
                  <p className="text-muted-foreground">Membros cadastrados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-500 mr-4" />
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-muted-foreground">Inscrições do retiro</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-orange-500 mr-4" />
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-muted-foreground">Pagamentos pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Lista de Membros Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">ID</th>
                    <th className="text-left p-4">Nome</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Telefone</th>
                    <th className="text-left p-4">Igreja</th>
                    <th className="text-left p-4">Data Cadastro</th>
                    <th className="text-left p-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {mockMembers.map((member) => (
                    <tr key={member.id} className="border-b hover:bg-secondary/50">
                      <td className="p-4 font-mono">{member.id}</td>
                      <td className="p-4">{member.fullName}</td>
                      <td className="p-4">{member.email}</td>
                      <td className="p-4">{member.phone}</td>
                      <td className="p-4">{member.churchName}</td>
                      <td className="p-4">
                        {new Date(member.registrationDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(member.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(member.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDelete(member.id)}
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;