
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type ProfileFormProps = {
  name: string;
  email: string;
  company: string;
  isLoading: boolean;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

export function ProfileForm({
  name,
  email,
  company,
  isLoading,
  onNameChange,
  onEmailChange,
  onCompanyChange,
  onSubmit,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input 
          id="name" 
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Empresa</Label>
        <Input 
          id="company" 
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          placeholder="Nome da empresa (opcional)"
        />
      </div>
      <Button 
        type="submit" 
        className="mt-2" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : (
          "Salvar Alterações"
        )}
      </Button>
    </form>
  );
}
