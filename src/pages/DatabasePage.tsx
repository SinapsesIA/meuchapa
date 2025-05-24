
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Database, Download, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SupplierTab } from "@/components/database/SupplierTab";
import { VehicleTab } from "@/components/database/VehicleTab";
import { LocationTab } from "@/components/database/LocationTab";
import { ServiceTab } from "@/components/database/ServiceTab";
import { FormData, EditDialog } from "@/components/database/EditDialog";

export default function DatabasePage() {
  const [activeTab, setActiveTab] = useState<"suppliers" | "vehicles" | "locations" | "services">("suppliers");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to synchronize local data with Supabase
  const handleSync = () => {
    queryClient.invalidateQueries();
    toast({
      title: "Dados sincronizados",
      description: "Os dados foram sincronizados com o banco de dados.",
    });
  };

  // Function to handle export
  const handleExport = () => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados de ${
        activeTab === "suppliers" ? "transportadoras" : 
        activeTab === "vehicles" ? "veículos" : 
        activeTab === "locations" ? "estabelecimentos" : "serviços"
      } estão sendo exportados.`,
    });
  };

  // Function to get empty item based on active tab
  const getEmptyItem = (): FormData => {
    switch (activeTab) {
      case 'suppliers':
        return { name: '', document: '', city: '', contact: '' };
      case 'vehicles':
        return { plate: '', type: '', capacity: '', supplier: '' };
      case 'locations':
        return { name: '', address: '', city: '', state: '' };
      case 'services':
        return { name: '', description: '', price: 0 };
      default:
        return { name: '', document: '', city: '', contact: '' };
    }
  };

  // Function to handle add button click
  const handleAddClick = () => {
    setIsDialogOpen(true);
  };

  // Function to handle save in dialog
  const handleSave = (data: FormData) => {
    // This is handled by individual tab components
    setIsDialogOpen(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Banco de Dados</h1>
          <Button variant="outline" onClick={handleSync}>
            <Database className="mr-2 h-4 w-4" />
            Sincronizar
          </Button>
        </div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Buscar..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="suppliers">Transportadoras</TabsTrigger>
            <TabsTrigger value="vehicles">Veículos</TabsTrigger>
            <TabsTrigger value="locations">Estabelecimentos</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
          </TabsList>
          
          <TabsContent value="suppliers" className="space-y-6">
            <SupplierTab searchTerm={searchTerm} onExport={handleExport} />
          </TabsContent>
          
          <TabsContent value="vehicles" className="space-y-6">
            <VehicleTab searchTerm={searchTerm} onExport={handleExport} />
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <LocationTab searchTerm={searchTerm} onExport={handleExport} />
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServiceTab searchTerm={searchTerm} onExport={handleExport} />
          </TabsContent>
        </Tabs>

        {/* Central dialog for adding new items */}
        <EditDialog 
          type={activeTab}
          item={getEmptyItem()}
          onSave={handleSave}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </Layout>
  );
}
