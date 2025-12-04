import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Calendar, Gauge, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Vehicle {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  kmAtual: number;
  filial: string;
  status: 'ativo' | 'manutencao' | 'inativo';
}

interface VehicleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export function VehicleDetailsDialog({ open, onOpenChange, vehicle }: VehicleDetailsDialogProps) {
  if (!vehicle) return null;

  const statusConfig = {
    ativo: { label: 'Ativo', variant: 'success' as const },
    manutencao: { label: 'Manutenção', variant: 'warning' as const },
    inativo: { label: 'Inativo', variant: 'destructive' as const },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              {vehicle.marca} {vehicle.modelo}
            </DialogTitle>
            <Badge variant={statusConfig[vehicle.status].variant}>
              {statusConfig[vehicle.status].label}
            </Badge>
          </div>
          <DialogDescription className="text-lg font-mono font-bold text-foreground mt-1">
            {vehicle.placa}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Ano Fabricação
              </span>
              <p className="font-medium text-base">{vehicle.ano}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5" /> Quilometragem
              </span>
              <p className="font-medium text-base">{vehicle.kmAtual.toLocaleString('pt-BR')} km</p>
            </div>
            <div className="space-y-1 col-span-2">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Filial Alocada
              </span>
              <p className="font-medium text-base">{vehicle.filial}</p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-1">Informações Adicionais</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Este veículo está atualmente alocado na filial {vehicle.filial}. 
                  Para transferências ou agendamento de manutenção, utilize o menu de ações na listagem principal.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
