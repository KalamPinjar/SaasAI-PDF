import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useMutation } from "@tanstack/react-query";
import { createContext, useRef, useState } from "react";
import toast from "react-hot-toast";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});
export default ChatContext;

type Props = {
  fileId: string;
  children: React.ReactNode;
};
export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const utils = trpc.useUtils();
  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch(`/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileId, message }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.body;
    },
    onMutate: async ({ message }) => {
      backupMessage.current = message;
      setMessage("");

      await utils.getFileMessages.cancel();

      const snapshot = utils.getFileMessages.getInfiniteData();
      utils.getFileMessages.setInfiniteData(
        {
          fileId,
          limit: INFINITE_QUERY_LIMIT,
        },
        (old) => {
          if (!old) {
            // Ensure you include pageParams even when old is undefined or empty
            return {
              pages: [],
              pageParams: [], // Initialize pageParams as an empty array
            };
          }

          let newPages = [...old.pages];
          let latestPage = newPages[0]!;
          latestPage.messages = [
            {
              createdAt: new Date().toISOString(),
              id: crypto.randomUUID(),
              text: message,
              isUserMessage: true,
            },
            ...latestPage.messages,
          ];
          newPages[0] = latestPage;

          return {
            ...old,
            pages: newPages,
          };
        }
      );
      setIsLoading(true);
      return {
        snapshot: snapshot?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream) {
        toast.error("Failed to send message");
        return;
      }

      const reader = stream?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accResponse = "";

      while (!done) {
        try {
          const readResult = await reader?.read();
          if (readResult) {
            const { value, done: doneReading } = readResult;
            done = doneReading;
            const chunkValue = decoder.decode(value);
            accResponse += chunkValue;

            // console.log("Received chunk: ", chunkValue);
            // console.log("Accumulated response: ", accResponse);

            utils.getFileMessages.setInfiniteData(
              { fileId, limit: INFINITE_QUERY_LIMIT },
              (old) => {
                if (!old) {
                  return {
                    pages: [],
                    pageParams: [],
                  };
                }

                let isAiResponseCreated = old.pages.some((page) =>
                  page.messages.some((message) => message.id === "ai-response")
                );

                let updatedPages = old.pages.map((page) => {
                  if (page === old.pages[0]) {
                    let updatedMessages;

                    if (!isAiResponseCreated) {
                      updatedMessages = [
                        {
                          createdAt: new Date().toISOString(),
                          id: "ai-response",
                          text: accResponse,
                          isUserMessage: false,
                        },
                        ...page.messages,
                      ];
                    } else {
                      updatedMessages = page.messages.map((message) => {
                        if (message.id === "ai-response") {
                          return {
                            ...message,
                            text: accResponse,
                          };
                        }
                        return message;
                      });
                    }

                    return {
                      ...page,
                      messages: updatedMessages,
                    };
                  }

                  return page;
                });

                return {
                  ...old,
                  pages: updatedPages,
                };
              }
            );
          }
        } catch (error) {
          console.error("Error reading stream: ", error);
          toast.error("Error reading stream");
          done = true; // Exit the loop on error
        }
      }
    },

    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.getFileMessages.setData(
        {
          fileId,
        },
        { messages: context?.snapshot ?? [] }
      );
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const addMessage = () => {
    sendMessage({ message });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
