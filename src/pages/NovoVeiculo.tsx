import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Vehicle } from '@/data/mockVehicles';
import { Inspection } from '@/data/mockInspections';
import { parseCurrencyInput } from '@/utils/formatUtils';

const NovoVeiculo = () => {
  const navigate = useNavigate();
  const { addVehicle, addInspection, branches } = useData();

  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [filial, setFilial] = useState('');
  const [km, setKm] = useState('');

  const handleSave = () => {
    if (!placa || !marca || !modelo || !ano || !filial || !km) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const selectedBranch = branches.find(b => b.nome === filial);

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      placa: placa.toUpperCase(),
      marca: marca.toUpperCase(),
      modelo: modelo.toUpperCase(),
      ano: Number(ano) || new Date().getFullYear(),
      cor: cor || 'Branco', // Default color if not specified
      kmAtual: Number(parseCurrencyInput(km)) || 0,
      status: 'ativo',
      filial: filial,
      empresa: selectedBranch?.empresa || 'Não informada'
    };

    addVehicle(newVehicle);

    // Automatically create a pending inspection for the new vehicle
    // Use a slightly different ID to ensure uniqueness (Date.now() might be same as vehicle ID)
    setTimeout(() => {
      const newInspection: Inspection = {
        id: (Date.now() + 1).toString(), 
        qtd: 1,
        placa: newVehicle.placa,
        kmRodado: newVehicle.kmAtual,
        kmDeslocamento: 0,
        valorKm: 0,
        ano: newVehicle.ano,
        modelo: newVehicle.modelo,
        marca: newVehicle.marca,
        filial: newVehicle.filial,
        empresa: newVehicle.empresa,
        estado: selectedBranch?.estado || 'MS',
        autoAvaliar: 0,
        caltelar: 0,
        pedagio: 0,
        total: 0,
        dataVistoria: new Date().toISOString().split('T')[0],
        status: 'pendente'
      };

      addInspection(newInspection);
      
      toast.success('Veículo salvo e vistoria criada com sucesso!');
      navigate('/vistorias');
    }, 100); // Small delay to ensure state updates and distinct IDs
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <MainLayout 
      title="Novo Veículo" 
      subtitle="Preencha os dados para cadastrar um novo veículo"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="placa">Placa *</Label>
              <Input 
                id="placa" 
                placeholder="ABC-1234" 
                value={placa}
                onChange={(e) => setPlaca(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="marca">Marca *</Label>
              <Input 
                id="marca" 
                placeholder="Ex: Chevrolet" 
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="modelo">Modelo *</Label>
              <Input 
                id="modelo" 
                placeholder="Ex: Onix" 
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ano">Ano *</Label>
              <Input 
                id="ano" 
                type="number" 
                placeholder="Ex: 2023" 
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input 
                id="cor" 
                placeholder="Ex: Branco" 
                value={cor}
                onChange={(e) => setCor(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="km">Hodômetro (KM Atual) *</Label>
              <Input 
                id="km" 
                placeholder="Ex: 15.000" 
                value={km}
                onChange={(e) => setKm(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="filial">Filial *</Label>
              <Select value={filial} onValueChange={setFilial}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.nome}>
                      {branch.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Veículo
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NovoVeiculo;
