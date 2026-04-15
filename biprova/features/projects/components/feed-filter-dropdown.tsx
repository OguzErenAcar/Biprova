"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocation } from "@/contexts/location-context";
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
import { getUserLocation } from "@/lib/location";
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
  const { coords, locationOn, setLocation, clearLocation } = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const activeLabel = FILTER_OPTIONS.find((o) => o.value === activeFilter)?.label ?? "Tümü";

  function handleSelect(value: FeedFilter) {
    if (value === "nearby") {
      if (coords) {
        router.push(`?filter=nearby&lat=${coords.lat}&lng=${coords.lng}`);
      } else {
        setDialogOpen(true);
      }
      return;
    }
    router.push(value === "all" ? "/dashboard" : `/dashboard?filter=${value}`);
  }

  function handleLocationToggle(checked: boolean) {
    if (!checked) {
      setDialogOpen(false);
      clearLocation();
      router.push("/dashboard");
      return;
    }

    setLocationLoading(true);

    getUserLocation().then((result) => {
      setLocationLoading(false);
      if (result.error) {
        if (result.error === "permission_denied") notify.location.denied();
        else if (result.error === "unsupported") notify.location.unsupported();
        else notify.location.unavailable();
        return;
      }
      setDialogOpen(false);
      setLocation(result.point!.lat, result.point!.lng, result.city);
      router.push(
        `/dashboard?filter=nearby&lat=${result.point!.lat}&lng=${result.point!.lng}`
      );
    });
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
