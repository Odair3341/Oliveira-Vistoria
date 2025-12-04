import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockFiliais } from '@/data/mockFiliais';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const FilialDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const filial = mockFiliais.find(f => f.id === id);

  if (!filial) {
    return (
      <MainLayout title="Erro" subtitle="Filial não encontrada">
        <div className="text-center">
          <p>A filial que você está procurando não foi encontrada.</p>
          <Button onClick={() => navigate('/filiais')} className="mt-4">
            Voltar para Filiais
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title={`Detalhes da Filial`}
      subtitle={filial.nome}
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
                <p><strong>Nome:</strong> {filial.nome}</p>
                <p><strong>Empresa:</strong> {filial.empresa}</p>
                <p><strong>Endereço:</strong> {filial.endereco}</p>
                <p><strong>Cidade:</strong> {filial.cidade}</p>
                <p><strong>Estado:</strong> {filial.estado}</p>
                <p><strong>Telefone:</strong> {filial.telefone}</p>
                <p><strong>Gestor:</strong> {filial.gestor}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FilialDetalhes;
