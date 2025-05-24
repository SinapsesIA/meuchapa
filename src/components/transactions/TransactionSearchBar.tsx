
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface TransactionSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function TransactionSearchBar({ searchTerm, onSearchChange }: TransactionSearchBarProps) {
  return (
    <div className="relative w-full md:w-auto">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Buscar recibos..."
        className="pl-8 w-full md:w-[300px]"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
