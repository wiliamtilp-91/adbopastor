import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          navigate('/dashboard');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: error.message,
        });
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta à nossa comunidade.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4 hover:bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
        </div>

        <Card className="shadow-divine border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-primary">
              Entrar na sua conta
            </CardTitle>
            <p className="text-muted-foreground">
              Acesse o App da Igreja
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-gradient-primary hover:shadow-divine transition-all duration-300 text-black font-semibold"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-primary hover:underline font-medium"
              >
                Esqueci minha senha
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Ainda não tem conta?{" "}
                <button 
                  onClick={() => navigate('/register')}
                  className="text-primary hover:underline font-semibold"
                >
                  Cadastre-se aqui
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;