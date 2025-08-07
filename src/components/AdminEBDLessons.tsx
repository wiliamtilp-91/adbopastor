import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, GraduationCap, Upload, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EBDCategory {
  id: string;
  name: string;
  age_range: string;
}

interface EBDLesson {
  id: string;
  title: string;
  description: string;
  category_id: string;
  lesson_date: string;
  file_url: string;
  file_type: string;
  is_active: boolean;
  created_at: string;
  ebd_categories?: EBDCategory;
}

export const AdminEBDLessons = () => {
  const [lessons, setLessons] = useState<EBDLesson[]>([]);
  const [categories, setCategories] = useState<EBDCategory[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [lessonDate, setLessonDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLessons();
    fetchCategories();
  }, []);

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('ebd_lessons')
        .select(`
          *,
          ebd_categories (
            id,
            name,
            age_range
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error("Erro ao carregar lições da EBD");
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('ebd_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Erro ao carregar categorias da EBD");
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `ebd-lessons/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const addLesson = async () => {
    if (!title || !categoryId || !file) {
      toast.error("Título, categoria e arquivo são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const fileUrl = await handleFileUpload(file);
      const fileType = file.name.split('.').pop()?.toLowerCase() || '';

      const { error } = await supabase
        .from('ebd_lessons')
        .insert({
          title,
          description,
          category_id: categoryId,
          lesson_date: lessonDate || null,
          file_url: fileUrl,
          file_type: fileType
        });

      if (error) throw error;

      toast.success("Lição da EBD adicionada com sucesso!");
      setTitle("");
      setDescription("");
      setCategoryId("");
      setLessonDate("");
      setFile(null);
      fetchLessons();
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error("Erro ao adicionar lição da EBD");
    } finally {
      setLoading(false);
    }
  };

  const toggleLessonStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('ebd_lessons')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Lição ${!currentStatus ? 'ativada' : 'desativada'} com sucesso!`);
      fetchLessons();
    } catch (error) {
      console.error('Error updating lesson status:', error);
      toast.error("Erro ao atualizar status da lição");
    }
  };

  const deleteLesson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ebd_lessons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Lição removida com sucesso!");
      fetchLessons();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error("Erro ao remover lição");
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
          <GraduationCap className="w-5 h-5 mr-2" />
          Lições da Escola Bíblica Dominical (EBD)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Lesson */}
        <div className="p-4 border rounded-lg space-y-4">
          <h3 className="font-medium">Adicionar Nova Lição</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da lição"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Departamento *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.age_range})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lesson-date">Data da Lição</Label>
              <Input
                id="lesson-date"
                type="date"
                value={lessonDate}
                onChange={(e) => setLessonDate(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição da lição (opcional)"
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
            onClick={addLesson} 
            disabled={loading}
            className="w-full bg-gradient-primary"
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? "Enviando..." : "Adicionar Lição"}
          </Button>
        </div>

        {/* Current Lessons */}
        <div className="space-y-4">
          <h3 className="font-medium">Lições Cadastradas</h3>
          {lessons.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma lição cadastrada</p>
          ) : (
            <div className="grid gap-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{lesson.title}</h4>
                      {lesson.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {lesson.description}
                        </p>
                      )}
                      {lesson.lesson_date && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Data: {new Date(lesson.lesson_date).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getFileTypeColor(lesson.file_type)}>
                        {lesson.file_type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {lesson.ebd_categories?.name}
                      </Badge>
                      <Badge variant={lesson.is_active ? "default" : "secondary"}>
                        {lesson.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(lesson.file_url, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLessonStatus(lesson.id, lesson.is_active)}
                    >
                      {lesson.is_active ? "Desativar" : "Ativar"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteLesson(lesson.id)}
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