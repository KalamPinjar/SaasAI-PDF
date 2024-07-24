import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UpgradeBtn from "@/components/UpgradeBtn";
import { PLANS } from "@/config/stripe";
import { cn } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import Link from "next/link";

const PricingPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const pricingItems = [
    {
      plan: "Free",
      tagline: "For small side projects.",
      quota: 10,
      features: [
        {
          text: "5 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
          negative: true,
        },
        {
          text: "Priority support",
          negative: true,
        },
      ],
    },
    {
      plan: "Pro",
      tagline: "For larger projects with higher needs.",
      quota: PLANS.find((p) => p.slug === "pro")!.quota,
      features: [
        {
          text: "25 pages per PDF",
          footnote: "The maximum amount of pages per PDF-file.",
        },
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single PDF file.",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "Higher-quality responses",
          footnote: "Better algorithmic responses for enhanced content quality",
        },
        {
          text: "Priority support",
        },
      ],
    },
  ];
  return (
    <MaxWidthWrapper className="mt-24 max-w-5xl text-center mn-8">
      <div className="mx-auto mb-10 sm:max-w-lg">
        <h1 className="font-bold text-6xl sm:text-7xl">Pricing</h1>
        <p className="mt-5 text-zinc-700 sm:text-lg dark:text-zinc-400">
          Whether you&apos;re a student, professional, or entrepreneur, our
          pricing is designed to fit your needs.
        </p>
      </div>
      <div className="gap-10 grid grid-cols-1 lg:grid-cols-2 pt-12">
        <TooltipProvider>
          {pricingItems.map(({ plan, tagline, quota, features }) => {
            const price =
              PLANS.find((p) => p.slug === plan.toLowerCase())!.price.amount ||
              0;

            return (
              <div
                key={plan}
                className={cn(
                  "relative rounded-2xl bg-white shadow-lg dark:bg-zinc-800",
                  {
                    "border-2 border-blue-500 shadow-blue-200 dark:shadow-blue-800":
                      plan === "Pro",
                    "border border-gray-200 dark:border-gray-700":
                      plan !== "Pro",
                  }
                )}
              >
                {plan === "Pro" && (
                  <div className="-top-5 right-0 left-0 absolute bg-gradient-to-r from-blue-600 dark:from-blue-500 to-cyan-600 dark:to-cyan-500 mx-auto px-3 py-2 rounded-full w-32 font-medium text-sm text-white dark:text-black">
                    Upgrade now
                  </div>
                )}
                <div className="p-10">
                  <h2 className="my-3 font-bold font-displays text-3xl">
                    {plan}
                  </h2>
                  <p className="mt-5 text-zinc-700 sm:text-lg dark:text-zinc-400">
                    {tagline}
                  </p>
                  <div className="mt-5">
                    <p className="font-display font-semibold text-5xl">
                      {price}$
                    </p>
                    <p className="text-zinc-500">/month</p>
                  </div>

                  <div className="flex justify-center items-center border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-zinc-800 border-t border-b h-20">
                    <div className="flex items-center space-x-1">
                      <p>{quota.toLocaleString()} PDFs/mo included</p>

                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="ml-1.5 cursor-default">
                          <TooltipContent className="p-2 w-80">
                            How many PDFs you can upload per month.
                          </TooltipContent>
                        </TooltipTrigger>
                      </Tooltip>
                    </div>
                  </div>
                  <ul className="space-y-5 my-10 px-8">
                    {features.map(({ text, footnote, negative }) => (
                      <li key={text} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {negative ? (
                            <Minus className="w-6 h-6 text-red-500" />
                          ) : (
                            <Check className="w-6 h-6 text-blue-500" />
                          )}
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-1">
                            <p
                              className={cn("text-gray-600", {
                                "text-red-500": negative,
                              })}
                            >
                              {text}
                            </p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="ml-1.5 cursor-default">
                                <HelpCircle className="w-4 h-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="p-2 w-80">
                                {footnote}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <p
                            className={cn("text-gray-600", {
                              "text-red-500": negative,
                            })}
                          >
                            {text}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-gray-200 border-t" />
                  <div className="p-5">
                    {plan === "Free" ? (
                      <Link
                        href={user ? "/dashboard" : "/sign-in"}
                        className={buttonVariants({
                          className: "w-full dark:text-white dark:hover:bg-white/90 dark:hover:text-black",  
                          variant: "outline",
                        })}
                      >
                        {user ? "Get started" : "Sign up"}
                        <ArrowRight className="ml-1.5 w-5 h-5" />
                      </Link>
                    ) : user ? (
                      <UpgradeBtn />
                    ) : (
                      <Link
                        href="/sign-in"
                        className={buttonVariants({
                          className: "w-full",
                        })}
                      >
                        {user ? "Upgrade now" : "Sign up"}
                        <ArrowRight className="ml-1.5 w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </TooltipProvider>
      </div>
    </MaxWidthWrapper>
  );
};

export default PricingPage;
