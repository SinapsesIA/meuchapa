
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Pencil, 
  Square, 
  Type, 
  Circle as CircleIcon, 
  MousePointer, 
  ArrowRight 
} from "lucide-react";

interface AnnotationToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
}

export function AnnotationToolbar({ activeTool, onToolChange }: AnnotationToolbarProps) {
  return (
    <ToggleGroup 
      type="single" 
      value={activeTool} 
      onValueChange={(value) => value && onToolChange(value)}
    >
      <ToggleGroupItem value="select" aria-label="Select">
        <MousePointer className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="draw" aria-label="Draw">
        <Pencil className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="rectangle" aria-label="Rectangle">
        <Square className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="circle" aria-label="Circle">
        <CircleIcon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="text" aria-label="Text">
        <Type className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="arrow" aria-label="Arrow">
        <ArrowRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
