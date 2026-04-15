"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ChevronDown } from "lucide-react";
import { notify } from "@/lib/notify";
import type { FeedFilter } from "@/features/projects/actions";

const FILTER_OPTIONS: { label: string; value: FeedFilter }[] = [
  { label: "Tümü", value: "all" },
  { label: "Konum", value: "nearby" },
  { label: "Remote", value: "remote" },
];

interface FeedFilterDropdownProps {
  activeFilter: FeedFilter;
}

export function FeedFilterDropdown({ activeFilter }: FeedFilterDropdownProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const locationOn = activeFilter === "nearby";

  const activeLabel = FILTER_OPTIONS.find((o) => o.value === activeFilter)?.label ?? "Tümü";

  function handleSelect(value: FeedFilter) {
    if (value === "nearby" && activeFilter !== "nearby") {
      setDialogOpen(true);
      return;
    }
    router.push(value === "all" ? "/dashboard" : `?filter=${value}`);
  }

  function handleLocationToggle(checked: boolean) {
    if (!checked) {
      setDialogOpen(false);
      router.push("/dashboard");
      return;
    }

    if (!navigator?.geolocation) {
      notify.location.unsupported();
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationLoading(false);
        setDialogOpen(false);
        router.push(
          `/dashboard?filter=nearby&lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
        );
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          notify.location.denied();
        } else {
          notify.location.unavailable();
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60_000 }
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="gap-1.5 flex text-ink font-semibold">
            {activeLabel}
            <ChevronDown className="w-3.5 h-3.5 text-ink" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <DropdownMenuItem
              key={value}
              onClick={() => handleSelect(value)}
              className={activeFilter === value ? "text-brand focus:text-brand" : ""}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Konum Gerekli</DialogTitle>
            <DialogDescription>
              Yakınındaki projeleri görmek için konumuna erişmemiz gerekiyor.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm font-semibold text-ink">Konumu Aç</span>
            <Switch
              checked={locationOn}
              disabled={locationLoading}
              onCheckedChange={handleLocationToggle}
            />
          </div>

          {locationLoading && (
            <p className="text-xs text-slate-400">Konum alınıyor...</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
