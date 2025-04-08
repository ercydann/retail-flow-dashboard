
import React, { useState } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import ProductList from '../components/sales/ProductList';
import Cart, { CartItem } from '../components/sales/Cart';
import CheckoutDialog from '../components/sales/CheckoutDialog';
import TransactionHistory, { Transaction } from '../components/sales/TransactionHistory';
import { toast } from 'sonner';
import { ItemWithId } from '../components/inventory/AddItemForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Sales = () => {
  // Mock inventory data
  const [inventory, setInventory] = useState<ItemWithId[]>([
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
      name: 'Tablet',
      price: 35000,
      stock: 7,
      vat: 16,
      category: 'Electronics'
    }
  ]);
  
  const categories = [...new Set(inventory.map(item => item.category))];
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('pos');
  
  const calculatePriceWithVat = (price: number, vat: number): number => {
    return price + (price * vat) / 100;
  };
  
  const handleAddToCart = (item: CartItem) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      // Check stock before updating
      const inventoryItem = inventory.find(i => i.id === item.id);
      if (!inventoryItem || existingItem.quantity >= inventoryItem.stock) {
        toast.error('Cannot add more', {
          description: 'No more stock available for this item',
        });
        return;
      }
      
      // Update quantity if item already exists
      setCartItems(
        cartItems.map(cartItem =>
          cartItem.id === item.id
            ? { 
                ...cartItem, 
                quantity: cartItem.quantity + 1,
                totalPrice: calculatePriceWithVat(cartItem.price, cartItem.vat) * (cartItem.quantity + 1)
              }
            : cartItem
        )
      );
      toast.success(`Added ${item.name} to cart`);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, item]);
      toast.success(`Added ${item.name} to cart`);
    }
  };
  
  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;
    
    const inventoryItem = inventory.find(i => i.id === id);
    if (!inventoryItem || newQuantity > inventoryItem.stock) {
      toast.error('Cannot add more', {
        description: 'No more stock available for this item',
      });
      return;
    }
    
    setCartItems(
      cartItems.map(item =>
        item.id === id
          ? { 
              ...item, 
              quantity: newQuantity,
              totalPrice: calculatePriceWithVat(item.price, item.vat) * newQuantity
            }
          : item
      )
    );
  };
  
  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };
  
  const handleCompleteCheckout = (customerName: string, amountPaid: number) => {
    // Create transaction record
    const newTransaction: Transaction = {
      id: `T${transactions.length + 1}${Date.now().toString().slice(-4)}`,
      date: new Date(),
      customerName,
      items: [...cartItems],
      totalAmount: totalAmount,
      amountPaid
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update inventory
    setInventory(prev => 
      prev.map(item => {
        const cartItem = cartItems.find(ci => ci.id === item.id);
        if (cartItem) {
          return {
            ...item,
            stock: item.stock - cartItem.quantity
          };
        }
        return item;
      })
    );
    
    // Show success message
    toast.success('Sale completed!', {
      description: `Receipt #${newTransaction.id}`,
    });
    
    // Clear cart
    setCartItems([]);
    setIsCheckoutOpen(false);
    
    // Switch to transaction history tab
    setActiveTab('transactions');
  };
  
  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Point of Sale</h1>
      
      <Tabs defaultValue="pos" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pos">POS Terminal</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pos">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ProductList 
                products={inventory} 
                onAddToCart={handleAddToCart} 
                categories={categories}
              />
            </div>
            
            <div className="lg:col-span-1">
              <Cart 
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                inventory={inventory}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionHistory transactions={transactions} />
        </TabsContent>
      </Tabs>
      
      <CheckoutDialog 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onCompleteCheckout={handleCompleteCheckout}
        totalAmount={totalAmount}
      />
    </MainLayout>
  );
};

export default Sales;
