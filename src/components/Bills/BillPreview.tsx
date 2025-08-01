import React, { useRef } from 'react';
import { Download, FileImage, Printer, X } from 'lucide-react';
import { Bill, CompanySettings } from '../../types';
import { downloadBillPDF, generateBillImage } from '../../utils/pdf';

interface BillPreviewProps {
  bill: Bill;
  settings: CompanySettings;
  onClose: () => void;
}

const BillPreview: React.FC<BillPreviewProps> = ({ bill, settings, onClose }) => {
  const billRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    await downloadBillPDF(bill, settings);
  };

  const handleDownloadImage = async () => {
    if (billRef.current) {
      await generateBillImage(billRef.current);
    }
  };

  const handlePrint = () => {
    const printContent = billRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Bill ${bill.billNo}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .bill-container { max-width: 800px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #dc3545; padding: 8px; text-align: left; font-size: 12px; }
            .header { background-color: #dc3545; color: white; text-align: center; padding: 20px; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .company-subtitle { font-size: 12px; }
            .company-details { text-align: center; padding: 10px; font-size: 10px; }
            .bill-info { display: flex; justify-content: space-between; padding: 10px; }
            .footer { display: flex; justify-content: space-between; padding: 20px; font-size: 10px; }
            .total { text-align: right; font-weight: bold; font-size: 14px; padding: 10px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-auto">
        {/* Header with actions */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold">Bill Preview - {bill.billNo}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadImage}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FileImage size={16} />
              <span>Download Bill</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Bill Content */}
        <div ref={billRef} className="p-8 bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
          <div className="max-w-4xl mx-auto" style={{ border: '2px solid #dc3545' }}>
            {/* Header */}
            <div className="text-center p-6" style={{ borderBottom: '2px solid #dc3545' }}>
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#dc3545', fontFamily: 'Arial, sans-serif' }}>
                KHODIYAR ENTERPRISE
              </h1>
              <p className="text-base font-medium mb-3" style={{ color: '#000' }}>
                TRANSPORT CONTRACTOR AND COMMISSION AGENT
              </p>
              <div className="text-sm space-y-1" style={{ color: '#000' }}>
                <p>{settings.address}</p>
                <p>Mobile: {settings.phone}{settings.phone2 ? `, ${settings.phone2}` : ''}</p>
                <p>PAN No: {settings.panNo}</p>
              </div>
            </div>

            {/* Bill Info */}
            <div className="flex justify-between p-4" style={{ borderBottom: '1px solid #dc3545' }}>
              <div>
                <p className="mb-2" style={{ fontSize: '14px', color: '#000' }}>
                  <strong>Bill No:</strong> {bill.billNo}
                </p>
                <p style={{ fontSize: '14px', color: '#000' }}>
                  <strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="mb-2" style={{ fontSize: '14px', color: '#000' }}>
                  <strong>M/s:</strong> {bill.clientName}
                </p>
                <p style={{ fontSize: '12px', color: '#000', maxWidth: '200px' }}>
                  <strong>Address:</strong> {bill.clientAddress}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ borderBottom: '1px solid #dc3545' }}>
                    <th className="p-3 text-left text-sm font-medium" style={{ borderRight: '1px solid #dc3545', color: '#000' }}>Date</th>
                    <th className="p-3 text-left text-sm font-medium" style={{ borderRight: '1px solid #dc3545', color: '#000' }}>Vehicle No</th>
                    <th className="p-3 text-left text-sm font-medium" style={{ borderRight: '1px solid #dc3545', color: '#000' }}>LR No</th>
                    <th className="p-3 text-left text-sm font-medium" style={{ borderRight: '1px solid #dc3545', color: '#000' }}>Particulars</th>
                    <th className="p-3 text-left text-sm font-medium" style={{ borderRight: '1px solid #dc3545', color: '#000' }}>Qty</th>
                    <th className="border-r border-red-600 p-2 text-left text-xs">Rate</th>
                    <th className="border-r border-red-600 p-2 text-left text-xs">Amount</th>
                    <th className="border-r border-red-600 p-2 text-left text-xs">Advance</th>
                    <th className="p-2 text-left text-xs">Actual</th>
                  </tr>
                </thead>
                <tbody>
                  {bill.items.map((item, index) => (
                    <tr key={index} className="border-b border-red-600">
                      <td className="p-3 text-sm" style={{ borderRight: '1px solid #dc3545', borderBottom: '1px solid #dc3545', color: '#000' }}>
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-sm" style={{ borderRight: '1px solid #dc3545', borderBottom: '1px solid #dc3545', color: '#000' }}>
                        {item.vehicleNo}
                      </td>
                      <td className="p-3 text-sm" style={{ borderRight: '1px solid #dc3545', borderBottom: '1px solid #dc3545', color: '#000' }}>
                        {item.lrNo}
                      </td>
                      <td className="p-3 text-sm" style={{ borderRight: '1px solid #dc3545', borderBottom: '1px solid #dc3545', color: '#000' }}>
                        {item.particulars}
                      </td>
                      <td className="p-3 text-sm" style={{ borderRight: '1px solid #dc3545', borderBottom: '1px solid #dc3545', color: '#000' }}>
                        {item.qty}
                      </td>
                      <td className="border-r border-red-600 p-2 text-xs text-right">{item.rate}</td>
                      <td className="border-r border-red-600 p-2 text-xs text-right">{item.amount}</td>
                      <td className="border-r border-red-600 p-2 text-xs text-right">{item.advance}</td>
                      <td className="p-2 text-xs text-right font-medium">{item.actual}</td>
                    </tr>
                  ))}
                  {/* Empty rows for formatting */}
                  {Array.from({ length: Math.max(0, 5 - bill.items.length) }).map((_, index) => (
                    <tr key={`empty-${index}`} style={{ borderBottom: '1px solid #dc3545' }}>
                      <td className="p-3" style={{ borderRight: '1px solid #dc3545' }}>&nbsp;</td>
                      <td className="p-3" style={{ borderRight: '1px solid #dc3545' }}>&nbsp;</td>
                      <td className="p-3" style={{ borderRight: '1px solid #dc3545' }}>&nbsp;</td>
                      <td className="p-3" style={{ borderRight: '1px solid #dc3545' }}>&nbsp;</td>
                      <td className="p-3" style={{ borderRight: '1px solid #dc3545' }}>&nbsp;</td>
                      <td className="border-r border-red-600 p-2 text-xs">&nbsp;</td>
                      <td className="border-r border-red-600 p-2 text-xs">&nbsp;</td>
                      <td className="border-r border-red-600 p-2 text-xs">&nbsp;</td>
                      <td className="p-2 text-xs">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-4" style={{ borderBottom: '1px solid #dc3545' }}>
              <div className="flex justify-end">
                <div className="text-right" style={{ 
                  fontSize: '18px', fontWeight: 'bold', color: '#000' 
                }}>
                  <p className="text-lg font-bold">Total: ₹{bill.totalActual}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between p-4">
              <div style={{ fontSize: '12px', color: '#000' }}>
                <p><strong>Bank Details:</strong></p>
                <p>Bank: {settings.bankName}</p>
                <p>A/c No: {settings.accountNo}</p>
                <p>IFSC: {settings.ifscCode}</p>
                <p>Branch: {settings.bankBranch}</p>
              </div>
              <div className="text-right" style={{ fontSize: '12px', color: '#000' }}>
                <p>For {settings.name}</p>
                <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Signature space */}
                </div>
                <p>{settings.proprietor}</p>
                <p>Proprietor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPreview;