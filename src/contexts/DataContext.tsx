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
  // Initialize state from localStorage if available, otherwise use mocks
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('oliveira_vehicles');
    return saved ? JSON.parse(saved) : mockVehicles;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('oliveira_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('oliveira_branches');
    return saved ? JSON.parse(saved) : mockFiliais;
  });

  const [inspections, setInspections] = useState<Inspection[]>(() => {
    const saved = localStorage.getItem('oliveira_inspections');
    return saved ? JSON.parse(saved) : mockInspections;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('oliveira_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('oliveira_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('oliveira_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('oliveira_inspections', JSON.stringify(inspections));
  }, [inspections]);

  // Actions Implementations
  const addVehicle = (vehicle: Vehicle) => setVehicles([...vehicles, vehicle]);
  const updateVehicle = (vehicle: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
  };
  const deleteVehicle = (placa: string) => {
    setVehicles(vehicles.filter(v => v.placa !== placa));
  };

  const addUser = (user: User) => setUsers([...users, user]);
  const updateUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
  };
  const deleteUser = (userName: string) => {
    setUsers(users.filter(u => u.nome !== userName));
  };

  const addBranch = (branch: Branch) => setBranches([...branches, branch]);
  const updateBranch = (branch: Branch) => {
    setBranches(branches.map(b => b.id === branch.id ? branch : b));
  };
  const deleteBranch = (name: string) => {
    setBranches(branches.filter(b => b.nome !== name));
  };

  const addInspection = (inspection: Inspection) => setInspections([...inspections, inspection]);
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
