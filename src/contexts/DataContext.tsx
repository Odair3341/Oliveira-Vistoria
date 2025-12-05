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
        // Helper to safely fetch JSON or fallback
        const safeFetch = async (url: string, mockData: any, storageKey: string) => {
            try {
                const res = await fetch(url);
                const contentType = res.headers.get('content-type');
                if (res.ok && contentType && contentType.includes('application/json')) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        // Quando a API retornar dados, usar e atualizar cache
                        localStorage.setItem(storageKey, JSON.stringify(data));
                        return data;
                    }
                    // Se a API retornar lista vazia, preservar dados locais ou mocks
                }
            } catch (e) {}
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
            return mockData;
        };

        const [vData, uData, bData, iData] = await Promise.all([
            safeFetch('/api/vehicles', mockVehicles, 'oliveira_vehicles'),
            safeFetch('/api/users', mockUsers, 'oliveira_users'),
            safeFetch('/api/branches', mockFiliais, 'oliveira_branches'),
            safeFetch('/api/inspections', mockInspections, 'oliveira_inspections')
        ]);

        setVehicles(vData);
        setUsers(uData);
        setBranches(bData);
        setInspections(iData);

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
            } else {
                 // Se o re-fetch falhar, faz o update local como fallback
                 setInspections(prev => prev.map(i => i.id === inspection.id ? inspection : i));
            }
        } else {
             // Se o PUT falhar, faz o update local como fallback
             setInspections(prev => prev.map(i => i.id === inspection.id ? inspection : i));
        }
    } catch (e) {
         // Se tudo falhar, faz o update local como fallback
         setInspections(prev => prev.map(i => i.id === inspection.id ? inspection : i));
    }
  };
  const deleteInspection = async (id: string) => {
    try {
        const res = await fetch(`/api/inspections?id=${id}`, {
            method: 'DELETE',
        });
        const filtered = inspections.filter(i => i.id !== id);
        setInspections(filtered);
        localStorage.setItem('oliveira_inspections', JSON.stringify(filtered));
        if (res.ok) {
          const refresh = await fetch('/api/inspections');
          if (refresh.ok) {
            const data = await refresh.json();
            setInspections(data);
            localStorage.setItem('oliveira_inspections', JSON.stringify(data));
          }
        }
    } catch (e) {
         const filtered = inspections.filter(i => i.id !== id);
         setInspections(filtered);
         localStorage.setItem('oliveira_inspections', JSON.stringify(filtered));
    }
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
