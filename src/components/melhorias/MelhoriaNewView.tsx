
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MelhoriaForm } from "./MelhoriaForm";
import { toast } from "sonner";

interface MelhoriaNewViewProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function MelhoriaNewView({ onSubmit, onCancel }: MelhoriaNewViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error("Erro ao criar solicitação:", error);
      toast.error("Erro ao criar solicitação");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <MelhoriaForm
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </CardContent>
    </Card>
  );
}
