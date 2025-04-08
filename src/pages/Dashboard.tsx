
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import StatCard from '../components/dashboard/StatCard';
import SalesChart from '../components/dashboard/SalesChart';
import RecentSales from '../components/dashboard/RecentSales';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import ThemeToggle from '../components/dashboard/ThemeToggle';
import { ShoppingCart, Package, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Mock data for demonstration
  const salesData = [
    { name: 'Mon', sales: 12500 },
    { name: 'Tue', sales: 15000 },
    { name: 'Wed', sales: 17800 },
    { name: 'Thu', sales: 16200 },
    { name: 'Fri', sales: 21000 },
    { name: 'Sat', sales: 24500 },
    { name: 'Sun', sales: 19800 },
  ];
  
  const recentSales = [
    {
      id: '1',
      items: 'Laptop, Headphones',
      amount: 85000,
      customer: 'John Doe',
      timestamp: new Date(2023, 3, 25, 14, 30),
    },
    {
      id: '2',
      items: 'Smartphone',
      amount: 45000,
      customer: 'Jane Smith',
      timestamp: new Date(2023, 3, 25, 13, 15),
    },
    {
      id: '3',
      items: 'Mouse, Keyboard',
      amount: 3500,
      customer: 'Mike Johnson',
      timestamp: new Date(2023, 3, 25, 11, 45),
    },
    {
      id: '4',
      items: 'Monitor',
      amount: 28000,
      customer: 'Sarah Williams',
      timestamp: new Date(2023, 3, 25, 10, 20),
    },
  ];
  
  const lowStockItems = [
    {
      id: '1',
      name: 'USB-C Cable',
      stock: 3,
      threshold: 10,
    },
    {
      id: '2',
      name: 'Wireless Mouse',
      stock: 2,
      threshold: 5,
    },
    {
      id: '3',
      name: 'HDMI Adapters',
      stock: 4,
      threshold: 8,
    },
  ];
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ThemeToggle />
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard 
          title="Total Sales Today"
          value="KSH 127,500"
          icon={<ShoppingCart size={18} />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Items in Inventory"
          value="386"
          icon={<Package size={18} />}
          description="48 categories"
        />
        <StatCard 
          title="Low Stock Alerts"
          value="8 Items"
          icon={<AlertTriangle size={18} />}
          trend={{ value: 3, isPositive: false }}
        />
        <StatCard 
          title="Revenue This Week"
          value="KSH 865,200"
          icon={<TrendingUp size={18} />}
          trend={{ value: 8.2, isPositive: true }}
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        <SalesChart data={salesData} />
        <RecentSales sales={recentSales} />
      </div>
      
      {/* Low Stock Alert */}
      <div className="mb-6">
        <LowStockAlert items={lowStockItems} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
