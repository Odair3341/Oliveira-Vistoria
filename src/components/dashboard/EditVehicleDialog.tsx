import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Vehicle } from "@/data/mockVehicles";
import { mockRoutes } from "@/data/mockRoutes";
import { parseCurrencyInput } from "@/utils/formatUtils";

interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
  onSave: (vehicle: Vehicle) => void;
}

export function EditVehicleDialog({ open, onOpenChange, vehicle, onSave }: EditVehicleDialogProps) {
  const [formData, setFormData] = useState<any>(null);

  // Extract unique companies
  const uniqueEmpresas = Array.from(new Set(mockRoutes.map(r => r.empresa)));
  
  // Filter branches based on selected company
  const availableFiliais = mockRoutes.filter(r => r.empresa === formData?.empresa);

  useEffect(() => {
    if (vehicle) {
      setFormData({ ...vehicle });
    }
  }, [vehicle]);

  if (!formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      const vehicleToSave: Vehicle = {
        ...formData,
        kmAtual: Number(parseCurrencyInput(String(formData.kmAtual))),
        ano: Number(formData.ano)
      };
      onSave(vehicleToSave);
      onOpenChange(false);
      toast.success(`Veículo ${formData.placa} atualizado com sucesso!`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Veículo</DialogTitle>
          <DialogDescription>
            Atualize os dados do veículo abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="placa" className="text-right">Placa</Label>
            <Input 
              id="placa" 
              value={formData.placa} 
              onChange={(e) => setFormData({...formData, placa: e.target.value})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="marca" className="text-right">Marca</Label>
            <Input 
              id="marca" 
              value={formData.marca} 
              onChange={(e) => setFormData({...formData, marca: e.target.value})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelo" className="text-right">Modelo</Label>
            <Input 
              id="modelo" 
              value={formData.modelo} 
              onChange={(e) => setFormData({...formData, modelo: e.target.value})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ano" className="text-right">Ano</Label>
            <Input 
              id="ano" 
              type="number"
              value={formData.ano} 
              onChange={(e) => setFormData({...formData, ano: e.target.value})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="km" className="text-right">Hodômetro</Label>
            <Input 
              id="km" 
              value={formData.kmAtual} 
              onChange={(e) => setFormData({...formData, kmAtual: e.target.value})}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="empresa" className="text-right">Empresa</Label>
            <Select 
              value={formData.empresa || ''} 
              onValueChange={(value) => setFormData({...formData, empresa: value, filial: ''})}
            >
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
            <Label htmlFor="filial" className="text-right">Filial</Label>
            <Select 
              value={formData.filial || ''} 
              onValueChange={(value) => setFormData({...formData, filial: value})}
              disabled={!formData.empresa}
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
