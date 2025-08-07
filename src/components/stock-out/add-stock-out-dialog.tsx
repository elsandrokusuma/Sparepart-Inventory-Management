
"use client";

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PackageMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem } from '@/lib/data';

const stockOutSchema = z.object({
  itemId: z.string().min(1, 'Please select an item.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  description: z.string().min(1, 'For is required.'),
  user: z.string().min(1, 'User is required.'),
});

type StockOutFormValues = z.infer<typeof stockOutSchema>;

interface AddStockOutDialogProps {
    onAddStockOut: (values: StockOutFormValues) => void;
    inventoryItems: InventoryItem[];
    userOptions: string[];
}

export const descriptions = [
    "Jakarta's Needs",
    "Surabaya's Needs",
    "Customer Purchases",
    "Production",
    "QC",
    "External Service",
    "Internal Service",
    "Damage",
];

export function AddStockOutDialog({ onAddStockOut, inventoryItems, userOptions }: AddStockOutDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<StockOutFormValues>({
    resolver: zodResolver(stockOutSchema),
    defaultValues: {
      itemId: '',
      quantity: 1,
      description: '',
      user: '',
    },
  });

  function onSubmit(values: StockOutFormValues) {
    onAddStockOut(values);
    const itemName = inventoryItems.find(i => i.id === values.itemId)?.name || 'Item';
    toast({
      title: "Stock Out Recorded",
      description: `Successfully recorded stock out for ${values.quantity}x "${itemName}".`,
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            form.reset();
        }
    }}>
      <DialogTrigger asChild>
        <Button>
          <PackageMinus className="mr-2 h-4 w-4" />
          Add Stock Out
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Add Stock Out</DialogTitle>
          <DialogDescription>
            Fill out the form below to record an outgoing stock transaction.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventoryItems
                        .filter((item) => item.stock > 0)
                        .map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} (Stock: {item.stock})
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="user"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>User</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {userOptions.map((user) => (
                                <SelectItem key={user} value={user}>
                                {user}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>For</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a description" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {descriptions.map((desc) => (
                        <SelectItem key={desc} value={desc}>
                          {desc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Record Stock Out</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
