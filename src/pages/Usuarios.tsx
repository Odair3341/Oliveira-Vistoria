import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Search, 
  Download,
  Users,
  Mail,
  Building,
  Briefcase,
  MoreHorizontal,
  Trash2,
  Pencil
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewUserDialog } from '@/components/dashboard/NewUserDialog';
import { exportToCSV } from '@/utils/exportUtils';
import { FilterComponent } from '@/components/dashboard/FilterComponent';

const statusConfig = {
  ativo: { label: 'Ativo', variant: 'success' as const },
  inativo: { label: 'Inativo', variant: 'destructive' as const },
};

const Usuarios = () => {
  const { users, deleteUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.filial.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(user.status);

    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    exportToCSV(filteredUsers, 'usuarios');
    toast.success("Lista de usuários exportada com sucesso!");
  };

  const handleDeleteUser = (userName: string) => {
    deleteUser(userName);
    toast.success(`Usuário ${userName} excluído com sucesso!`);
  };

  const filterOptions = [
    { id: 'ativo', label: 'Ativo' },
    { id: 'inativa', label: 'Inativo' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <MainLayout 
      title="Usuários" 
      subtitle="Gerencie os usuários do sistema"
    >
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, email ou filial..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <FilterComponent 
            options={filterOptions}
            onApplyFilters={setActiveFilters}
          />
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <NewUserDialog />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{filteredUsers.length}</span> usuários
        </p>
      </div>

      {/* Users Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredUsers.map((user, index) => (
          <div 
            key={user.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-md animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  {/* <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nome}`} /> */}
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {getInitials(user.nome)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-foreground">{user.nome}</h3>
                  <p className="text-xs text-muted-foreground">{user.cargo}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => toast.info(`Editando usuário: ${user.nome}`)}
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteUser(user.nome)}
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => toast.info(`Visualizando perfil de: ${user.nome}`)}>
                      Ver perfil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={statusConfig[user.status as keyof typeof statusConfig]?.variant || 'default'}>
                  {statusConfig[user.status as keyof typeof statusConfig]?.label || user.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Último acesso: {user.ultimoAcesso.split(' ')[0]}
                </span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-center gap-2 text-sm overflow-hidden">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground/80 truncate" title={user.email}>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground/80">{user.filial}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground/80">{user.departamento}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum usuário encontrado</h3>
          <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Usuarios;
