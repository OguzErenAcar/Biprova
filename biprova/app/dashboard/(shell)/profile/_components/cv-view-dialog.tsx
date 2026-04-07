'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const CvPdfViewer = dynamic(
  () => import('./cv-pdf-viewer').then((m) => m.CvPdfViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-slate-400 text-body">
        Yükleniyor...
      </div>
    ),
  },
);

interface CvViewDialogProps {
  cvUrl: string | null;
}

export function CvViewDialog({ cvUrl }: CvViewDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        className="font-bold gap-1.5"
      >
        📄 CV Görüntüle
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 py-4 border-b border-slate-200 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="font-nunito font-black text-base text-slate-900">CV</DialogTitle>
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-meta text-blue-600 font-semibold hover:underline mr-8"
                >
                  İndir ↗
                </a>
              )}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {cvUrl ? (
              <CvPdfViewer cvUrl={cvUrl} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="text-[2.5rem] mb-3">📄</div>
                <p className="text-body font-medium">Henüz CV yüklenmemiş.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
