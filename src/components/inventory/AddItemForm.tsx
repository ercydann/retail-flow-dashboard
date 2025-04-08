
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const itemSchema = z.object({
  name: z.string().min(1, { message: 'Item name is required' }),
  price: z.coerce.number().positive({ message: 'Price must be positive' }),
  stock: z.coerce.number().int({ message: 'Stock must be an integer' }).nonnegative({ message: 'Stock cannot be negative' }),
  vat: z.coerce.number().min(0, { message: 'VAT cannot be negative' }).max(100, { message: 'VAT cannot exceed 100%' }),
  category: z.string().min(1, { message: 'Category is required' }),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface AddItemFormProps {
  onAddItem: (item: ItemFormData) => void;
  categories: string[];
  editItem?: ItemWithId;
  onCancelEdit?: () => void;
}

export interface ItemWithId extends ItemFormData {
  id: string;
}

const AddItemForm = ({ onAddItem, categories, editItem, onCancelEdit }: AddItemFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: editItem || {
      name: '',
      price: 0,
      stock: 0,
      vat: 16, // Default VAT in Kenya
      category: '',
    },
  });

  // Set form values when editing an item
  React.useEffect(() => {
    if (editItem) {
      setValue('name', editItem.name);
      setValue('price', editItem.price);
      setValue('stock', editItem.stock);
      setValue('vat', editItem.vat);
      setValue('category', editItem.category);
    }
  }, [editItem, setValue]);

  const onSubmit: SubmitHandler<ItemFormData> = (data) => {
    onAddItem(data);
    
    if (!editItem) {
      reset();
      toast.success('Item added successfully');
    } else {
      toast.success('Item updated successfully');
      if (onCancelEdit) onCancelEdit();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editItem ? 'Edit Item' : 'Add New Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (KSH)</Label>
              <Input id="price" type="number" step="0.01" {...register('price')} />
              {errors.price && (
                <p className="text-destructive text-sm">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input id="stock" type="number" {...register('stock')} />
              {errors.stock && (
                <p className="text-destructive text-sm">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vat">VAT %</Label>
              <Input id="vat" type="number" step="0.1" {...register('vat')} />
              {errors.vat && (
                <p className="text-destructive text-sm">{errors.vat.message}</p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => setValue('category', value)}
                defaultValue={editItem?.category || ''}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-destructive text-sm">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {editItem && onCancelEdit && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
            <Button type="submit">{editItem ? 'Update Item' : 'Add Item'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddItemForm;
