
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
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem, PreOrder, companies } from '@/lib/data';

const addPreOrderSchema = z.object({
  company: z.string().min(1, 'Company name is required.'),
  itemId: z.string().min(1, 'Please select an item.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
});

type AddPreOrderFormValues = z.infer<typeof addPreOrderSchema>;

interface AddPreOrderDialogProps {
    onAddPreOrder: (values: Omit<PreOrder, 'id' | 'orderDate' | 'status' | 'location'>) => void;
    inventoryItems: InventoryItem[];
    location: 'jakarta' | 'surabaya';
}


export function AddPreOrderDialog({ onAddPreOrder, inventoryItems, location }: AddPreOrderDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddPreOrderFormValues>({
    resolver: zodResolver(addPreOrderSchema),
    defaultValues: {
      company: '',
      itemId: '',
      quantity: 1,
    },
  });

  function onSubmit(values: AddPreOrderFormValues) {
    const selectedItem = inventoryItems.find(i => i.id === values.itemId);
    if (!selectedItem) return;

    onAddPreOrder({ 
        company: values.company,
        item: selectedItem.name,
        itemId: values.itemId,
        quantity: values.quantity,
    });

    toast({
      title: "Pre-Order Created",
      description: `Successfully created pre-order for "${selectedItem.name}" in ${location === 'jakarta' ? 'Jakarta' : 'Surabaya'}.`,
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
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Pre-order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create New Pre-order</DialogTitle>
          <DialogDescription>
            Create a new pre-order for {location === 'jakarta' ? 'Jakarta' : 'Surabaya'}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.value} value={company.value}>
                          {company.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
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
                        {inventoryItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                            {item.name}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
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
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Pre-order</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
