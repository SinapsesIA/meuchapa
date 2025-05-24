
import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { MelhoriaKanbanColumn } from "./MelhoriaKanbanColumn";
import { MelhoriaStatusType, Melhoria } from "@/types/melhorias";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { MelhoriaFilterDialog } from "./MelhoriaFilterDialog";

interface MelhoriaKanbanProps {
  melhorias: Melhoria[];
  onViewClick: (id: string) => void;
  onStatusChange: (id: string, status: MelhoriaStatusType) => void;
  isLoading?: boolean;
}

export function MelhoriaKanban({ 
  melhorias, 
  onViewClick, 
  onStatusChange,
  isLoading = false
}: MelhoriaKanbanProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [columnHeight, setColumnHeight] = useState(500); // Default height
  
  // Define all possible status values as column IDs
  const columns: MelhoriaStatusType[] = [
    "Pendente", 
    "Em análise", 
    "Em desenvolvimento", 
    "Implementado", 
    "Rejeitado"
  ];

  // Group items by status
  const itemsByStatus = columns.reduce((acc, status) => {
    acc[status] = melhorias.filter(item => item.status === status);
    return acc;
  }, {} as Record<MelhoriaStatusType, Melhoria[]>);

  // Find column with most items to determine height
  useEffect(() => {
    const maxItems = Math.max(...columns.map(col => itemsByStatus[col]?.length || 0));
    // Calculate a reasonable height based on the maximum number of items
    // Each card is approximately 120px tall + some spacing
    const calculatedHeight = Math.max(500, maxItems * 120 + 40); 
    setColumnHeight(calculatedHeight);
  }, [melhorias]);

  // Handle drag end event
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Check if we have a valid destination
    if (!destination) {
      return; // Dropped outside of a valid drop target
    }
    
    // Check if the position changed
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // Dropped in the same position
    }
    
    // Get the new status (destination column)
    const newStatus = destination.droppableId as MelhoriaStatusType;
    
    console.log(`Moving item ${draggableId} from ${source.droppableId} to ${newStatus}`);
    
    // Update the status in the database
    onStatusChange(draggableId, newStatus);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(true)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" /> Filtros
        </Button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="w-full rounded-md border h-[70vh] overflow-hidden">
          <ScrollArea className="w-full h-full">
            <div className="flex p-4 gap-4 h-full">
              {columns.map(columnId => (
                <MelhoriaKanbanColumn
                  key={columnId}
                  id={columnId}
                  title={columnId}
                  items={itemsByStatus[columnId] || []}
                  onViewClick={onViewClick}
                  contentHeight={columnHeight}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </DragDropContext>
      
      <MelhoriaFilterDialog 
        open={showFilters} 
        onOpenChange={setShowFilters}
      />
    </div>
  );
}
