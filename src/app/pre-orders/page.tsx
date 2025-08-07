
"use client";

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { preOrders as initialPreOrders, inventoryItems, PreOrder } from '@/lib/data';
import { format } from 'date-fns';
import { AddPreOrderDialog } from '@/components/pre-orders/add-pre-order-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { PreOrderDetailsDialog } from '@/components/pre-orders/pre-order-details-dialog';


export default function PreOrdersPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>(initialPreOrders);
  const [activeTab, setActiveTab] = useState<'jakarta' | 'surabaya'>('jakarta');
  const [selectedOrders, setSelectedOrders] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const [selectedPreOrderDetails, setSelectedPreOrderDetails] = useState<PreOrder | null>(null);

  const handleAddPreOrder = (newOrderData: Omit<PreOrder, 'id' | 'orderDate' | 'status' | 'location'>) => {
    const newOrder: PreOrder = {
      ...newOrderData,
      id: `PO-${(preOrders.length + 1).toString().padStart(3, '0')}`,
      orderDate: new Date().toISOString(),
      status: 'Awaiting Approval',
      location: activeTab === 'jakarta' ? 'Jakarta' : 'Surabaya',
    };
    setPreOrders(currentOrders => [newOrder, ...currentOrders]);
  };
  
  const jakartaPreOrders = preOrders.filter(
    (order) => order.location === 'Jakarta'
  );
  const surabayaPreOrders = preOrders.filter(
    (order) => order.location === 'Surabaya'
  );

  const handleSelectOrder = (orderId: string, isSelected: boolean) => {
    setSelectedOrders(prev => ({
      ...prev,
      [orderId]: isSelected,
    }));
  };

  const handleRowClick = (order: PreOrder) => {
    setSelectedPreOrderDetails(order);
  };

  const handleSubmitForApproval = () => {
    const orderIdsToSubmit = Object.keys(selectedOrders).filter(id => selectedOrders[id]);
    
    if (orderIdsToSubmit.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select orders to submit for approval.",
        variant: "destructive",
      });
      return;
    }

    setPreOrders(currentOrders => 
      currentOrders.map(order => 
        orderIdsToSubmit.includes(order.id) ? { ...order, status: 'Pending' } : order
      )
    );

    toast({
      title: "Submitted for Approval",
      description: `${orderIdsToSubmit.length} order(s) have been sent for approval.`,
    });
    setSelectedOrders({});
  };

  const selectedCount = Object.values(selectedOrders).filter(Boolean).length;


  const renderPreOrderTable = (orders: typeof preOrders) => (
    <Card>
      <CardContent className="!p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                {/* <Checkbox /> */}
              </TableHead>
              <TableHead>No.</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow 
                key={order.id} 
                data-state={selectedOrders[order.id] ? 'selected' : ''}
                onClick={() => handleRowClick(order)}
                className="cursor-pointer"
              >
                 <TableCell onClick={(e) => e.stopPropagation()}>
                  {order.status === 'Awaiting Approval' && (
                     <Checkbox
                        checked={selectedOrders[order.id] || false}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                        aria-label={`Select order ${order.id}`}
                      />
                  )}
                 </TableCell>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.company}</TableCell>
                <TableCell>{order.item}</TableCell>
                <TableCell className="text-right">{order.quantity}</TableCell>
                <TableCell>
                  {format(new Date(order.orderDate), 'PPP')}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === 'Pending' ? 'secondary' :
                      order.status === 'Awaiting Approval' ? 'secondary' :
                      order.status === 'Approved' ? 'default' :
                      order.status === 'Fulfilled' ? 'default' : 'destructive'
                    }
                    className={
                      order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      order.status === 'Awaiting Approval' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      order.status === 'Approved' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      order.status === 'Fulfilled' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      'bg-red-500/20 text-red-400 border-red-500/30'
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pre-Order Management</h2>
          <p className="text-muted-foreground">
            Track and manage customer pre-orders for each location.
          </p>
        </div>
        <div className="flex items-center space-x-2">
           {selectedCount > 0 && (
             <Button onClick={handleSubmitForApproval}>
              Submit for Approval ({selectedCount})
            </Button>
           )}
           <AddPreOrderDialog
            location={activeTab}
            inventoryItems={inventoryItems}
            onAddPreOrder={handleAddPreOrder}
          />
        </div>
      </div>
      <Tabs 
        defaultValue="jakarta" 
        className="space-y-4"
        onValueChange={(value) => {
          setActiveTab(value as 'jakarta' | 'surabaya');
          setSelectedOrders({});
        }}
      >
        <TabsList>
          <TabsTrigger value="jakarta">Jakarta</TabsTrigger>
          <TabsTrigger value="surabaya">Surabaya</TabsTrigger>
        </TabsList>
        <TabsContent value="jakarta">
          {renderPreOrderTable(jakartaPreOrders)}
        </TabsContent>
        <TabsContent value="surabaya">
          {renderPreOrderTable(surabayaPreOrders)}
        </TabsContent>
      </Tabs>

      {selectedPreOrderDetails && (
        <PreOrderDetailsDialog
            preOrder={selectedPreOrderDetails}
            onOpenChange={() => setSelectedPreOrderDetails(null)}
        />
      )}
    </div>
  );
}
