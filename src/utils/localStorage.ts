
// Types
import { ItemWithId } from '../components/inventory/AddItemForm';
import { Transaction } from '../components/sales/TransactionHistory';

// Keys for localStorage
const STORAGE_KEYS = {
  INVENTORY: 'pos_inventory',
  TRANSACTIONS: 'pos_transactions',
  CATEGORIES: 'pos_categories',
};

// Save inventory items to localStorage
export const saveInventory = (items: ItemWithId[]): void => {
  localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
};

// Load inventory items from localStorage
export const loadInventory = (): ItemWithId[] => {
  const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
  if (!data) {
    return getDefaultInventory();
  }
  return JSON.parse(data);
};

// Save transactions to localStorage
export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

// Load transactions from localStorage
export const loadTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (!data) {
    return [];
  }
  return JSON.parse(data);
};

// Save categories to localStorage
export const saveCategories = (categories: string[]): void => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

// Load categories from localStorage
export const loadCategories = (): string[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!data) {
    return getDefaultCategories();
  }
  return JSON.parse(data);
};

// Default inventory in case localStorage is empty
const getDefaultInventory = (): ItemWithId[] => [
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

// Default categories in case localStorage is empty
const getDefaultCategories = (): string[] => [
  'Electronics',
  'Accessories',
  'Storage'
];

// Clear all stored data (for testing or reset)
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.INVENTORY);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
};
