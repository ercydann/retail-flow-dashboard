
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CartItem } from './Cart';
import { CheckCircle } from 'lucide-react';

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onCompleteCheckout: (customerName: string, amountPaid: number) => void;
  totalAmount: number;
}

const CheckoutDialog = ({
  isOpen,
  onClose,
  cartItems,
  onCompleteCheckout,
  totalAmount,
}: CheckoutDialogProps) => {
  const [customerName, setCustomerName] = useState('');
  const [amountPaid, setAmountPaid] = useState(totalAmount.toFixed(2));
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const calculateChange = () => {
    const paid = parseFloat(amountPaid || '0');
    return paid - totalAmount;
  };
  
  const handleComplete = () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onCompleteCheckout(customerName, parseFloat(amountPaid));
      setIsProcessing(false);
      setIsComplete(true);
      
      // Close after showing success
      setTimeout(() => {
        setIsComplete(false);
        onClose();
        setCustomerName('');
        setAmountPaid(totalAmount.toFixed(2));
      }, 2000);
    }, 1000);
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const vatAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity * item.vat / 100), 0);
  const change = calculateChange();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isComplete ? 'Payment Complete' : 'Checkout'}</DialogTitle>
          <DialogDescription>
            {isComplete 
              ? 'The transaction has been completed successfully.'
              : 'Complete customer payment details below.'}
          </DialogDescription>
        </DialogHeader>
        
        {isComplete ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-medium text-lg">Payment Successful</h3>
              <p className="text-muted-foreground">Receipt has been generated</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name (Optional)</Label>
                <Input
                  id="customer"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                />
              </div>
              
              <div className="space-y-1">
                <div className="text-sm font-medium">Order Summary</div>
                <div className="rounded-md bg-secondary/50 p-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>KSH {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VAT:</span>
                      <span>KSH {vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-1.5 font-medium">
                      <span>Total:</span>
                      <span>KSH {totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount Paid (KSH)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label>Change</Label>
                <div className="text-lg font-bold">
                  KSH {change >= 0 ? change.toFixed(2) : '0.00'}
                  {change < 0 && (
                    <span className="text-destructive text-sm ml-2">
                      (KSH {Math.abs(change).toFixed(2)} short)
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                type="button"
                onClick={handleComplete}
                disabled={isProcessing || parseFloat(amountPaid) < totalAmount}
              >
                {isProcessing ? 'Processing...' : 'Complete Payment'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;
