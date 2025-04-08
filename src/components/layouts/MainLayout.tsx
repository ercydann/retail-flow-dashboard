
import React from 'react';
import Navbar from './Navbar';
import { Toaster } from '@/components/ui/sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 animate-fade-in">
        {children}
      </main>
      <Toaster />
    </div>
  );
};

export default MainLayout;
