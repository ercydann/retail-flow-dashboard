
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { ItemWithId } from '../inventory/AddItemForm';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  vat: number;
  quantity: number;
  totalPrice: number;
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  inventory: ItemWithId[];
}

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onCheckout, inventory }: CartProps) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatAmount = items.reduce((sum, item) => sum + (item.price * item.quantity * item.vat / 100), 0);
  const total = subtotal + vatAmount;
  
  const handleIncrease = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const inventoryItem = inventory.find(i => i.id === id);
    if (!inventoryItem) return;
    
    if (item.quantity >= inventoryItem.stock) {
      toast.error('Cannot add more', {
        description: 'No more stock available for this item',
      });
      return;
    }
    
    onUpdateQuantity(id, item.quantity + 1);
  };
  
  const handleDecrease = (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    if (item.quantity <= 1) {
      onRemoveItem(id);
      return;
    }
    
    onUpdateQuantity(id, item.quantity - 1);
  };
  
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Cart is empty', {
        description: 'Add items to cart before checkout',
      });
      return;
    }
    onCheckout();
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          <span>Shopping Cart</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8 text-muted-foreground">
            <ShoppingBag className="h-12 w-12 mb-2 opacity-20" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start border-b pb-3"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    KSH {item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDecrease(item.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleIncrease(item.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col border-t pt-4">
        <div className="w-full space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>KSH {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT</span>
            <span>KSH {vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-1">
            <span>Total</span>
            <span>KSH {total.toFixed(2)}</span>
          </div>
        </div>
        <Button
          className="w-full mt-4"
          size="lg"
          onClick={handleCheckout}
          disabled={items.length === 0}
        >
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Cart;
