export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  totalBills: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

export interface BillItem {
  id: string;
  date: string;
  vehicleNo: string;
  lrNo: string;
  particulars: string;
  qty: number;
  rate: number;
  amount: number;
  advance: number;
  actual: number;
}

export interface Bill {
  id: string;
  billNo: string;
  clientId: string;
  clientName: string;
  clientAddress: string;
  date: string;
  items: BillItem[];
  totalAmount: number;
  totalAdvance: number;
  totalActual: number;
  paidAmount: number;
  pendingAmount: number;
  status: 'pending' | 'paid' | 'partial';
  createdAt: string;
}

export interface Payment {
  id: string;
  clientId: string;
  billId: string;
  amount: number;
  date: string;
  description: string;
  createdAt: string;
}

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  phone2?: string;
  email: string;
  panNo: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  bankBranch: string;
  proprietor: string;
  logo?: string;
}

export interface DashboardStats {
  totalClients: number;
  totalBills: number;
  totalRevenue: number;
  pendingAmount: number;
  thisMonthRevenue: number;
  recentClients: Client[];
  recentBills: Bill[];
  recentPayments: Payment[];
}