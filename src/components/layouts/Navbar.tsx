
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { name: 'Inventory', path: '/inventory', icon: <Package size={18} /> },
  { name: 'Sales', path: '/sales', icon: <ShoppingCart size={18} /> },
  { name: 'Reports', path: '/reports', icon: <BarChart3 size={18} /> },
];

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            'nav-link',
            location.pathname === item.path && 'active'
          )}
        >
          {item.icon}
          <span>{item.name}</span>
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold text-2xl text-primary">
            <ShoppingCart className="h-6 w-6" />
            <span>POS System</span>
          </Link>
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-2 pt-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
