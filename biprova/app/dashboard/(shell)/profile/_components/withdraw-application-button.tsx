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
    <button
      onClick={handleWithdraw}
      disabled={isPending}
      className="text-[0.72rem] font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-[6px] whitespace-nowrap transition-colors disabled:opacity-50"
    >
      {isPending ? "..." : "Geri Al"}
    </button>
  );
}
