"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useModalStore from "@/hooks/use-store-modal";

import { Farm } from "@prisma/client";

import {
  Check,
  PlusSquare,
  ChevronsUpDown,
  Store as StoreIcon,
} from "lucide-react";
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
import { CommandSeparator } from "cmdk";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;
interface FarmComboboxProps extends PopoverTriggerProps {
  farms: Farm[];
}

export function FarmCombobox({ farms = [] }: FarmComboboxProps) {
  const [open, setOpen] = useState(false);

  const params = useParams();
  const router = useRouter();
  const storeModal = useModalStore();

  const routes = farms.map((farm) => ({
    label: farm.name,
    id: farm.id,
  }));

  //find the Farm that is currently in the pathname
  const activeFarm = routes.find((farm) => farm.id === params?.farmId);

  const handleSelectRes = (farm: { label: string; id: string }) => {
    setOpen(false); //close modal
    router.push(`/dashboard/farms/${farm.id}`); //push to selected farm
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a farm"
          className="flex flex-row gap-4 border-none min-w-[150px]"
        >
          <StoreIcon size={20} />

          {activeFarm && <p>{activeFarm.label}</p>}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[230px] p-0 border">
        <Command>
          <CommandList>
            <CommandInput placeholder="My farm" />

            <CommandEmpty>No results.</CommandEmpty>

            <CommandGroup heading="Your farms">
              <CommandItem
                className={cn("cursor-pointer")}
                onSelect={() => router.push("/dashboard/farms")}
              >
                <StoreIcon size={20} />
                {!activeFarm?.label && (
                  <div className="ml-auto">
                    <Check />
                  </div>
                )}
              </CommandItem>
              {routes.map((route) => (
                <CommandItem
                  key={route.id}
                  onSelect={() => handleSelectRes(route)}
                  className={
                    (cn("text-sm"),
                    activeFarm?.label === route.label ? "font-bold" : "")
                  }
                >
                  {route.label}
                  {activeFarm?.label === route.label && (
                    <div className="ml-auto">
                      <Check />
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="font-bold flex gap-2 cursor-pointer"
                onSelect={() => {
                  storeModal.onOpen("create-initial-farm");
                }}
              >
                <PlusSquare />
                Create Farm
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
