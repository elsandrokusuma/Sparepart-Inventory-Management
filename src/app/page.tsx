
"use client";

import { Package, DollarSign, ClipboardList, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import StatCard from '@/components/dashboard/stat-card';
import InventoryChart from '@/components/dashboard/inventory-chart';
import RecentTransactions from '@/components/dashboard/recent-transactions';
import { InventoryItem, Transaction, PreOrder } from '@/lib/data';
import { getInventoryItems, getPreOrders, getTransactions } from '@/lib/firebase/firestore';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [items, trans, orders] = await Promise.all([
        getInventoryItems(),
        getTransactions(),
        getPreOrders(),
      ]);
      setInventoryItems(items);
      setTransactions(trans);
      setPreOrders(orders);
    };
    fetchData();
  }, []);

  const totalStock = inventoryItems.reduce((sum, item) => sum + item.stock, 0);
  const pendingPreOrders = preOrders.filter(
    (order) => order.status === 'Pending'
  ).length;
  const lowStockItems = inventoryItems.filter((item) => item.stock < 10).length;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Stock"
          value={totalStock.toLocaleString()}
          icon={Package}
          description="All items across locations"
        />
        <StatCard
          title="Pending Pre-Orders"
          value={pendingPreOrders.toString()}
          icon={ClipboardList}
          description="Jakarta & Surabaya"
          accentColor="text-accent"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems.toString()}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-package-warning h-4 w-4 text-muted-foreground"
            >
              <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2" />
              <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5" />
              <path d="M3 10h18" />
              <path d="M12 2v4" />
              <path d="m7 4 5 2.5" />
              <path d="m17 4-5 2.5" />
              <path d="M12 21v-8" />
              <path d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
          }
          description="Items needing restock"
          accentColor="text-destructive"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <InventoryChart inventoryItems={inventoryItems} />
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </Card>
      </div>
    </div>
  );
}
