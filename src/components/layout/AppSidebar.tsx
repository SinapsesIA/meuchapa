
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  Settings,
  Database,
  MessageSquare,
  Receipt,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon: Icon, label, href, active, onClick }: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:text-primary",
        active && "bg-primary/10 text-primary font-medium"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { user } = useAuth();

  // Handler to refresh the melhorias page
  const handleMelhoriasClick = () => {
    if (pathname === '/melhorias') {
      // If already on the melhorias page, refresh it
      window.location.reload();
    }
  };

  const routes = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Upload de Recibos",
      href: "/upload",
      icon: Upload,
    },
    {
      label: "Histórico de Recibos",
      href: "/receipts",
      icon: FileText,
    },
    {
      label: "Transações de Recibos",
      href: "/transactions",
      icon: Receipt,
    },
    {
      label: "Relatórios",
      href: "/reports",
      icon: BarChart3,
    },
    {
      label: "Banco de Dados",
      href: "/database",
      icon: Database,
    },
    {
      label: "Meu Chapa Responde",
      href: "/chat", 
      icon: MessageSquare,
    },
    {
      label: "Melhorias / Ajustes",
      href: "/melhorias",
      icon: ClipboardList,
      onClick: handleMelhoriasClick,
    },
    {
      label: "Configurações",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen w-64 border-r bg-white p-4 flex flex-col">
      <div className="mb-8 flex justify-center">
        <Link to="/dashboard">
          <img 
            src="/lovable-uploads/d6a24b70-a13e-4c3c-9061-f3573e61e1a9.png"
            alt="Meu Chapa Logo"
            className="h-24 w-auto"
          />
        </Link>
      </div>
      <nav className="space-y-1 flex-1">
        {routes.map((route) => (
          <SidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            active={pathname === route.href}
            onClick={route.onClick}
          />
        ))}
      </nav>
      <div className="border-t pt-4 mt-auto">
        <div className="text-sm text-gray-500">
          © {new Date().getFullYear()} Meu Chapa
        </div>
      </div>
    </div>
  );
}
