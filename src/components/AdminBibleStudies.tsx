import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, BookOpen, Upload, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BibleStudy {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export const AdminBibleStudies = () => {
  const [studies, setStudies] = useState<BibleStudy[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('bible_studies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudies(data || []);
    } catch (error) {
      console.error('Error fetching studies:', error);
      toast.error("Erro ao carregar estudos bíblicos");
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `bible-studies/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const addStudy = async () => {
    if (!title || !file) {
      toast.error("Título e arquivo são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const fileUrl = await handleFileUpload(file);
      const fileType = file.name.split('.').pop()?.toLowerCase() || '';

      const { error } = await supabase
        .from('bible_studies')
        .insert({
          title,
          description,
          file_url: fileUrl,
          file_type: fileType,
          category
        });

      if (error) throw error;

      toast.success("Estudo bíblico adicionado com sucesso!");
      setTitle("");
      setDescription("");
      setCategory("general");
      setFile(null);
      fetchStudies();
    } catch (error) {
      console.error('Error adding study:', error);
      toast.error("Erro ao adicionar estudo bíblico");
    } finally {
      setLoading(false);
    }
  };

  const toggleStudyStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('bible_studies')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Estudo ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
      fetchStudies();
    } catch (error) {
      console.error('Error updating study status:', error);
      toast.error("Erro ao atualizar status do estudo");
    }
  };

  const deleteStudy = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bible_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Estudo removido com sucesso!");
      fetchStudies();
    } catch (error) {
      console.error('Error deleting study:', error);
      toast.error("Erro ao remover estudo");
    }
  };

  const getFileTypeColor = (fileType: string) => {
    const colors: { [key: string]: string } = {
      pdf: "bg-red-100 text-red-800",
      doc: "bg-blue-100 text-blue-800",
      docx: "bg-blue-100 text-blue-800"
    };
    return colors[fileType] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="shadow-divine border-0">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <BookOpen className="w-5 h-5 mr-2" />
          Estudos Bíblicos para Culto nos Lares
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Study */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-medium">Adicionar Novo Estudo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do estudo"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="family">Família</SelectItem>
                  <SelectItem value="youth">Jovens</SelectItem>
                  <SelectItem value="prayer">Oração</SelectItem>
                  <SelectItem value="doctrine">Doutrina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do estudo (opcional)"
            />
          </div>
          
          <div>
            <Label htmlFor="file">Arquivo (PDF, DOC, DOCX) *</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          
          <Button 
            onClick={addStudy} 
            disabled={loading}
            className="w-full bg-gradient-primary"
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? "Enviando..." : "Adicionar Estudo"}
          </Button>
        </div>

        {/* Current Studies */}
        <div className="space-y-4">
          <h3 className="font-medium">Estudos Cadastrados</h3>
          {studies.length === 0 ? (
            <p className="text-muted-foreground">Nenhum estudo cadastrado</p>
          ) : (
            <div className="grid gap-4">
              {studies.map((study) => (
                <div key={study.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{study.title}</h4>
                      {study.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {study.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getFileTypeColor(study.file_type)}>
                        {study.file_type.toUpperCase()}
                      </Badge>
                      <Badge variant={study.is_active ? "default" : "secondary"}>
                        {study.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(study.file_url, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStudyStatus(study.id, study.is_active)}
                    >
                      {study.is_active ? "Desativar" : "Ativar"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteStudy(study.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};