"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { FeedFilter } from "@/features/projects/actions";

const FILTER_OPTIONS: { label: string; value: FeedFilter }[] = [
  { label: "Tümü", value: "all" },
  { label: "Şehrim", value: "sehrim" },
  { label: "Remote", value: "remote" },
];

interface FeedFilterDropdownProps {
  activeFilter: FeedFilter;
}

export function FeedFilterDropdown({ activeFilter }: FeedFilterDropdownProps) {
  const router = useRouter();

  const activeLabel = FILTER_OPTIONS.find((o) => o.value === activeFilter)?.label ?? "Tümü";

  function handleSelect(value: FeedFilter) {
    router.push(value === "all" ? "/dashboard" : `?filter=${value}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
          {activeLabel}
          <ChevronDown className="w-3.5 h-3.5 text-ink-subtle" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleSelect(value)}
            className={activeFilter === value ? "text-brand bg-brand-surface focus:bg-brand-surface focus:text-brand" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
