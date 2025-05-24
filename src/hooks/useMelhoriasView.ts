
import { useState } from "react";
import { MelhoriaCategoriaType, MelhoriaStatusType } from "@/types/melhorias";

type MelhoriasView = "list" | "new" | "detail";
type ViewMode = "list" | "kanban";

export function useMelhoriasView() {
  const [currentView, setCurrentView] = useState<MelhoriasView>("list");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const showListView = () => {
    setCurrentView("list");
    setSelectedId(undefined);
  };

  const showNewView = () => {
    setCurrentView("new");
  };

  const showDetailView = (id: string) => {
    setSelectedId(id);
    setCurrentView("detail");
  };

  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return {
    currentView,
    viewMode,
    selectedId,
    showListView,
    showNewView,
    showDetailView,
    toggleViewMode
  };
}
