import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Vehicle } from '@/data/mockVehicles';
import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Search, 
  Download,
  Car,
  MapPin,
  Calendar,
  Gauge,
  MoreHorizontal,
  Pencil,
  Trash2,
  Building2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { NewVehicleDialog } from '@/components/dashboard/NewVehicleDialog';
import { EditVehicleDialog } from '@/components/dashboard/EditVehicleDialog';
import { VehicleDetailsDialog } from '@/components/dashboard/VehicleDetailsDialog';
import { exportToCSV } from '@/utils/exportUtils';
import { FilterComponent } from '@/components/dashboard/FilterComponent';

const statusConfig = {
  ativo: { label: 'Ativo', variant: 'success' as const },
  manutencao: { label: 'Manutenção', variant: 'warning' as const },
  inativo: { label: 'Inativo', variant: 'destructive' as const },
};

const Veiculos = () => {
  const { vehicles, updateVehicle, deleteVehicle } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const navigate = useNavigate();
  
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.filial.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(vehicle.status);

    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    exportToCSV(filteredVehicles, 'veiculos');
    toast.success("Lista de veículos exportada com sucesso!");
  };

  const handleDeleteVehicle = (placa: string) => {
    deleteVehicle(placa);
    toast.success(`Veículo ${placa} excluído com sucesso!`);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setEditDialogOpen(true);
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setDetailsDialogOpen(true);
  };

  const handleSaveEdit = (updatedVehicle: Vehicle) => {
    updateVehicle(updatedVehicle);
  };

  const filterOptions = [
    { id: 'ativo', label: 'Ativo' },
    { id: 'manutencao', label: 'Manutenção' },
    { id: 'inativo', label: 'Inativo' },
  ];

  return (
    <MainLayout 
      title="Veículos" 
      subtitle="Gerencie a frota de veículos"
    >
      {/* Actions Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Buscar por placa, modelo ou filial..."
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
          <NewVehicleDialog />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{filteredVehicles.length}</span> veículos
        </p>
      </div>

      {/* Vehicles Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredVehicles.map((vehicle, index) => (
          <div 
            key={vehicle.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-md animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Car className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => handleEditVehicle(vehicle)}
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteVehicle(vehicle.placa)}
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
                    <DropdownMenuItem onClick={() => handleViewDetails(vehicle)}>
                      Ver detalhes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-mono text-lg font-bold text-foreground">
                  {vehicle.placa}
                </h3>
                <Badge variant={statusConfig[vehicle.status].variant}>
                  {statusConfig[vehicle.status].label}
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {vehicle.marca} {vehicle.modelo}
              </p>
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Empresa
                </span>
                <span className="font-medium">{vehicle.empresa || '-'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  Filial
                </span>
                <span className="font-medium">{vehicle.filial}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Ano
                </span>
                <span className="font-medium">{vehicle.ano}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  Km Atual
                </span>
                <span className="font-medium">{vehicle.kmAtual.toLocaleString('pt-BR')} km</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Car className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhum veículo encontrado</h3>
          <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
        </div>
      )}

      <EditVehicleDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        vehicle={selectedVehicle} 
        onSave={handleSaveEdit} 
      />

      <VehicleDetailsDialog 
        open={detailsDialogOpen} 
        onOpenChange={setDetailsDialogOpen} 
        vehicle={selectedVehicle} 
      />
    </MainLayout>
  );
};

export default Veiculos;
