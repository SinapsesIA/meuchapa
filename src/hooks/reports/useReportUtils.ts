
import { useNavigate } from "react-router-dom";

export function useReportUtils() {
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleViewReceipt = (id: string) => {
    navigate(`/receipts/${id}`);
  };

  return { formatCurrency, handleViewReceipt };
}
