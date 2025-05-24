
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccountSettings } from "@/hooks/use-account-settings";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";

export function AccountSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { 
    isLoading: isActionLoading, 
    updateProfile, 
    updatePassword, 
    getUserProfile 
  } = useAccountSettings();

  useEffect(() => {
    let isMounted = true;
    
    const loadUserProfile = async () => {
      try {
        if (isMounted) setIsLoading(true);
        const profile = await getUserProfile();
        
        if (profile && isMounted) {
          console.log("Loaded profile data:", profile);
          setName(profile.name || "");
          setEmail(profile.email || "");
          setCompany(profile.company || "");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        if (isMounted) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível carregar os dados do perfil."
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    loadUserProfile();
    
    return () => {
      isMounted = false;
    };
  }, [getUserProfile]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Add debug logging
      console.log("Saving profile with values:", { name, email, company });
      
      const result = await updateProfile({ 
        name, 
        email, 
        company 
      });
      
      console.log("Profile update result:", result);
      
      if (result) {
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso!"
        });
      }
    } catch (error) {
      console.error("Error in handleSaveChanges:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "As senhas não coincidem."
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres."
      });
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      await updatePassword({
        currentPassword,
        newPassword
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileForm
            name={name}
            email={email}
            company={company}
            isLoading={isSaving || isActionLoading}
            onNameChange={setName}
            onEmailChange={setEmail}
            onCompanyChange={setCompany}
            onSubmit={handleSaveChanges}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <PasswordForm
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            isLoading={isChangingPassword || isActionLoading}
            onCurrentPasswordChange={setCurrentPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleChangePassword}
          />
        </CardContent>
      </Card>
    </div>
  );
}
