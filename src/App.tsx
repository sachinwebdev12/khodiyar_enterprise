import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useSupabaseData } from './hooks/useSupabaseData';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import ClientList from './components/Clients/ClientList';
import BillList from './components/Bills/BillList';
import BillForm from './components/Bills/BillForm';
import Settings from './components/Settings/Settings';
import { Bill, Client } from './types';
import { useNavigate } from 'react-router-dom';

const NewBillPage: React.FC = () => {
  const { clients, addBill, addClient, getNextBillNumber, refreshData } = useSupabaseData();
  const navigate = useNavigate();

  const handleCreateBill = async (billData: any, newClient?: any) => {
    // If new client was created, add it first
    let clientId = billData.clientId;
    if (newClient) {
      await addClient(newClient);
      // Get the newly created client ID
      clientId = `client_${Date.now()}`;
    }

    const billNo = await getNextBillNumber();
    
    const newBill: Bill = {
      id: `bill_${Date.now()}`,
      billNo,
      clientId,
      ...billData,
      paidAmount: 0,
      pendingAmount: billData.totalActual,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    await addBill(newBill);

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