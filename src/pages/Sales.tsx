import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import ProductList from '../components/sales/ProductList';
import Cart, { CartItem } from '../components/sales/Cart';
import CheckoutDialog from '../components/sales/CheckoutDialog';
import TransactionHistory, { Transaction } from '../components/sales/TransactionHistory';
import { toast } from 'sonner';
import { ItemWithId } from '../components/inventory/AddItemForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadInventory, saveInventory, loadTransactions, saveTransactions } from '../utils/localStorage';

const Sales = () => {
  const [inventory, setInventory] = useState<ItemWithId[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('pos');
  
  useEffect(() => {
    const loadedInventory = loadInventory();
    const loadedTransactions = loadTransactions();
    
    setInventory(loadedInventory);
    setTransactions(loadedTransactions);
  }, []);
  
  const categories = [...new Set(inventory.map(item => item.category))];
  
  const calculatePriceWithVat = (price: number, vat: number): number => {
    return price + (price * vat) / 100;
  };
  
  const handleAddToCart = (item: CartItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      const inventoryItem = inventory.find(i => i.id === item.id);
      if (!inventoryItem || existingItem.quantity >= inventoryItem.stock) {
        toast.error('Cannot add more', {
          description: 'No more stock available for this item',
        });
        return;
      }
      
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
    const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    const newTransaction: Transaction = {
      id: `T${Date.now().toString()}`,
      date: new Date(),
      customerName,
      items: [...cartItems],
      totalAmount: totalAmount,
      amountPaid
    };
    
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    
    const updatedInventory = inventory.map(item => {
      const cartItem = cartItems.find(ci => ci.id === item.id);
      if (cartItem) {
        return {
          ...item,
          stock: item.stock - cartItem.quantity
        };
      }
      return item;
    });
    
    setInventory(updatedInventory);
    saveInventory(updatedInventory);
    
    toast.success('Sale completed!', {
      description: `Receipt #${newTransaction.id}`,
    });
    
    setCartItems([]);
    setIsCheckoutOpen(false);
    
    setActiveTab('transactions');
  };
  
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
