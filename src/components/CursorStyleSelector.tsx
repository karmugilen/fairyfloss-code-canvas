
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from 'lucide-react';

type CursorStyle = 'default' | 'dot' | 'ring' | 'glow';

interface CursorStyleSelectorProps {
  value: CursorStyle;
  onChange: (value: CursorStyle) => void;
}

const CursorStyleSelector = ({ value, onChange }: CursorStyleSelectorProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-muted/40 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-muted">
      <Settings size={18} className="text-primary" />
      <Select 
        value={value} 
        onValueChange={(val) => onChange(val as CursorStyle)}
      >
        <SelectTrigger className="w-[140px] h-8 bg-background/50 border-none text-sm">
          <SelectValue placeholder="Cursor style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          <SelectItem value="dot">Dot</SelectItem>
          <SelectItem value="ring">Ring</SelectItem>
          <SelectItem value="glow">Glow</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CursorStyleSelector;
