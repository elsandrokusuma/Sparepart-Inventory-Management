
"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
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
import { AddStockInDialog } from '@/components/stock-in/add-stock-in-dialog';
import { ClientFormattedDate } from '@/components/client-formatted-date';

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
          <h2 className="text-3xl font-bold tracking-tight">Stock In History</h2>
          <p className="text-muted-foreground">
            A log of all received inventory.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <AddStockInDialog onAddStockIn={handleAddStockIn} inventoryItems={initialInventoryItems}/>
        </div>
      </div>

      <Card>
        <CardContent className="!p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockInTransactions.map((tx) => {
                const item = initialInventoryItems.find(i => i.id === tx.itemId);
                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <ClientFormattedDate date={tx.date} format="PPP p" />
                    </TableCell>
                    <TableCell className="font-medium">{tx.item}</TableCell>
                    <TableCell>{item?.location || '-'}</TableCell>
                    <TableCell>{tx.quantity}</TableCell>
                    <TableCell>{tx.supplier}</TableCell>
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
