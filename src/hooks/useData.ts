import { useState, useEffect } from 'react';
import { Client, Bill, Payment, DashboardStats } from '../types';
import { storage } from '../utils/storage';

export const useData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setClients(storage.getClients());
    setBills(storage.getBills());
    setPayments(storage.getPayments());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const refreshData = () => {
    loadData();
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
    loading,
    refreshData,
    getDashboardStats
  };
};