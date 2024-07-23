import { cn } from "@/lib/utils";
import { ExtendedMessage } from "@/types/message";
import Icon from "../icons";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import { forwardRef } from "react";

interface MessageProps {
  message: ExtendedMessage;
  isNextMessageSamePerson: boolean;
}
// eslint-disable-next-line react/display-name
export const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson },ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-end", {
          "justify-end": message.isUserMessage,
        })}
      >
        <div
          className={cn(
            "relative flex h-6 w-6 aspect-square items-center justify-center",
            {
              "order-2 bg-blue-600 rounded-sm": message.isUserMessage,
              "order-1  bg-zinc-300 dark:bg-zinc-700 rounded-sm":
                !message.isUserMessage,
              invisible: isNextMessageSamePerson,
            }
          )}
        >
          {message.isUserMessage ? (
            <Icon.user className="w-3/4 h-3/4 text-zinc-700 fill-zinc-800 dark:fill-white" />
          ) : (
            <Icon.logo className="w-3/4 h-3/4 fill-zinc-800 dark:fill-white" />
          )}
        </div>

        <div
          className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
            "order-1 items-end": message.isUserMessage,
            "order-2 items-start": !message.isUserMessage,
          })}
        >
          <div
            className={cn("px-2 py-2 rounded-lg inline-block", {
              "bg-blue-600 text-white": message.isUserMessage,
              "bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-white":
                !message.isUserMessage,
              "rounded-br-none":
                !isNextMessageSamePerson && message.isUserMessage,
              "rounded-bl-none":
                !isNextMessageSamePerson && !message.isUserMessage,
            })}
          >
            {typeof message.text === "string" ? (
              <ReactMarkdown
                className={cn("prose", {
                  "dark:prose-invert": !message.isUserMessage,
                  "prose-invert": message.isUserMessage,
                })}
              >
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn("text-xs select-none mt-2 w-full text-right", {
                  "text-zinc-500": !message.isUserMessage,
                  "text-white": message.isUserMessage,
                })}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);
