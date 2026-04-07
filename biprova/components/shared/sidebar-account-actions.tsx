"use client";

import { useState } from "react";
import { logout, deleteAccount } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SidebarAccountActions() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setIsLoading(true);
    await logout();
  }

  async function handleDeleteAccount() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await deleteAccount();
    if (result && "error" in result) {
      setError(result.error);
      setIsLoading(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div id="sidebar-account-actions" className="flex flex-col gap-0.5">
      {error && (
        <Alert variant="destructive" className="mb-1 py-2">
          <AlertDescription className="text-label">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        variant="ghost"
        onClick={handleLogout}
        disabled={isLoading}
        className="justify-start gap-[0.65rem] px-3 py-[0.65rem] text-body font-semibold text-slate-500 hover:text-slate-900 h-auto rounded-[10px]"
      >
        <span className="text-[1.1rem] w-5 text-center">🚪</span>
        Çıkış Yap
      </Button>

      {confirmDelete ? (
        <Alert className="px-3 py-2 bg-red-50 border-red-200">
          <AlertDescription>
            <p className="text-meta text-red-700 font-medium mb-2">
              Emin misin? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 text-meta bg-red-600 hover:bg-red-700 text-white h-7"
              >
                {isLoading ? "Siliniyor..." : "Evet, Sil"}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setConfirmDelete(false)}
                disabled={isLoading}
                className="flex-1 text-meta h-7"
              >
                İptal
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <Button
          variant="ghost"
          onClick={handleDeleteAccount}
          disabled={isLoading}
          className="justify-start gap-[0.65rem] px-3 py-[0.65rem] text-body font-semibold text-red-400 hover:bg-red-50 hover:text-red-600 h-auto rounded-[10px]"
        >
          <span className="text-[1.1rem] w-5 text-center">🗑️</span>
          Hesabı Sil
        </Button>
      )}
    </div>
  );
}
