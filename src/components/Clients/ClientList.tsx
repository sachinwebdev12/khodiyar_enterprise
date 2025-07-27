import React, { useState } from 'react';
import { Plus, Search, Eye, CreditCard, Download, Edit } from 'lucide-react';
import { Client } from '../../types';
import { storage } from '../../utils/storage';
import { useData } from '../../hooks/useData';
import { processPayment } from '../../utils/payments';
import { exportClientData } from '../../utils/export';
import ClientForm from './ClientForm';
import PaymentForm from './PaymentForm';

const ClientList: React.FC = () => {
  const { clients, bills, refreshData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showClientForm, setShowClientForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleAddClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'totalBills' | 'totalAmount' | 'paidAmount' | 'pendingAmount'>) => {
    if (editingClient) {
      // Update existing client
      storage.updateClient(editingClient.id, clientData);
    } else {
      // Add new client
      const newClient: Client = {
        ...clientData,
        id: `client_${Date.now()}`,
        createdAt: new Date().toISOString(),
        totalBills: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0
      };
      storage.addClient(newClient);
    }
    refreshData();
    setShowClientForm(false);
    setEditingClient(null);
  };

  const handleAddPayment = (amount: number, date: string, description: string) => {
    if (selectedClient) {
      processPayment(selectedClient.id, amount, date, description);
      refreshData();
      setShowPaymentForm(false);
      setSelectedClient(null);
    }
  };

  const handleExportClient = (client: Client) => {
    const clientBills = bills.filter(b => b.clientId === client.id);
    exportClientData(client, clientBills);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={() => setShowClientForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search clients by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Contact
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Bills
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-xs md:text-sm font-medium text-gray-900">{client.name}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{client.phone}</div>
                      <div className="text-xs text-gray-500 hidden md:block">{client.address}</div>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-xs md:text-sm text-gray-900">{client.phone}</div>
                    <div className="text-xs text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900 hidden md:table-cell">
                    {client.totalBills}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">
                    ₹{client.totalAmount.toLocaleString()}
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      client.pendingAmount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      ₹{client.pendingAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                      <button
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                        title="View Bills"
                      >
                        <Eye size={14} />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClient(client);
                          setShowPaymentForm(true);
                        }}
                        className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 transition-colors flex items-center justify-center space-x-1"
                        title="Add Payment"
                      >
                        <CreditCard size={14} />
                        <span className="hidden sm:inline">Pay</span>
                      </button>
                      <button
                        onClick={() => handleExportClient(client)}
                        className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs hover:bg-purple-200 transition-colors flex items-center justify-center space-x-1"
                        title="Export Data"
                      >
                        <Download size={14} />
                        <span className="hidden sm:inline">Export</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setShowClientForm(true);
                        }}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                        title="Edit Client"
                      >
                        <Edit size={14} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Form Modal */}
      {showClientForm && (
        <ClientForm
          onSubmit={handleAddClient}
          onClose={() => {
            setShowClientForm(false);
            setEditingClient(null);
          }}
          initialData={editingClient || undefined}
        />
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && selectedClient && (
        <PaymentForm
          clientName={selectedClient.name}
          pendingAmount={selectedClient.pendingAmount}
          onSubmit={handleAddPayment}
          onClose={() => {
            setShowPaymentForm(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
};

export default ClientList;