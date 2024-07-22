"use client";

import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery({
    fileId,
  });

  if (isLoading)
    return (
      <div className="relative flex flex-col justify-between gap-2 bg-zinc-50 dark:bg-slate-900 divide-y divide-zinc-200 min-h-full dark:text-zinc-400">
        <div className="flex flex-col flex-1 justify-center items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-sm text-zinc-500">
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "PROCESSING")
    return (
      <div className="relative flex flex-col justify-between gap-2 bg-zinc-50 dark:bg-slate-900 divide-y divide-zinc-200 min-h-full dark:text-zinc-400">
        <div className="flex flex-col flex-1 justify-center items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <h3 className="font-semibold text-xl">Processing PDF...</h3>
            <p className="text-sm text-zinc-500">This won&apos;t take long.</p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative flex flex-col justify-between gap-2 bg-zinc-50 dark:bg-slate-900 divide-y divide-zinc-200 min-h-full dark:text-zinc-400">
        <div className="flex flex-col flex-1 justify-center items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="w-8 h-8 text-red-500" />
            <h3 className="font-semibold text-xl">Too many pages in PDF</h3>
            <p className="text-sm text-zinc-500">
              Your <span className="font-medium">Free</span> plan supports up to
              5 pages per PDF.
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className="mr-1.5 w-3 h-3" />
              Back
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    );

  return (
    <div className="relative flex flex-col justify-between gap-2 bg-zinc-50 dark:bg-slate-900 divide-y divide-zinc-200 min-h-full dark:text-zinc-400">
      <div className="flex flex-col flex-1 justify-between mb-28">
        <Messages />
        <ChatInput isDisabled />
      </div>
    </div>
  );
};

export default ChatWrapper;
