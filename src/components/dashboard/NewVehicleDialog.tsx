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
import { useState } from "react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { mockRoutes } from "@/data/mockRoutes";
import { parseCurrencyInput } from "@/utils/formatUtils";
import { Vehicle } from "@/data/mockVehicles";

export function NewVehicleDialog() {
  const { addVehicle } = useData();
  const [open, setOpen] = useState(false);
  
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [km, setKm] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [filial, setFilial] = useState('');

  // Extract unique companies
  const uniqueEmpresas = Array.from(new Set(mockRoutes.map(r => r.empresa)));
  
  // Filter branches based on selected company
  const availableFiliais = mockRoutes.filter(r => r.empresa === empresa);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!placa || !marca || !modelo || !ano || !empresa || !filial || !km) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newVehicle: Vehicle = {
      id: Date.now().toString(),
      placa: placa.toUpperCase(),
      marca: marca.toUpperCase(),
      modelo: modelo.toUpperCase(),
      ano: Number(ano) || new Date().getFullYear(),
      cor: 'Branco', // Default
      kmAtual: Number(parseCurrencyInput(km)) || 0,
      status: 'ativo',
      filial: filial,
      empresa: empresa
    };

    addVehicle(newVehicle);
    toast.success("Veículo cadastrado com sucesso!");
    setOpen(false);
    
    // Reset form
    setPlaca('');
    setMarca('');
    setModelo('');
    setAno('');
    setKm('');
    setEmpresa('');
    setFilial('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Veículo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Veículo</DialogTitle>
          <DialogDescription>
            Cadastre um novo veículo na frota.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="placa" className="text-right">
                Placa
              </Label>
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
              <Label htmlFor="marca" className="text-right">
                Marca
              </Label>
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
              <Label htmlFor="modelo" className="text-right">
                Modelo
              </Label>
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
              <Label htmlFor="ano" className="text-right">
                Ano
              </Label>
              <Input 
                id="ano" 
                type="number" 
                placeholder="2024" 
                className="col-span-3" 
                required 
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="km" className="text-right">
                Hodômetro
              </Label>
              <Input 
                id="km" 
                placeholder="Ex: 150.000" 
                className="col-span-3" 
                required 
                value={km}
                onChange={(e) => setKm(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="empresa" className="text-right">
                Empresa
              </Label>
              <Select onValueChange={setEmpresa} value={empresa}>
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
              <Label htmlFor="filial" className="text-right">
                Filial
              </Label>
              <Select 
                onValueChange={setFilial} 
                value={filial}
                disabled={!empresa}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  {availableFiliais.map(route => (
                    <SelectItem key={route.id} value={route.filial}>{route.filial}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Veículo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
