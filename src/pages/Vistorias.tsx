import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Inspection } from '@/data/mockInspections';
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
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewInspectionDialog } from '@/components/dashboard/NewInspectionDialog';
import { InspectionDetailsDialog } from '@/components/dashboard/InspectionDetailsDialog';
import { EditInspectionDialog } from '@/components/dashboard/EditInspectionDialog';
import { exportToCSV } from '@/utils/exportUtils';
import { FilterComponent } from '@/components/dashboard/FilterComponent';

const statusConfig = {
  concluida: { label: 'Concluída', variant: 'success' as const },
  pendente: { label: 'Pendente', variant: 'warning' as const },
  em_analise: { label: 'Em Análise', variant: 'secondary' as const },
};

function InspectionCard({ 
  inspection, 
  index, 
  onViewDetails,
  onEdit,
  onDelete
}: { 
  inspection: Inspection; 
  index: number; 
  onViewDetails: (inspection: Inspection) => void;
  onEdit: (inspection: Inspection) => void;
  onDelete: (inspection: Inspection) => void;
}) {
  const hasValue = inspection.total > 0;
  
  return (
    <div 
      className={cn(
        "group rounded-xl border border-border bg-card p-4 shadow-card transition-all duration-300 card-hover animate-slide-up",
      )}
      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'both' }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
          <Car className="h-7 w-7 text-secondary-foreground" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-lg font-bold text-foreground">
              {inspection.placa}
            </span>
            <Badge variant={statusConfig[inspection.status].variant}>
              {statusConfig[inspection.status].label}
            </Badge>
          </div>
          
          <p className="text-sm font-medium text-foreground mb-2">
            {inspection.marca} {inspection.modelo}
          </p>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {inspection.empresa} - {inspection.filial}/{inspection.estado}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(inspection.dataVistoria).toLocaleDateString('pt-BR')}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" />
              {inspection.kmRodado.toLocaleString('pt-BR')} km
            </span>
            <span className="text-muted-foreground/70">
              Ano: {inspection.ano}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="text-right">
            {hasValue ? (
              <>
                <p className="text-lg font-bold text-foreground">
                  R$ {inspection.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mb-2">Valor total</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-muted-foreground">-</p>
                <p className="text-xs text-warning mb-2">Sem avaliação</p>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(inspection);
              }}
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(inspection);
              }}
              title="Excluir"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewDetails(inspection)}
            >
              Detalhes
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Vistorias = () => {
  const { inspections, deleteInspection, vehicles, addInspection } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const navigate = useNavigate();
  
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = 
      inspection.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.filial.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = activeFilters.length === 0 || activeFilters.includes(inspection.status);
    
    return matchesSearch && matchesFilter;
  });

  const handleGeneratePendingInspections = () => {
    let createdCount = 0;
    vehicles.forEach(vehicle => {
      // Check if there is ANY inspection for this vehicle (pending, concluded, etc.)
      // This prevents generating duplicates if the vehicle already has history
      const hasAnyInspection = inspections.some(i => i.placa === vehicle.placa);
      
      if (!hasAnyInspection) {
        const newInspection: Inspection = {
          id: Date.now().toString() + Math.random().toString().slice(2, 8),
          qtd: 1,
          placa: vehicle.placa,
          kmRodado: vehicle.kmAtual,
          kmDeslocamento: 0,
          valorKm: 0,
          ano: vehicle.ano,
          modelo: vehicle.modelo,
          marca: vehicle.marca,
          filial: vehicle.filial,
          empresa: vehicle.empresa || 'Não informada',
          estado: 'MS', // Default state
          autoAvaliar: 0,
          caltelar: 0,
          pedagio: 0,
          total: 0,
          dataVistoria: new Date().toISOString().split('T')[0],
          status: 'pendente'
        };
        addInspection(newInspection);
        createdCount++;
      }
    });

    if (createdCount > 0) {
      toast.success(`${createdCount} vistoria(s) pendente(s) gerada(s) com sucesso!`);
    } else {
      toast.info("Todos os veículos já possuem vistorias cadastradas.");
    }
  };

  const handleExport = () => {
    exportToCSV(filteredInspections, 'vistorias');
    toast.success("Relatório de vistorias exportado com sucesso!");
  };

  const handleViewDetails = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setDetailsDialogOpen(true);
  };

  const handleEdit = (inspection: Inspection) => {
    setSelectedInspection(inspection);
    setEditDialogOpen(true);
  };

  const handleDelete = (inspection: Inspection) => {
    if (confirm(`Tem certeza que deseja excluir a vistoria da placa ${inspection.placa}?`)) {
      deleteInspection(inspection.id);
      toast.success("Vistoria excluída com sucesso!");
    }
  };

  const filterOptions = [
    { id: 'concluida', label: 'Concluída' },
    { id: 'pendente', label: 'Pendente' },
    { id: 'em_analise', label: 'Em Análise' },
  ];

  return (
    <MainLayout 
      title="Vistorias" 
      subtitle="Gerencie todas as vistorias realizadas"
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
          <Button variant="outline" size="sm" onClick={handleGeneratePendingInspections} title="Gerar vistorias pendentes para veículos sem vistoria">
            Gerar Pendentes
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <NewInspectionDialog />
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{filteredInspections.length}</span> vistorias
        </p>
      </div>

      {/* Inspections Grid */}
      <div className="space-y-3">
        {filteredInspections.map((inspection, index) => (
          <InspectionCard 
            key={inspection.id} 
            inspection={inspection} 
            index={index} 
            onViewDetails={handleViewDetails} 
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredInspections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Car className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Nenhuma vistoria encontrada</h3>
          <p className="text-sm text-muted-foreground mb-6">Tente ajustar os filtros de busca ou gere vistorias para veículos existentes.</p>
          
          <Button onClick={handleGeneratePendingInspections} variant="outline">
             Gerar Vistorias para Veículos Existentes
          </Button>
        </div>
      )}

      <InspectionDetailsDialog 
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        inspection={selectedInspection}
      />

      <EditInspectionDialog 
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        inspection={selectedInspection}
      />
    </MainLayout>
  );
};

export default Vistorias;
