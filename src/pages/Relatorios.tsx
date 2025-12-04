import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar as CalendarIcon, FileText, Filter } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { FilterComponent } from '@/components/dashboard/FilterComponent';
import { useData } from '@/contexts/DataContext';
import { exportToPDF } from '@/utils/exportUtils';

const mockData = {
  mensal: {
    vistorias: [
      { name: 'Sem 1', total: 12 },
      { name: 'Sem 2', total: 15 },
      { name: 'Sem 3', total: 10 },
      { name: 'Sem 4', total: 18 },
    ],
    status: [
      { name: 'Concluídas', value: 35, color: '#22c55e' },
      { name: 'Pendentes', value: 12, color: '#eab308' },
      { name: 'Em Análise', value: 8, color: '#3b82f6' },
    ]
  },
  semestral: {
    vistorias: [
      { name: 'Jan', total: 45 },
      { name: 'Fev', total: 52 },
      { name: 'Mar', total: 38 },
      { name: 'Abr', total: 65 },
      { name: 'Mai', total: 48 },
      { name: 'Jun', total: 60 },
    ],
    status: [
      { name: 'Concluídas', value: 150, color: '#22c55e' },
      { name: 'Pendentes', value: 45, color: '#eab308' },
      { name: 'Em Análise', value: 25, color: '#3b82f6' },
    ]
  },
  anual: {
    vistorias: [
      { name: 'Jan', total: 45 },
      { name: 'Fev', total: 52 },
      { name: 'Mar', total: 38 },
      { name: 'Abr', total: 65 },
      { name: 'Mai', total: 48 },
      { name: 'Jun', total: 60 },
      { name: 'Jul', total: 55 },
      { name: 'Ago', total: 58 },
      { name: 'Set', total: 42 },
      { name: 'Out', total: 63 },
      { name: 'Nov', total: 50 },
      { name: 'Dez', total: 45 },
    ],
    status: [
      { name: 'Concluídas', value: 450, color: '#22c55e' },
      { name: 'Pendentes', value: 85, color: '#eab308' },
      { name: 'Em Análise', value: 45, color: '#3b82f6' },
    ]
  }
};

