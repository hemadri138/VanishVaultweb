'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type SecureViewerProps = {
  fileType: 'image' | 'video' | 'pdf';
  src: string;
  viewerLabel: string;
};

export function SecureViewer({ fileType, src, viewerLabel }: SecureViewerProps) {
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfPages, setPdfPages] = useState(0);

  const watermarkText = useMemo(
    () => `${viewerLabel} - ${new Date().toLocaleString()}`,
    [viewerLabel]
  );

  useEffect(() => {
    const preventContext = (event: Event) => event.preventDefault();
    const preventKey = (event: KeyboardEvent) => {
      const blocked =
        (event.ctrlKey || event.metaKey) &&
        ['s', 'p', 'u', 'i', 'j', 'c'].includes(event.key.toLowerCase());
      if (blocked || event.key === 'PrintScreen') {
        event.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventContext);
    document.addEventListener('selectstart', preventContext);
    document.addEventListener('dragstart', preventContext);
    document.addEventListener('keydown', preventKey);

    return () => {
      document.removeEventListener('contextmenu', preventContext);
      document.removeEventListener('selectstart', preventContext);
      document.removeEventListener('dragstart', preventContext);
      document.removeEventListener('keydown', preventKey);
    };
  }, []);

  useEffect(() => {
    if (fileType !== 'image' || !imageCanvasRef.current) return;

    const canvas = imageCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = src;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      ctx.font = '20px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.34)';
      ctx.rotate(-0.3);

      for (let y = 0; y < canvas.height * 1.8; y += 140) {
        for (let x = -canvas.width; x < canvas.width * 1.4; x += 320) {
          ctx.fillText(watermarkText, x, y);
        }
      }
    };
  }, [fileType, src, watermarkText]);

  if (fileType === 'image') {
    return <canvas ref={imageCanvasRef} className="mx-auto max-h-[78vh] w-auto rounded-xl border border-border" />;
  }

  if (fileType === 'video') {
    return (
      <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-xl border border-border">
        <video src={src} controls controlsList="nodownload noplaybackrate" className="h-auto w-full" />
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm font-medium text-white/45">
          {watermarkText}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-4">
      <Document file={src} onLoadSuccess={(pdf) => setPdfPages(pdf.numPages)}>
        {Array.from({ length: pdfPages }, (_, index) => (
          <Page
            key={index + 1}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="mb-4 overflow-hidden rounded-lg border border-border"
            width={900}
          />
        ))}
      </Document>
      <div className="mt-2 text-center text-xs text-fg/60">Watermarked for {viewerLabel}</div>
    </div>
  );
}
