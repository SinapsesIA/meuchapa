
import { FileUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "@/types";

interface ProcessedReceiptsProps {
  receipts: Receipt[];
  onViewReceipt: (receipt: Receipt) => void;
}

export function ProcessedReceipts({ receipts, onViewReceipt }: ProcessedReceiptsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recibos Processados</h3>
      <div className="grid gap-2">
        {receipts.map((receipt) => (
          <Card key={receipt.id}>
            <CardContent className="p-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FileUp className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium">{receipt.receiptNumber}</p>
                  <p className="text-xs text-gray-500">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(receipt.totalAmount || 0)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewReceipt(receipt)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
