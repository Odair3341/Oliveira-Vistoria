import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useData } from '@/contexts/DataContext';
import { Trash2 } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

const Configuracoes = () => {
  const { clearVehicles, clearInspections, clearUsers, clearMockData } = useData();
  const { theme, setTheme } = useTheme();

  const handleSaveProfile = () => {
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleRestoreDefaults = () => {
    toast.info("Configurações restauradas para o padrão.");
  };

  const handlePhotoChange = () => {
    toast.info("Funcionalidade de upload de foto em desenvolvimento.");
  };
  
  const handleClearMockData = () => {
    if (confirm("Deseja limpar apenas os dados de exemplo e manter os dados que você cadastrou?")) {
      clearMockData();
      toast.success("Dados de exemplo removidos com sucesso!");
    }
  };

  const handleClearData = (type: 'vistorias' | 'veiculos' | 'usuarios') => {
    if (confirm(`Tem certeza que deseja apagar TODOS os dados de ${type}? Esta ação não pode ser desfeita.`)) {
      switch (type) {
        case 'vistorias':
          clearInspections();
          toast.success("Banco de vistorias limpo com sucesso!");
          break;
        case 'veiculos':
          clearVehicles();
          toast.success("Banco de veículos limpo com sucesso!");
          break;
        case 'usuarios':
          clearUsers();
          toast.success("Banco de usuários limpo com sucesso!");
          break;
      }
    }
  };

  return (
    <MainLayout 
      title="Configurações" 
      subtitle="Gerencie as preferências do sistema"
    >
      <Tabs defaultValue="perfil" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e foto de perfil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={handlePhotoChange}>Alterar foto</Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input id="nome" defaultValue="João Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" defaultValue="joao.silva@empresa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input id="cargo" defaultValue="Administrador" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input id="departamento" defaultValue="TI" disabled />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sistema">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>
                Gerencie notificações e aparência.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notifications" className="flex flex-col space-y-1">
                  <span>Notificações por Email</span>
                  <span className="font-normal text-xs text-muted-foreground">Receba atualizações sobre novas vistorias</span>
                </Label>
                <Switch id="notifications" defaultChecked onCheckedChange={(checked) => toast.info(`Notificações ${checked ? 'ativadas' : 'desativadas'}`)} />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                  <span>Relatórios Semanais</span>
                  <span className="font-normal text-xs text-muted-foreground">Receba um resumo semanal das atividades</span>
                </Label>
                <Switch id="marketing" defaultChecked onCheckedChange={(checked) => toast.info(`Relatórios semanais ${checked ? 'ativados' : 'desativados'}`)} />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="theme" className="flex flex-col space-y-1">
                  <span>Modo Escuro</span>
                  <span className="font-normal text-xs text-muted-foreground">Alternar entre tema claro e escuro</span>
                </Label>
                <Switch 
                  id="theme" 
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => {
                    const newTheme = checked ? 'dark' : 'light';
                    setTheme(newTheme);
                    toast.info(`Modo escuro ${checked ? 'ativado' : 'desativado'}`);
                  }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Zona de Perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis para limpar dados do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-primary/20 rounded-lg bg-primary/5">
                <div>
                  <p className="font-medium">Limpar Dados de Exemplo</p>
                  <p className="text-sm text-muted-foreground">Remove apenas os dados fictícios, mantendo os seus cadastros.</p>
                </div>
                <Button onClick={handleClearMockData}>
                  Limpar Exemplos
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <p className="font-medium">Limpar Vistorias</p>
                  <p className="text-sm text-muted-foreground">Apaga todas as vistorias cadastradas.</p>
                </div>
                <Button variant="destructive" onClick={() => handleClearData('vistorias')}>
                  Limpar
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <p className="font-medium">Limpar Veículos</p>
                  <p className="text-sm text-muted-foreground">Apaga todos os veículos cadastrados.</p>
                </div>
                <Button variant="destructive" onClick={() => handleClearData('veiculos')}>
                  Limpar
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <p className="font-medium">Limpar Usuários</p>
                  <p className="text-sm text-muted-foreground">Apaga todos os usuários (exceto atual).</p>
                </div>
                <Button variant="destructive" onClick={() => handleClearData('usuarios')}>
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Configuracoes;
