import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="flex flex-col justify-center items-center mt-27 sm:mt-40 mb-12 text-center">
        <div className="flex justify-center items-center space-x-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-white/50 dark:hover:bg-white/90 shadow-md backdrop-blur backdrop-md mx-auto mb-4 px-7 py-2 border rounded-full max-w-fit transition-all overflow-hidden">
          <p className="font-semibold text-2xl text-gray-700 dark:text-black">
            DocQuerry
          </p>
        </div>
        <h1 className="max-w-4xl font-bold text-5xl md:text-6xl lg:text-7xl">
          Chat with your <span className="text-blue-500">documents</span>
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          DocQuerry is a web app that allows you to chat with your documents.
          Simply upload your documents and start chatting.
        </p>

        <Link
          className={buttonVariants({
            size: "lg",
            className: "mt-8 dark:text-white",
          })}
          href="/dashboard"
          target="_blank"
        >
          Get started <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </MaxWidthWrapper>

      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="-top-40 sm:-top-80 -z-10 absolute inset-x-0 blur-3xl transform-gpu overflow-hidden pointer-events-none"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] sm:left-[calc(50%-30rem)] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 w-[36.125rem] sm:w-[72.1875rem] -translate-x-1/2 aspect-[1155/678] rotate-[30deg]"
            />
          </div>

          <div>
            <div className="mx-auto px-6 lg:px-8 max-w-6xl">
              <div className="mt-16 sm:mt-24 flow-root">
                <div className="bg-gray-900/5 dark:bg-gray-100/5 -m-2 lg:-m-4 p-2 lg:p-4 rounded-xl lg:rounded-2xl ring-1 ring-gray-900/10 ring-inset">
                  <Image
                    src="/dashboard-preview.jpg"
                    width={1364}
                    height={866}
                    alt="product-preview"
                    quality={100}
                    className="bg-white shadow-2xl p-2 sm:p-8 md:p-20 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-32 sm:mt-56 mb-32 max-w-5xl">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="font-bold text-3xl text-gray-900 sm:text-4xl dark:text-gray-300 tracking-tight">
              Start chatting with your documents in minutes
            </h2>
            <p className="mt-4 text-gray-600 text-lg leading-8">
              Chatting with your documents is a breeze. Simply upload your
              documents and start chatting.
            </p>
          </div>
        </div>

        <ol className="md:flex md:space-x-12 space-y-4 md:space-y-0 my-8 p-2 pt-8">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-zinc-300 py-2 md:pt-4 md:pb-0 pl-4 md:pl-0 md:border-t-2 border-l-4 md:border-l-0">
              <span className="font-medium text-blue-600 text-sm">Step 1</span>
              <h3 className="font-medium text-gray-900 text-xl dark:text-gray-300">
                Sign up for an account
              </h3>
              <p className="text-gray-600">
                Either starting out with a free account or signing up for a{" "}
                <Link
                  href="/pricing"
                  target="_blank"
                  className="text-blue-700 underline underline-offset-2"
                >
                  paid plan.
                </Link>
              </p>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-zinc-300 py-2 md:pt-4 md:pb-0 pl-4 md:pl-0 md:border-t-2 border-l-4 md:border-l-0">
              <span className="font-medium text-blue-600 text-sm">Step 2</span>
              <h3 className="font-medium text-gray-900 text-xl dark:text-gray-300">
                Upload your documents
              </h3>
              <p className="text-gray-600">
                And we&apos;ll take care of the rest
              </p>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-zinc-300 py-2 md:pt-4 md:pb-0 pl-4 md:pl-0 md:border-t-2 border-l-4 md:border-l-0">
              <span className="font-medium text-blue-600 text-sm">Step 3</span>
              <h3 className="font-medium text-gray-900 text-xl dark:text-gray-300">
                Start chatting
              </h3>
              <p className="text-gray-600">It&apos;s that simple</p>
            </div>
          </li>
        </ol>

        <div>
          <div className="mx-auto px-6 lg:px-8 max-w-6xl">
            <div className="mt-16 sm:mt-24 flow-root">
              <div className="bg-gray-900/5 dark:bg-gray-100/5 -m-2 lg:-m-4 p-2 lg:p-4 rounded-xl lg:rounded-2xl ring-1 ring-gray-900/10 ring-inset">
                <Image
                  src="/file-upload-preview.jpg"
                  width={1419}
                  height={732}
                  alt="Upload preview"
                  quality={100}
                  className="bg-white shadow-2xl p-2 sm:p-8 md:p-20 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
