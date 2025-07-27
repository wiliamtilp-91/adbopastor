import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, DollarSign, CreditCard, Smartphone, FileText, Upload, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Retreat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    paymentMethod: "",
    paymentType: "",
    installments: "1",
    proofOfPayment: null as File | null,
  });

  const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'confirmed'>('pending');

  const retreatInfo = {
    date: "01/05/2026",
    location: "Sítio Vale da Paz - Atibaia/SP",
    price: 350.00,
    deadline: "15/04/2026"
  };

  const installmentOptions = [
    { value: "1", label: "À vista - R$ 350,00", discount: true },
    { value: "2", label: "2x de R$ 180,00", discount: false },
    { value: "3", label: "3x de R$ 120,00", discount: false },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.paymentMethod || !formData.paymentType) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Simular processamento
    setTimeout(() => {
      setRegistrationStatus('confirmed');
      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Sua inscrição foi enviada e está sendo processada.",
      });
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, proofOfPayment: file });
      toast({
        title: "Arquivo enviado",
        description: `Comprovante ${file.name} carregado com sucesso.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful">
      {/* Header */}
      <div className="bg-gradient-primary shadow-divine">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="mr-4 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Retiro da Igreja 2026</h1>
              <p className="text-primary-foreground/80">Inscreva-se para um momento especial com Deus</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Retreat Information */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg mb-6">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Informações do Retiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-semibold">Data</p>
                    <p className="text-muted-foreground">{retreatInfo.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-semibold">Local</p>
                    <p className="text-muted-foreground">{retreatInfo.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-semibold">Valor</p>
                    <p className="text-muted-foreground">R$ {retreatInfo.price.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-semibold">Prazo</p>
                    <p className="text-muted-foreground">Até {retreatInfo.deadline}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Status da Inscrição</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {registrationStatus === 'pending' ? (
                    <>
                      <Clock className="w-5 h-5 text-amber-500 mr-2" />
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        Pendente
                      </Badge>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <Badge className="bg-green-100 text-green-800">
                        Confirmado
                      </Badge>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {registrationStatus === 'pending' 
                    ? "Aguardando confirmação do pagamento"
                    : "Sua inscrição foi confirmada!"
                  }
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Formulário de Inscrição</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Dados Pessoais</h3>
                    
                    <div>
                      <Label htmlFor="fullName">Nome completo *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu.email@exemplo.com"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Informações de Pagamento</h3>
                    
                    <div>
                      <Label htmlFor="paymentType">Forma de pagamento *</Label>
                      <Select value={formData.paymentType} onValueChange={(value) => setFormData({ ...formData, paymentType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma de pagamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pix">
                            <div className="flex items-center">
                              <Smartphone className="w-4 h-4 mr-2" />
                              PIX
                            </div>
                          </SelectItem>
                          <SelectItem value="credit">
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Cartão de Crédito
                            </div>
                          </SelectItem>
                          <SelectItem value="boleto">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-2" />
                              Boleto Bancário
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="installments">Parcelas *</Label>
                      <Select value={formData.installments} onValueChange={(value) => setFormData({ ...formData, installments: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o número de parcelas" />
                        </SelectTrigger>
                        <SelectContent>
                          {installmentOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center justify-between w-full">
                                {option.label}
                                {option.discount && (
                                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                                    Desconto
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="proof">Comprovante de pagamento</Label>
                      <div className="mt-2">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {formData.proofOfPayment 
                                ? `Arquivo selecionado: ${formData.proofOfPayment.name}`
                                : "Clique para enviar o comprovante"
                              }
                            </p>
                          </div>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full py-3 text-lg bg-gradient-primary hover:shadow-divine transition-all duration-300"
                    disabled={registrationStatus === 'confirmed'}
                  >
                    {registrationStatus === 'confirmed' ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Inscrição Confirmada
                      </>
                    ) : (
                      <>
                        <Calendar className="w-5 h-5 mr-2" />
                        Enviar Inscrição
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Retreat;