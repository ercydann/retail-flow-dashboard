
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import AddItemForm, { ItemWithId } from '../components/inventory/AddItemForm';
import InventoryTable from '../components/inventory/InventoryTable';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';

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
  
  const categories = [...new Set(items.map(item => item.category))];
  
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
  
  const handleAddItem = (newItem: Omit<ItemWithId, 'id'>) => {
    if (editingItem) {
      // Update existing item
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === editingItem.id ? { ...newItem, id: item.id } : item
        )
      );
      setEditingItem(null);
    } else {
      // Add new item
      const id = (items.length + 1).toString();
      setItems(prevItems => [...prevItems, { ...newItem, id }]);
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
