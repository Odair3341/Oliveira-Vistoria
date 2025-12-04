import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUsers } from '@/data/mockUsers';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UsuarioDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find(u => u.id === id);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user) {
    return (
      <MainLayout title="Erro" subtitle="Usuário não encontrado">
        <div className="text-center">
          <p>O usuário que você está procurando não foi encontrado.</p>
          <Button onClick={() => navigate('/usuarios')} className="mt-4">
            Voltar para Usuários
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Detalhes do Usuário"
      subtitle={user.nome}
    >
      <div className="max-w-5xl mx-auto">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-background shadow-sm">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nome}`} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {getInitials(user.nome)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.nome}</CardTitle>
              <p className="text-muted-foreground">{user.cargo}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Filial:</strong> {user.filial}</p>
            <p><strong>Departamento:</strong> {user.departamento}</p>
            <p><strong>Status:</strong> {user.status}</p>
            <p><strong>Último Acesso:</strong> {user.ultimoAcesso}</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UsuarioDetalhes;
