import { SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useContext, useRef } from "react";
import ChatContext from "./ChatContext";

interface ChatInputProps {
  isDisabled: boolean;
}
const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const { addMessage, message, handleInputChange, isLoading } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="bottom-0 left-0 absolute w-full">
      <div className="flex flex-row gap-3 mx-2 md:mx-4 md:last:md-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex md:flex-col flex-1 items-stretch gap-2 h-full">
          <div className="relative flex flex-col flex-grow p-4 w-full">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                rows={1}
                maxRows={4}
                autoFocus
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textareaRef.current?.focus();
                  }
                }}
                placeholder="Enter your question..."
                className="scrollbar-thumb-blue py-3 pr-12 scrollbar-thumb-rounded scrollbar-w-2 text-base resize-none scrollbar-track-blue-lighter scrolling-touch"
              />
              <Button
                disabled={isDisabled || isLoading}
                className="right-[8px] bottom-1.5 absolute"
                onClick={() => {
                  addMessage();
                  textareaRef.current?.focus();
                }}
              >
                <SendIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
