import { useState } from 'react';
import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Car, 
  Building2, 
  Users, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ClipboardList, label: 'Vistorias', path: '/vistorias' },
  { icon: Car, label: 'Veículos', path: '/veiculos' },
  { icon: Building2, label: 'Empresas', path: '/filiais' },
  { icon: Users, label: 'Usuários', path: '/usuarios' },
  { icon: FileText, label: 'Relatórios', path: '/relatorios' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
              <Car className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-sidebar-foreground">Vistoria</h1>
              <p className="text-xs text-sidebar-foreground/60">Oliveira</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Car className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4">
          <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2">
            <Search className="h-4 w-4 text-sidebar-foreground/50" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-transparent text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/50 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-2"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Button */}
      <div className="border-t border-sidebar-border p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
