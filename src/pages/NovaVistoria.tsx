import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const NovaVistoria = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    toast.success('Vistoria salva com sucesso!');
    navigate('/vistorias');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <MainLayout 
      title="Nova Vistoria" 
      subtitle="Preencha os dados para criar uma nova vistoria"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="placa">Placa do Veículo</Label>
              <Input id="placa" placeholder="ABC-1234" />
            </div>
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input id="modelo" placeholder="Ex: Onix, Corolla" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="filial">Filial</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="navirai">Naviraí</SelectItem>
                  <SelectItem value="campo-grande">Campo Grande</SelectItem>
                  <SelectItem value="dourados">Dourados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="km">KM Rodado</Label>
              <Input id="km" type="number" placeholder="Ex: 50000" />
            </div>
          </div>
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea id="observacoes" placeholder="Detalhes sobre a vistoria..." />
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Vistoria
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NovaVistoria;
