
"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { transactions as initialTransactions, Transaction, inventoryItems as initialInventoryItems } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddStockOutDialog } from '@/components/stock-out/add-stock-out-dialog';
import { ClientFormattedDate } from '@/components/client-formatted-date';

export default function StockOutPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleAddStockOut = (values: { itemId: string; quantity: number; description: string; }) => {
    const item = initialInventoryItems.find(i => i.id === values.itemId);
    if (!item) return;

    const newTransaction: Transaction = {
      id: `T${(transactions.length + 1).toString().padStart(3, '0')}`,
      type: 'OUT',
      item: item.name,
      itemId: values.itemId,
      quantity: values.quantity,
      description: values.description,
      date: new Date().toISOString(),
      user: 'Admin', // Assuming a static user for now
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const stockOutTransactions = transactions.filter(tx => tx.type === 'OUT');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stock Out History</h2>
          <p className="text-muted-foreground">
            A log of all outgoing inventory.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <AddStockOutDialog onAddStockOut={handleAddStockOut} inventoryItems={initialInventoryItems}/>
        </div>
      </div>

      <Card>
        <CardContent className="!p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockOutTransactions.map((tx) => {
                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <ClientFormattedDate date={tx.date} format="PPP p" />
                    </TableCell>
                    <TableCell className="font-medium">{tx.item}</TableCell>
                    <TableCell>{tx.quantity}</TableCell>
                    <TableCell>{tx.description || '-'}</TableCell>
                    <TableCell>{tx.user}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
