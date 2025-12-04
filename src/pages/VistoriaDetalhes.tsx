import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockInspections } from '@/data/mockInspections';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const VistoriaDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const inspection = mockInspections.find(insp => insp.id === id);

  if (!inspection) {
    return (
      <MainLayout title="Erro" subtitle="Vistoria não encontrada">
        <div className="text-center">
          <p>A vistoria que você está procurando não foi encontrada.</p>
          <Button onClick={() => navigate('/vistorias')} className="mt-4">
            Voltar para Vistorias
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={`Detalhes da Vistoria #${inspection.id.slice(0, 8)}`}
      subtitle={`Placa: ${inspection.placa}`}
    >
      <div className="max-w-5xl mx-auto">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Placa:</strong> {inspection.placa}</p>
                <p><strong>Modelo:</strong> {inspection.marca} {inspection.modelo}</p>
                <p><strong>Ano:</strong> {inspection.ano}</p>
                <p><strong>KM Rodado:</strong> {inspection.kmRodado.toLocaleString('pt-BR')} km</p>
                <p><strong>Data da Vistoria:</strong> {new Date(inspection.dataVistoria).toLocaleDateString('pt-BR')}</p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Empresa:</strong> {inspection.empresa}</p>
                <p><strong>Filial:</strong> {inspection.filial}</p>
                <p><strong>Estado:</strong> {inspection.estado}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VistoriaDetalhes;
