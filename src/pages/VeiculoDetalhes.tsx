import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockVehicles } from '@/data/mockVehicles';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const VeiculoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const vehicle = mockVehicles.find(v => v.id === id);

  if (!vehicle) {
    return (
      <MainLayout title="Erro" subtitle="Veículo não encontrado">
        <div className="text-center">
          <p>O veículo que você está procurando não foi encontrado.</p>
          <Button onClick={() => navigate('/veiculos')} className="mt-4">
            Voltar para Veículos
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={`Detalhes do Veículo`}
      subtitle={`Placa: ${vehicle.placa}`}
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
                <p><strong>Placa:</strong> {vehicle.placa}</p>
                <p><strong>Modelo:</strong> {vehicle.marca} {vehicle.modelo}</p>
                <p><strong>Ano:</strong> {vehicle.ano}</p>
                <p><strong>KM Atual:</strong> {vehicle.kmAtual.toLocaleString('pt-BR')} km</p>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Filial:</strong> {vehicle.filial}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VeiculoDetalhes;
