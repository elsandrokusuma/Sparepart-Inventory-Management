
"use client";

import { useEffect } from 'react';
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
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem } from '@/lib/data';

const editItemSchema = z.object({
    name: z.string().min(1, 'Item name is required.'),
    imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
    stock: z.coerce.number().min(0, 'Stock must be a positive number.'),
    location: z.enum(['Jakarta', 'Surabaya', 'Both'], { required_error: 'Location is required.'}),
    dataAiHint: z.string().optional(),
});

type EditItemFormValues = z.infer<typeof editItemSchema>;

interface EditItemDialogProps {
    item: InventoryItem;
    onUpdateItem: (item: InventoryItem) => void;
    onOpenChange: (open: boolean) => void;
}

export function EditItemDialog({ item, onUpdateItem, onOpenChange }: EditItemDialogProps) {
  const { toast } = useToast();

  const form = useForm<EditItemFormValues>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      name: item.name,
      imageUrl: item.imageUrl,
      stock: item.stock,
      location: item.location,
      dataAiHint: item.dataAiHint,
    },
  });
  
  useEffect(() => {
    form.reset({
        name: item.name,
        imageUrl: item.imageUrl,
        stock: item.stock,
        location: item.location,
        dataAiHint: item.dataAiHint,
    });
  }, [item, form]);


  function onSubmit(values: EditItemFormValues) {
    const newStatus = values.stock === 0 ? 'Out of Stock' : values.stock < 10 ? 'Low Stock' : 'In Stock';
    onUpdateItem({ ...item, ...values, status: newStatus });
    toast({
      title: "Item Updated",
      description: `Successfully updated "${values.name}".`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item</DialogTitle>
          <DialogDescription>
            Update the details for the inventory item below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Wireless Mouse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a location" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Jakarta">Jakarta</SelectItem>
                            <SelectItem value="Surabaya">Surabaya</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataAiHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Search Hint</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 'wireless mouse'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
