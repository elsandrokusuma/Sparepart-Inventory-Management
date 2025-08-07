
"use client";

import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InventoryItem } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search, Database } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddItemDialog } from '@/components/inventory/add-item-dialog';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { EditItemDialog } from '@/components/inventory/edit-item-dialog';
import { Input } from '@/components/ui/input';
import { addInventoryItem, deleteInventoryItem, getInventoryItems, updateInventoryItem } from '@/lib/firebase/firestore';
import { seedDatabase } from '@/lib/firebase/seed';


const statusVariantMap = {
  'In Stock': 'default',
  'Low Stock': 'secondary',
  'Out of Stock': 'destructive',
} as const;

const statusColorMap = {
  'In Stock': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Low Stock': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Out of Stock': 'bg-red-500/20 text-red-400 border-red-500/30',
} as const;

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [filter, setFilter] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const items = await getInventoryItems();
    setInventoryItems(items);
  };

  const handleDelete = (item: InventoryItem) => {
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteInventoryItem(itemToDelete.id);
      toast({
        title: "Item Deleted",
        description: `Successfully deleted "${itemToDelete.name}".`,
      });
      setItemToDelete(null);
      fetchItems();
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setItemToEdit(item);
  };

  const handleUpdateItem = async (updatedItem: InventoryItem) => {
    await updateInventoryItem(updatedItem.id, updatedItem);
    setItemToEdit(null);
    fetchItems();
  };

  const handleAddItem = async (newItem: Omit<InventoryItem, 'id' | 'status'>) => {
    const newStatus = newItem.stock === 0 ? 'Out of Stock' : newItem.stock < 10 ? 'Low Stock' : 'In Stock';
    await addInventoryItem({ ...newItem, status: newStatus });
    fetchItems();
  };

  const handleSeedDatabase = async () => {
    try {
      await seedDatabase();
      toast({
        title: "Database Seeded",
        description: "Successfully populated the inventory with initial data.",
      });
      fetchItems();
    } catch (error) {
      toast({
        title: "Seeding Failed",
        description: "Could not seed the database. Check the console for errors.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage your products and their stock levels here.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9"
            />
          </div>
           <Button variant="outline" onClick={handleSeedDatabase}>
            <Database className="mr-2 h-4 w-4" />
            Seed Database
          </Button>
          <AddItemDialog onAddItem={handleAddItem} />
        </div>
      </div>
      <Card>
        <CardContent className="!p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image
                      alt={item.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={item.imageUrl || 'https://placehold.co/100x100.png'}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={statusVariantMap[item.status]}
                      className={statusColorMap[item.status]}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(item)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleDelete(item)} className="text-red-500 focus:text-red-500">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item "{itemToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {itemToEdit && (
        <EditItemDialog
          item={itemToEdit}
          onUpdateItem={handleUpdateItem}
          onOpenChange={() => setItemToEdit(null)}
        />
      )}
    </div>
  );
}
