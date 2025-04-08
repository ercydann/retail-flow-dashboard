
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ItemWithId } from '../inventory/AddItemForm';
import { CartItem } from './Cart';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductListProps {
  products: ItemWithId[];
  onAddToCart: (item: CartItem) => void;
  categories: string[];
}

const calculatePriceWithVat = (price: number, vat: number): number => {
  return price + (price * vat) / 100;
};

const ProductList = ({ products, onAddToCart, categories }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: ItemWithId) => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock', {
        description: 'This item cannot be added to cart',
      });
      return;
    }
    
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      vat: product.vat,
      quantity: 1,
      totalPrice: calculatePriceWithVat(product.price, product.vat),
    });
    
    toast.success('Added to cart', {
      description: `1 × ${product.name} added`,
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center pt-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pb-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No products found
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const priceWithVat = calculatePriceWithVat(product.price, product.vat);
              const isOutOfStock = product.stock <= 0;
              
              return (
                <div
                  key={product.id}
                  className="relative border rounded-lg p-4 transition-all hover:shadow-md"
                >
                  {isOutOfStock && (
                    <div className="absolute top-2 right-2">
                      <AlertCircle className="text-destructive h-5 w-5" />
                    </div>
                  )}
                  <div className="flex flex-col h-full">
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="mt-1 mb-2 text-sm text-muted-foreground">
                      {product.category}
                    </div>
                    <div className="mt-auto space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-lg font-bold">
                            KSH {priceWithVat.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            incl. {product.vat}% VAT
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Stock: {product.stock}
                        </div>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        disabled={isOutOfStock}
                        onClick={() => handleAddToCart(product)}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductList;
