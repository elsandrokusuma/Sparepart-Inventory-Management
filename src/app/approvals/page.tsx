
"use client";

import { useState, useEffect } from 'react';
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
import { PreOrder } from '@/lib/data';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPreOrders, updatePreOrderStatusByOrderId } from '@/lib/firebase/firestore';

interface GroupedPreOrder {
  orderId: string;
  items: string[];
  totalQuantity: number;
  orderDate: string;
  originalIds: string[];
  company: string;
  location: string;
}

export default function ApprovalsPage() {
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    const allOrders = await getPreOrders();
    const pending = allOrders.filter(order => order.status === 'Pending');
    setPreOrders(pending);
  };

  const handleApproval = async (orderId: string, newStatus: 'Approved' | 'Rejected') => {
    await updatePreOrderStatusByOrderId(orderId, newStatus);
    toast({
      title: `Pre-Order ${newStatus}`,
      description: `Order ${orderId} has been successfully ${newStatus.toLowerCase()}.`,
    });
    fetchPendingApprovals();
  };
  
  const pendingApprovals = preOrders.filter(order => order.status === 'Pending');

  const groupedOrders = pendingApprovals.reduce((acc, order) => {
    if (!order.orderId) return acc;

    if (!acc[order.orderId]) {
      acc[order.orderId] = {
        orderId: order.orderId,
        items: [],
        totalQuantity: 0,
        orderDate: order.orderDate,
        originalIds: [],
        company: order.company,
        location: order.location,
      };
    }
    
    acc[order.orderId].items.push(order.item);
    acc[order.orderId].totalQuantity += order.quantity;
    acc[order.orderId].originalIds.push(order.id);

    return acc;
  }, {} as Record<string, GroupedPreOrder>);

  const groupedApprovals = Object.values(groupedOrders);


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
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Total Quantity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedApprovals.map((group) => (
                <TableRow key={group.orderId}>
                  <TableCell className="font-medium">
                    {group.orderId}
                  </TableCell>
                  <TableCell>{group.company}</TableCell>
                   <TableCell>{group.location}</TableCell>
                  <TableCell>{group.items.join(', ')}</TableCell>
                  <TableCell>{group.totalQuantity}</TableCell>
                  <TableCell>
                    {format(new Date(group.orderDate), 'PPP')}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-green-500 text-green-500 hover:bg-green-500/10 hover:text-green-500"
                      onClick={() => handleApproval(group.orderId, 'Approved')}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Approve</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                      onClick={() => handleApproval(group.orderId, 'Rejected')}
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
