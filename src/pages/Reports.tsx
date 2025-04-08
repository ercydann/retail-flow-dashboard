
import React, { useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import ReportGenerator from '../components/reports/ReportGenerator';
import SalesReport, { SaleRecord } from '../components/reports/SalesReport';
import InventoryReport from '../components/reports/InventoryReport';
import { ItemWithId } from '../components/inventory/AddItemForm';
import { toast } from 'sonner';

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<{
    type: string;
    startDate: Date;
    endDate: Date;
    generated: boolean;
  }>({
    type: '',
    startDate: new Date(),
    endDate: new Date(),
    generated: false,
  });
  
  // Mock data for demonstration
  const mockSales: SaleRecord[] = [
    {
      id: '1',
      date: new Date(2023, 3, 25),
      customerName: 'John Doe',
      items: ['Laptop', 'Headphones'],
      quantity: 2,
      totalAmount: 83500,
    },
    {
      id: '2',
      date: new Date(2023, 3, 24),
      customerName: 'Jane Smith',
      items: ['Smartphone'],
      quantity: 1,
      totalAmount: 45000,
    },
    {
      id: '3',
      date: new Date(2023, 3, 24),
      customerName: 'Mike Johnson',
      items: ['Mouse', 'Keyboard'],
      quantity: 2,
      totalAmount: 8000,
    },
    {
      id: '4',
      date: new Date(2023, 3, 23),
      customerName: 'Sarah Williams',
      items: ['Monitor'],
      quantity: 1,
      totalAmount: 28000,
    },
    {
      id: '5',
      date: new Date(2023, 3, 23),
      customerName: '',
      items: ['USB-C Cable', 'HDMI Adapter', 'External SSD'],
      quantity: 3,
      totalAmount: 15700,
    },
    {
      id: '6',
      date: new Date(2023, 3, 22),
      customerName: 'David Brown',
      items: ['Tablet', 'Keyboard Case'],
      quantity: 2,
      totalAmount: 42000,
    },
  ];
  
  const mockInventory: ItemWithId[] = [
    {
      id: '1',
      name: 'Laptop',
      price: 75000,
      stock: 15,
      vat: 16,
      category: 'Electronics'
    },
    {
      id: '2',
      name: 'Smartphone',
      price: 45000,
      stock: 22,
      vat: 16,
      category: 'Electronics'
    },
    {
      id: '3',
      name: 'USB-C Cable',
      price: 1200,
      stock: 3,
      vat: 16,
      category: 'Accessories'
    },
    {
      id: '4',
      name: 'Wireless Mouse',
      price: 2500,
      stock: 2,
      vat: 16,
      category: 'Accessories'
    },
    {
      id: '5',
      name: 'External SSD',
      price: 12000,
      stock: 8,
      vat: 16,
      category: 'Storage'
    },
    {
      id: '6',
      name: 'Headphones',
      price: 8500,
      stock: 12,
      vat: 16,
      category: 'Audio'
    },
    {
      id: '7',
      name: 'Monitor',
      price: 28000,
      stock: 6,
      vat: 16,
      category: 'Electronics'
    },
    {
      id: '8',
      name: 'Keyboard',
      price: 5500,
      stock: 10,
      vat: 16,
      category: 'Accessories'
    },
    {
      id: '9',
      name: 'HDMI Adapter',
      price: 2500,
      stock: 4,
      vat: 16,
      category: 'Accessories'
    },
  ];
  
  const generateReport = (type: string, startDate: Date, endDate: Date) => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setReportData({
        type,
        startDate,
        endDate,
        generated: true,
      });
      
      setIsGenerating(false);
      toast.success('Report generated successfully');
    }, 1500);
  };
  
  const renderReport = () => {
    if (!reportData.generated) return null;
    
    switch (reportData.type) {
      case 'daily-sales':
        return (
          <SalesReport
            sales={mockSales}
            startDate={reportData.startDate}
            endDate={reportData.endDate}
            type="daily-sales"
          />
        );
      case 'low-stock':
        return (
          <InventoryReport
            items={mockInventory}
            startDate={reportData.startDate}
            endDate={reportData.endDate}
            type="low-stock"
          />
        );
      case 'inventory':
        return (
          <InventoryReport
            items={mockInventory}
            startDate={reportData.startDate}
            endDate={reportData.endDate}
            type="inventory"
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-1">
          <ReportGenerator
            onGenerateReport={generateReport}
            isGenerating={isGenerating}
          />
        </div>
        
        <div className="lg:col-span-2">
          {isGenerating ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p>Generating report...</p>
              </div>
            </div>
          ) : (
            reportData.generated ? (
              <div className="print:pt-8">{renderReport()}</div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px] text-center p-6 border rounded-lg">
                <div>
                  <h3 className="text-lg font-medium mb-2">No Report Generated</h3>
                  <p className="text-muted-foreground">
                    Select a report type and date range, then click "Generate Report" to view data.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
