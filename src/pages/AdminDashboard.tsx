import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  MessageSquare, 
  Shield, 
  Camera, 
  Heart,
  Settings,
  DollarSign,
  TrendingUp,
  FileText,
  UserCheck,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Send,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import logoHorizontal from '@/assets/logo-ad-bon-pastor-horizontal.png';

interface DashboardStats {
  totalMembers: number;
  retreatSignups: number;
  pendingPayments: number;
  pendingPaymentValue: number;
  recentAnnouncements: any[];
  ageDistribution: any[];
  paymentStatus: any[];
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    retreatSignups: 0,
    pendingPayments: 0,
    pendingPaymentValue: 0,
    recentAnnouncements: [],
    ageDistribution: [],
    paymentStatus: []
  });
  const [members, setMembers] = useState([]);
  const [retreatMembers, setRetreatMembers] = useState([]);
  const [prayerRequests, setPrayerRequests] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [dailyVerse, setDailyVerse] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', is_urgent: false });
  const [newEvent, setNewEvent] = useState({ name: '', description: '', event_date: '', event_time: '' });

  // Sidebar menu items
  const menuItems = [
    { title: 'Visão Geral', icon: BarChart3, value: 'overview' },
    { title: 'Membros', icon: Users, value: 'members' },
    { title: 'Retiro', icon: UserCheck, value: 'retreat' },
    { title: 'Comunicados', icon: MessageSquare, value: 'announcements' },
    { title: 'Eventos', icon: Calendar, value: 'events' },
    { title: 'Galeria', icon: Camera, value: 'gallery' },
    { title: 'Oração/Testemunhos', icon: Heart, value: 'prayer' },
    { title: 'Configurações', icon: Settings, value: 'settings' },
  ];

  useEffect(() => {
    loadDashboardData();
    loadDailyVerse();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load members
      const { data: membersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      setMembers(membersData || []);

      // Load retreat registrations
      const { data: retreatData } = await supabase
        .from('retreat_registrations')
        .select(`
          *,
          profiles!retreat_registrations_user_id_fkey (full_name, phone)
        `);
      setRetreatMembers(retreatData || []);

      // Load announcements
      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setAnnouncements(announcementsData || []);

      // Load prayer requests
      const { data: prayerData } = await supabase
        .from('prayer_requests')
        .select(`
          *,
          profiles!prayer_requests_user_id_fkey (full_name)
        `)
        .order('created_at', { ascending: false });
      setPrayerRequests(prayerData || []);

      // Load testimonies
      const { data: testimoniesData } = await supabase
        .from('testimonies')
        .select(`
          *,
          profiles!testimonies_user_id_fkey (full_name)
        `)
        .order('created_at', { ascending: false });
      setTestimonies(testimoniesData || []);

      // Load events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      setEvents(eventsData || []);

      // Calculate stats
      const totalMembers = membersData?.length || 0;
      const retreatSignups = retreatData?.length || 0;
      const pendingPayments = retreatData?.filter(r => r.status === 'Pendente').length || 0;
      
      setStats({
        totalMembers,
        retreatSignups,
        pendingPayments,
        pendingPaymentValue: pendingPayments * 150,
        recentAnnouncements: announcementsData?.slice(0, 5) || [],
        ageDistribution: calculateAgeDistribution(membersData || []),
        paymentStatus: calculatePaymentStatus(retreatData || [])
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do dashboard",
        variant: "destructive"
      });
    }
  };

  const loadDailyVerse = async () => {
    try {
      const { data } = await supabase
        .from('app_configurations')
        .select('value')
        .eq('key', 'daily_verse')
        .single();
      
      if (data) {
        setDailyVerse(data.value);
      }
    } catch (error) {
      console.error('Error loading daily verse:', error);
    }
  };

  const calculateAgeDistribution = (members: any[]) => {
    const distribution = {
      '18-25': 0,
      '26-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0
    };

    members.forEach(member => {
      if (member.birth_date) {
        const age = new Date().getFullYear() - new Date(member.birth_date).getFullYear();
        if (age >= 18 && age <= 25) distribution['18-25']++;
        else if (age >= 26 && age <= 35) distribution['26-35']++;
        else if (age >= 36 && age <= 50) distribution['36-50']++;
        else if (age >= 51 && age <= 65) distribution['51-65']++;
        else if (age > 65) distribution['65+']++;
      }
    });

    return Object.entries(distribution).map(([range, count]) => ({
      name: range,
      value: count
    }));
  };

  const calculatePaymentStatus = (retreatData: any[]) => {
    const statusCount = retreatData.reduce((acc, registration) => {
      acc[registration.status] = (acc[registration.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count as number
    }));
  };

  const handleCreateAnnouncement = async () => {
    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          is_urgent: newAnnouncement.is_urgent
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Comunicado criado com sucesso!"
      });

      setNewAnnouncement({ title: '', content: '', is_urgent: false });
      loadDashboardData();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar comunicado",
        variant: "destructive"
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      const { error } = await supabase
        .from('events')
        .insert({
          name: newEvent.name,
          description: newEvent.description,
          event_date: newEvent.event_date,
          event_time: newEvent.event_time
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso!"
      });

      setNewEvent({ name: '', description: '', event_date: '', event_time: '' });
      loadDashboardData();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar evento",
        variant: "destructive"
      });
    }
  };

  const updatePaymentStatus = async (registrationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('retreat_registrations')
        .update({ status: newStatus })
        .eq('id', registrationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status de pagamento atualizado!"
      });

      loadDashboardData();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status",
        variant: "destructive"
      });
    }
  };

  const togglePrayerRequestStatus = async (requestId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({ is_answered: !currentStatus })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status do pedido atualizado!"
      });

      loadDashboardData();
    } catch (error) {
      console.error('Error updating prayer request:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar pedido",
        variant: "destructive"
      });
    }
  };

  const approveTestimony = async (testimonyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('testimonies')
        .update({ is_approved: !currentStatus })
        .eq('id', testimonyId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Testemunho atualizado!"
      });

      loadDashboardData();
    } catch (error) {
      console.error('Error updating testimony:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar testemunho",
        variant: "destructive"
      });
    }
  };

  const AppSidebar = () => (
    <Sidebar className="w-64">
      <SidebarContent>
        <div className="p-4 border-b">
          <img src={logoHorizontal} alt="Logo" className="h-12 w-auto" />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton 
                    onClick={() => setActiveTab(item.value)}
                    className={activeTab === item.value ? "bg-primary text-primary-foreground" : ""}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <main className="flex-1 p-6 bg-background">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Voltar ao App
            </Button>
          </div>

          {/* Versículo do Dia */}
          {dailyVerse && activeTab === 'overview' && (
            <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2 text-primary">Versículo do Dia</h3>
                  <p className="text-foreground/80 italic">{dailyVerse}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Membros</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stats.totalMembers}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inscrições Retiro</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">{stats.retreatSignups}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{stats.pendingPayments}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">R$ {stats.pendingPaymentValue}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Membros por Faixa Etária</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{}} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.ageDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {stats.ageDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status de Pagamento - Retiro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={{}} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.paymentStatus}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" fill="hsl(var(--primary))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle>Últimos Comunicados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentAnnouncements.map((announcement) => (
                      <div key={announcement.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{announcement.title}</h4>
                          <p className="text-sm text-muted-foreground">{announcement.content.substring(0, 100)}...</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(announcement.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        {announcement.is_urgent && (
                          <Badge variant="destructive">Urgente</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestão de Membros</h2>
                <div className="flex gap-4">
                  <Input
                    placeholder="Buscar por nome, email ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80"
                  />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="retreat">Inscritos Retiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Membro ID</TableHead>
                        <TableHead>Data Cadastro</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members
                        .filter(member => 
                          member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.document_number?.includes(searchTerm) ||
                          member.phone?.includes(searchTerm)
                        )
                        .map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>{member.full_name}</TableCell>
                          <TableCell>{member.user_id}</TableCell>
                          <TableCell>{member.phone}</TableCell>
                          <TableCell>{member.document_number}</TableCell>
                          <TableCell>{member.member_id}</TableCell>
                          <TableCell>{new Date(member.created_at).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Retreat Tab */}
          {activeTab === 'retreat' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestão do Retiro</h2>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Lista
                </Button>
              </div>

              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Status Pagamento</TableHead>
                        <TableHead>Data Inscrição</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {retreatMembers.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>{registration.profiles?.full_name}</TableCell>
                          <TableCell>{registration.profiles?.phone}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={registration.status === 'Pago' ? 'default' : 
                                      registration.status === 'Pendente' ? 'destructive' : 'secondary'}
                            >
                              {registration.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(registration.created_at).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Select 
                                value={registration.status} 
                                onValueChange={(value) => updatePaymentStatus(registration.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pendente">Pendente</SelectItem>
                                  <SelectItem value="Pago">Pago</SelectItem>
                                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Announcements Tab */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Comunicados</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Comunicado
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Comunicado</DialogTitle>
                      <DialogDescription>
                        Crie um novo comunicado para enviar a todos os membros.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={newAnnouncement.title}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Conteúdo</Label>
                        <Textarea
                          id="content"
                          value={newAnnouncement.content}
                          onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                          rows={5}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="urgent"
                          checked={newAnnouncement.is_urgent}
                          onCheckedChange={(checked) => setNewAnnouncement({...newAnnouncement, is_urgent: checked})}
                        />
                        <Label htmlFor="urgent">Marcar como urgente</Label>
                      </div>
                      <Button onClick={handleCreateAnnouncement} className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Criar e Enviar
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent>
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{announcement.title}</h3>
                              {announcement.is_urgent && (
                                <Badge variant="destructive">Urgente</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(announcement.created_at).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Eventos & Agenda</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Evento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="event-name">Nome do Evento</Label>
                        <Input
                          id="event-name"
                          value={newEvent.name}
                          onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-description">Descrição</Label>
                        <Textarea
                          id="event-description"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-date">Data</Label>
                        <Input
                          id="event-date"
                          type="date"
                          value={newEvent.event_date}
                          onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-time">Hora</Label>
                        <Input
                          id="event-time"
                          type="time"
                          value={newEvent.event_time}
                          onChange={(e) => setNewEvent({...newEvent, event_time: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleCreateEvent} className="w-full">
                        Criar Evento
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>{event.name}</TableCell>
                          <TableCell>{event.description}</TableCell>
                          <TableCell>{new Date(event.event_date).toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell>{event.event_time}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Prayer & Testimonies Tab */}
          {activeTab === 'prayer' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Pedidos de Oração & Testemunhos</h2>
              
              <Tabs defaultValue="prayer" className="w-full">
                <TabsList>
                  <TabsTrigger value="prayer">Pedidos de Oração</TabsTrigger>
                  <TabsTrigger value="testimonies">Testemunhos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="prayer" className="space-y-4">
                  <Card>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {prayerRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>{request.profiles?.full_name}</TableCell>
                              <TableCell>{request.title}</TableCell>
                              <TableCell>{request.description.substring(0, 100)}...</TableCell>
                              <TableCell>
                                <Badge variant={request.is_answered ? "default" : "secondary"}>
                                  {request.is_answered ? "Atendido" : "Pendente"}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(request.created_at).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => togglePrayerRequestStatus(request.id, request.is_answered)}
                                >
                                  {request.is_answered ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="testimonies" className="space-y-4">
                  <Card>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Autor</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Conteúdo</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {testimonies.map((testimony) => (
                            <TableRow key={testimony.id}>
                              <TableCell>{testimony.profiles?.full_name}</TableCell>
                              <TableCell>{testimony.title}</TableCell>
                              <TableCell>{testimony.content.substring(0, 100)}...</TableCell>
                              <TableCell>
                                <Badge variant={testimony.is_approved ? "default" : "secondary"}>
                                  {testimony.is_approved ? "Aprovado" : "Pendente"}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(testimony.created_at).toLocaleDateString('pt-BR')}</TableCell>
                              <TableCell>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => approveTestimony(testimony.id, testimony.is_approved)}
                                >
                                  {testimony.is_approved ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Galeria de Fotos & Mídias</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Álbum
                </Button>
              </div>
              
              <Card>
                <CardContent>
                  <div className="text-center py-12">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum álbum criado</h3>
                    <p className="text-muted-foreground">Crie seu primeiro álbum para começar a organizar as fotos dos eventos.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Configurações do App</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Gerais</CardTitle>
                    <CardDescription>
                      Configure as informações básicas do aplicativo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="app-name">Nome do App</Label>
                      <Input id="app-name" defaultValue="Assembleia de Deus Bom Pastor" />
                    </div>
                    <div>
                      <Label htmlFor="daily-verse">Versículo do Dia</Label>
                      <Textarea 
                        id="daily-verse" 
                        value={dailyVerse}
                        onChange={(e) => setDailyVerse(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact-email">Email de Contato</Label>
                      <Input id="contact-email" defaultValue="contato@adbompastor.org.br" />
                    </div>
                    <Button>Salvar Configurações</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Administradores</CardTitle>
                    <CardDescription>
                      Gerencie os usuários com acesso administrativo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Lista de administradores será exibida aqui</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;