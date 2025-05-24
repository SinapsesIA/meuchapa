
import { MelhoriaFilterBar } from "./MelhoriaFilterBar";
import { MelhoriaList } from "./MelhoriaList";
import { MelhoriaKanban } from "./MelhoriaKanban";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, LayoutGrid } from "lucide-react";
import { Melhoria, MelhoriaCategoriaType, MelhoriaStatusType, MelhoriaUrgenciaType, SortField, SortOrder } from "@/types/melhorias";

interface MelhoriaListViewProps {
  melhorias: Melhoria[];
  isLoading: boolean;
  viewMode: "list" | "kanban";
  onViewModeChange: (mode: "list" | "kanban") => void;
  onFilterChange: (filters: {
    status?: MelhoriaStatusType | "Todas";
    categoria?: MelhoriaCategoriaType | "Todas";
    urgencia?: MelhoriaUrgenciaType | "Todas";
    searchTerm?: string;
    sortField?: SortField;
    sortOrder?: SortOrder;
  }) => void;
  onNewClick: () => void;
  onViewClick: (id: string) => void;
  onStatusChange: (id: string, status: MelhoriaStatusType) => void;
  sortField?: SortField;
  sortOrder?: SortOrder;
  currentFilters?: {
    status?: MelhoriaStatusType | "Todas";
    categoria?: MelhoriaCategoriaType | "Todas";
    urgencia?: MelhoriaUrgenciaType | "Todas";
    searchTerm?: string;
  };
}

export function MelhoriaListView({
  melhorias,
  isLoading,
  viewMode,
  onViewModeChange,
  onFilterChange,
  onNewClick,
  onViewClick,
  onStatusChange,
  sortField = "urgencia",
  sortOrder = "asc",
  currentFilters = {}
}: MelhoriaListViewProps) {
  const handleSortChange = (field: SortField, order: SortOrder) => {
    onFilterChange({ sortField: field, sortOrder: order });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <MelhoriaFilterBar
          onFilterChange={onFilterChange}
          onNewClick={onNewClick}
          initialFilters={currentFilters}
        />

        <div className="ml-auto">
          <Tabs
            value={viewMode}
            onValueChange={(value) => onViewModeChange(value as "list" | "kanban")}
            className="w-[200px]"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <ListFilter className="h-4 w-4" /> Lista
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" /> Kanban
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {viewMode === "list" ? (
        <MelhoriaList
          melhorias={melhorias || []}
          onViewClick={onViewClick}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      ) : (
        <MelhoriaKanban
          melhorias={melhorias || []}
          onViewClick={onViewClick}
          onStatusChange={onStatusChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
