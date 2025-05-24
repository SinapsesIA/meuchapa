
import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { OCRSettings } from "@/components/settings/OCRSettings";
import { BackupSettings } from "@/components/settings/BackupSettings";

export default function SettingsPage() {
  return (
    <Layout>
      <main className="container mx-auto py-6 px-4 space-y-8">
        <h1 className="text-3xl font-bold">Configurações</h1>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="account">Conta</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="ocr">OCR e Processamento</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="ocr">
            <OCRSettings />
          </TabsContent>
          
          <TabsContent value="backups">
            <BackupSettings />
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
}
