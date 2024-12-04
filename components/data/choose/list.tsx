"use client";
import { buttonVariants } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { ColorType, TitleType } from "@/types";
import { Check, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import pluralize from "pluralize";
import { useState } from "react";
import { deleteParams, updateParams } from "./action";

function List({
  data: d,
  title,
  existId,
  side,
  className,
  count,
  defaultOpen = false,
  keys,
}: {
  data: string;
  title: TitleType;
  existId: string | undefined;
  side?: "bottom" | "right";
  className?: string;
  count: number;
  defaultOpen?: boolean;
  keys: string;
}) {
  const data = JSON.parse(d) as {
    name: string;
    _id: string;
    color?: ColorType;
  }[];
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const paramId = searchParams.get(pluralize.singular(title)) || existId;
  const [activeParams, setActiveParams] = useState(paramId);
  const pathname = usePathname();

  const active = data.find((d) => d._id === activeParams);
  const currentParams = new URLSearchParams(searchParams.toString());
  currentParams.delete(
    pluralize.singular(title === "leaves" ? "leave" : title)
  );

  const allUrl = `${pathname}?${currentParams.toString()}`;

  return (
    <Popover defaultOpen={defaultOpen} onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        style={{
          backgroundColor: active?.color?.back,
          color: active?.color?.text,
        }}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "min-w-[180px] cart-bg flex justify-between capitalize px-4 rounded-lg",
          active && "hover:opacity-[50]",
          className
        )}
      >
        {active ? active.name : `Choose ${title}`}{" "}
        {side === "right" ? (
          <ChevronRight
            className={cn(
              "w-4 ml-2 transition-all duration-300",
              open && "transform rotate-180"
            )}
          />
        ) : (
          <ChevronDown
            className={cn(
              "w-4 ml-2 transition-all duration-300",
              open && "transform rotate-180"
            )}
          />
        )}
      </PopoverTrigger>
      <PopoverContent
        className="p-0 border-none mx-4 min-w-[220px]"
        side={side}
      >
        <Command className="border p-0">
          {count > 10 && (
            <CommandInput placeholder="Type a command or search..." />
          )}
          <CommandList className="max-h-[500px] p-0">
            <CommandEmpty>No results found.</CommandEmpty>{" "}
            <CommandItem className="p-1">
              <Link
                onClick={async () => {
                  setActiveParams("");
                  setOpen(false);
                  await deleteParams(keys);
                }}
                href={allUrl}
                className="py-2 pl-6 hover w-full rounded-md font-semibold"
              >
                All {title}
              </Link>
            </CommandItem>
            <CommandGroup className="p-0">
              {data.map((d, index) => {
                const currentParams = new URLSearchParams(
                  searchParams.toString()
                );
                currentParams.set(
                  pluralize.singular(title === "leaves" ? "leave" : title),
                  d._id
                );
                const active = activeParams === d._id;
                return (
                  <CommandItem className="p-1" key={index}>
                    <Link
                      style={{
                        color: d.color?.back,
                        textShadow: `.5px .5px .5px ${d.color?.text}`,
                      }}
                      className="py-2 pl-6 hover w-full rounded-md font-semibold relative"
                      href={`?${currentParams.toString()}`}
                      onClick={async () => {
                        setActiveParams(d._id);
                        setOpen(false);
                        await updateParams(keys, d._id);
                      }}
                    >
                      {active && <Check className="w-4 absolute left-1" />}{" "}
                      {d.name}
                    </Link>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default List;
