import { Client, Bill } from '../types';

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? '' : String(value);
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportClientData = (client: Client, bills: Bill[]) => {
  const clientData = [{
    'Client Name': client.name,
    'Address': client.address,
    'Phone': client.phone,
    'Email': client.email,
    'Total Bills': client.totalBills,
    'Total Amount': client.totalAmount,
    'Paid Amount': client.paidAmount,
    'Pending Amount': client.pendingAmount,
    'Created Date': new Date(client.createdAt).toLocaleDateString()
  }];

  const billsData = bills.map(bill => ({
    'Bill No': bill.billNo,
    'Date': new Date(bill.date).toLocaleDateString(),
    'Total Amount': bill.totalAmount,
    'Paid Amount': bill.paidAmount,
    'Pending Amount': bill.pendingAmount,
    'Status': bill.status,
    'Items Count': bill.items.length
  }));

  exportToCSV([...clientData, ...billsData], `${client.name}_data`);
};