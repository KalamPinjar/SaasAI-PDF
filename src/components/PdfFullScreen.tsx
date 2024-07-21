import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import toast from "react-hot-toast";
import { useResizeDetector } from "react-resize-detector";
interface PdfRendererProp {
  url: string;
}
const PdfFullScreen = ({ url }: PdfRendererProp) => {
  const [isOpen, setIsOpen] = useState(false);
  const [npages, setnPages] = useState<number>();
  const { width, ref } = useResizeDetector();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="ghost" className="gap-1.5" aria-label="Full Screen">
          <Expand className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-7xl">
        <SimpleBar autoHide={false} className="mt-6 max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center items-center w-full h-full">
                  <Loader2 className="my-24 w-6 h-6 animate-spin" />
                </div>
              }
              onLoadError={() => toast.error("Failed to load document")}
              onLoadSuccess={({ numPages }) => setnPages(numPages)}
              file={url}
              className="max-h-screen"
            >
              {new Array(npages).fill(0).map((_, index) => (
                <Page
                  key={index}
                  pageNumber={index + 1}
                  width={width ? width : 1}
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullScreen;
