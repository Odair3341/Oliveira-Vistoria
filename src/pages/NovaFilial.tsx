import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const NovaFilial = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    toast.success('Filial salva com sucesso!');
    navigate('/filiais');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <MainLayout 
      title="Nova Filial" 
      subtitle="Preencha os dados para cadastrar uma nova filial"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nome">Nome da Filial</Label>
              <Input id="nome" placeholder="Ex: Filial Naviraí" />
            </div>
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Input id="empresa" placeholder="Ex: Matriz" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" placeholder="Ex: Naviraí" />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input id="estado" placeholder="Ex: MS" />
            </div>
          </div>
          <div>
            <Label htmlFor="endereco">Endereço</Label>
            <Input id="endereco" placeholder="Ex: Av. Principal, 123" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" placeholder="(67) 99999-9999" />
            </div>
            <div>
              <Label htmlFor="gestor">Gestor</Label>
              <Input id="gestor" placeholder="Nome do gestor" />
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Filial
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NovaFilial;
