
"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { transactions as initialTransactions, Transaction, InventoryItem, inventoryItems as initialInventoryItems } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { AddStockInDialog } from '@/components/stock-in/add-stock-in-dialog';

export default function StockInPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleAddStockIn = (values: { itemId: string; quantity: number; supplier: string; }) => {
    const item = initialInventoryItems.find(i => i.id === values.itemId);
    if (!item) return;

    const newTransaction: Transaction = {
      id: `T${(transactions.length + 1).toString().padStart(3, '0')}`,
      type: 'IN',
      item: item.name,
      itemId: values.itemId,
      quantity: values.quantity,
      supplier: values.supplier,
      date: new Date().toISOString(),
      user: 'Admin', // Assuming a static user for now
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const stockInTransactions = transactions.filter(tx => tx.type === 'IN');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stock In</h2>
          <p className="text-muted-foreground">
            Record new inventory received from suppliers.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <AddStockInDialog onAddStockIn={handleAddStockIn} inventoryItems={initialInventoryItems}/>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock In History</CardTitle>
          <CardDescription>
            A log of all received inventory.
          </CardDescription>
        </CardHeader>
        <CardContent className="!p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockInTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{format(new Date(tx.date), 'PPP p')}</TableCell>
                  <TableCell className="font-medium">{tx.item}</TableCell>
                  <TableCell>{tx.quantity}</TableCell>
                  <TableCell>{tx.supplier}</TableCell>
                  <TableCell>{tx.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
