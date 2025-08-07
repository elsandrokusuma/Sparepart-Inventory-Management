
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PreOrder } from '@/lib/data';
import { format } from 'date-fns';

interface PreOrderDetailsDialogProps {
    preOrder: PreOrder;
    onOpenChange: (open: boolean) => void;
}

export function PreOrderDetailsDialog({ preOrder, onOpenChange }: PreOrderDetailsDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Pre-Order Details</DialogTitle>
          <DialogDescription>
            Review the details of the pre-order below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <p className="font-semibold text-muted-foreground">Company</p>
                <p>{preOrder.company}</p>

                <p className="font-semibold text-muted-foreground">Item</p>
                <p>{preOrder.item}</p>
                
                <p className="font-semibold text-muted-foreground">Quantity</p>
                <p>{preOrder.quantity}</p>

                <p className="font-semibold text-muted-foreground">Order Date</p>
                <p>{format(new Date(preOrder.orderDate), 'PPP')}</p>

                <p className="font-semibold text-muted-foreground">Location</p>
                <p>{preOrder.location}</p>

                <p className="font-semibold text-muted-foreground">Status</p>
                <p>{preOrder.status}</p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
