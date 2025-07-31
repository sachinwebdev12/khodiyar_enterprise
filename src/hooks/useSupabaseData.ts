import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Client, Bill, Payment, CompanySettings, DashboardStats } from '../types';

export const useSupabaseData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load clients
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // Load bills
      const { data: billsData, error: billsError } = await supabase
        .from('bills')
        .select('*')
        .order('created_at', { ascending: false });

      if (billsError) throw billsError;

      // Load payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      // Load settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsError && settingsError.code !== 'PGRST116') {
        throw settingsError;
      }

      // Transform data to match existing types
      const transformedClients: Client[] = clientsData?.map(client => ({
        id: client.id,
        name: client.name,
        address: client.address,
        phone: client.phone,
        email: client.email,
        createdAt: client.created_at,
        totalBills: client.total_bills,
        totalAmount: client.total_amount,
        paidAmount: client.paid_amount,
        pendingAmount: client.pending_amount
      })) || [];

      const transformedBills: Bill[] = billsData?.map(bill => ({
        id: bill.id,
        billNo: bill.bill_no,
        clientId: bill.client_id,
        clientName: bill.client_name,
        clientAddress: bill.client_address,
        date: bill.date,
        items: bill.items,
        totalAmount: bill.total_amount,
        totalAdvance: bill.total_advance,
        totalActual: bill.total_actual,
        paidAmount: bill.paid_amount,
        pendingAmount: bill.pending_amount,
        status: bill.status,
        createdAt: bill.created_at
      })) || [];

      const transformedPayments: Payment[] = paymentsData?.map(payment => ({
        id: payment.id,
        clientId: payment.client_id,
        billId: payment.bill_id,
        amount: payment.amount,
        date: payment.date,
        description: payment.description,
        createdAt: payment.created_at
      })) || [];

      const transformedSettings: CompanySettings = settingsData ? {
        name: settingsData.name,
        address: settingsData.address,
        phone: settingsData.phone,
        phone2: settingsData.phone2,
        email: settingsData.email,
        panNo: settingsData.pan_no,
        bankName: settingsData.bank_name,
        accountNo: settingsData.account_no,
        ifscCode: settingsData.ifsc_code,
        bankBranch: settingsData.bank_branch,
        proprietor: settingsData.proprietor,
        logo: settingsData.logo
      } : {
        name: 'Khodiyar Enterprise',
        address: 'Transport Company Address',
        phone: '+91 98765 43210',
        phone2: '',
        email: 'info@khodiyarenterprise.com',
        panNo: 'ABCDE1234F',
        bankName: 'State Bank of India',
        accountNo: '1234567890',
        ifscCode: 'SBIN0001234',
        bankBranch: 'Main Branch',
        proprietor: 'Proprietor Name'
      };

      setClients(transformedClients);
      setBills(transformedBills);
      setPayments(transformedPayments);
      setSettings(transformedSettings);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
  };

  const addClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'totalBills' | 'totalAmount' | 'paidAmount' | 'pendingAmount'>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          address: clientData.address,
          phone: clientData.phone,
          email: clientData.email
        });

      if (error) throw error;
      await refreshData();
    } catch (err) {
      console.error('Error adding client:', err);
      throw err;
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: updates.name,
          address: updates.address,
          phone: updates.phone,
          email: updates.email,
          total_bills: updates.totalBills,
          total_amount: updates.totalAmount,
          paid_amount: updates.paidAmount,
          pending_amount: updates.pendingAmount
        })
        .eq('id', clientId);

      if (error) throw error;
      await refreshData();
    } catch (err) {
      console.error('Error updating client:', err);
      throw err;
    }
  };

  const addBill = async (billData: Omit<Bill, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('bills')
        .insert({
          bill_no: billData.billNo,
          client_id: billData.clientId,
          client_name: billData.clientName,
          client_address: billData.clientAddress,
          date: billData.date,
          items: billData.items,
          total_amount: billData.totalAmount,
          total_advance: billData.totalAdvance,
          total_actual: billData.totalActual,
          paid_amount: billData.paidAmount,
          pending_amount: billData.pendingAmount,
          status: billData.status
        });

      if (error) throw error;
      await refreshData();
    } catch (err) {
      console.error('Error adding bill:', err);
      throw err;
    }
  };

  const updateBill = async (billId: string, updates: Partial<Bill>) => {
    try {
      const { error } = await supabase
        .from('bills')
        .update({
          bill_no: updates.billNo,
          client_id: updates.clientId,
          client_name: updates.clientName,
          client_address: updates.clientAddress,
          date: updates.date,
          items: updates.items,
          total_amount: updates.totalAmount,
          total_advance: updates.totalAdvance,
          total_actual: updates.totalActual,
          paid_amount: updates.paidAmount,
          pending_amount: updates.pendingAmount,
          status: updates.status
        })
        .eq('id', billId);

      if (error) throw error;
      await refreshData();
    } catch (err) {
      console.error('Error updating bill:', err);
      throw err;
    }
  };

  const deleteBill = async (billId: string) => {
    try {
      const { error } = await supabase
        .from('bills')
        .delete()
        .eq('id', billId);

      if (error) throw error;
      await refreshData();
    } catch (err) {
      console.error('Error deleting bill:', err);
      throw err;
    }
  };

  const addPayment = async (paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          client_id: paymentData.clientId,
          bill_id: paymentData.billId,
          amount: paymentData.amount,
          date: paymentData.date,
          description: paymentData.description
        });

      if (error) throw error;
      await refreshData();
    } catch (err) {
      console.error('Error adding payment:', err);
      throw err;
    }
  };

  const updateSettings = async (settingsData: CompanySettings) => {
    try {
      const { error } = await supabase
        .from('company_settings')
        .upsert({
          name: settingsData.name,
          address: settingsData.address,
          phone: settingsData.phone,
          phone2: settingsData.phone2,
          email: settingsData.email,
          pan_no: settingsData.panNo,
          bank_name: settingsData.bankName,
          account_no: settingsData.accountNo,
          ifsc_code: settingsData.ifscCode,
          bank_branch: settingsData.bankBranch,
          proprietor: settingsData.proprietor,
          logo: settingsData.logo
        });

      if (error) throw error;
      await refreshData();
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    }
  };

  const getNextBillNumber = async (): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('bill_counter')
        .select('counter')
        .limit(1)
        .single();

      if (error) throw error;

      const nextCounter = (data?.counter || 1000) + 1;

      const { error: updateError } = await supabase
        .from('bill_counter')
        .update({ counter: nextCounter })
        .eq('id', data?.id || '');

      if (updateError) throw updateError;

      return nextCounter.toString();
    } catch (err) {
      console.error('Error getting next bill number:', err);
      return Date.now().toString();
    }
  };

  const getDashboardStats = (): DashboardStats => {
    const totalClients = clients.length;
    const totalBills = bills.length;
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
    const pendingAmount = bills.reduce((sum, bill) => sum + bill.pendingAmount, 0);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthRevenue = payments
      .filter(p => {
        const paymentDate = new Date(p.date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    const recentClients = clients.slice(0, 5);
    const recentBills = bills.slice(0, 5);
    const recentPayments = payments.slice(0, 5);

    return {
      totalClients,
      totalBills,
      totalRevenue,
      pendingAmount,
      thisMonthRevenue,
      recentClients,
      recentBills,
      recentPayments
    };
  };

  return {
    clients,
    bills,
    payments,
    settings,
    loading,
    error,
    refreshData,
    addClient,
    updateClient,
    addBill,
    updateBill,
    deleteBill,
    addPayment,
    updateSettings,
    getNextBillNumber,
    getDashboardStats
  };
};