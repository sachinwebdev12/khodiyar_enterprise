import { Bill, Payment, Client } from '../types';
import { storage } from './storage';

export const processPayment = (clientId: string, amount: number, date: string, description: string) => {
  const bills = storage.getBills().filter(b => b.clientId === clientId && b.pendingAmount > 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let remainingAmount = amount;
  const payments: Payment[] = [];
  const updatedBills: Bill[] = [];

  for (const bill of bills) {
    if (remainingAmount <= 0) break;

    const paymentForThisBill = Math.min(remainingAmount, bill.pendingAmount);
    
    const payment: Payment = {
      id: `payment_${Date.now()}_${Math.random()}`,
      clientId,
      billId: bill.id,
      amount: paymentForThisBill,
      date,
      description,
      createdAt: new Date().toISOString()
    };

    payments.push(payment);
    storage.addPayment(payment);

    const updatedBill = {
      ...bill,
      paidAmount: bill.paidAmount + paymentForThisBill,
      pendingAmount: bill.pendingAmount - paymentForThisBill,
      status: (bill.pendingAmount - paymentForThisBill) === 0 ? 'paid' as const : 'partial' as const
    };

    updatedBills.push(updatedBill);
    storage.updateBill(bill.id, updatedBill);

    remainingAmount -= paymentForThisBill;
  }

  // Update client totals
  const client = storage.getClients().find(c => c.id === clientId);
  if (client) {
    storage.updateClient(clientId, {
      paidAmount: client.paidAmount + amount,
      pendingAmount: client.pendingAmount - amount
    });
  }

  return { payments, updatedBills, remainingAmount };
};