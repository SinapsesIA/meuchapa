
export type MelhoriaCategoriaType = 'Bug' | 'Sugestão' | 'Recurso Novo' | 'Ajuste Visual' | 'Outro';
export type MelhoriaUrgenciaType = 'Baixa' | 'Média' | 'Alta';
export type MelhoriaStatusType = 'Pendente' | 'Em análise' | 'Em desenvolvimento' | 'Implementado' | 'Rejeitado';

export interface Melhoria {
  id: string;
  titulo: string;
  descricao: string;
  categoria: MelhoriaCategoriaType;
  urgencia: MelhoriaUrgenciaType;
  status: MelhoriaStatusType;
  usuario_id: string | null;
  data_solicitacao: Date;
  data_atualizacao: Date;
  anexo_url: string | null;
  imagem_url?: string | null;
}

export interface MelhoriaComentario {
  id: string;
  melhoria_id: string;
  usuario_id: string | null;
  conteudo: string;
  data_criacao: Date;
  is_admin: boolean;
}

export type SortField = 'titulo' | 'urgencia' | 'categoria' | 'status' | 'data_solicitacao' | 'data_atualizacao';
export type SortOrder = 'asc' | 'desc';

export interface MelhoriaFilter {
  status?: MelhoriaStatusType | "Todas";
  categoria?: MelhoriaCategoriaType | "Todas";
  urgencia?: MelhoriaUrgenciaType | "Todas";
  dataInicio?: Date | null;
  dataFim?: Date | null;
  searchTerm?: string;
  id?: string;
  sortField?: SortField;
  sortOrder?: SortOrder;
}
