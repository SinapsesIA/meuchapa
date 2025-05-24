
import { useState } from "react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { MelhoriaCategoriaType, MelhoriaUrgenciaType } from "@/types/melhorias";
import { Loader2, ImageIcon, Trash2, File, X } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  descricao: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  categoria: z.enum(["Bug", "Sugestão", "Recurso Novo", "Ajuste Visual", "Outro"] as const),
  urgencia: z.enum(["Baixa", "Média", "Alta"] as const),
});

type FormValues = z.infer<typeof formSchema>;

interface MelhoriaFormProps {
  onSubmit: (data: FormValues & { 
    anexoFile?: File | null,
    imagemFile?: File | null,
    anexo_url?: string | null,
    imagem_url?: string | null 
  }) => Promise<void>;
  onCancel: () => void;
  initialValues?: {
    titulo?: string;
    descricao?: string;
    categoria?: MelhoriaCategoriaType;
    urgencia?: MelhoriaUrgenciaType;
    anexo_url?: string | null;
    imagem_url?: string | null;
  };
}

export function MelhoriaForm({ onSubmit, onCancel, initialValues }: MelhoriaFormProps) {
  const [anexoFile, setAnexoFile] = useState<File | null>(null);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string | null>(initialValues?.imagem_url || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: initialValues?.titulo || "",
      descricao: initialValues?.descricao || "",
      categoria: initialValues?.categoria || "Bug",
      urgencia: initialValues?.urgencia || "Média",
    },
  });

  const handleAnexoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      toast.error("O arquivo é muito grande. Tamanho máximo: 5MB");
      return;
    }
    
    setAnexoFile(selectedFile);
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      toast.error("A imagem é muito grande. Tamanho máximo: 5MB");
      return;
    }
    
    if (selectedFile) {
      setImagemFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        setPreviewImagem(e.target?.result as string);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const removeAnexo = () => {
    setAnexoFile(null);
  };

  const removeImagem = () => {
    setImagemFile(null);
    setPreviewImagem(null);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Submit form with files and existing URLs if no new files selected
      await onSubmit({ 
        ...values, 
        anexoFile, 
        imagemFile,
        anexo_url: !anexoFile ? initialValues?.anexo_url : undefined,
        imagem_url: !imagemFile ? initialValues?.imagem_url : undefined
      });
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da solicitação</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título da sua solicitação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição detalhada</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva sua solicitação em detalhes" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Sugestão">Sugestão</SelectItem>
                    <SelectItem value="Recurso Novo">Recurso Novo</SelectItem>
                    <SelectItem value="Ajuste Visual">Ajuste Visual</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="urgencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgência</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a urgência" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Média">Média</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <FormLabel>Imagem (opcional)</FormLabel>
            <div className="mt-2">
              {previewImagem ? (
                <div className="relative border rounded-md overflow-hidden">
                  <img 
                    src={previewImagem} 
                    alt="Preview" 
                    className="max-h-[200px] w-full object-contain bg-gray-50"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImagem}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-md p-4">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                    <label htmlFor="imagem" className="text-sm text-blue-600 cursor-pointer hover:underline">
                      Clique para adicionar uma imagem
                      <input
                        type="file"
                        id="imagem"
                        className="sr-only"
                        onChange={handleImagemChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <FormLabel>Arquivo anexo (opcional)</FormLabel>
            <div className="mt-2">
              {anexoFile ? (
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">{anexoFile.name} ({(anexoFile.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeAnexo}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ) : initialValues?.anexo_url ? (
                <div className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-blue-500" />
                    <a 
                      href={initialValues.anexo_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Anexo atual
                    </a>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const input = document.getElementById('anexo') as HTMLInputElement;
                      if (input) input.click();
                    }}
                  >
                    <span className="text-xs text-blue-600">Alterar</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    id="anexo" 
                    onChange={handleAnexoChange}
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Salvar Solicitação
          </Button>
        </div>
      </form>
    </Form>
  );
}
