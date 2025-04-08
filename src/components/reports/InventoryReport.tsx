
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ItemWithId } from '../inventory/AddItemForm';

interface InventoryReportProps {
  items: ItemWithId[];
  startDate: Date;
  endDate: Date;
  type: 'inventory' | 'low-stock';
}

const InventoryReport = ({ items, startDate, endDate, type }: InventoryReportProps) => {
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const lowStockItems = items.filter(item => item.stock <= 5);
  
  const displayItems = type === 'low-stock' ? lowStockItems : items;
  
  const reportTitle = type === 'low-stock' ? 'Low Stock Items Report' : 'Inventory Summary Report';

  return (
    <Card className="print:shadow-none print:border-none">
      <CardHeader className="print:pb-0">
        <CardTitle className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold">POS System - {reportTitle}</h2>
          <p className="text-muted-foreground">Generated on {format(new Date(), 'MMMM dd, yyyy')}</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {type === 'low-stock' ? 'Low Stock Items' : 'Total Items'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{type === 'low-stock' ? lowStockItems.length : totalItems}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {type === 'low-stock' ? 'Need Attention' : 'Total Categories'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {type === 'low-stock' 
                    ? Math.round((lowStockItems.length / totalItems) * 100) + '%'
                    : new Set(items.map(item => item.category)).size}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {type === 'low-stock' ? 'Restock Value' : 'Inventory Value'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KSH {(type === 'low-stock' 
                    ? lowStockItems.reduce((sum, item) => sum + (item.price * Math.max(5 - item.stock, 0)), 0)
                    : totalValue).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">{type === 'low-stock' ? 'Low Stock Items' : 'Inventory Items'}</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Price (KSH)</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {type === 'low-stock' 
                          ? 'No low stock items found - inventory is healthy!'
                          : 'No inventory items found'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className={item.stock <= 5 ? 'text-destructive font-medium' : ''}>
                          {item.stock}
                        </TableCell>
                        <TableCell>{item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {(item.price * item.stock).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryReport;
