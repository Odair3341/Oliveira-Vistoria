import { useData } from '@/contexts/DataContext';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
  concluida: { label: 'Concluída', variant: 'success' as const },
  pendente: { label: 'Pendente', variant: 'warning' as const },
  em_analise: { label: 'Em Análise', variant: 'secondary' as const },
};

export function RecentInspections() {
  const { inspections } = useData();
  const recentInspections = inspections.slice(0, 5);

  return (
    <div className="rounded-xl bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Vistorias Recentes</h3>
          <p className="text-sm text-muted-foreground">Últimas 5 vistorias</p>
        </div>
        <button className="text-sm font-medium text-primary hover:underline">
          Ver todas
        </button>
      </div>
      
      <div className="space-y-3">
        {recentInspections.map((inspection, index) => (
          <div 
            key={inspection.id}
            className={cn(
              "flex items-center gap-4 rounded-lg border border-border bg-background p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-sm animate-fade-in",
              `stagger-${index + 1}`
            )}
            style={{ animationFillMode: 'both' }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
              <Car className="h-5 w-5 text-secondary-foreground" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {inspection.placa}
                </span>
                <Badge variant={statusConfig[inspection.status as keyof typeof statusConfig]?.variant || 'default'}>
                  {statusConfig[inspection.status as keyof typeof statusConfig]?.label || inspection.status}
                </Badge>
              </div>
              <p className="truncate text-sm text-muted-foreground">
                {inspection.marca} {inspection.modelo}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 truncate max-w-[120px]">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  {inspection.filial}/{inspection.estado}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(inspection.dataVistoria).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-foreground">
                {inspection.total > 0 ? `R$ ${inspection.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}
              </p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
