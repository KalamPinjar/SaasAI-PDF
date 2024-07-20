"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.mjs`; 

interface PdfRendererProp {
  url: string;
}

const PdfRenderer = ({ url }: PdfRendererProp) => {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-zinc-900 shadow rounded-md w-full">
      <div className="flex justify-between items-center border-zinc-200 px-2 border-b w-full h-14">
        <div className="flex items-center gap-1.5">top bar</div>
      </div>
      <div className="flex-1 w-full max-h-screen overflow-y-auto">
        <Document file={url} className="max-h-screen">
          <Page pageNumber={1} />
        </Document>
      </div>
    </div>
  );
};

export default PdfRenderer;
