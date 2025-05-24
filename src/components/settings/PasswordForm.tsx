
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type PasswordFormProps = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
};

export function PasswordForm({
  currentPassword,
  newPassword,
  confirmPassword,
  isLoading,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: PasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-password">Senha Atual</Label>
        <Input 
          id="current-password" 
          type="password" 
          value={currentPassword}
          onChange={(e) => onCurrentPasswordChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">Nova Senha</Label>
        <Input 
          id="new-password" 
          type="password" 
          value={newPassword}
          onChange={(e) => onNewPasswordChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
        <Input 
          id="confirm-password" 
          type="password" 
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          required
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
            Alterando...
          </>
        ) : (
          "Alterar Senha"
        )}
      </Button>
    </form>
  );
}
