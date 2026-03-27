"use client";

import { useState } from "react";
import { logout, deleteAccount } from "@/features/auth/actions";

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
    <div className="flex flex-col gap-0.5">
      {error && (
        <p className="text-[0.72rem] text-red-500 px-3 pb-1">{error}</p>
      )}

      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center gap-[0.65rem] px-3 py-[0.65rem] rounded-[10px] text-[0.9rem] font-semibold text-slate-500 cursor-pointer hover:bg-slate-100 hover:text-slate-900 transition-all duration-150 w-full text-left disabled:opacity-50"
      >
        <span className="text-[1.1rem] w-5 text-center">🚪</span>
        Çıkış Yap
      </button>

      {confirmDelete ? (
        <div className="px-3 py-2 rounded-[10px] bg-red-50 border border-red-200">
          <p className="text-[0.75rem] text-red-700 font-medium mb-2">
            Emin misin? Bu işlem geri alınamaz.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDeleteAccount}
              disabled={isLoading}
              className="flex-1 text-[0.75rem] font-semibold py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Siliniyor..." : "Evet, Sil"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={isLoading}
              className="flex-1 text-[0.75rem] font-semibold py-1 rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors disabled:opacity-50"
            >
              İptal
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleDeleteAccount}
          disabled={isLoading}
          className="flex items-center gap-[0.65rem] px-3 py-[0.65rem] rounded-[10px] text-[0.9rem] font-semibold text-red-400 cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all duration-150 w-full text-left disabled:opacity-50"
        >
          <span className="text-[1.1rem] w-5 text-center">🗑️</span>
          Hesabı Sil
        </button>
      )}
    </div>
  );
}
