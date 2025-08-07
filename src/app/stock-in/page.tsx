
"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Transaction, InventoryItem, locations } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AddStockInDialog } from '@/components/stock-in/add-stock-in-dialog';
import { ClientFormattedDate } from '@/components/client-formatted-date';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getTransactions, addTransaction, getInventoryItems } from '@/lib/firebase/firestore';

const fromOptions = [
    "Items from Jakarta",
    "Items from Cannibals",
    "Items from Vendors",
    "Local Purchases",
    "Modification Remainder",
    "Service Remainder",
    "QC Remainder",
];


export default function StockInPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filters, setFilters] = useState<{
    dateRange: DateRange | undefined;
    item: string;
    location: string;
    from: string;
  }>({
    dateRange: undefined,
    item: '',
    location: '',
    from: '',
  });

  const [popoverOpen, setPopoverOpen] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [transactionsData, itemsData] = await Promise.all([getTransactions(), getInventoryItems()]);
    setTransactions(transactionsData);
    setInventoryItems(itemsData);
  };

  const handleAddStockIn = async (values: { itemId: string; quantity: number; from: string; }) => {
    const item = inventoryItems.find(i => i.id === values.itemId);
    if (!item) return;

    const newTransaction: Omit<Transaction, 'id'> = {
      type: 'IN',
      item: item.name,
      itemId: values.itemId,
      quantity: values.quantity,
      from: values.from,
      date: new Date().toISOString(),
      user: 'Admin', // Assuming a static user for now
    };
    await addTransaction(newTransaction);
    fetchData();
  };

  const clearFilters = () => {
    setFilters({
      dateRange: undefined,
      item: '',
      location: '',
      from: '',
    });
  };
  
  const activeFilterCount = [
    filters.dateRange,
    filters.item,
    filters.location,
    filters.from,
  ].filter(Boolean).length;


  const stockInTransactions = transactions
    .filter(tx => tx.type === 'IN')
    .filter(tx => {
      const { dateRange, item, location, from } = filters;

      if (dateRange?.from && new Date(tx.date) < dateRange.from) return false;
      if (dateRange?.to && new Date(tx.date) > new Date(dateRange.to).setHours(23, 59, 59, 999)) return false;
      
      const inventoryItem = inventoryItems.find(i => i.id === tx.itemId);
      if (location && inventoryItem?.location.toLowerCase() !== location.toLowerCase()) return false;
      
      if (item && tx.item.toLowerCase() !== item.toLowerCase()) return false;
      
      if (from && tx.from?.toLowerCase() !== from.toLowerCase()) return false;

      return true;
    });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stock In History</h2>
          <p className="text-muted-foreground">
            A log of all received inventory.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  {activeFilterCount > 0 && (
                     <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {activeFilterCount}
                     </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Set filters to refine the results.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                       <label className="text-sm font-medium">Date</label>
                        <div className="col-span-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !filters.dateRange && "text-muted-foreground"
                                    )}
                                    >
                                    {filters.dateRange?.from ? (
                                        filters.dateRange.to ? (
                                        <>
                                            {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                                            {format(filters.dateRange.to, "LLL dd, y")}
                                        </>
                                        ) : (
                                        format(filters.dateRange.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={filters.dateRange?.from}
                                    selected={filters.dateRange}
                                    onSelect={(range) => setFilters(f => ({...f, dateRange: range}))}
                                    numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                       <label className="text-sm font-medium">Item</label>
                       <div className="col-span-2">
                            <FilterCombobox
                                type="item"
                                options={inventoryItems.map(item => ({value: item.name.toLowerCase(), label: item.name}))}
                                value={filters.item}
                                onChange={(value) => setFilters(f => ({...f, item: value}))}
                            />
                       </div>
                    </div>
                     <div className="grid grid-cols-3 items-center gap-4">
                       <label className="text-sm font-medium">Location</label>
                       <div className="col-span-2">
                            <FilterCombobox
                                type="location"
                                options={locations.map(loc => ({value: loc.value.toLowerCase(), label: loc.label}))}
                                value={filters.location}
                                onChange={(value) => setFilters(f => ({...f, location: value}))}
                            />
                       </div>
                    </div>
                     <div className="grid grid-cols-3 items-center gap-4">
                       <label className="text-sm font-medium">From</label>
                       <div className="col-span-2">
                           <FilterCombobox
                                type="from"
                                options={fromOptions.map(from => ({value: from.toLowerCase(), label: from}))}
                                value={filters.from}
                                onChange={(value) => setFilters(f => ({...f, from: value}))}
                            />
                       </div>
                    </div>
                  </div>
                   <Button variant="ghost" onClick={clearFilters} className="w-full justify-center">
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                </div>
              </PopoverContent>
            </Popover>
            <AddStockInDialog onAddStockIn={handleAddStockIn} inventoryItems={inventoryItems}/>
        </div>
      </div>

      <Card>
        <CardContent className="!p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>From</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockInTransactions.map((tx) => {
                const item = inventoryItems.find(i => i.id === tx.itemId);
                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <ClientFormattedDate date={tx.date} format="PPP p" />
                    </TableCell>
                    <TableCell className="font-medium">{tx.item}</TableCell>
                    <TableCell>{item?.location || '-'}</TableCell>
                    <TableCell>{tx.quantity}</TableCell>
                    <TableCell>{tx.from}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}


function FilterCombobox({ type, options, value, onChange }: { type: string, options: {value: string, label: string}[], value: string, onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false)
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : `Select ${type}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${type}...`} />
          <CommandList>
            <CommandEmpty>No {type} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
