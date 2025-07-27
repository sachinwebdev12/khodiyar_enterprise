import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ClientList from './components/Clients/ClientList';
import BillList from './components/Bills/BillList';
import BillForm from './components/Bills/BillForm';
import Settings from './components/Settings/Settings';
import { useData } from './hooks/useData';
import { storage } from './utils/storage';
import { Bill, Client } from './types';
import { useNavigate } from 'react-router-dom';

const NewBillPage: React.FC = () => {
  const { clients, refreshData } = useData();
  const navigate = useNavigate();

  const handleCreateBill = (billData: any, newClient?: any) => {
    // If new client was created, add it first
    if (newClient) {
      const client: Client = {
        ...newClient,
        id: billData.clientId,
        createdAt: new Date().toISOString(),
        totalBills: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0
      };
      storage.addClient(client);
    }

    const billNo = storage.incrementBillCounter().toString();
    
    const newBill: Bill = {
      id: `bill_${Date.now()}`,
      billNo,
      ...billData,
      paidAmount: 0,
      pendingAmount: billData.totalActual,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    storage.addBill(newBill);

    // Update client totals
    const client = newClient ? 
      storage.getClients().find(c => c.id === billData.clientId) :
      clients.find(c => c.id === billData.clientId);
      
    if (client) {
      storage.updateClient(client.id, {
        totalBills: client.totalBills + 1,
        totalAmount: client.totalAmount + billData.totalActual,
        pendingAmount: client.pendingAmount + billData.totalActual
      });
    }

    refreshData();
    navigate('/bills');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <BillForm
      clients={clients}
      onSubmit={handleCreateBill}
      onCancel={handleCancel}
    />
  );
};

function App() {
  const { isLoggedIn, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={login} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout onLogout={logout} />}>
          <Route index element={<Dashboard />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="bills" element={<BillList />} />
          <Route path="new-bill" element={<NewBillPage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;