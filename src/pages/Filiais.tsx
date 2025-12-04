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
  Building2,
  MapPin,
  Phone,
  User,
  MoreHorizontal,
  Pencil,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewBranchDialog } from '@/components/dashboard/NewBranchDialog';
import { exportToCSV } from '@/utils/exportUtils';
import { FilterComponent } from '@/components/dashboard/FilterComponent';

const statusConfig = {
  ativa: { label: 'Ativa', variant: 'success' as const },
  inativa: { label: 'Inativa', variant: 'destructive' as const },
};

const Filiais = () => {
  const { branches, deleteBranch } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const navigate = useNavigate();
  
  const filteredFiliais = branches.filter(filial => {
    const matchesSearch = 
      filial.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filial.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      filial.empresa.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(filial.status);

    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    exportToCSV(filteredFiliais, 'filiais');
    toast.success("Lista de filiais exportada com sucesso!");
  };

  const handleDeleteBranch = (nome: string) => {
    deleteBranch(nome);
    toast.success(`Filial ${nome} excluída com sucesso!`);
  };

  const handleEditBranch = (nome: string) => {
    toast.info(`Editando filial: ${nome}`);
  };

  const filterOptions = [
    { id: 'ativa', label: 'Ativa' },
    { id: 'inativa', label: 'Inativa' },
  ];

  return (
    <MainLayout 
      title="Empresas" 
      subtitle="Gerencie as empresas e filiais"
    >
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, cidade ou empresa..."
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
          <NewBranchDialog />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{filteredFiliais.length}</span> empresas
        </p>
      </div>

      {/* Filiais Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredFiliais.map((filial, index) => (
          <div 
            key={filial.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-md animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => handleEditBranch(filial.nome)}
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteBranch(filial.nome)}
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
                    <DropdownMenuItem onClick={() => toast.info(`Visualizando detalhes da filial: ${filial.nome}`)}>
                      Ver detalhes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-foreground">
                  {filial.nome}
                </h3>
                <Badge variant={statusConfig[filial.status].variant}>
                  {statusConfig[filial.status].label}
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {filial.empresa}
              </p>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-foreground/80">{filial.endereco} - {filial.cidade}/{filial.estado}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground/80">{filial.telefone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-foreground/80">{filial.gestor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFiliais.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhuma filial encontrada</h3>
          <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </MainLayout>
  );
};

export default Filiais;
