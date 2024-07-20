"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import toast from "react-hot-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const UploadDropZone = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Polling error:", error);
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedUpload = (): NodeJS.Timeout => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 95) {
          clearInterval(interval);
          return oldProgress;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);
    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      accept={{ "application/pdf": [".pdf"] }}
      maxSize={4 * 1024 * 1024} // 4MB
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);
        const progressInterval = startSimulatedUpload();

        const res = await startUpload(acceptedFiles);

        if (res && Array.isArray(res)) {
          const [fileResponse] = res;
          const key = fileResponse?.key;

          if (!key) {
            toast.error("Failed to upload file");
            return;
          }


          clearInterval(progressInterval);
          setProgress(100);

          startPolling({ key });
        } else {
          toast.error("Failed to retrieve file response");
        }
      }}
    >
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        acceptedFiles,
        fileRejections,
      }) => (
        <div
          {...getRootProps()}
          className={`flex flex-col justify-center items-center border-2 border-dashed rounded-lg w-full h-64 cursor-pointer ${
            isDragActive
              ? "bg-gray-200 dark:bg-zinc-800"
              : "bg-gray-50 dark:bg-zinc-900/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col justify-center items-center p-4 w-full h-full">
            <Cloud className="mb-3 w-10 h-10 text-gray-400" />
            <p className="text-center text-gray-500 text-sm dark:text-gray-400">
              <span className="font-semibold">Click to upload PDF</span> or drag
              and drop PDF
              <br />
              PDF (up to 4MB)
            </p>
            {acceptedFiles.length > 0 && (
              <p className="mt-2 text-green-500 text-sm">
                File accepted: {acceptedFiles[0].name}
              </p>
            )}
            {fileRejections.length > 0 && (
              <p className="mt-2 text-red-500 text-sm">
                File rejected: {fileRejections[0].file.name}
              </p>
            )}
            {acceptedFiles && acceptedFiles[0] && (
              <div className="flex items-center bg-white dark:bg-zinc-900 mt-2 rounded-md divide-x divide-x-200 max-w-xs overflow-hidden outline outline-[1px] outline-zinc-200">
                <div className="place-items-center grid px-3 py-2 h-full">
                  <File className="w-6 h-6 text-blue-500"></File>
                </div>
                <div className="place-items-center grid px-3 py-2 h-full truncate">
                  {acceptedFiles[0].name}
                </div>
              </div>
            )}
            {isUploading && (
              <div className="mx-auto mt-4 w-full max-w-xs">
                <Progress
                  indicatorColor={
                    progress > 50
                      ? "bg-green-500"
                      : progress > 0
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }
                  value={progress}
                  className="bg-zinc-200 dark:bg-zinc-800 w-full h-1"
                />
                {progress === 100 ? (
                  <div className="flex justify-center items-center gap-1 pt-2 text-center text-sm text-zinc-700">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting...
                  </div>
                ) : null}
              </div>
            )}
            <input
              {...getInputProps()}
              type="file"
              id="dropzone-file"
              className="hidden"
            />
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button
          className="font-semibold dark:text-white/75"
          onClick={() => setOpen(true)}
        >
          Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <UploadDropZone />
      </DialogContent>
    </Dialog>
  );
};

export default UploadButton;
