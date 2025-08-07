
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
import { locations as initialLocations } from "@/lib/data";

interface LocationComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationCombobox({ value, onChange }: LocationComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [locations, setLocations] = React.useState(initialLocations);
  const [inputValue, setInputValue] = React.useState("");

  React.useEffect(() => {
    // If the current value is not in the initial list, add it.
    if (value && !locations.some(l => l.value === value)) {
        const newLocation = { value: value, label: value };
        setLocations(prevLocations => [...prevLocations, newLocation]);
    }
  }, [value, locations]);

  const filteredLocations = inputValue
    ? locations.filter((location) =>
        location.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : locations;

  const showAddNew = inputValue && !locations.some(l => l.value.toLowerCase() === inputValue.toLowerCase());


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
            ? locations.find((location) => location.value === value)?.label
            : "Select location..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search location..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            {filteredLocations.length === 0 && !showAddNew && <CommandEmpty>No location found.</CommandEmpty>}
            <CommandGroup>
              {filteredLocations.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    setInputValue("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === location.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location.label}
                </CommandItem>
              ))}
               {showAddNew && (
                <CommandItem
                  value={inputValue}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    const newLocation = { value: currentValue, label: currentValue };
                    if (!locations.some(l => l.value === currentValue)) {
                        setLocations(prev => [...prev, newLocation]);
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
