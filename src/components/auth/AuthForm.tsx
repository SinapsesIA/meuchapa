
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Login flow
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error("Login error:", error);
          let errorMessage = "Verifique suas credenciais e tente novamente";
          
          // More user-friendly error messages
          if (error.message?.includes("Invalid login credentials")) {
            errorMessage = "Email ou senha incorretos";
          } else if (error.message?.includes("Email not confirmed")) {
            errorMessage = "Acesso liberado sem confirmação de email";
          }
          
          toast.error("Falha no login", {
            description: errorMessage
          });
          setIsLoading(false);
          return;
        }
        
        // Note: redirect is handled in the useAuth hook
      } else {
        // Signup flow
        if (!name.trim()) {
          toast.error("Nome é obrigatório");
          setIsLoading(false);
          return;
        }
        
        const { error } = await signUp(email, password, name);
        
        if (error) {
          console.error("Signup error:", error);
          let errorMessage = "Não foi possível criar sua conta";
          
          // More user-friendly error messages
          if (error.message?.includes("already registered")) {
            errorMessage = "Este email já está cadastrado. Tente fazer login.";
            setIsLogin(true);
          } else if (error.message?.includes("password")) {
            errorMessage = "A senha deve ter pelo menos 6 caracteres";
          }
          
          toast.error("Falha no cadastro", {
            description: errorMessage
          });
          setIsLoading(false);
          return;
        }
        
        // Note: redirect is handled in the useAuth hook
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(isLogin ? "Erro ao fazer login" : "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[400px] border border-gray-200 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{isLogin ? "Login" : "Criar Conta"}</CardTitle>
        <CardDescription className="text-center">
          {isLogin
            ? "Entre com seus dados para acessar o sistema"
            : "Preencha os dados para criar sua conta sem necessidade de confirmação"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                placeholder="Nome completo" 
                className="border-l-4 border-l-primary-orange"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu@email.com" 
              className="border-l-4 border-l-primary-orange"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              className="border-l-4 border-l-primary-orange"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary-orange to-orange-500 hover:from-orange-600 hover:to-orange-600" 
            disabled={isLoading}
          >
            {isLoading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-primary-orange hover:text-orange-600"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Criar uma conta" : "Já tenho uma conta"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
