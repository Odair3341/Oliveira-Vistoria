import { useData } from '@/contexts/DataContext';

export function TopModelsChart() {
  const { inspections } = useData();
  
  // Calculate top models dynamically
  const modelCounts = inspections.reduce((acc, curr) => {
    acc[curr.modelo] = (acc[curr.modelo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(modelCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([modelo, quantidade]) => ({
      modelo,
      quantidade,
      percentual: inspections.length > 0 ? (quantidade / inspections.length) * 100 : 0
    }));

  return (
    <div className="rounded-xl bg-card p-5 shadow-card">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Top Modelos</h3>
        <p className="text-sm text-muted-foreground">Mais vistoriados</p>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.modelo} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="font-medium text-foreground">{item.modelo}</span>
              </div>
              <span className="text-muted-foreground">{item.quantidade} un.</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${item.percentual}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
