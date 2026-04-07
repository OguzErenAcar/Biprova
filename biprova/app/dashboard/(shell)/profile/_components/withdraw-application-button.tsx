"use client";

import { useTransition } from "react";
import { withdrawApplication } from "@/features/users/actions";
import { Button } from "@/components/ui/button";

interface WithdrawApplicationButtonProps {
  applicationId: string;
}

export function WithdrawApplicationButton({ applicationId }: WithdrawApplicationButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleWithdraw() {
    startTransition(async () => {
      await withdrawApplication(applicationId);
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleWithdraw}
      disabled={isPending}
      className="text-meta font-semibold text-danger border-danger-surface bg-danger-surface hover:bg-danger-surface hover:text-danger h-auto px-2.5 py-1 rounded-[6px] whitespace-nowrap"
    >
      {isPending ? "..." : "Geri Al"}
    </Button>
  );
}
