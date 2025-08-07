
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
import { Button } from '@/components/ui/button';
import { preOrders as initialPreOrders, PreOrder } from '@/lib/data';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ApprovalsPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>(initialPreOrders);
  const { toast } = useToast();

  const handleApproval = (orderId: string, newStatus: 'Approved' | 'Rejected') => {
    setPreOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
      title: `Pre-Order ${newStatus}`,
      description: `Order ${orderId} has been successfully ${newStatus.toLowerCase()}.`,
    });
  };
  
  const pendingApprovals = preOrders.filter(order => order.status === 'Pending');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Approval Requests</h2>
          <p className="text-muted-foreground">
            Review and approve or reject pending pre-order requests.
          </p>
        </div>
      </div>
      <Card>
        <CardContent className="!p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApprovals.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.id}
                  </TableCell>
                  <TableCell>{request.item}</TableCell>
                  <TableCell>{request.quantity}</TableCell>
                  <TableCell>
                    {format(new Date(request.orderDate), 'PPP')}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-green-500 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                      onClick={() => handleApproval(request.id, 'Approved')}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Approve</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => handleApproval(request.id, 'Rejected')}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Reject</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
