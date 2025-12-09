import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Inspection } from "@/data/mockInspections";
import { mockRoutes, cityDistances } from "@/data/mockRoutes";
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";
import { parseCurrencyInput } from "@/utils/formatUtils";

interface EditInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: Inspection | null;
}

export function EditInspectionDialog({ open, onOpenChange, inspection }: EditInspectionDialogProps) {
  const { updateInspection } = useData();
  const [formData, setFormData] = useState<Partial<Inspection>>({});
  
  // Novos campos para seleção de rota
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [selectedFilial, setSelectedFilial] = useState<string>('');
  
  // Campos para cálculo de deslocamento
  const [origem, setOrigem] = useState<string>('');
  const [destino, setDestino] = useState<string>('');

  // Extrair empresas e cidades únicas
  const uniqueEmpresas = Array.from(new Set(mockRoutes.map(r => r.empresa)));
  const uniqueCities = Array.from(new Set(mockRoutes.map(r => r.cidade))).sort();
  
  // Filtrar filiais baseadas na empresa selecionada
  const availableFiliais = mockRoutes.filter(r => r.empresa === selectedEmpresa);

  // Garantir que a filial atual esteja na lista de opções
  if (selectedFilial && !availableFiliais.some(r => r.filial === selectedFilial)) {
    availableFiliais.push({
      id: 'current-filial',
      empresa: selectedEmpresa,
      filial: selectedFilial,
      cidade: selectedFilial,
      distancia: 0
    });
  }

  // Garantir que Origem e Destino atuais estejam na lista de cidades
  const currentOrigem = inspection?.origem?.trim() || '';
  const currentDestino = inspection?.destino?.trim() || '';
  
  const origemOptions = ['Naviraí', ...uniqueCities.filter(c => c !== 'Naviraí')];
  if (currentOrigem && !origemOptions.includes(currentOrigem)) {
    origemOptions.push(currentOrigem);
  }
  
  const destinoOptions = ['Naviraí', ...uniqueCities.filter(c => c !== 'Naviraí')];
  if (currentDestino && !destinoOptions.includes(currentDestino)) {
    destinoOptions.push(currentDestino);
  }

  useEffect(() => {
    if (open && inspection) {
      // Sempre recarrega os dados quando o modal é aberto
      setFormData({ ...inspection });
      setSelectedEmpresa(inspection.empresa?.trim() || '');
      setSelectedFilial(inspection.filial?.trim() || '');
      setOrigem(inspection.origem?.trim() || '');
      setDestino(inspection.destino?.trim() || '');
    }
  }, [open, inspection]);

  // Atualizar empresa e filial no formData quando selecionadas
  useEffect(() => {
    if (selectedEmpresa) {
      handleChange('empresa', selectedEmpresa);
    }
    if (selectedFilial) {
      handleChange('filial', selectedFilial);
    }
  }, [selectedEmpresa, selectedFilial]);

  // Função para atualizar rota e calcular distância apenas quando o usuário altera manualmente
  const handleRouteUpdate = (newOrigem: string, newDestino: string) => {
    setOrigem(newOrigem);
    setDestino(newDestino);
    handleChange('origem', newOrigem);
    handleChange('destino', newDestino);

    if (newOrigem && newDestino) {
      let distance = 0;

      // 1. Check specific matrix first
      if (cityDistances[newOrigem] && cityDistances[newOrigem][newDestino]) {
        distance = cityDistances[newOrigem][newDestino];
      } else if (cityDistances[newDestino] && cityDistances[newDestino][newOrigem]) {
        distance = cityDistances[newDestino][newOrigem];
      }
      
      // 2. If not found, check if one is Naviraí (Base)
      else {
          const targetCity = newOrigem === 'Naviraí' ? newDestino : (newDestino === 'Naviraí' ? newOrigem : null);
          if (targetCity) {
            const route = mockRoutes.find(r => r.cidade === targetCity);
            if (route) {
                distance = route.distancia;
            }
          }
      }

      // Atualiza o KM apenas se encontrou uma distância
      if (distance >= 0) {
         handleChange('kmDeslocamento', distance.toString());
      }
    }
  };

  const handleChange = (field: keyof Inspection, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const kmDeslocamento = Number(parseCurrencyInput(String(formData.kmDeslocamento || ''))) || 0;
    const valorKm = Number(parseCurrencyInput(String(formData.valorKm || ''))) || 0;
    const pedagio = Number(parseCurrencyInput(String(formData.pedagio || ''))) || 0;
    const autoAvaliar = Number(parseCurrencyInput(String(formData.autoAvaliar || ''))) || 0;
    const caltelar = Number(parseCurrencyInput(String(formData.caltelar || ''))) || 0;

    return (kmDeslocamento * valorKm) + pedagio + autoAvaliar + caltelar;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspection || !formData) return;

    const total = calculateTotal();
    
    const updatedInspection: Inspection = {
      ...inspection,
      ...formData,
      total,
      kmRodado: Number(parseCurrencyInput(String(formData.kmRodado || ''))) || 0,
      kmDeslocamento: Number(parseCurrencyInput(String(formData.kmDeslocamento || ''))) || 0,
      valorKm: Number(parseCurrencyInput(String(formData.valorKm || ''))) || 0,
      pedagio: Number(parseCurrencyInput(String(formData.pedagio || ''))) || 0,
      autoAvaliar: Number(parseCurrencyInput(String(formData.autoAvaliar || ''))) || 0,
      caltelar: Number(parseCurrencyInput(String(formData.caltelar || ''))) || 0,
      ano: Number(formData.ano) || new Date().getFullYear(),
    } as Inspection;

    updateInspection(updatedInspection);
    toast.success("Vistoria atualizada com sucesso!");
    onOpenChange(false);
  };

  if (!inspection) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] w-[96vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Vistoria - {inspection.placa}</DialogTitle>
          <DialogDescription>
            Atualize os dados da vistoria abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Seção de Dados do Veículo */}
            <div className="border-b pb-4 mb-4 space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Dados do Veículo</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placa">Placa</Label>
                  <Input 
                    id="placa" 
                    value={formData.placa || ''} 
                    onChange={(e) => handleChange('placa', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="em_analise">Em Análise</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataVistoria">Data da Vistoria</Label>
                  <Input 
                    id="dataVistoria" 
                    type="date"
                    value={formData.dataVistoria || ''} 
                    onChange={(e) => handleChange('dataVistoria', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Input 
                    id="marca" 
                    value={formData.marca || ''} 
                    onChange={(e) => handleChange('marca', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo</Label>
                  <Input 
                    id="modelo" 
                    value={formData.modelo || ''} 
                    onChange={(e) => handleChange('modelo', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ano">Ano</Label>
                  <Input 
                    id="ano" 
                    type="number"
                    value={formData.ano || ''} 
                    onChange={(e) => handleChange('ano', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="kmRodado">KM Veículo (Hodômetro)</Label>
                <Input 
                  id="kmRodado" 
                  value={formData.kmRodado || ''} 
                  onChange={(e) => handleChange('kmRodado', e.target.value)}
                />
              </div>
            </div>

            {/* Seção Localização */}
            <div className="border-b pb-4 mb-4 space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Localização da Empresa</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Select onValueChange={setSelectedEmpresa} value={selectedEmpresa}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueEmpresas.map(emp => (
                        <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filial">Cidade/Filial</Label>
                  <Select 
                    key={`${inspection.id}-${selectedEmpresa}`} // Force re-render when inspection or company changes
                    onValueChange={setSelectedFilial} 
                    value={selectedFilial}
                    disabled={!selectedEmpresa}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFiliais.map(route => (
                        <SelectItem key={route.id || route.filial} value={route.filial}>{route.filial}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Seção Financeira */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Financeiro / Deslocamento</h4>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origem">Origem</Label>
                  <Select 
                    key={`origem-${inspection.id}-${origem}`}
                    onValueChange={(val) => handleRouteUpdate(val, destino)} 
                    value={origem}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a origem" />
                    </SelectTrigger>
                    <SelectContent>
                      {origemOptions.map(city => (
                        <SelectItem key={city} value={city}>{city === 'Naviraí' ? 'Naviraí (Base)' : city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destino">Destino</Label>
                  <Select 
                    key={`destino-${inspection.id}-${destino}`}
                    onValueChange={(val) => handleRouteUpdate(origem, val)} 
                    value={destino}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinoOptions.map(city => (
                        <SelectItem key={city} value={city}>{city === 'Naviraí' ? 'Naviraí (Base)' : city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kmDeslocamento">KM Deslocamento</Label>
                  <Input 
                    id="kmDeslocamento" 
                    value={formData.kmDeslocamento || ''} 
                    onChange={(e) => handleChange('kmDeslocamento', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorKm">Valor/KM (R$)</Label>
                  <Input 
                    id="valorKm" 
                    step="0.01"
                    value={formData.valorKm || ''} 
                    onChange={(e) => handleChange('valorKm', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pedagio">Pedágio (R$)</Label>
                  <Input 
                    id="pedagio" 
                    step="0.01"
                    value={formData.pedagio || ''} 
                    onChange={(e) => handleChange('pedagio', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtotal Reembolso</Label>
                  <div className="h-10 px-3 py-2 bg-muted rounded-md flex items-center font-medium">
                    R$ {(((Number(parseCurrencyInput(String(formData.kmDeslocamento || ''))) || 0) * (Number(parseCurrencyInput(String(formData.valorKm || ''))) || 0)) + (Number(parseCurrencyInput(String(formData.pedagio || ''))) || 0)).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="autoAvaliar">Auto Avaliar (R$)</Label>
                  <Input 
                    id="autoAvaliar" 
                    step="0.01"
                    value={formData.autoAvaliar || ''} 
                    onChange={(e) => handleChange('autoAvaliar', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caltelar">Cautelar (R$)</Label>
                  <Input 
                    id="caltelar" 
                    step="0.01"
                    value={formData.caltelar || ''} 
                    onChange={(e) => handleChange('caltelar', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center bg-primary/10 p-4 rounded-lg">
                <span className="font-bold">VALOR TOTAL A RECEBER</span>
                <span className="font-bold text-xl text-primary">
                  R$ {calculateTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
