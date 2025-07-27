import { Client, Bill, Payment, CompanySettings } from '../types';
import { cloudStorage } from './cloudStorage';

const STORAGE_KEYS = {
  clients: 'transport_clients',
  bills: 'transport_bills',
  payments: 'transport_payments',
  settings: 'transport_settings',
  billCounter: 'transport_bill_counter',
  isLoggedIn: 'transport_logged_in',
  cloudConfig: 'transport_cloud_config'
};

// Auto-save to cloud after data changes
const autoSaveToCloud = async () => {
  if (cloudStorage.isConfigured()) {
    const data = {
      clients: storage.getClients(),
      bills: storage.getBills(),
      payments: storage.getPayments(),
      settings: storage.getSettings(),
      billCounter: storage.getBillCounter()
    };
    await cloudStorage.saveData(data);
  }
};

export const storage = {
  // Authentication
  setLoggedIn: (status: boolean) => {
    localStorage.setItem(STORAGE_KEYS.isLoggedIn, JSON.stringify(status));
  },
  
  getLoggedIn: (): boolean => {
    const status = localStorage.getItem(STORAGE_KEYS.isLoggedIn);
    return status ? JSON.parse(status) : false;
  },

  // Clients
  getClients: (): Client[] => {
    const clients = localStorage.getItem(STORAGE_KEYS.clients);
    return clients ? JSON.parse(clients) : [];
  },

  setClients: (clients: Client[]) => {
    localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
  },

  addClient: (client: Client) => {
    const clients = storage.getClients();
    clients.unshift(client);
    storage.setClients(clients);
    autoSaveToCloud();
  },

  updateClient: (clientId: string, updates: Partial<Client>) => {
    const clients = storage.getClients();
    const index = clients.findIndex(c => c.id === clientId);
    if (index !== -1) {
      clients[index] = { ...clients[index], ...updates };
      storage.setClients(clients);
      autoSaveToCloud();
    }
  },

  // Bills
  getBills: (): Bill[] => {
    const bills = localStorage.getItem(STORAGE_KEYS.bills);
    return bills ? JSON.parse(bills) : [];
  },

  setBills: (bills: Bill[]) => {
    localStorage.setItem(STORAGE_KEYS.bills, JSON.stringify(bills));
  },

  addBill: (bill: Bill) => {
    const bills = storage.getBills();
    bills.unshift(bill);
    storage.setBills(bills);
    autoSaveToCloud();
  },

  updateBill: (billId: string, updates: Partial<Bill>) => {
    const bills = storage.getBills();
    const index = bills.findIndex(b => b.id === billId);
    if (index !== -1) {
      bills[index] = { ...bills[index], ...updates };
      storage.setBills(bills);
      autoSaveToCloud();
    }
  },

  deleteBill: (billId: string) => {
    const bills = storage.getBills();
    const filteredBills = bills.filter(b => b.id !== billId);
    storage.setBills(filteredBills);
    autoSaveToCloud();
  },

  getBillCounter: (): number => {
    const counter = localStorage.getItem(STORAGE_KEYS.billCounter);
    return counter ? parseInt(counter) : 1000;
  },

  incrementBillCounter: (): number => {
    const current = storage.getBillCounter();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEYS.billCounter, next.toString());
    return next;
  },

  // Payments
  getPayments: (): Payment[] => {
    const payments = localStorage.getItem(STORAGE_KEYS.payments);
    return payments ? JSON.parse(payments) : [];
  },

  setPayments: (payments: Payment[]) => {
    localStorage.setItem(STORAGE_KEYS.payments, JSON.stringify(payments));
  },

  addPayment: (payment: Payment) => {
    const payments = storage.getPayments();
    payments.unshift(payment);
    storage.setPayments(payments);
    autoSaveToCloud();
  },

  // Settings
  getSettings: (): CompanySettings => {
    const settings = localStorage.getItem(STORAGE_KEYS.settings);
    return settings ? JSON.parse(settings) : {
      name: 'Khodiyar Enterprise',
      address: 'Transport Company Address',
      phone: '+91 98765 43210',
      phone2: '+91 98765 43211',
      email: 'info@khodiyarenterprise.com',
      panNo: 'ABCDE1234F',
      bankName: 'State Bank of India',
      accountNo: '1234567890',
      ifscCode: 'SBIN0001234',
      bankBranch: 'Main Branch',
      proprietor: 'Proprietor Name'
    };
  },

  setSettings: (settings: CompanySettings) => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    autoSaveToCloud();
  },

  // Cloud storage configuration
  getCloudConfig: () => {
    const config = localStorage.getItem(STORAGE_KEYS.cloudConfig);
    return config ? JSON.parse(config) : null;
  },

  setCloudConfig: (config: any) => {
    localStorage.setItem(STORAGE_KEYS.cloudConfig, JSON.stringify(config));
  },

  // Load data from cloud
  loadFromCloud: async () => {
    try {
      const data = await cloudStorage.loadData();
      if (data) {
        if (data.clients) storage.setClients(data.clients);
        if (data.bills) storage.setBills(data.bills);
        if (data.payments) storage.setPayments(data.payments);
        if (data.settings) storage.setSettings(data.settings);
        if (data.billCounter) localStorage.setItem(STORAGE_KEYS.billCounter, data.billCounter.toString());
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load from cloud:', error);
      return false;
    }
  }
};