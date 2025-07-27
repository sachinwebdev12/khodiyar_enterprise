import { Bill, CompanySettings } from '../types';

export const generateBillPDF = async (bill: Bill, settings: CompanySettings) => {
  // Import jsPDF dynamically
  const { jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Set up colors and styles to match the image
  const redColor = [220, 53, 69]; // Bootstrap red color
  
  // Draw outer border
  doc.setDrawColor(...redColor);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Header section with company name
  doc.setFillColor(...redColor);
  doc.rect(10, 10, pageWidth - 20, 35);
  
  doc.setTextColor(255, 255, 255); // White text
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('KHODIYAR ENTERPRISE', pageWidth / 2, 25, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('TRANSPORT CONTRACTOR AND COMMISSION AGENT', pageWidth / 2, 35, { align: 'center' });

  // Reset text color to black
  doc.setTextColor(0, 0, 0);
  
  // Company details section
  doc.setFontSize(9);
  const phoneText = settings.phone2 ? 
    `Mobile: ${settings.phone}, ${settings.phone2}` : 
    `Mobile: ${settings.phone}`;
  
  doc.text(settings.address, pageWidth / 2, 52, { align: 'center' });
  doc.text(phoneText, pageWidth / 2, 59, { align: 'center' });
  doc.text(`PAN No: ${settings.panNo}`, pageWidth / 2, 66, { align: 'center' });

  // Bill details section
  doc.setDrawColor(...redColor);
  doc.setLineWidth(1);
  doc.line(10, 75, pageWidth - 10, 75);

  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text(`Bill No: ${bill.billNo}`, 15, 85);
  doc.text(`Date: ${new Date(bill.date).toLocaleDateString()}`, pageWidth - 70, 85);

  // Client details
  doc.text('M/s:', 15, 100);
  doc.setFont(undefined, 'normal');
  doc.text(bill.clientName, 35, 100);
  
  // Split address into multiple lines if too long
  const addressLines = doc.splitTextToSize(bill.clientAddress, pageWidth - 30);
  let yPos = 107;
  addressLines.forEach((line: string) => {
    doc.text(line, 15, yPos);
    yPos += 7;
  });

  // Table header
  const tableStartY = Math.max(yPos + 10, 125);
  doc.setDrawColor(...redColor);
  doc.setLineWidth(1);
  
  // Draw table border
  doc.rect(10, tableStartY, pageWidth - 20, 20); // Header row
  
  // Column positions
  const cols = [
    { x: 15, width: 25, label: 'Date' },
    { x: 40, width: 25, label: 'Vehicle No' },
    { x: 65, width: 20, label: 'LR No' },
    { x: 85, width: 40, label: 'Particulars' },
    { x: 125, width: 15, label: 'Qty' },
    { x: 140, width: 20, label: 'Rate' },
    { x: 160, width: 20, label: 'Amount' },
    { x: 180, width: 20, label: 'Advance' }
  ];

  // Draw vertical lines for columns
  let currentX = 10;
  cols.forEach((col, index) => {
    if (index > 0) {
      doc.line(currentX, tableStartY, currentX, tableStartY + 20);
    }
    currentX += col.width;
  });
  doc.line(currentX, tableStartY, currentX, tableStartY + 20); // Last vertical line

  // Table headers
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  cols.forEach(col => {
    doc.text(col.label, col.x, tableStartY + 12);
  });

  // Table content
  let currentY = tableStartY + 20;
  doc.setFont(undefined, 'normal');
  
  bill.items.forEach((item) => {
    // Draw row border
    doc.rect(10, currentY, pageWidth - 20, 15);
    
    // Draw vertical lines
    let currentX = 10;
    cols.forEach((col, index) => {
      if (index > 0) {
        doc.line(currentX, currentY, currentX, currentY + 15);
      }
      currentX += col.width;
    });
    doc.line(currentX, currentY, currentX, currentY + 15);

    // Fill data
    doc.text(new Date(item.date).toLocaleDateString(), 15, currentY + 10);
    doc.text(item.vehicleNo, 40, currentY + 10);
    doc.text(item.lrNo || '', 65, currentY + 10);
    
    // Handle long particulars text
    const particularText = item.particulars.length > 20 ? 
      item.particulars.substring(0, 20) + '...' : item.particulars;
    doc.text(particularText, 85, currentY + 10);
    
    doc.text(item.qty.toString(), 125, currentY + 10);
    doc.text(item.rate.toString(), 140, currentY + 10);
    doc.text(item.amount.toString(), 160, currentY + 10);
    doc.text(item.advance.toString(), 180, currentY + 10);
    
    currentY += 15;
  });

  // Add empty rows to match the format
  const emptyRows = Math.max(0, 8 - bill.items.length);
  for (let i = 0; i < emptyRows; i++) {
    doc.rect(10, currentY, pageWidth - 20, 15);
    
    let currentX = 10;
    cols.forEach((col, index) => {
      if (index > 0) {
        doc.line(currentX, currentY, currentX, currentY + 15);
      }
      currentX += col.width;
    });
    doc.line(currentX, currentY, currentX, currentY + 15);
    
    currentY += 15;
  }

  // Total section
  currentY += 10;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.text(`Total: ₹${bill.totalActual.toLocaleString()}`, pageWidth - 50, currentY);

  // Footer section
  currentY += 20;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  
  // Bank details (left side)
  doc.text('Bank Details:', 15, currentY);
  doc.text(`Bank: ${settings.bankName}`, 15, currentY + 7);
  doc.text(`A/c No: ${settings.accountNo}`, 15, currentY + 14);
  doc.text(`IFSC: ${settings.ifscCode}`, 15, currentY + 21);
  doc.text(`Branch: ${settings.bankBranch}`, 15, currentY + 28);

  // Signature section (right side)
  doc.text(`For ${settings.name}`, pageWidth - 70, currentY);
  doc.text(settings.proprietor, pageWidth - 70, currentY + 35);
  doc.text('Proprietor', pageWidth - 70, currentY + 42);

  return doc;
};

export const downloadBillPDF = async (bill: Bill, settings: CompanySettings) => {
  const doc = await generateBillPDF(bill, settings);
  doc.save(`Bill_${bill.billNo}.pdf`);
};

export const downloadBillAsPDF = async (billElement: HTMLElement, billNo: string) => {
  const { jsPDF } = await import('jspdf');
  const html2canvas = (await import('html2canvas')).default;

  const canvas = await html2canvas(billElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: true,
    width: billElement.scrollWidth,
    height: billElement.scrollHeight,
    windowWidth: billElement.scrollWidth,
    windowHeight: billElement.scrollHeight,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`Bill_${billNo}.pdf`);
};

