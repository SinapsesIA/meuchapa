
import { Layout } from "@/components/layout/Layout";
import { MelhoriaDetail } from "@/components/melhorias/MelhoriaDetail";
import { useMelhorias } from "@/hooks/useMelhorias";
import { MelhoriaCategoriaType, MelhoriaStatusType, MelhoriaUrgenciaType, SortField, SortOrder } from "@/types/melhorias";
import { useUserAdmin } from "@/hooks/useUserAdmin";
import { useMelhoriasView } from "@/hooks/useMelhoriasView";
import { MelhoriaNewView } from "@/components/melhorias/MelhoriaNewView";
import { MelhoriaListView } from "@/components/melhorias/MelhoriaListView";
import { setupStorageBuckets } from "@/utils/supabase-storage-setup";
import { useEffect } from "react";

export default function MelhoriasPage() {
  const { isAdmin } = useUserAdmin();
  const { 
    currentView, 
    viewMode, 
    selectedId,
    showListView,
    showNewView,
    showDetailView,
    toggleViewMode
  } = useMelhoriasView();

  const { 
    melhorias, 
    melhoria, 
    comentarios,
    isLoading, 
    isMelhoriaLoading,
    isComentariosLoading,
    filter, 
    setFilter,
    createMelhoria,
    updateMelhoria,
    createComentario
  } = useMelhorias();

  // Initialize storage buckets when page loads
  useEffect(() => {
    setupStorageBuckets();
  }, []);

  const handleFilterChange = (filters: {
    status?: MelhoriaStatusType | "Todas";
    categoria?: MelhoriaCategoriaType | "Todas";
    urgencia?: MelhoriaUrgenciaType | "Todas";
    searchTerm?: string;
    sortField?: SortField;
    sortOrder?: SortOrder;
  }) => {
    setFilter({
      ...filter,
      ...filters
    });
  };
  
  const handleViewClick = (id: string) => {
    setFilter({ ...filter, id });
    showDetailView(id);
  };
  
  const handleCreateSubmit = async (data: any) => {
    await createMelhoria(data);
    showListView();
  };
  
  const handleStatusChange = (status: MelhoriaStatusType) => {
    if (selectedId && melhoria) {
      updateMelhoria({
        id: selectedId,
        updates: { status }
      });
    }
  };

  const handleUpdateMelhoria = async (id: string, updates: any) => {
    await updateMelhoria({ id, updates });
  };

  const handleKanbanStatusChange = (id: string, status: MelhoriaStatusType) => {
    console.log(`Moving item ${id} to ${status}`);
    updateMelhoria({
      id,
      updates: { status }
    });
  };

  const handleComentarioSubmit = async (comentario: string, isAdminComment: boolean) => {
    if (selectedId) {
      await createComentario({
        melhoria_id: selectedId,
        usuario_id: null,
        conteudo: comentario,
        is_admin: isAdminComment
      });
    }
  };

  // Extract the filter values that should be passed to the list view
  const currentFilters = {
    status: filter.status,
    categoria: filter.categoria,
    urgencia: filter.urgencia,
    searchTerm: filter.searchTerm
  };
  
  // Render the current view
  const renderContent = () => {
    switch (currentView) {
      case "new":
        return (
          <MelhoriaNewView
            onSubmit={handleCreateSubmit}
            onCancel={showListView}
          />
        );
      
      case "detail":
        return melhoria ? (
          <MelhoriaDetail 
            melhoria={melhoria} 
            comentarios={comentarios || []}
            isAdmin={isAdmin}
            loading={isMelhoriaLoading}
            isComentariosLoading={isComentariosLoading}
            onBack={showListView}
            onStatusChange={handleStatusChange}
            onComentarioSubmit={handleComentarioSubmit}
            onUpdate={handleUpdateMelhoria}
          />
        ) : null;
      
      default:
        return (
          <MelhoriaListView
            melhorias={melhorias || []}
            isLoading={isLoading}
            viewMode={viewMode}
            onViewModeChange={toggleViewMode}
            onFilterChange={handleFilterChange}
            onNewClick={showNewView}
            onViewClick={handleViewClick}
            onStatusChange={handleKanbanStatusChange}
            sortField={filter.sortField}
            sortOrder={filter.sortOrder}
            currentFilters={currentFilters}
          />
        );
    }
  };
  
  return (
    <Layout loading={isLoading && currentView === "list"} requireAuth={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Melhorias e Ajustes</h1>
        </div>
        
        {renderContent()}
      </div>
    </Layout>
  );
}
