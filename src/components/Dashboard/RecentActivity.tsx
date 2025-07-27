import React from 'react';
import { Client, Bill, Payment } from '../../types';
import { Calendar, User, FileText, CreditCard } from 'lucide-react';

interface RecentActivityProps {
  recentClients: Client[];
  recentBills: Bill[];
  recentPayments: Payment[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  recentClients,
  recentBills,
  recentPayments
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Recent Clients */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <User className="mr-2 text-blue-600" size={20} />
          Recent Clients
        </h3>
        <div className="space-y-3">
          {recentClients.slice(0, 5).map((client) => (
            <div key={client.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{client.name}</p>
                <p className="text-sm text-gray-500">{client.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">₹{client.paidAmount}</p>
                <p className="text-xs text-gray-500">Paid</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="mr-2 text-green-600" size={20} />
          Recent Bills
        </h3>
        <div className="space-y-3">
          {recentBills.slice(0, 5).map((bill) => (
            <div key={bill.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">#{bill.billNo}</p>
                <p className="text-sm text-gray-500">{bill.clientName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-600">₹{bill.totalActual}</p>
                <p className={`text-xs ${
                  bill.status === 'paid' ? 'text-green-600' : 
                  bill.status === 'partial' ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {bill.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <CreditCard className="mr-2 text-purple-600" size={20} />
          Recent Payments
        </h3>
        <div className="space-y-3">
          {recentPayments.slice(0, 5).map((payment) => (
            <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">₹{payment.amount}</p>
                <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <Calendar className="text-gray-400" size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;