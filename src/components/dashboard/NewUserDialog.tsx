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
import { User } from "@/data/mockUsers";

export function NewUserDialog() {
  const [open, setOpen] = useState(false);
  const { addUser } = useData();
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [filial, setFilial] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !cargo || !filial) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      nome,
      email,
      cargo,
      departamento: "Operacional", // Default department or add field
      filial,
      status: "ativo",
      ultimoAcesso: "Nunca acessou"
    };

    addUser(newUser);
    toast.success("Usuário cadastrado com sucesso!");
    setOpen(false);
    
    // Reset form
    setNome("");
    setEmail("");
    setCargo("");
    setFilial("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Cadastre um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input 
                id="nome" 
                placeholder="Nome completo" 
                className="col-span-3" 
                required 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="email@empresa.com" 
                className="col-span-3" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cargo" className="text-right">
                Cargo
              </Label>
              <Select value={cargo} onValueChange={setCargo}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Vistoriador">Vistoriador</SelectItem>
                  <SelectItem value="Gestor de Filial">Gestor de Filial</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filial" className="text-right">
                Filial
              </Label>
              <Select value={filial} onValueChange={setFilial}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Naviraí">Naviraí</SelectItem>
                  <SelectItem value="Dourados">Dourados</SelectItem>
                  <SelectItem value="Chapadão do Sul">Chapadão do Sul</SelectItem>
                  <SelectItem value="Jardim">Jardim</SelectItem>
                  <SelectItem value="Ponta Porã">Ponta Porã</SelectItem>
                  <SelectItem value="Matriz">Matriz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
