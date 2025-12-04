import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { User } from '@/data/mockUsers';

const NovoUsuario = () => {
  const navigate = useNavigate();
  const { addUser } = useData();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [filial, setFilial] = useState('');
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo');

  const handleSave = () => {
    if (!nome || !email || !cargo || !filial) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      nome,
      email,
      cargo,
      departamento: departamento || 'Operacional',
      filial,
      status,
      ultimoAcesso: 'Nunca acessou'
    };

    addUser(newUser);
    toast.success('Usuário salvo com sucesso!');
    navigate('/usuarios');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <MainLayout 
      title="Novo Usuário" 
      subtitle="Preencha os dados para cadastrar um novo usuário"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input 
                id="nome" 
                placeholder="Nome do usuário" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="usuario@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="cargo">Cargo *</Label>
              <Input 
                id="cargo" 
                placeholder="Ex: Vistoriador" 
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="departamento">Departamento</Label>
              <Input 
                id="departamento" 
                placeholder="Ex: Operacional" 
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
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
                  <SelectItem value="Naviraí">Naviraí</SelectItem>
                  <SelectItem value="Dourados">Dourados</SelectItem>
                  <SelectItem value="Chapadão do Sul">Chapadão do Sul</SelectItem>
                  <SelectItem value="Jardim">Jardim</SelectItem>
                  <SelectItem value="Ponta Porã">Ponta Porã</SelectItem>
                  <SelectItem value="Matriz">Matriz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: 'ativo' | 'inativo') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
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
            Salvar Usuário
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NovoUsuario;
