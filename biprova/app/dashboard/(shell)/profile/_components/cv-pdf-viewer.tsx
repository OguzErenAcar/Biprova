'use client';

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface CvPdfViewerProps {
  cvUrl: string;
}

export function CvPdfViewer({ cvUrl }: CvPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  }, []);

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="flex-1 overflow-y-auto flex flex-col items-center py-4 w-full bg-slate-100">
        <Document
          file={cvUrl}
          onLoadSuccess={onLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-40 text-slate-400 text-body">
              Yükleniyor...
            </div>
          }
          error={
            <div className="text-center text-slate-400 p-8">
              <div className="text-[2rem] mb-2">📄</div>
              <p className="text-body">CV yüklenemedi.</p>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption text-blue-600 font-semibold hover:underline mt-2 inline-block"
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
      </div>

      {numPages > 1 && (
        <div className="flex items-center justify-center gap-4 px-6 py-3 border-t border-slate-200 shrink-0 w-full bg-white">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors"
          >
            ←
          </button>
          <span className="text-caption text-slate-500">
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
  );
}
