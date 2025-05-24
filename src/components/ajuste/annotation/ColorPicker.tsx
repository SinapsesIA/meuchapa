
import React from 'react';

interface ColorPickerProps {
  activeColor: string;
  onColorChange: (color: string) => void;
  colors?: string[];
}

export function ColorPicker({ 
  activeColor, 
  onColorChange, 
  colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'] 
}: ColorPickerProps) {
  return (
    <div className="color-picker flex gap-1 ml-2">
      {colors.map(color => (
        <button
          key={color}
          className={`w-6 h-6 rounded-full border ${activeColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
          aria-label={`Color ${color}`}
        />
      ))}
    </div>
  );
}
