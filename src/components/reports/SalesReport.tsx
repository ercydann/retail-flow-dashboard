
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';

export interface SaleRecord {
  id: string;
  date: Date;
  customerName: string;
  items: string[];
  quantity: number;
  totalAmount: number;
}

interface SalesReportProps {
  sales: SaleRecord[];
  startDate: Date;
  endDate: Date;
  type: string;
}

const SalesReport = ({ sales, startDate, endDate, type }: SalesReportProps) => {
  const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalItems = sales.reduce((sum, sale) => sum + sale.quantity, 0);

  return (
    <Card className="print:shadow-none print:border-none">
      <CardHeader className="print:pb-0">
        <CardTitle className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold">POS System - Sales Report</h2>
          <p className="text-muted-foreground">
            {format(startDate, 'MMMM dd, yyyy')} - {format(endDate, 'MMMM dd, yyyy')}
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSH {totalSales.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sales.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Items Sold
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Transactions</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        No transactions found for the selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{format(sale.date, 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{sale.customerName || 'Walk-in Customer'}</TableCell>
                        <TableCell>
                          {sale.items.length > 2
                            ? `${sale.items.slice(0, 2).join(', ')} +${sale.items.length - 2} more`
                            : sale.items.join(', ')}
                        </TableCell>
                        <TableCell className="text-right">KSH {sale.totalAmount.toLocaleString()}</TableCell>
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

export default SalesReport;
