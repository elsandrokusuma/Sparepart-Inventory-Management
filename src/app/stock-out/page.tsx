"use client";

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { inventoryItems } from '@/lib/data';
import { Upload } from 'lucide-react';

const stockOutSchema = z.object({
  itemId: z.string().min(1, 'Please select an item.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
  destination: z.enum(['Jakarta', 'Surabaya'], {
    required_error: 'You need to select a destination.',
  }),
});

export default function StockOutPage() {
  const form = useForm<z.infer<typeof stockOutSchema>>({
    resolver: zodResolver(stockOutSchema),
    defaultValues: {
      itemId: '',
      quantity: 1,
    },
  });

  function onSubmit(values: z.infer<typeof stockOutSchema>) {
    console.log(values);
    // Handle form submission and create approval request
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stock Out</h2>
          <p className="text-muted-foreground">
            Record outgoing inventory and submit for approval.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Create Request</CardTitle>
                <CardDescription>
                  Fill in the details for the outgoing stock.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Jakarta">Jakarta</SelectItem>
                          <SelectItem value="Surabaya">Surabaya</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit">Submit for Approval</Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Bulk Request</CardTitle>
                <CardDescription>
                    Process a CSV file to create multiple stock out requests.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed border-muted-foreground/50 p-8 text-center">
                    <Upload className="h-10 w-10 text-muted-foreground"/>
                    <p className="text-sm text-muted-foreground">Drag & drop your CSV file here, or click to select a file.</p>
                    <Input id="csv-upload-out" type="file" className="sr-only"/>
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('csv-upload-out')?.click()}>
                        Select File
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
                <Button>Process CSV</Button>
                <p className="text-xs text-muted-foreground">
                    Required columns: SKU, Quantity, Destination
                </p>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
