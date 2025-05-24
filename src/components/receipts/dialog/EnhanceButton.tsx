
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface EnhanceButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  isEnhanced: boolean;
}

export function EnhanceButton({ onClick, isProcessing, isEnhanced }: EnhanceButtonProps) {
  return (
    <Button 
      onClick={onClick} 
      disabled={isProcessing || isEnhanced} 
      className="flex items-center gap-2"
    >
      <Sparkles className="h-4 w-4" />
      {isProcessing ? "Processando..." : isEnhanced ? "Dados aprimorados" : "Aprimorar com IA Avançada"}
    </Button>
  );
}
