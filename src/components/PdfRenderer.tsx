"use client";

import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import toast from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import SimpleBar from "simplebar-react";
import PdfFullScreen from "./PdfFullScreen";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.mjs`;

interface PdfRendererProp {
  url: string;
}
const PdfRenderer = ({ url }: PdfRendererProp) => {
  const { width, ref } = useResizeDetector();
  const [npages, setnPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;
  const customePageValidator = z.object({
    page: z
      .string()
      .refine((val) => Number(val) > 0 && Number(val) <= npages!, {
        message: "Enter a valid page number",
      }),
  });

  type TCustomPageValidator = z.infer<typeof customePageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(customePageValidator),
  });

  const handlePageSubmit = (data: TCustomPageValidator) => {
    setCurrentPage(Number(data.page));
    setValue("page", String(data.page));
  };
  return (
    <div className="flex flex-col items-center bg-white dark:bg-zinc-900 shadow rounded-md w-full">
      <div className="flex justify-between items-center border-zinc-200 px-2 border-b w-full h-14">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPage <= 1}
            onClick={() => {
              setCurrentPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
              setValue("page", String(currentPage - 1));
            }}
            variant="ghost"
            aria-label="Previous Page"
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
              className={cn(
                "w-12 h-8 bg-zinc-800",
                errors.page && "focus-visible:ring-red-500 border-red-500"
              )}
            />
            <p className="space-x-1 text-sm text-zinc-700">
              <span>of</span>
              <span>{npages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={currentPage >= npages!}
            onClick={() => {
              setCurrentPage((prev) =>
                prev + 1 > npages! ? npages! : prev + 1
              );
              setValue("page", String(currentPage + 1));
            }}
            variant="ghost"
            aria-label="Next Page"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="gap-1.5" variant="ghost" aria-label="zoom">
                <ZoomIn className="w-4 h-4" />
                {scale * 100}% <ChevronDown className="opacity-50 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(1);
                }}
              >
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(1.5);
                }}
              >
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(2);
                }}
              >
                200%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setScale(2.5);
                }}
              >
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            aria-label="rotate 90 degrees"
            variant={"ghost"}
            onClick={() => setRotate((prev) => prev + 90)}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <PdfFullScreen url={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
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
              {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotate}
                  key={"@" + renderedScale}
                />
              ) : null}
              <Page
                className={cn(isLoading ? "hidden" : "")}
                width={width ? width : 1}
                pageNumber={currentPage}
                scale={scale}
                rotate={rotate}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 w-6 h-6 animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PdfRenderer;
