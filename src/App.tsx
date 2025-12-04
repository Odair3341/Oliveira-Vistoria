import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./contexts/DataContext";
import { ThemeProvider } from "./components/theme-provider";
import Index from "./pages/Index";
import Vistorias from "./pages/Vistorias";
import NovaVistoria from "./pages/NovaVistoria";
import VistoriaDetalhes from "./pages/VistoriaDetalhes";
import Veiculos from "./pages/Veiculos";
import NovoVeiculo from "./pages/NovoVeiculo";
import VeiculoDetalhes from "./pages/VeiculoDetalhes";
import Filiais from "./pages/Filiais";
import NovaFilial from "./pages/NovaFilial";
import FilialDetalhes from "./pages/FilialDetalhes";
import Usuarios from "./pages/Usuarios";
import NovoUsuario from "./pages/NovoUsuario";
import UsuarioDetalhes from "./pages/UsuarioDetalhes";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="oliveira-theme">
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vistorias" element={<Vistorias />} />
              <Route path="/veiculos" element={<Veiculos />} />
              <Route path="/veiculos/novo" element={<NovoVeiculo />} />
              <Route path="/veiculos/:id" element={<VeiculoDetalhes />} />
              <Route path="/filiais" element={<Filiais />} />
              <Route path="/filiais/nova" element={<NovaFilial />} />
              <Route path="/filiais/:id" element={<FilialDetalhes />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/usuarios/novo" element={<NovoUsuario />} />
              <Route path="/usuarios/:id" element={<UsuarioDetalhes />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/vistorias/nova" element={<NovaVistoria />} />
              <Route path="/vistorias/:id" element={<VistoriaDetalhes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
