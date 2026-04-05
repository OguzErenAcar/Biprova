'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CvViewDialogProps {
  cvUrl: string;
}

export function CvViewDialog({ cvUrl }: CvViewDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[0.75rem] font-bold px-2.5 py-1 rounded-[8px] transition-colors"
      >
        📄 CV&apos;mi Görüntüle
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-200 shrink-0">
            <DialogTitle className="text-[1rem] font-bold text-slate-900">
              CV
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={`${cvUrl}#toolbar=1`}
              className="w-full h-full border-0"
              title="CV"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
