
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface Sale {
  id: string;
  items: string;
  amount: number;
  customer: string;
  timestamp: Date;
}

interface RecentSalesProps {
  sales: Sale[];
}

const RecentSales = ({ sales }: RecentSalesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.items}</TableCell>
                <TableCell>KSH {sale.amount.toLocaleString()}</TableCell>
                <TableCell>{sale.customer}</TableCell>
                <TableCell>{formatDistanceToNow(sale.timestamp, { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentSales;
