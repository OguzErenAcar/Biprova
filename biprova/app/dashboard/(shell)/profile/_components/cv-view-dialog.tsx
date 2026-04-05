'use client';

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CvViewDialogProps {
  cvUrl: string | null;
}

export function CvViewDialog({ cvUrl }: CvViewDialogProps) {
  const [open, setOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[0.75rem] font-bold px-2.5 py-1 rounded-[8px] transition-colors"
      >
        📄 CV&apos;mi Görüntüle
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-[20px] w-full max-w-3xl h-[90vh] shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto flex flex-col items-center py-4 bg-slate-100">
              {cvUrl ? (
                <Document
                  file={cvUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="flex items-center justify-center h-40 text-slate-400 text-[0.88rem]">
                      Yükleniyor...
                    </div>
                  }
                  error={
                    <div className="text-center text-slate-400 p-8">
                      <div className="text-[2rem] mb-2">📄</div>
                      <p className="text-[0.88rem]">CV yüklenemedi.</p>
                      <a
                        href={cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[0.82rem] text-blue-600 font-semibold hover:underline mt-2 inline-block"
                      >
                        Doğrudan aç ↗
                      </a>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    width={Math.min(700, window.innerWidth - 80)}
                    className="shadow-md"
                  />
                </Document>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="text-[2.5rem] mb-3">📄</div>
                  <p className="text-[0.88rem] font-medium">Henüz CV yüklenmemiş.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {cvUrl && numPages > 1 && (
              <div className="flex items-center justify-center gap-4 px-6 py-3 border-t border-slate-200 shrink-0">
                <button
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors"
                >
                  ←
                </button>
                <span className="text-[0.82rem] text-slate-500">
                  {pageNumber} / {numPages}
                </span>
                <button
                  onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
                  disabled={pageNumber >= numPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
