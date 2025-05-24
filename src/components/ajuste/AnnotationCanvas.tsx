
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Transformer } from 'react-konva';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  Pencil, 
  Square, 
  Type, 
  Circle as CircleIcon, 
  MousePointer, 
  ArrowRight 
} from "lucide-react";
import { KonvaEventObject } from 'konva/lib/Node';

interface AnnotationCanvasProps {
  backgroundImage: string;
  onSave: (dataUrl: string) => void;
}

type Shape = {
  id: string;
  tool: string;
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fill?: string;
  stroke: string;
  strokeWidth: number;
  isDragging?: boolean;
  isSelected?: boolean;
};

export const AnnotationCanvas = forwardRef<
  { clearCanvas: () => void },
  AnnotationCanvasProps
>(({ backgroundImage, onSave }, ref) => {
  const [image] = useState(new window.Image());
  const [activeTool, setActiveTool] = useState<'select' | 'draw' | 'rectangle' | 'circle' | 'text' | 'arrow'>('select');
  const [activeColor, setActiveColor] = useState('#ff0000');
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const stageRef = React.useRef<any>(null);
  const transformerRef = React.useRef<any>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [textInput, setTextInput] = useState<{visible: boolean, x: number, y: number, text: string}>({
    visible: false,
    x: 0,
    y: 0,
    text: ''
  });
  
  // Load background image
  React.useEffect(() => {
    if (!backgroundImage) return;
    
    image.src = backgroundImage;
    image.onload = () => {
      // Calculate canvas size based on image dimensions
      const scale = Math.min(800 / image.width, 600 / image.height);
      setCanvasSize({
        width: image.width * scale,
        height: image.height * scale
      });
      
      // Trigger save when image loads
      handleSaveCanvas();
    };
  }, [backgroundImage]);

  // Update transformer when selected shape changes
  React.useEffect(() => {
    if (selectedShapeId && transformerRef.current) {
      // Find the selected node
      const selectedNode = stageRef.current?.findOne('#' + selectedShapeId);
      if (selectedNode) {
        // Attach transformer to the selected node
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      } else {
        // Clear selection if node not found
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else if (transformerRef.current) {
      // Clear selection
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedShapeId]);

  // Clear canvas method exposed to parent
  const clearCanvas = () => {
    setShapes([]);
    setSelectedShapeId(null);
    handleSaveCanvas();
  };
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clearCanvas
  }));
  
  const handleToolChange = (tool: typeof activeTool) => {
    setActiveTool(tool);
    
    // Clear selection when switching tools
    if (tool !== 'select') {
      setSelectedShapeId(null);
    }
  };
  
  const handleSaveCanvas = () => {
    if (!stageRef.current) return;
    
    // Hide transformer before creating dataURL
    const prevSelectedId = selectedShapeId;
    setSelectedShapeId(null);
    
    // Use timeout to ensure transformer is hidden before saving
    setTimeout(() => {
      if (!stageRef.current) return;
      const dataUrl = stageRef.current.toDataURL();
      onSave(dataUrl);
      
      // Restore selection
      setSelectedShapeId(prevSelectedId);
    }, 50);
  };
  
  // Generic event handler that works for both mouse and touch events
  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (activeTool === 'select') {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        setSelectedShapeId(null);
        return;
      }
      
      // Get id from clicked shape
      const id = e.target.id();
      setSelectedShapeId(id);
      return;
    }
    
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    
    setIsDrawing(true);
    const id = Date.now().toString();
    
    if (activeTool === 'draw') {
      setShapes([
        ...shapes,
        {
          id,
          tool: 'draw',
          points: [pos.x, pos.y],
          stroke: activeColor,
          strokeWidth: 3
        }
      ]);
    } else if (activeTool === 'rectangle') {
      setShapes([
        ...shapes,
        {
          id,
          tool: 'rectangle',
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          fill: 'transparent',
          stroke: activeColor,
          strokeWidth: 2
        }
      ]);
    } else if (activeTool === 'circle') {
      setShapes([
        ...shapes,
        {
          id,
          tool: 'circle',
          x: pos.x,
          y: pos.y,
          radius: 0,
          fill: 'transparent',
          stroke: activeColor,
          strokeWidth: 2
        }
      ]);
    } else if (activeTool === 'arrow') {
      setShapes([
        ...shapes,
        {
          id,
          tool: 'arrow',
          points: [pos.x, pos.y, pos.x, pos.y],
          stroke: activeColor,
          strokeWidth: 2
        }
      ]);
    } else if (activeTool === 'text') {
      setTextInput({
        visible: true,
        x: pos.x,
        y: pos.y,
        text: ''
      });
    }
  };
  
  // Generic event handler that works for both mouse and touch events
  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;
    
    const lastShape = shapes[shapes.length - 1];
    if (!lastShape) return;
    
    const newShapes = shapes.slice(0, -1);
    
    if (lastShape.tool === 'draw' && lastShape.points) {
      newShapes.push({
        ...lastShape,
        points: [...lastShape.points, point.x, point.y]
      });
    } else if (lastShape.tool === 'rectangle' && lastShape.x !== undefined && lastShape.y !== undefined) {
      newShapes.push({
        ...lastShape,
        width: point.x - lastShape.x,
        height: point.y - lastShape.y
      });
    } else if (lastShape.tool === 'circle' && lastShape.x !== undefined && lastShape.y !== undefined) {
      const dx = point.x - lastShape.x;
      const dy = point.y - lastShape.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      newShapes.push({
        ...lastShape,
        radius
      });
    } else if (lastShape.tool === 'arrow' && lastShape.points) {
      newShapes.push({
        ...lastShape,
        points: [lastShape.points[0], lastShape.points[1], point.x, point.y]
      });
    }
    
    setShapes(newShapes);
  };
  
  // Generic event handler that works for both mouse and touch events
  const handlePointerUp = () => {
    setIsDrawing(false);
    handleSaveCanvas();
  };
  
  const handleTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput({
      ...textInput,
      text: e.target.value
    });
  };
  
  const handleTextInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      finishTextInput();
    }
  };
  
  const finishTextInput = () => {
    if (textInput.text) {
      setShapes([
        ...shapes,
        {
          id: Date.now().toString(),
          tool: 'text',
          x: textInput.x,
          y: textInput.y,
          text: textInput.text,
          fill: activeColor,
          stroke: activeColor,
          strokeWidth: 1
        }
      ]);
      
      handleSaveCanvas();
    }
    
    setTextInput({
      visible: false,
      x: 0,
      y: 0,
      text: ''
    });
  };

  // Handle shape drag end
  const handleDragEnd = (e: KonvaEventObject<DragEvent>, id: string) => {
    const { x, y } = e.target.position();
    
    setShapes(
      shapes.map(shape => {
        if (shape.id === id) {
          return {
            ...shape,
            x,
            y,
            isDragging: false
          };
        }
        return shape;
      })
    );
    
    handleSaveCanvas();
  };
  
  // Handle transformer changes
  const handleTransformEnd = (id: string) => {
    const node = stageRef.current?.findOne('#' + id);
    if (!node) return;
    
    const shape = shapes.find(s => s.id === id);
    if (!shape) return;
    
    // Update shape data based on its type
    if (shape.tool === 'rectangle') {
      const updatedShape = {
        ...shape,
        x: node.x(),
        y: node.y(),
        width: node.width() * node.scaleX(),
        height: node.height() * node.scaleY()
      };
      
      setShapes(
        shapes.map(s => s.id === id ? updatedShape : s)
      );
      
      // Reset scale for next transformation
      node.scaleX(1);
      node.scaleY(1);
    } else if (shape.tool === 'circle') {
      const updatedShape = {
        ...shape,
        x: node.x(),
        y: node.y(),
        radius: shape.radius ? shape.radius * node.scaleX() : 0
      };
      
      setShapes(
        shapes.map(s => s.id === id ? updatedShape : s)
      );
      
      // Reset scale for next transformation
      node.scaleX(1);
      node.scaleY(1);
    } else if (shape.tool === 'text') {
      const updatedShape = {
        ...shape,
        x: node.x(),
        y: node.y(),
        // For text, we might want to keep the scale to adjust text size
      };
      
      setShapes(
        shapes.map(s => s.id === id ? updatedShape : s)
      );
    }
    
    handleSaveCanvas();
  };
  
  // Delete selected shape on keyboard Delete
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedShapeId) {
      setShapes(shapes.filter(shape => shape.id !== selectedShapeId));
      setSelectedShapeId(null);
      handleSaveCanvas();
    }
  };
  
  // Add keyboard event listener
  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedShapeId, shapes]);
  
  return (
    <div className="annotation-canvas space-y-2">
      <div className="toolbar flex flex-wrap items-center gap-2 p-2 bg-muted rounded-md">
        <ToggleGroup type="single" value={activeTool} onValueChange={(value) => value && handleToolChange(value as any)}>
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
        
        <div className="color-picker flex gap-1 ml-2">
          {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'].map(color => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full border ${activeColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setActiveColor(color)}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
        
        {selectedShapeId && (
          <div className="ml-auto">
            <button 
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
              onClick={() => {
                setShapes(shapes.filter(shape => shape.id !== selectedShapeId));
                setSelectedShapeId(null);
                handleSaveCanvas();
              }}
            >
              Deletar
            </button>
          </div>
        )}
      </div>
      
      <div className="canvas-container border rounded relative overflow-hidden" style={{ maxWidth: '100%' }}>
        <Stage
          ref={stageRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={canvasSize.width}
              height={canvasSize.height}
              fillPatternImage={image}
              fillPatternRepeat="no-repeat"
              fillPatternScale={{
                x: canvasSize.width / image.width,
                y: canvasSize.height / image.height
              }}
            />
            
            {shapes.map(shape => {
              if (shape.tool === 'rectangle') {
                return (
                  <Rect
                    key={shape.id}
                    id={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.fill}
                    stroke={shape.stroke}
                    strokeWidth={shape.strokeWidth}
                    draggable={activeTool === 'select'}
                    onDragEnd={(e) => handleDragEnd(e, shape.id)}
                    onTransformEnd={() => handleTransformEnd(shape.id)}
                  />
                );
              } else if (shape.tool === 'circle') {
                return (
                  <Circle
                    key={shape.id}
                    id={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    fill={shape.fill}
                    stroke={shape.stroke}
                    strokeWidth={shape.strokeWidth}
                    draggable={activeTool === 'select'}
                    onDragEnd={(e) => handleDragEnd(e, shape.id)}
                    onTransformEnd={() => handleTransformEnd(shape.id)}
                  />
                );
              } else if (shape.tool === 'draw') {
                return (
                  <Line
                    key={shape.id}
                    id={shape.id}
                    points={shape.points}
                    stroke={shape.stroke}
                    strokeWidth={shape.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    draggable={activeTool === 'select'}
                    onDragEnd={(e) => handleDragEnd(e, shape.id)}
                  />
                );
              } else if (shape.tool === 'arrow') {
                return (
                  <React.Fragment key={shape.id}>
                    <Line
                      id={shape.id}
                      points={shape.points}
                      stroke={shape.stroke}
                      strokeWidth={shape.strokeWidth}
                      draggable={activeTool === 'select'}
                      onDragEnd={(e) => handleDragEnd(e, shape.id)}
                    />
                    {shape.points && shape.points.length === 4 && (
                      <Line
                        points={[
                          shape.points[2], 
                          shape.points[3],
                          shape.points[2] - 10, 
                          shape.points[3] - 10,
                          shape.points[2], 
                          shape.points[3],
                          shape.points[2] - 10, 
                          shape.points[3] + 10,
                        ]}
                        stroke={shape.stroke}
                        strokeWidth={shape.strokeWidth}
                        draggable={false}
                      />
                    )}
                  </React.Fragment>
                );
              } else if (shape.tool === 'text') {
                return (
                  <Text
                    key={shape.id}
                    id={shape.id}
                    x={shape.x}
                    y={shape.y}
                    text={shape.text}
                    fill={shape.fill}
                    fontSize={16}
                    draggable={activeTool === 'select'}
                    onDragEnd={(e) => handleDragEnd(e, shape.id)}
                    onTransformEnd={() => handleTransformEnd(shape.id)}
                  />
                );
              }
              return null;
            })}
            
            {/* Transformer for resizing */}
            {activeTool === 'select' && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit minimum size
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
        
        {textInput.visible && (
          <div 
            className="absolute bg-white border p-1"
            style={{
              left: textInput.x,
              top: textInput.y,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <input
              type="text"
              autoFocus
              value={textInput.text}
              onChange={handleTextInput}
              onKeyDown={handleTextInputKeyDown}
              onBlur={finishTextInput}
              className="w-32 text-sm p-1"
              placeholder="Digite texto..."
            />
          </div>
        )}
      </div>
      
      {activeTool === 'select' && selectedShapeId && (
        <div className="text-xs text-muted-foreground mt-1">
          <p>Dica: Use as alças para redimensionar o elemento selecionado</p>
        </div>
      )}
    </div>
  );
});

AnnotationCanvas.displayName = 'AnnotationCanvas';
