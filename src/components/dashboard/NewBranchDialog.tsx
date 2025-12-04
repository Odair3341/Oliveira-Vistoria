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
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function NewBranchDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Filial cadastrada com sucesso!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Filial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Filial</DialogTitle>
          <DialogDescription>
            Cadastre uma nova filial da empresa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input id="nome" placeholder="Ex: Filial Dourados" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cidade" className="text-right">
                Cidade
              </Label>
              <Input id="cidade" placeholder="Ex: Dourados" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estado" className="text-right">
                Estado
              </Label>
              <Input id="estado" placeholder="Ex: MS" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gestor" className="text-right">
                Gestor
              </Label>
              <Input id="gestor" placeholder="Nome do gestor" className="col-span-3" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Filial</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
