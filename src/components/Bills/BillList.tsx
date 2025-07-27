import React, { useState } from 'react';
import { Search, Eye, CreditCard, Download, Printer, Edit, Trash2 } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { storage } from '../../utils/storage';
import BillPreview from './BillPreview';
import BillForm from './BillForm';
import PaymentForm from '../Clients/PaymentForm';
import { processPayment } from '../../utils/payments';
import { Bill } from '../../types';

interface BillListProps {
  onEditBill?: (bill: Bill) => void;
}

const BillList: React.FC<BillListProps> = ({ onEditBill }) => {
  const { bills, clients, refreshData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const settings = storage.getSettings();

  const filteredBills = bills.filter(bill =>
    bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPayment = (amount: number, date: string, description: string) => {
    if (selectedBill) {
      processPayment(selectedBill.clientId, amount, date, description);
      refreshData();
      setShowPaymentForm(false);
      setSelectedBill(null);
    }
  };

  const handleEditBill = (billData: any, newClient?: any) => {
    if (!selectedBill) return;

    // If new client was created, add it first
    if (newClient) {
      const client = {
        ...newClient,
        id: `client_${Date.now()}`,
        createdAt: new Date().toISOString(),
        totalBills: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0
      };
      storage.addClient(client);
    }

    // Update the bill
    const updatedBill = {
      ...selectedBill,
      ...billData
    };

    storage.updateBill(selectedBill.id, updatedBill);
    refreshData();
    setShowEditForm(false);
    setSelectedBill(null);
  };

  const handleDeleteBill = (bill: Bill) => {
    if (window.confirm(`Are you sure you want to delete bill #${bill.billNo}?`)) {
      // Update client totals
      const client = clients.find(c => c.id === bill.clientId);
      if (client) {
        storage.updateClient(client.id, {
          totalBills: Math.max(0, client.totalBills - 1),
          totalAmount: Math.max(0, client.totalAmount - bill.totalActual),
          pendingAmount: Math.max(0, client.pendingAmount - bill.pendingAmount)
        });
      }
      
      storage.deleteBill(bill.id);
      refreshData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Bills</h1>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search bills by number or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill No
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Date
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Paid Amount
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm font-medium text-gray-900">#{bill.billNo}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm text-gray-900">{bill.clientName}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden sm:table-cell">
                    {new Date(bill.date).toLocaleDateString()}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                    ₹{bill.totalActual.toLocaleString()}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden md:table-cell">
                    ₹{bill.paidAmount.toLocaleString()}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(bill.status)}`}>
                      {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <button
                        onClick={() => {
                          setSelectedBill(bill);
                          setShowPreview(true);
                        }}
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                        title="View Bill"
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBill(bill);
                          setShowEditForm(true);
                        }}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                        title="Edit Bill"
                      >
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBill(bill);
                          setShowPaymentForm(true);
                        }}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 transition-colors flex items-center justify-center space-x-1"
                        title="Add Payment"
                      >
                        <CreditCard size={14} />
                        <span className="hidden sm:inline">Pay</span>
                      </button>
                     
                      <button
                        onClick={() => handleDeleteBill(bill)}
                        className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors flex items-center justify-center space-x-1"
                        title="Delete Bill"
                      >
                        <Trash2 size={14} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Preview Modal */}
      {showPreview && selectedBill && (
        <BillPreview
          bill={selectedBill}
          settings={settings}
          onClose={() => {
            setShowPreview(false);
            setSelectedBill(null);
          }}
        />
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && selectedBill && (
        <PaymentForm
          clientName={selectedBill.clientName}
          pendingAmount={selectedBill.pendingAmount}
          onSubmit={handleAddPayment}
          onClose={() => {
            setShowPaymentForm(false);
            setSelectedBill(null);
          }}
        />
      )}

      {/* Edit Bill Form Modal */}
      {showEditForm && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-screen overflow-auto">
            <div className="p-4 md:p-6">
              <BillForm
                clients={clients}
                onSubmit={handleEditBill}
                onCancel={() => {
                  setShowEditForm(false);
                  setSelectedBill(null);
                }}
                editingBill={selectedBill}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillList;