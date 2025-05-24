
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Melhoria } from "@/types/melhorias";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MelhoriaKanbanCardProps {
  melhoria: Melhoria;
  index: number;
  onViewClick: (id: string) => void;
}

export function MelhoriaKanbanCard({ 
  melhoria, 
  index,
  onViewClick 
}: MelhoriaKanbanCardProps) {
  
  // Fetch user info to display name
  const { data: userInfo } = useQuery({
    queryKey: ["user", melhoria.usuario_id],
    queryFn: async () => {
      if (!melhoria.usuario_id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", melhoria.usuario_id)
        .single();
        
      if (error) return null;
      return data;
    },
    enabled: !!melhoria.usuario_id,
  });

  // Format date
  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  // Get urgency color
  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia) {
      case 'Baixa':
        return 'border-l-green-500';
      case 'Média':
        return 'border-l-yellow-500';
      case 'Alta':
        return 'border-l-red-500';
      default:
        return 'border-l-gray-300';
    }
  };

  // Get category badge color
  const getCategoryColor = (categoria: string) => {
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

  return (
    <Draggable draggableId={melhoria.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
          }}
          className={`
            cursor-grab active:cursor-grabbing 
            bg-white p-3 rounded-md shadow-sm 
            border-l-4 ${getUrgencyColor(melhoria.urgencia)}
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : 'hover:shadow-md'}
            transition-shadow
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm line-clamp-2" title={melhoria.titulo}>
              {melhoria.titulo}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                onViewClick(melhoria.id);
              }}
              className="h-6 w-6 ml-1"
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>

          <Badge variant="outline" className={`text-xs mb-2 ${getCategoryColor(melhoria.categoria)}`}>
            {melhoria.categoria}
          </Badge>

          <div className="text-xs text-gray-500 mb-1">
            <div title={userInfo?.full_name || userInfo?.email || "Usuário"} className="truncate">
              {userInfo?.full_name || userInfo?.email || "Usuário"}
            </div>
            <div>{formatDate(melhoria.data_solicitacao)}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
