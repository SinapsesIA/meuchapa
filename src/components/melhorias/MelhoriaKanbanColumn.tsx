
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { MelhoriaStatusType, Melhoria } from "@/types/melhorias";
import { MelhoriaKanbanCard } from "./MelhoriaKanbanCard";

interface MelhoriaKanbanColumnProps {
  id: MelhoriaStatusType;
  title: string;
  items: Melhoria[];
  onViewClick: (id: string) => void;
  contentHeight?: number;
}

export function MelhoriaKanbanColumn({ 
  id, 
  title, 
  items, 
  onViewClick,
  contentHeight = 500
}: MelhoriaKanbanColumnProps) {
  
  // Get background color for column header based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-yellow-100 border-yellow-300';
      case 'Em análise':
        return 'bg-blue-100 border-blue-300';
      case 'Em desenvolvimento':
        return 'bg-purple-100 border-purple-300';
      case 'Implementado':
        return 'bg-green-100 border-green-300';
      case 'Rejeitado':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="flex-shrink-0 w-[280px] flex flex-col h-full relative">
      <div className={`rounded-t-md p-3 font-medium ${getStatusColor(id)} sticky top-0 z-20 shadow-sm`}>
        <div className="flex items-center justify-between">
          <span>{title}</span>
          <span className="bg-white text-xs font-semibold px-2 py-1 rounded-full">
            {items.length}
          </span>
        </div>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div 
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`bg-gray-50 rounded-b-md p-2 border border-gray-200 overflow-y-auto
                       ${snapshot.isDraggingOver ? 'bg-gray-100' : ''}`}
            style={{
              transition: 'background-color 0.2s ease',
              height: `${contentHeight}px`
            }}
          >
            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="flex items-center justify-center h-20 text-gray-400 text-sm border border-dashed border-gray-300 rounded-md">
                  Sem solicitações
                </div>
              ) : (
                items.map((item, index) => (
                  <MelhoriaKanbanCard 
                    key={item.id}
                    index={index}
                    melhoria={item}
                    onViewClick={onViewClick}
                  />
                ))
              )}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    </div>
  );
}
