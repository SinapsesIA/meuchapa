
import { TransactionSearchBar } from "./TransactionSearchBar";

interface TransactionHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function TransactionHeader({ searchTerm, onSearchChange }: TransactionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Transações de Recibos</h1>
        <p className="text-muted-foreground">
          Visualize todos os recibos armazenados no banco de dados
        </p>
      </div>
      <TransactionSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange} 
      />
    </div>
  );
}
