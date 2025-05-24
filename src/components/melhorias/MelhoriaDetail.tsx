import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Melhoria, 
  MelhoriaComentario, 
  MelhoriaStatusType,
  MelhoriaCategoriaType,
  MelhoriaUrgenciaType 
} from "@/types/melhorias";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Check, Edit, FileImage, ImageIcon, Loader2, Save, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MelhoriaDetailProps {
  melhoria: Melhoria;
  comentarios: MelhoriaComentario[];
  isAdmin: boolean;
  loading?: boolean;
  isComentariosLoading?: boolean;
  onBack: () => void;
  onStatusChange: (status: MelhoriaStatusType) => void;
  onComentarioSubmit: (comentario: string, isAdmin: boolean) => void;
  onUpdate?: (id: string, updates: Partial<Melhoria>) => Promise<void>;
}

export function MelhoriaDetail({ 
  melhoria,
  comentarios,
  isAdmin,
  loading = false,
  isComentariosLoading = false,
  onBack,
  onStatusChange,
  onComentarioSubmit,
  onUpdate
}: MelhoriaDetailProps) {
  const [novoComentario, setNovoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [userInfo, setUserInfo] = useState<{ email: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedMelhoria, setEditedMelhoria] = useState<Partial<Melhoria>>({});
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em análise':
        return 'bg-blue-100 text-blue-800';
      case 'Em desenvolvimento':
        return 'bg-purple-100 text-purple-800';
      case 'Implementado':
        return 'bg-green-100 text-green-800';
      case 'Rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'Bug':
        return 'bg-red-50 text-red-700';
      case 'Sugestão':
        return 'bg-blue-50 text-blue-700';
      case 'Recurso Novo':
        return 'bg-green-50 text-green-700';
      case 'Ajuste Visual':
        return 'bg-purple-50 text-purple-700';
      case 'Outro':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'Baixa':
        return 'bg-green-50 text-green-700';
      case 'Média':
        return 'bg-yellow-50 text-yellow-700';
      case 'Alta':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatData = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  const handleEnviarComentario = async () => {
    if (!novoComentario.trim()) return;
    
    setEnviando(true);
    try {
      await onComentarioSubmit(novoComentario, isAdmin);
      setNovoComentario("");
    } finally {
      setEnviando(false);
    }
  };
  
  const getUserInfo = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const handleEdit = () => {
    setEditedMelhoria({
      titulo: melhoria.titulo,
      descricao: melhoria.descricao,
      categoria: melhoria.categoria,
      urgencia: melhoria.urgencia,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedMelhoria({});
  };

  const handleSave = async () => {
    if (!onUpdate) return;
    
    setIsSaving(true);
    try {
      await onUpdate(melhoria.id, editedMelhoria);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setEditedMelhoria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if the image is a base64 string or a URL
  const isBase64Image = melhoria.imagem_url?.startsWith('data:image/');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="text-2xl font-bold">Detalhes da Solicitação</div>
        </div>

        {(isAdmin || true) && !isEditing && (
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        )}

        {isEditing && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input 
                        value={editedMelhoria.titulo || ''} 
                        onChange={(e) => handleChange('titulo', e.target.value)}
                        className="text-xl font-bold mb-2"
                      />
                    ) : (
                      <CardTitle className="text-xl">{melhoria.titulo}</CardTitle>
                    )}
                    <CardDescription>
                      Criado em {formatData(melhoria.data_solicitacao)}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <>
                        <Select
                          value={editedMelhoria.categoria || melhoria.categoria}
                          onValueChange={(value) => handleChange('categoria', value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bug">Bug</SelectItem>
                            <SelectItem value="Sugestão">Sugestão</SelectItem>
                            <SelectItem value="Recurso Novo">Recurso Novo</SelectItem>
                            <SelectItem value="Ajuste Visual">Ajuste Visual</SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={editedMelhoria.urgencia || melhoria.urgencia}
                          onValueChange={(value) => handleChange('urgencia', value)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      <>
                        <Badge className={getCategoriaColor(melhoria.categoria)}>
                          {melhoria.categoria}
                        </Badge>
                        <Badge className={getUrgenciaColor(melhoria.urgencia)}>
                          Urgência: {melhoria.urgencia}
                        </Badge>
                        <Badge className={getStatusColor(melhoria.status)}>
                          {melhoria.status}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea 
                    value={editedMelhoria.descricao || ''}
                    onChange={(e) => handleChange('descricao', e.target.value)}
                    className="min-h-[150px]"
                  />
                ) : (
                  <div className="whitespace-pre-wrap">{melhoria.descricao}</div>
                )}
                
                {/* Exibir a imagem da captura de tela */}
                {melhoria.imagem_url && (
                  <div className="mt-6">
                    <div className="font-medium mb-2 text-gray-700">Captura de Tela:</div>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
                        <img 
                          src={melhoria.imagem_url} 
                          alt="Captura de tela do ajuste"
                          className="max-w-full max-h-[500px] object-contain"
                          onClick={() => window.open(melhoria.imagem_url, '_blank')}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="absolute bottom-2 right-2"
                          onClick={() => window.open(melhoria.imagem_url, '_blank')}
                        >
                          <ImageIcon className="h-4 w-4 mr-1" /> Ver em tamanho completo
                        </Button>
                      </div>
                      <div className="p-3 border-t bg-gray-50 text-xs text-gray-500">
                        {isBase64Image ? 
                          "Imagem armazenada no banco de dados" : 
                          melhoria.imagem_url.split('/').pop()
                        }
                      </div>
                    </div>
                  </div>
                )}
                
                {melhoria.anexo_url && (
                  <div className="mt-4 border rounded p-3 flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-blue-500" />
                    <a 
                      href={melhoria.anexo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Ver anexo
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comentários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isComentariosLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : comentarios.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      Ainda não há comentários nesta solicitação
                    </div>
                  ) : (
                    comentarios.map((comentario) => (
                      <div key={comentario.id} className="space-y-2 pb-4">
                        <div className={`p-4 rounded-lg ${
                          comentario.is_admin 
                            ? "bg-blue-50 border border-blue-100" 
                            : "bg-gray-50 border border-gray-100"
                        }`}>
                          <div className="flex justify-between items-start">
                            <div className="font-medium">
                              {comentario.is_admin ? "Administrador" : "Você"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(comentario.data_criacao, "dd/MM/yyyy HH:mm")}
                            </div>
                          </div>
                          <div className="mt-2 whitespace-pre-wrap">{comentario.conteudo}</div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <div className="pt-4">
                    <Textarea 
                      placeholder="Adicionar um comentário..." 
                      value={novoComentario}
                      onChange={(e) => setNovoComentario(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="mt-2 flex justify-end">
                      <Button 
                        onClick={handleEnviarComentario} 
                        disabled={!novoComentario.trim() || enviando}
                      >
                        {enviando && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Send className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium text-sm text-gray-500">Data de Solicitação</div>
                  <div>{formatData(melhoria.data_solicitacao)}</div>
                </div>
                
                <div>
                  <div className="font-medium text-sm text-gray-500">Última Atualização</div>
                  <div>{formatData(melhoria.data_atualizacao)}</div>
                </div>
                
                <Separator />
                
                {isAdmin && (
                  <div className="pt-2">
                    <div className="font-medium text-sm text-gray-500 mb-2">Status da Solicitação</div>
                    <Select
                      value={melhoria.status}
                      onValueChange={(value) => onStatusChange(value as MelhoriaStatusType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Em análise">Em análise</SelectItem>
                        <SelectItem value="Em desenvolvimento">Em desenvolvimento</SelectItem>
                        <SelectItem value="Implementado">Implementado</SelectItem>
                        <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
