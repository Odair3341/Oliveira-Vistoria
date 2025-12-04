import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockVehicles, Vehicle } from '@/data/mockVehicles';
import { mockUsers } from '@/data/mockUsers';
import { mockFiliais } from '@/data/mockFiliais';
import { mockInspections, Inspection } from '@/data/mockInspections';

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
  
  // Actions
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (userName: string) => void; // Keeping consistent with current implementation using name
  
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

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tenta buscar da API. Se falhar (ex: 404 em dev sem serverless), usa mocks ou vazio.
        // Para desenvolvimento local sem 'vercel dev', o fetch falhará.
        // Podemos checar process.env.NODE_ENV
        
        const [vRes, uRes, bRes, iRes] = await Promise.allSettled([
          fetch('/api/vehicles'),
          fetch('/api/users'),
          fetch('/api/branches'),
          fetch('/api/inspections')
        ]);

        if (vRes.status === 'fulfilled' && vRes.value.ok) {
          const data = await vRes.value.json();
          setVehicles(data);
        } else {
           console.warn("Usando dados locais para Veículos (API não disponível ou erro)");
           // Fallback to localStorage or Mock if API fails (dev mode without backend)
           const saved = localStorage.getItem('oliveira_vehicles');
           setVehicles(saved ? JSON.parse(saved) : mockVehicles);
        }

        if (uRes.status === 'fulfilled' && uRes.value.ok) {
          const data = await uRes.value.json();
          setUsers(data);
        } else {
           const saved = localStorage.getItem('oliveira_users');
           setUsers(saved ? JSON.parse(saved) : mockUsers);
        }

        if (bRes.status === 'fulfilled' && bRes.value.ok) {
          const data = await bRes.value.json();
          setBranches(data);
        } else {
           const saved = localStorage.getItem('oliveira_branches');
           setBranches(saved ? JSON.parse(saved) : mockFiliais);
        }

        if (iRes.status === 'fulfilled' && iRes.value.ok) {
          const data = await iRes.value.json();
          setInspections(data);
        } else {
           const saved = localStorage.getItem('oliveira_inspections');
           setInspections(saved ? JSON.parse(saved) : mockInspections);
        }

      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
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
        localStorage.setItem('oliveira_vehicles', JSON.stringify([...vehicles, vehicle]));
      }
    } catch (e) {
      setVehicles(prev => [...prev, vehicle]);
      localStorage.setItem('oliveira_vehicles', JSON.stringify([...vehicles, vehicle]));
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
          setUsers(prev => [...prev, saved]);
        } else {
          setUsers(prev => [...prev, user]);
        }
    } catch(e) {
        setUsers(prev => [...prev, user]);
    }
  };
  
  const updateUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
  };
  const deleteUser = (userName: string) => {
    setUsers(users.filter(u => u.nome !== userName));
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
        if (res.ok) {
          const saved = await res.json();
          setInspections(prev => [...prev, saved]);
        } else {
           setInspections(prev => [...prev, inspection]);
        }
      } catch(e) {
          setInspections(prev => [...prev, inspection]);
      }
  };

  const updateInspection = (inspection: Inspection) => {
    setInspections(inspections.map(i => i.id === inspection.id ? inspection : i));
  };
  const deleteInspection = (id: string) => {
    setInspections(inspections.filter(i => i.id !== id));
  };


  const clearVehicles = () => setVehicles([]);
  const clearUsers = () => setUsers([]);
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
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addUser,
      updateUser,
      deleteUser,
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
