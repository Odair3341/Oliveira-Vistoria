import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { Inspection } from "@/data/mockInspections";
import { mockRoutes } from "@/data/mockRoutes";
import { parseCurrencyInput } from "@/utils/formatUtils";

export function NewInspectionDialog() {
  const { addInspection } = useData();
  const [open, setOpen] = useState(false);
  
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [km, setKm] = useState<string>('');
  const [kmDeslocamento, setKmDeslocamento] = useState<string>('');
  const [valorKm, setValorKm] = useState<string>('');
  const [pedagio, setPedagio] = useState<string>('');

  // Novos campos para seleção de rota
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [selectedFilial, setSelectedFilial] = useState<string>('');
  const [trajeto, setTrajeto] = useState<string>(''); // Naviraí a XXX

  // Extrair empresas únicas
  const uniqueEmpresas = Array.from(new Set(mockRoutes.map(r => r.empresa)));
  
  // Filtrar filiais baseadas na empresa selecionada
  const availableFiliais = mockRoutes.filter(r => r.empresa === selectedEmpresa);

  // Atualizar KM e Trajeto quando a filial é selecionada
  useEffect(() => {
    if (selectedEmpresa && selectedFilial) {
      const route = mockRoutes.find(r => r.empresa === selectedEmpresa && r.filial === selectedFilial);
      if (route) {
        setKmDeslocamento(route.distancia.toString());
        setTrajeto(`Naviraí a ${route.cidade}`);
      }
    }
  }, [selectedEmpresa, selectedFilial]);

  const totalCalculado = ((Number(parseCurrencyInput(kmDeslocamento)) || 0) * (Number(parseCurrencyInput(valorKm)) || 0)) + (Number(parseCurrencyInput(pedagio)) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newInspection: Inspection = {
      id: Date.now().toString(),
      qtd: 1,
      placa: placa.toUpperCase(),
      kmRodado: Number(parseCurrencyInput(km)) || 0,
      kmDeslocamento: Number(parseCurrencyInput(kmDeslocamento)) || 0,
      valorKm: Number(parseCurrencyInput(valorKm)) || 0,
      pedagio: Number(parseCurrencyInput(pedagio)) || 0,
      ano: new Date().getFullYear(),
      modelo: modelo.toUpperCase(),
      marca: marca.toUpperCase(),
      filial: selectedFilial, // Usar a filial selecionada
      empresa: selectedEmpresa, // Usar a empresa selecionada
      estado: 'MS',
      autoAvaliar: 0,
      caltelar: 0,
      total: totalCalculado,
      dataVistoria: new Date().toISOString().split('T')[0],
      status: 'pendente'
    };

    addInspection(newInspection);
    
    toast.success("Vistoria criada com sucesso!");
    setOpen(false);
    
    // Reset form
    setPlaca('');
    setModelo('');
    setMarca('');
    setKm('');
    setKmDeslocamento('');
    setValorKm('');
    setPedagio('');
    setSelectedEmpresa('');
    setSelectedFilial('');
    setTrajeto('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Vistoria
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Vistoria</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para iniciar uma nova vistoria.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Dados do Veículo */}
            <div className="space-y-4 border-b pb-4">
              <h4 className="font-medium text-sm text-muted-foreground">Dados do Veículo</h4>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="placa" className="text-right">Placa</Label>
                <Input 
                  id="placa" 
                  placeholder="ABC-1234" 
                  className="col-span-3" 
                  required 
                  value={placa}
                  onChange={(e) => setPlaca(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="modelo" className="text-right">Modelo</Label>
                <Input 
                  id="modelo" 
                  placeholder="Ex: Strada" 
                  className="col-span-3" 
                  required 
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="marca" className="text-right">Marca</Label>
                <Input 
                  id="marca" 
                  placeholder="Ex: Fiat" 
                  className="col-span-3" 
                  required 
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="km" className="text-right">Hodômetro (KM Atual)</Label>
                <Input 
                  id="km" 
                  placeholder="Ex: 150.000" 
                  className="col-span-3" 
                  required 
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                />
              </div>
            </div>

            {/* Localização e Deslocamento */}
            <div className="space-y-4 border-b pb-4">
              <h4 className="font-medium text-sm text-muted-foreground">Localização da Empresa</h4>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="empresa" className="text-right">Empresa</Label>
                <Select onValueChange={setSelectedEmpresa} value={selectedEmpresa}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueEmpresas.map(emp => (
                      <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="filial" className="text-right">Cidade/Filial</Label>
                <Select 
                  onValueChange={setSelectedFilial} 
                  value={selectedFilial}
                  disabled={!selectedEmpresa}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFiliais.map(route => (
                      <SelectItem key={route.id} value={route.filial}>{route.filial}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Valores Financeiros */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Financeiro / Deslocamento</h4>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trajeto" className="text-right">Trajeto</Label>
                <Input 
                  id="trajeto" 
                  placeholder="Ex: Naviraí a Paranavaí" 
                  className="col-span-3" 
                  value={trajeto}
                  onChange={(e) => setTrajeto(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="kmDeslocamento" className="text-right">KM Rodado (Deslocamento)</Label>
                <div className="col-span-3 flex gap-2">
                  <Input 
                    id="kmDeslocamento" 
                    placeholder="Distância" 
                    required 
                    value={kmDeslocamento}
                    onChange={(e) => setKmDeslocamento(e.target.value)}
                  />
                  <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap px-2 bg-muted rounded">
                    km
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="valorKm" className="text-right">Valor/KM (R$)</Label>
                <Input 
                  id="valorKm" 
                  step="0.01"
                  placeholder="0.00" 
                  className="col-span-3" 
                  required 
                  value={valorKm}
                  onChange={(e) => setValorKm(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="pedagio" className="text-right">Pedágio (R$)</Label>
                <Input 
                  id="pedagio" 
                  step="0.01"
                  placeholder="0.00" 
                  className="col-span-3" 
                  value={pedagio}
                  onChange={(e) => setPedagio(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4 bg-primary/5 p-3 rounded-md">
                <Label className="text-right font-bold">Total Estimado</Label>
                <div className="col-span-3 font-bold text-lg text-primary">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCalculado)}
                </div>
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button type="submit">Criar Vistoria</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}