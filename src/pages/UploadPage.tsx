
import { Layout } from "@/components/layout/Layout";
import { ReceiptUploader } from "@/components/receipts/ReceiptUploader";

export default function UploadPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Upload de Recibos</h1>
        <p className="text-muted-foreground">
          Faça upload de recibos em formato de imagem (JPEG, PNG) ou PDF para processamento com OCR e análise com IA.
          Arquivos já processados anteriormente serão identificados para evitar duplicações.
        </p>
        <ReceiptUploader />
      </div>
    </Layout>
  );
}