const Relatorios = () => {
  const { inspections, branches, vehicles } = useData();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeFilters, setActiveFilters] = useState<string[]>(['mensal']);

  // Calculate chart data dynamically from inspections
  const calculateChartData = () => {
    // Status Distribution
    const statusCount = {
      concluida: 0,
      pendente: 0,
      em_analise: 0
    };

    inspections.forEach(i => {
      if (statusCount[i.status] !== undefined) {
        statusCount[i.status]++;
      }
    });

    const statusData = [
      { name: 'Concluídas', value: statusCount.concluida, color: '#22c55e' },
      { name: 'Pendentes', value: statusCount.pendente, color: '#eab308' },
      { name: 'Em Análise', value: statusCount.em_analise, color: '#3b82f6' },
    ];

    // Monthly Inspections (Last 6 months)
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const today = new Date();
    const vistoriasData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthIdx = d.getMonth();
      const year = d.getFullYear();
      
      const count = inspections.filter(inspection => {
        const inspectionDate = new Date(inspection.dataVistoria);
        return inspectionDate.getMonth() === monthIdx && inspectionDate.getFullYear() === year;
      }).length;

      vistoriasData.push({
        name: monthNames[monthIdx],
        total: count
      });
    }

    return {
      vistorias: vistoriasData,
      status: statusData
    };
  };

  const currentData = calculateChartData();


  const handleDownloadReport = (reportName: string) => {
    toast.info(`Gerando ${reportName}...`);

    try {
      let data: any[] = [];
      let columns: string[] = [];
      let title = reportName;

      switch (reportName) {
        case "Relatório Geral de Vistorias":
        case "Relatório Completo (PDF)":
          columns = ['Placa', 'Modelo', 'Filial', 'Data', 'Hodômetro', 'KM Desloc.', 'Valor KM', 'Pedagio', 'Taxa', 'Total'];
          data = inspections.map(i => ({
            'Placa': i.placa,
            'Modelo': i.modelo,
            'Filial': i.filial,
            'Data': new Date(i.dataVistoria).toLocaleDateString('pt-BR'),
            'Hodômetro': `${i.kmRodado} km`,
            'KM Desloc.': `${i.kmDeslocamento || 0} km`,
            'Valor KM': i.valorKm || 0,
            'Pedagio': i.pedagio || 0,
            'Taxa': (i.autoAvaliar || 0) + (i.caltelar || 0),
            'Status': i.status.toUpperCase(),
            'Total': i.total
          }));
          break;

        case "Relatório de Frota (Veículos)":
          columns = ['placa', 'marca', 'modelo', 'ano', 'filial', 'status'];
          title = "Relatório de Frota";
          data = vehicles.map(v => ({
            placa: v.placa,
            marca: v.marca,
            modelo: v.modelo,
            ano: v.ano,
            filial: v.filial,
            status: v.status.toUpperCase()
          }));
          break;

        case "Relatório de Custos por Filial":
          columns = ['filial', 'qtd_vistorias', 'total_custo'];
          const costsByBranch = branches.map(branch => {
            const branchInspections = inspections.filter(i => i.filial === branch.nome);
            const totalCost = branchInspections.reduce((acc, curr) => acc + curr.total, 0);
            return {
              filial: branch.nome,
              qtd_vistorias: branchInspections.length,
              total_custo: totalCost
            };
          });
          data = costsByBranch.filter(i => i.qtd_vistorias > 0);
          break;

        case "Relatório Mensal Consolidado":
          columns = ['mes', 'qtd_vistorias', 'total_custo'];
          // Agrupar por mês (simplificado para o exemplo)
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const monthlyInspections = inspections.filter(i => {
            const d = new Date(i.dataVistoria);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          });
          
          data = [{
            mes: `${currentMonth + 1}/${currentYear}`,
            qtd_vistorias: monthlyInspections.length,
            total_custo: monthlyInspections.reduce((acc, curr) => acc + curr.total, 0)
          }];
          break;

        default:
          // Fallback genérico
          columns = ['placa', 'modelo', 'filial', 'status'];
          data = inspections.map(i => ({
            placa: i.placa,
            modelo: i.modelo,
            filial: i.filial,
            status: i.status
          }));
      }

      exportToPDF(data, title, columns);
      toast.success("Download concluído com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao gerar relatório.");
    }
  };

  const filterOptions = [
    { id: 'mensal', label: 'Relatório Mensal' },
    { id: 'semestral', label: 'Relatório Semestral' },
    { id: 'anual', label: 'Relatório Anual' },
  ];

  return (
    <MainLayout 
      title="Relatórios" 
      subtitle="Visualize e exporte relatórios detalhados"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FilterComponent 
            title="Período"
            options={filterOptions}
            onApplyFilters={setActiveFilters}
          />
        </div>
        <Button onClick={() => handleDownloadReport("Relatório Completo (PDF)")}>
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vistorias por Mês</CardTitle>
            <CardDescription>Volume de vistorias realizadas no último semestre</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData.vistorias}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status das Vistorias</CardTitle>
            <CardDescription>Distribuição atual dos status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentData.status}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {currentData.status.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {currentData.status.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
            <CardDescription>Selecione um modelo para gerar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Relatório Geral de Vistorias",
                "Relatório de Frota (Veículos)",
                "Relatório de Custos por Filial",
                "Relatório de Desempenho da Equipe",
                "Relatório de Manutenção de Veículos",
                "Relatório de Auditoria",
                "Relatório Mensal Consolidado"
              ].map((report, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => handleDownloadReport(report)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium text-sm">{report}</span>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Relatorios;
