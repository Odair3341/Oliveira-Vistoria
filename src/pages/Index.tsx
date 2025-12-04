import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { InspectionChart } from '@/components/dashboard/InspectionChart';
import { TopModelsChart } from '@/components/dashboard/TopModelsChart';
import { RecentInspections } from '@/components/dashboard/RecentInspections';
import { FilialStats } from '@/components/dashboard/FilialStats';
import { useData } from '@/contexts/DataContext';
import { ClipboardList, DollarSign, CheckCircle2, Clock } from 'lucide-react';

const Index = () => {
  const { inspections } = useData();
  
  // Calculate stats dynamically based on current context data
  const total = inspections.length;
  const valorTotal = inspections.reduce((acc, curr) => acc + (curr.total || 0), 0);
  const concluidas = inspections.filter(i => i.status === 'concluida').length;
  const pendentes = inspections.filter(i => i.status === 'pendente').length;
  const emAnalise = inspections.filter(i => i.status === 'em_analise').length;

  const stats = {
    total,
    valorTotal,
    concluidas,
    pendentes,
    emAnalise
  };

  return (
    <MainLayout 
      title="Dashboard" 
      subtitle="Bem-vindo ao Sistema de Gestão de Vistorias"
    >
      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Vistorias"
          value={stats.total}
          subtitle="No período atual"
          icon={ClipboardList}
          trend={{ value: 12, positive: true }}
          variant="primary"
          className="animate-slide-up stagger-1"
        />
        <StatCard
          title="Valor Total"
          value={`R$ ${stats.valorTotal.toLocaleString('pt-BR')}`}
          subtitle="Avaliações acumuladas"
          icon={DollarSign}
          trend={{ value: 8, positive: true }}
          className="animate-slide-up stagger-2"
        />
        <StatCard
          title="Concluídas"
          value={stats.concluidas}
          subtitle={stats.total > 0 ? `${Math.round((stats.concluidas / stats.total) * 100)}% do total` : "0% do total"}
          icon={CheckCircle2}
          variant="success"
          className="animate-slide-up stagger-3"
        />
        <StatCard
          title="Pendentes"
          value={stats.pendentes + stats.emAnalise}
          subtitle="Aguardando análise"
          icon={Clock}
          variant="warning"
          className="animate-slide-up stagger-4"
        />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InspectionChart />
        </div>
        <div>
          <TopModelsChart />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentInspections />
        </div>
        <div>
          <FilialStats />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
