'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const CvPdfViewer = dynamic(
  () => import('./cv-pdf-viewer').then((m) => m.CvPdfViewer),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-full text-slate-400 text-[0.88rem]">
      Yükleniyor...
    </div>
  )},
);

interface CvViewDialogProps {
  cvUrl: string | null;
}

export function CvViewDialog({ cvUrl }: CvViewDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[0.75rem] font-bold px-2.5 py-1 rounded-[8px] transition-colors"
      >
        📄 CV Görüntüle
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-[20px] w-full max-w-3xl h-[90vh] shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <span className="font-nunito font-black text-[1rem] text-slate-900">CV</span>
              <div className="flex items-center gap-3">
                {cvUrl && (
                  <a
                    href={cvUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.75rem] text-blue-600 font-semibold hover:underline"
                  >
                    İndir ↗
                  </a>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 text-[1.1rem] transition-colors"
                  aria-label="Kapat"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {cvUrl ? (
                <CvPdfViewer cvUrl={cvUrl} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="text-[2.5rem] mb-3">📄</div>
                  <p className="text-[0.88rem] font-medium">Henüz CV yüklenmemiş.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
