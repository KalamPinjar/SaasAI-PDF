"use client";

import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadBtn";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import toast, { Toaster } from "react-hot-toast";

const DashboardPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
  }, []);

  const [currentlyDeleting, setCurrentlyDeleting] = useState<string | null>(
    null
  );
  const utils = trpc.useUtils();
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onError(error, variables, context) {
      toast.error("Failed to delete file");
      console.log(error);
      console.log({ variables, context });

      utils.getUserFiles.invalidate();

      setCurrentlyDeleting(null);
    },

    onSuccess: () => {
      toast.success("File deleted successfully");
      utils.getUserFiles.invalidate();
    },
    onMutate: ({ id }) => {
      setCurrentlyDeleting(id);
    },
    onSettled: () => {
      setCurrentlyDeleting(null);
    },
  });

  return (
    <main className="mx-auto md:p-10 max-w-7xl">
      <Toaster />
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4 sm:gap-0 border-gray-200 dark:border-gray-700 mt-8 pb-5 border-b">
        <h1 className="mb-3 font-semibold text-5xl text-gray-900 dark:text-gray-200">
          My Files
        </h1>
        <UploadButton />
      </div>
      {files && files?.length !== 0 ? (
        <ul className="gap-6 grid grid-cols-1 md:grid-cols-3 mt-8 divide-y divide-zinc-200">
          {files
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 bg-white shadow hover:shadow-lg dark:shadow-gray-900 rounded-lg divide-y divide-gray-200 transition"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center space-x-6 px-6 p-6 w-full">
                    <div className="flex-shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-10 h-10"></div>
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900 text-sm truncate capitalize">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="gap-6 grid grid-cols-3 mt-4 px-6 py-2 text-xs text-zinc-500 place-items">
                  <div className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {format(new Date(file.createdAt), "dd MMM yyyy")}
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <MessageSquare className="w-4 h-4" />
                    test
                  </div>
                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    disabled={currentlyDeleting === file.id}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    {currentlyDeleting === file.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        isDarkMode ? (
          <SkeletonTheme baseColor="#202020" highlightColor="#444">
            <Skeleton
              style={{
                padding: "1rem",
                marginRight: "0.5rem",
                marginTop: "2rem",
              }}
              inline={true}
              height={140}
              width={340}
              count={3}
            />
          </SkeletonTheme>
        ) : (
          <Skeleton
            style={{
              padding: "1rem",
              marginRight: "0.5rem",
              marginTop: "2rem",
            }}
            inline={true}
            height={140}
            width={340}
            count={3}
          />
        )
      ) : (
        <div className="flex flex-col items-center gap-2 mt-16">
          <Ghost className="w-24 h-24 text-zinc-800 dark:text-zinc-400" />
          <p className="text-zinc-700 dark:text-zinc-400">No files found</p>
          <p className="text-zinc-700 dark:text-zinc-400">
            Upload your PDF and start chatting!
          </p>
        </div>
      )}
    </main>
  );
};

export default DashboardPage;
