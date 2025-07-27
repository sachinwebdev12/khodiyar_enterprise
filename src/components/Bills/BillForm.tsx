import React, { useState } from 'react';
import { Plus, Minus, Save } from 'lucide-react';
import { BillItem, Client, Bill } from '../../types';
import { storage } from '../../utils/storage';

interface BillFormProps {
  clients: Client[];
  onSubmit: (billData: any, newClient?: Omit<Client, 'id' | 'createdAt' | 'totalBills' | 'totalAmount' | 'paidAmount' | 'pendingAmount'>) => void;
  onCancel: () => void;
  editingBill?: Bill;
}

const BillForm: React.FC<BillFormProps> = ({ clients, onSubmit, onCancel, editingBill }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    editingBill ? clients.find(c => c.id === editingBill.clientId) || null : null
  );
  const [clientSearch, setClientSearch] = useState(editingBill?.clientName || '');
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [clientAddress, setClientAddress] = useState(editingBill?.clientAddress || '');
  const [billDate, setBillDate] = useState(editingBill?.date || new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<Omit<BillItem, 'id' | 'amount' | 'actual'>[]>(
    editingBill?.items.map(item => ({
      date: item.date,
      vehicleNo: item.vehicleNo,
      lrNo: item.lrNo,
      particulars: item.particulars,
      qty: item.qty,
      rate: item.rate,
      advance: item.advance
    })) || [
    {
      date: new Date().toISOString().split('T')[0],
      vehicleNo: '',
      lrNo: '',
      particulars: '',
      qty: 1,
      rate: 0,
      advance: 0
    }
  ]
  );

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientSearch(client.name);
    setClientAddress(client.address);
    setShowClientSuggestions(false);
  };

  const handleAddItem = () => {
    setItems([...items, {
      date: new Date().toISOString().split('T')[0],
      vehicleNo: '',
      lrNo: '',
      particulars: '',
      qty: 1,
      rate: 0,
      advance: 0
    }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const calculateItemAmount = (qty: number, rate: number) => qty * rate;
  const calculateItemActual = (amount: number, advance: number) => amount - advance;

  const totalAmount = items.reduce((sum, item) => 
    sum + calculateItemAmount(item.qty, item.rate), 0
  );
  
  const totalAdvance = items.reduce((sum, item) => sum + item.advance, 0);
  const totalActual = totalAmount - totalAdvance;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let newClient = null;
    let clientId = selectedClient?.id;
    
    // If no existing client selected but we have a name, create new client
    if (!selectedClient && clientSearch.trim()) {
      newClient = {
        name: clientSearch.trim(),
        address: clientAddress.trim() || 'Address not provided',
        phone: '',
        email: ''
      };
      clientId = `client_${Date.now()}`;
    }
    
    if (!clientId) return;

    const billItems: BillItem[] = items.map((item, index) => ({
      ...item,
      id: `item_${Date.now()}_${index}`,
      amount: calculateItemAmount(item.qty, item.rate),
      actual: calculateItemActual(calculateItemAmount(item.qty, item.rate), item.advance)
    }));

    onSubmit({
      clientId,
      clientName: clientSearch.trim(),
      clientAddress: clientAddress.trim() || 'Address not provided',
      date: billDate,
      items: billItems,
      totalAmount,
      totalAdvance,
      totalActual
    }, newClient);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Create New Bill</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Selection */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setShowClientSuggestions(true);
                    if (!e.target.value) {
                      setSelectedClient(null);
                      setClientAddress('');
                      setShowClientSuggestions(false);
                    }
                  }}
                  onFocus={() => setShowClientSuggestions(true)}
                  onBlur={() => {
                    // Delay hiding to allow click on suggestion
                    setTimeout(() => setShowClientSuggestions(false), 200);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
                  placeholder="Type client name or search existing..."
                  required
                />
                {showClientSuggestions && clientSearch && filteredClients.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                    {filteredClients.slice(0, 5).map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => handleClientSelect(client)}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-gray-500">{client.phone}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Address *
              </label>
              <textarea
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
                placeholder="Enter client address..."
                rows={3}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill Date *
              </label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px]"
                required
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Bill Items</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-xs md:text-sm">
                  <th className="text-left py-2 px-1 md:px-2">Date</th>
                  <th className="text-left py-2 px-1 md:px-2">Vehicle No</th>
                  <th className="text-left py-2 px-1 md:px-2">LR No</th>
                  <th className="text-left py-2 px-1 md:px-2">Particulars</th>
                  <th className="text-left py-2 px-1 md:px-2">Qty</th>
                  <th className="text-left py-2 px-1 md:px-2">Rate</th>
                  <th className="text-left py-2 px-1 md:px-2">Amount</th>
                  <th className="text-left py-2 px-1 md:px-2">Advance</th>
                  <th className="text-left py-2 px-1 md:px-2">Actual</th>
                  <th className="text-left py-2 px-1 md:px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => {
                  const amount = calculateItemAmount(item.qty, item.rate);
                  const actual = calculateItemActual(amount, item.advance);
                  
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 px-1 md:px-2">
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => handleItemChange(index, 'date', e.target.value)}
                          className="w-full p-2 md:p-1 border border-gray-300 rounded text-sm md:text-sm min-h-[40px] md:min-h-auto"
                          required
                        />
                      </td>
                      <td className="py-2 px-1 md:px-2">
                        <input
                          type="text"
                          value={item.vehicleNo}
                          onChange={(e) => handleItemChange(index, 'vehicleNo', e.target.value)}
                          className="w-full p-2 md:p-1 border border-gray-300 rounded text-sm md:text-sm min-h-[40px] md:min-h-auto"
                          placeholder="Vehicle No"
                          required
                        />
                      </td>
                      <td className="py-2 px-1 md:px-2">
                        <input
                          type="text"
                          value={item.lrNo}
                          onChange={(e) => handleItemChange(index, 'lrNo', e.target.value)}
                          className="w-full p-2 md:p-1 border border-gray-300 rounded text-sm md:text-sm min-h-[40px] md:min-h-auto"
                          placeholder="LR No"
                        />
                      </td>
                      <td className="py-2 px-1 md:px-2">
                        <input
                          type="text"
                          value={item.particulars}
                          onChange={(e) => handleItemChange(index, 'particulars', e.target.value)}
                          className="w-full p-2 md:p-1 border border-gray-300 rounded text-sm md:text-sm min-h-[40px] md:min-h-auto"
                          placeholder="Particulars"
                          required
                        />
                      </td>
                      <td className="py-2 px-1 md:px-2">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', parseInt(e.target.value) || 0)}
                          className="w-full p-2 md:p-1 border border-gray-300 rounded text-sm md:text-sm min-h-[40px] md:min-h-auto"
                          min="1"
                          required
                        />
                      </td>
                      <td className="py-2 px-1 md:px-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 md:p-1 border border-gray-300 rounded text-sm md:text-sm min-h-[40px] md:min-h-auto"
                          min="0"
                          required
                        />
                      </td>
                      <td className="py-2 px-1 md:px-2 text-center font-medium text-xs md:text-sm">
                        ₹{amount}
                      </td>
                      <td className="py-2 px-1 md:px-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.advance}
                          onChange={(e) => handleItemChange(index, 'advance', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 md:p-1 border border-gray-300 rounded text-sm md:text-sm min-h-[40px] md:min-h-auto"
                          min="0"
                        />
                      </td>
                      <td className="py-2 px-1 md:px-2 text-center font-medium text-green-600 text-xs md:text-sm">
                        ₹{actual}
                      </td>
                      <td className="py-2 px-1 md:px-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length === 1}
                          className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                        >
                          <Minus size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">₹{totalAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Advance</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">₹{totalAdvance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Actual</p>
                <p className="text-lg md:text-xl font-bold text-green-600">₹{totalActual}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            disabled={!clientSearch.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>{editingBill ? 'Update Bill' : 'Create Bill'}</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillForm;