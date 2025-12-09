import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockVehicles, Vehicle } from '@/data/mockVehicles';
import { mockUsers } from '@/data/mockUsers';
import { mockFiliais } from '@/data/mockFiliais';
import { mockInspections, Inspection } from '@/data/mockInspections';

import { toast } from 'sonner';

// Define Types (you might want to import these from a central types file eventually)
interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
  filial: string;
  status: 'ativo' | 'inativa';
  ultimoAcesso: string;
}

interface Branch {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  empresa: string;
  gestor: string;
  telefone: string;
  endereco: string;
  status: 'ativa' | 'inativa';
}

interface DataContextType {
  vehicles: Vehicle[];
  users: User[];
  branches: Branch[];
  inspections: Inspection[];
  currentUser: User | null;
  
  // Actions
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userName: string) => void; // Keeping consistent with current implementation using name
  setCurrentUser: (user: User) => void;
  
  addBranch: (branch: Branch) => void;
  updateBranch: (branch: Branch) => void;
  deleteBranch: (name: string) => void;
  
  addInspection: (inspection: Inspection) => void;
  updateInspection: (inspection: Inspection) => void;
  deleteInspection: (id: string) => void;

  // Clear Data Actions
  clearVehicles: () => void;
  clearUsers: () => void;
  clearInspections: () => void;
  clearMockData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state empty initially, then fetch
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Helper to safely fetch JSON or fallback
        const isProd = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD;
        const safeFetch = async (url: string, mockData: any, storageKey: string, label: string) => {
            const isProd = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD;

            try {
                // 1. Priorizar a busca na rede
                const res = await fetch(url);
                const contentType = res.headers.get('content-type');

                if (res.ok && contentType && contentType.includes('application/json')) {
                    const data = await res.json();
                    const dataToStore = Array.isArray(data) ? data : [];
                    
                    // 2. Se sucesso, atualizar o cache e retornar os dados
                    localStorage.setItem(storageKey, JSON.stringify(dataToStore));
                    return dataToStore;
                } else {
                    // Se a API falhar (ex: 500), logar mas continuar para o fallback
                    console.error(`Falha ao buscar ${label} da API: ${res.status} ${res.statusText}`);
                    if (isProd) {
                        toast.error(`Serviço de ${label} indisponível. Tentando dados locais.`);
                    }
                }
            } catch (e) {
                // Se a rede falhar (ex: offline), logar mas continuar para o fallback
                console.error(`Erro de rede ao buscar ${label}:`, e);
                if (isProd) {
                    toast.error(`Erro de conexão ao buscar ${label}. Usando dados em cache, se disponíveis.`);
                }
            }

            // 3. Fallback para o localStorage
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) {
                        return parsed;
                    }
                } catch (e) {
                    console.error(`Erro ao parsear dados do localStorage para ${label}:`, e);
                }
            }
            
            // 4. Fallback final para mock data (apenas em dev) ou array vazio
            if (isProd) {
                return []; 
            }
            
            return mockData;
        };

        const timestamp = Date.now();
        const [vData, uData, bData, iData] = await Promise.all([
            safeFetch(`/api/vehicles?t=${timestamp}`, mockVehicles, 'oliveira_vehicles_v2', 'veículos'),
            safeFetch(`/api/users?t=${timestamp}`, mockUsers, 'oliveira_users_v2', 'usuários'),
            safeFetch(`/api/branches?t=${timestamp}`, mockFiliais, 'oliveira_branches_v2', 'filiais'),
            safeFetch(`/api/inspections?t=${timestamp}`, mockInspections, 'oliveira_inspections_v2', 'vistorias')
        ]);

        setVehicles(vData);
        setUsers(uData);
        setBranches(bData);
        setInspections(iData);

        // Inicializar usuário atual
        try {
          const savedCurrent = localStorage.getItem('oliveira_current_user_v2');
          if (savedCurrent) {
            setCurrentUserState(JSON.parse(savedCurrent));
          } else {
            setCurrentUserState(Array.isArray(uData) && uData.length > 0 ? uData[0] : null);
          }
        } catch {}

      } catch (error) {
        console.error("Erro crítico ao carregar dados:", error);
        // Last resort fallback
        setVehicles(mockVehicles);
        setUsers(mockUsers);
        setBranches(mockFiliais);
        setInspections(mockInspections);
      }
    };

    fetchData();
  }, []);

  // Actions Implementations - Updated to call API
  const addVehicle = async (vehicle: Vehicle) => {
    try {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle)
      });
      if (res.ok) {
        const savedVehicle = await res.json();
        setVehicles(prev => [...prev, savedVehicle]);
      } else {
        // Fallback local
        setVehicles(prev => [...prev, vehicle]);
        localStorage.setItem('oliveira_vehicles_v2', JSON.stringify([...vehicles, vehicle]));
      }
    } catch (e) {
      setVehicles(prev => [...prev, vehicle]);
      localStorage.setItem('oliveira_vehicles_v2', JSON.stringify([...vehicles, vehicle]));
    }
  };
  
  // Simplificação: Para update/delete e outros resources, vou manter a lógica local por enquanto
  // para não estender demais o escopo da mudança de uma vez e quebrar a UI se a API não tiver implementada UPDATE/DELETE.
  // Mas o ideal seria implementar todos.
  // Como o usuário quer VER os dados do banco, o GET é o mais importante.
  
  const updateVehicle = (vehicle: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
    // TODO: Implement API update
  };
  const deleteVehicle = (placa: string) => {
    setVehicles(vehicles.filter(v => v.placa !== placa));
     // TODO: Implement API delete
  };

  const addUser = async (user: User) => {
    try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        if (res.ok) {
          const saved = await res.json();
          const list = [...users, saved];
          setUsers(list);
          try { localStorage.setItem('oliveira_users_v2', JSON.stringify(list)); } catch {}
        } else {
          const list = [...users, user];
          setUsers(list);
          try { localStorage.setItem('oliveira_users_v2', JSON.stringify(list)); } catch {}
        }
    } catch(e) {
        const list = [...users, user];
        setUsers(list);
        try { localStorage.setItem('oliveira_users_v2', JSON.stringify(list)); } catch {}
    }
  };
  
  const updateUser = (user: User) => {
    const list = users.map(u => u.id === user.id ? user : u);
    setUsers(list);
    try { localStorage.setItem('oliveira_users_v2', JSON.stringify(list)); } catch {}
    // Se atualizar o usuário atual, refletir
    if (currentUser && currentUser.id === user.id) {
      setCurrentUserState(user);
      try { localStorage.setItem('oliveira_current_user_v2', JSON.stringify(user)); } catch {}
    }
  };
  const deleteUser = (userName: string) => {
    const list = users.filter(u => u.nome !== userName);
    setUsers(list);
    try { localStorage.setItem('oliveira_users_v2', JSON.stringify(list)); } catch {}
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    try { localStorage.setItem('oliveira_current_user_v2', JSON.stringify(user)); } catch {}
  };

  const addBranch = async (branch: Branch) => {
      try {
        const res = await fetch('/api/branches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(branch)
        });
        if (res.ok) {
          const saved = await res.json();
          setBranches(prev => [...prev, saved]);
        } else {
          setBranches(prev => [...prev, branch]);
        }
      } catch(e) {
          setBranches(prev => [...prev, branch]);
      }
  };

  const updateBranch = (branch: Branch) => {
    setBranches(branches.map(b => b.id === branch.id ? branch : b));
  };
  const deleteBranch = (name: string) => {
    setBranches(branches.filter(b => b.nome !== name));
  };

  const addInspection = async (inspection: Inspection) => {
      try {
        const res = await fetch('/api/inspections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inspection)
        });
        const isProd = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD;
        if (res.ok) {
          const saved = await res.json();
          const list = [...inspections, saved];
          setInspections(list);
          try { localStorage.setItem('oliveira_inspections_v2', JSON.stringify(list)); } catch {}
        } else {
          if (isProd) {
            console.error('Falha ao salvar na API em produção');
            return;
          }
          const list = [...inspections, inspection];
          setInspections(list);
          try { localStorage.setItem('oliveira_inspections_v2', JSON.stringify(list)); } catch {}
        }
      } catch(e) {
          const isProd = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PROD;
          if (isProd) {
            console.error('Erro ao salvar na API em produção');
            return;
          }
          const list = [...inspections, inspection];
          setInspections(list);
          try { localStorage.setItem('oliveira_inspections_v2', JSON.stringify(list)); } catch {}
      }
  };

  const updateInspection = async (inspection: Inspection) => {
    try {
        const res = await fetch('/api/inspections', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inspection)
        });

        if (res.ok) {
            // Atraso de 2 segundos para mitigar possível replication lag.
            await new Promise(resolve => setTimeout(resolve, 2000)); 

            // Força Bruta: Re-fetch a lista inteira para garantir consistência.
            const newDataRes = await fetch('/api/inspections');
            if (newDataRes.ok) {
                const allInspections = await newDataRes.json();
                setInspections(allInspections);
                try { localStorage.setItem('oliveira_inspections_v2', JSON.stringify(allInspections)); } catch {}
            } else {
                 // Se o re-fetch falhar, faz o update local como fallback
                 const updatedList = inspections.map(i => i.id === inspection.id ? inspection : i);
                 setInspections(updatedList);
                 try { localStorage.setItem('oliveira_inspections_v2', JSON.stringify(updatedList)); } catch {}
            }
        } else {
             // Se o PUT falhar, faz o update local como fallback
             const updatedList = inspections.map(i => i.id === inspection.id ? inspection : i);
             setInspections(updatedList);
             try { localStorage.setItem('oliveira_inspections_v2', JSON.stringify(updatedList)); } catch {}
        }
    } catch (e) {
         // Se tudo falhar, faz o update local como fallback
         const updatedList = inspections.map(i => i.id === inspection.id ? inspection : i);
         setInspections(updatedList);
         try { localStorage.setItem('oliveira_inspections_v2', JSON.stringify(updatedList)); } catch {}
    }
  };
  const deleteInspection = async (id: string) => {
    try {
        const res = await fetch(`/api/inspections?id=${id}`, {
            method: 'DELETE',
        });
        const filtered = inspections.filter(i => i.id !== id);
        setInspections(filtered);
        localStorage.setItem('oliveira_inspections_v2', JSON.stringify(filtered));
        if (res.ok) {
          const refresh = await fetch('/api/inspections');
          if (refresh.ok) {
            const data = await refresh.json();
            setInspections(data);
            localStorage.setItem('oliveira_inspections_v2', JSON.stringify(data));
          }
        }
    } catch (e) {
         const filtered = inspections.filter(i => i.id !== id);
         setInspections(filtered);
         localStorage.setItem('oliveira_inspections_v2', JSON.stringify(filtered));
    }
  };


  const clearVehicles = () => setVehicles([]);
  const clearUsers = () => setUsers([]);
  // Também limpar cache para evitar restauração
  // Mantém usuário atual para exibir nome no cabeçalho; opcionalmente poderia limpar também
  useEffect(() => {
    // Hook para manter coerência caso lista de usuários esvazie
    if (users.length === 0) {
      try { localStorage.removeItem('oliveira_users_v2'); } catch {}
    }
  }, [users]);
  const clearInspections = () => setInspections([]);
  
  const clearMockData = () => {
    // Remove itens com IDs curtos (geralmente mocks são '1', '2'...)
    // Mantém itens com IDs longos (timestamp)
    setVehicles(vehicles.filter(v => v.id.length > 5));
    setInspections(inspections.filter(i => i.id.length > 5));
    // Usuários e filiais podem ser mantidos ou limpos conforme necessidade,
    // mas o foco do usuário foi veículos.
  };

  return (
    <DataContext.Provider value={{
      vehicles,
      users,
      branches,
      inspections,
      currentUser,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addUser,
      updateUser,
      deleteUser,
      setCurrentUser,
      addBranch,
      updateBranch,
      deleteBranch,
      addInspection,
      updateInspection,
      deleteInspection,
      clearVehicles,
      clearUsers,
      clearInspections,
      clearMockData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
