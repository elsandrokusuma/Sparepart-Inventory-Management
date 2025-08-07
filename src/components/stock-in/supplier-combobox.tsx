
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { suppliers as initialSuppliers } from "@/lib/data";

interface SupplierComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function SupplierCombobox({ value, onChange }: SupplierComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [suppliers, setSuppliers] = React.useState(initialSuppliers);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    // If the current value is not in the initial list, add it.
    if (value && !suppliers.some(s => s.value === value)) {
        const newSupplier = { value: value, label: value };
        setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier]);
    }
  }, [value, suppliers]);

  const filteredSuppliers = inputValue
    ? suppliers.filter((supplier) =>
        supplier.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : suppliers;

  const showAddNew = inputValue && !suppliers.some(s => s.value.toLowerCase() === inputValue.toLowerCase());


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
            ? suppliers.find((supplier) => supplier.value === value)?.label
            : "Select supplier..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search supplier..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {filteredSuppliers.length === 0 && !showAddNew && <CommandEmpty>No supplier found.</CommandEmpty>}
            <CommandGroup>
              {filteredSuppliers.map((supplier) => (
                <CommandItem
                  key={supplier.value}
                  value={supplier.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setInputValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === supplier.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {supplier.label}
                </CommandItem>
              ))}
               {showAddNew && (
                <CommandItem
                  value={inputValue}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    const newSupplier = { value: currentValue, label: currentValue };
                    if (!suppliers.some(s => s.value === currentValue)) {
                        setSuppliers(prev => [...prev, newSupplier]);
                    }
                    setOpen(false);
                    setInputValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      "opacity-0"
                    )}
                  />
                  Add "{inputValue}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
