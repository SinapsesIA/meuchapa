
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { DeleteConfirmDialog } from "@/components/transactions/DeleteConfirmDialog";
import { useTransactions } from "@/hooks/useTransactions";

export default function TransactionsPage() {
  const {
    filteredReceipts,
    isLoading,
    searchTerm,
    setSearchTerm,
    deleteConfirmId,
    setDeleteConfirmId,
    isDeleting,
    handleViewReceipt,
    handleDeleteConfirm,
    formatDate,
    formatCurrency
  } = useTransactions();

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4 space-y-6">
        <TransactionHeader 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle>Recibos do Banco de Dados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TransactionTable
              receipts={filteredReceipts}
              isLoading={isLoading || isDeleting}
              searchTerm={searchTerm}
              onViewReceipt={handleViewReceipt}
              onDeleteReceipt={setDeleteConfirmId}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
            />
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Layout>
  );
}
