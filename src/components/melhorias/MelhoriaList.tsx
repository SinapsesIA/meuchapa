
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUp, ArrowDown } from "lucide-react";
import { Melhoria, SortField, SortOrder } from "@/types/melhorias";

interface MelhoriaListProps {
  melhorias: Melhoria[];
  onViewClick: (id: string) => void;
  sortField?: SortField;
  sortOrder?: SortOrder;
  onSortChange?: (field: SortField, order: SortOrder) => void;
}

export function MelhoriaList({ 
  melhorias, 
  onViewClick,
  sortField = 'urgencia',
  sortOrder = 'asc',
  onSortChange
}: MelhoriaListProps) {
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
      case 'Alta':
        return 'bg-red-50 text-red-700';
      case 'Média':
        return 'bg-yellow-50 text-yellow-700';
      case 'Baixa':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleSort = (field: SortField) => {
    if (!onSortChange) return;
    
    // Toggle or set new order
    if (field === sortField) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };
  
  const renderSortIcon = (field: SortField) => {
    if (field !== sortField) return null;
    return sortOrder === 'asc' ? (
      <ArrowUp className="inline h-4 w-4 ml-1" />
    ) : (
      <ArrowDown className="inline h-4 w-4 ml-1" />
    );
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[300px] cursor-pointer"
              onClick={() => handleSort('titulo')}
            >
              Título {renderSortIcon('titulo')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('categoria')}
            >
              Categoria {renderSortIcon('categoria')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('urgencia')}
            >
              Urgência {renderSortIcon('urgencia')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('status')}
            >
              Status {renderSortIcon('status')}
            </TableHead>
            <TableHead 
              className="hidden md:table-cell cursor-pointer"
              onClick={() => handleSort('data_solicitacao')}
            >
              Data Solicitação {renderSortIcon('data_solicitacao')}
            </TableHead>
            <TableHead 
              className="hidden md:table-cell cursor-pointer"
              onClick={() => handleSort('data_atualizacao')}
            >
              Última Atualização {renderSortIcon('data_atualizacao')}
            </TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {melhorias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                Nenhuma solicitação encontrada
              </TableCell>
            </TableRow>
          ) : (
            melhorias.map((melhoria) => (
              <TableRow key={melhoria.id}>
                <TableCell className="font-medium">{melhoria.titulo}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getCategoriaColor(melhoria.categoria)}>
                    {melhoria.categoria}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getUrgenciaColor(melhoria.urgencia)}>
                    {melhoria.urgencia}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(melhoria.status)}>
                    {melhoria.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(melhoria.data_solicitacao)}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatDate(melhoria.data_atualizacao)}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onViewClick(melhoria.id)} 
                    title="Ver detalhes"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
