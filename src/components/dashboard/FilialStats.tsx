import { useData } from '@/contexts/DataContext';
import { Building2 } from 'lucide-react';

export function FilialStats() {
  const { inspections } = useData();
  
  // Calculate filial stats dynamically
  const filialCounts = inspections.reduce((acc, curr) => {
    const key = curr.filial;
    if (!acc[key]) {
      acc[key] = {
        filial: key,
        estado: curr.estado,
        vistorias: 0
      };
    }
    acc[key].vistorias++;
    return acc;
  }, {} as Record<string, { filial: string; estado: string; vistorias: number }>);

  const data = Object.values(filialCounts)
    .sort((a, b) => b.vistorias - a.vistorias)
    .slice(0, 5);

  return (
    <div className="rounded-xl bg-card p-5 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Vistorias por Filial</h3>
        <p className="text-sm text-muted-foreground">Distribuição regional</p>
      </div>
      
      <div className="space-y-3">
        {data.map((filial) => (
          <div 
            key={filial.filial}
            className="flex items-center gap-3 rounded-lg bg-background p-3 transition-colors hover:bg-secondary/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {filial.filial}
              </p>
              <p className="text-xs text-muted-foreground">{filial.estado}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {filial.vistorias}
              </p>
              <p className="text-xs text-muted-foreground">vistorias</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
