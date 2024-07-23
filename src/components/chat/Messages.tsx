import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { Message } from "./Message";
import Skeleton from "react-loading-skeleton";
import { MessageSquare } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import ChatContext from "./ChatContext";
import { SkeletonTheme } from "react-loading-skeleton";
import { useIntersection } from "@mantine/hooks";

const Messages = ({ fileId }: { fileId: string }) => {
  const { isLoading: isAIThinking } = useContext(ChatContext);
  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      }
    );

  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
  }, []);

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    text: (
      <div className="flex flex-row gap-2">
        <div className="bg-zinc-700 dark:bg-zinc-200 rounded-full w-2 h-2 animate-pulse" />
        <div className="bg-zinc-700 dark:bg-zinc-200 rounded-full w-2 h-2 animate-pulse" />
        <div className="bg-zinc-700 dark:bg-zinc-200 rounded-full w-2 h-2 animate-pulse" />
      </div>
    ),
    isUserMessage: false,
  };

  const combineMessages = [
    ...(isAIThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { entry, ref } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  return (
    <div className="flex flex-col-reverse gap-4 border-zinc-200 dark:border-zinc-700 scroll-bar-thumb-blue p-3 scrollbar-thumb-rounded scrollbar-w-2 max-h-[calc(100vh-3.5rem-7rem)] overflow-y-auto scrollbar-track-blue-lighter scrolling-touch">
      {combineMessages && combineMessages.length > 0 ? (
        combineMessages.map((message, i) => {
          const isNextMessageSamePerson =
            combineMessages[i + 1]?.isUserMessage ===
            combineMessages[i]?.isUserMessage;
          if (i === combineMessages.length - 1) {
            return (
              <Message
                ref={ref}
                key={message.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
                message={message}
              />
            );
          } else
            return (
              <Message
                key={message.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
                message={message}
              />
            );
        })
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
              height={60}
              width={340}
              count={4}
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
            height={60}
            width={340}
            count={4}
          />
        )
      ) : (
        <div className="flex flex-col flex-1 justify-center items-center gap-2">
          <MessageSquare className="w-8 h-8 text-blue-400" />
          <h3 className="text-zinc-400">You&apos;re all set!</h3>
          <p className="text-sm text-zinc-400">
            Ask your first question to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
