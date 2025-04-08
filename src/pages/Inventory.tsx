
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import AddItemForm, { ItemWithId } from '../components/inventory/AddItemForm';
import InventoryTable from '../components/inventory/InventoryTable';
import CategoryManager from '../components/inventory/CategoryManager';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Inventory = () => {
  const [items, setItems] = useState<ItemWithId[]>(() => {
    // Mock initial data
    return [
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
      }
    ];
  });
  
  const [categories, setCategories] = useState<string[]>(() => {
    return [...new Set(items.map(item => item.category))];
  });
  
  const [editingItem, setEditingItem] = useState<ItemWithId | null>(null);
  const location = useLocation();
  
  // Check for edit parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const editId = params.get('edit');
    
    if (editId) {
      const itemToEdit = items.find(item => item.id === editId);
      if (itemToEdit) {
        setEditingItem(itemToEdit);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [location.search, items]);

  // Handler for adding a new category
  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories([...categories, category]);
    }
  };

  // Handler for deleting a category
  const handleDeleteCategory = (categoryToDelete: string) => {
    // Check if any item uses this category
    const itemsUsingCategory = items.filter(item => item.category === categoryToDelete);
    
    if (itemsUsingCategory.length > 0) {
      toast.error('Cannot delete category', { 
        description: 'There are items assigned to this category'
      });
      return;
    }
    
    setCategories(categories.filter(cat => cat !== categoryToDelete));
    toast.success('Category deleted successfully');
  };
  
  const handleAddItem = (newItem: Omit<ItemWithId, 'id'>) => {
    if (editingItem) {
      // Update existing item
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItem.id ? { ...newItem, id: item.id } : item
        )
      );
      setEditingItem(null);
      toast.success('Item updated successfully');
    } else {
      // Add new item
      const id = (items.length + 1).toString();
      setItems(prevItems => [...prevItems, { ...newItem, id }]);
      toast.success('Item added successfully');

      // Add category if it's new
      if (newItem.category && !categories.includes(newItem.category)) {
        setCategories([...categories, newItem.category]);
      }
    }
  };
  
  const handleEditItem = (item: ItemWithId) => {
    setEditingItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Item deleted successfully');
  };
  
  const handleCancelEdit = () => {
    setEditingItem(null);
  };
  
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AddItemForm
            onAddItem={handleAddItem}
            categories={categories}
            editItem={editingItem || undefined}
            onCancelEdit={handleCancelEdit}
          />
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryManager 
                  categories={categories} 
                  onAddCategory={handleAddCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <InventoryTable
            items={items}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            categories={categories}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Inventory;
