import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Calendar, Gauge, AlertCircle, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Inspection } from "@/data/mockInspections";

interface InspectionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inspection: Inspection | null;
}

export function InspectionDetailsDialog({ open, onOpenChange, inspection }: InspectionDetailsDialogProps) {
  if (!inspection) return null;

  const statusConfig = {
    concluida: { label: 'Concluída', variant: 'success' as const },
    pendente: { label: 'Pendente', variant: 'warning' as const },
    em_analise: { label: 'Em Análise', variant: 'secondary' as const },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              {inspection.marca} {inspection.modelo} ({inspection.placa})
            </DialogTitle>
            <Badge variant={statusConfig[inspection.status].variant}>
              {statusConfig[inspection.status].label}
            </Badge>
          </div>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Realizada em {new Date(inspection.dataVistoria).toLocaleDateString('pt-BR')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Car className="h-3.5 w-3.5" /> Veículo
              </span>
              <p className="font-medium text-base">{inspection.marca} {inspection.modelo}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Ano Modelo
              </span>
              <p className="font-medium text-base">{inspection.ano}</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5" /> KM Registrado
              </span>
              <p className="font-medium text-base">{Number(inspection.kmRodado || 0).toLocaleString('pt-BR')} km</p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> Localização
              </span>
              <p className="font-medium text-base">{inspection.filial} - {inspection.estado}</p>
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border/50">
              <DollarSign className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-sm">Detalhamento Financeiro</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Seção de Reembolso */}
              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reembolso / Deslocamento</h5>
                <div>
                  <span className="text-xs text-muted-foreground block">Deslocamento</span>
                  <p className="font-medium">
                    {inspection.valorKm ? `R$ ${inspection.valorKm.toFixed(2)}` : 'R$ 0,00'}
                    <span className="text-xs text-muted-foreground font-normal ml-1">
                       x {(inspection.kmDeslocamento || 0).toLocaleString('pt-BR')} km
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                     = R$ {((inspection.kmDeslocamento || 0) * (inspection.valorKm || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div>
                  <span className="text-xs text-muted-foreground block">Pedágio</span>
                  <p className="font-medium">
                    R$ {(inspection.pedagio || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/30">
                  <span className="text-xs font-medium block">Subtotal Reembolso</span>
                  <p className="font-bold text-primary">
                    R$ {(((inspection.kmDeslocamento || 0) * (inspection.valorKm || 0)) + (inspection.pedagio || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Seção de Serviços */}
              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Serviços Prestados</h5>
                <div>
                  <span className="text-xs text-muted-foreground block">Auto Avaliação</span>
                  <p className="font-medium">
                    {inspection.autoAvaliar ? `R$ ${inspection.autoAvaliar.toFixed(2)}` : 'R$ 0,00'}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Cautelar</span>
                  <p className="font-medium">
                    {inspection.caltelar ? `R$ ${inspection.caltelar.toFixed(2)}` : 'R$ 0,00'}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/30">
                  <span className="text-xs font-medium block">Subtotal Serviços</span>
                  <p className="font-bold text-primary">
                    R$ {((inspection.autoAvaliar || 0) + (inspection.caltelar || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center bg-primary/5 p-3 rounded-md">
              <span className="font-bold text-sm">VALOR TOTAL A RECEBER</span>
              <span className="font-bold text-xl text-primary">
                R$ {(((inspection.kmDeslocamento || 0) * (inspection.valorKm || 0)) + (inspection.pedagio || 0) + (inspection.autoAvaliar || 0) + (inspection.caltelar || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
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
