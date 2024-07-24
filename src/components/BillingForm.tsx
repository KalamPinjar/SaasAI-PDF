"use client";

import { trpc } from "@/app/_trpc/client";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import toast from "react-hot-toast";
import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}
const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { mutate: createStripeSession, status } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          window.location.href = url;
        }
        if (!url) toast.error("There was an error, please try again");
      },
      onError: () => {
        toast.error("Payment failed");
      },
    });
  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card className="border-none">
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the{" "}
              <strong>
                {subscriptionPlan?.isSubscribed
                  ? subscriptionPlan?.name
                  : "Free"}{" "}
              </strong>
              plan.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex md:flex-row flex-col md:justify-between items-start md:space-x-0 space-y-2">
            <Button type="submit">
              {status === "pending" && (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              )}
              {subscriptionPlan?.isSubscribed
                ? "Manage Subscription"
                : "Upgrade Plan"}
            </Button>

            {subscriptionPlan?.isSubscribed && (
              <p className="rounded-full font-medium text-xs text-zinc-500 dark:text-zinc-400">
                {subscriptionPlan?.isCanceled
                  ? "Your subscription has been canceled."
                  : "Your subscription will end on " +
                    format(
                      subscriptionPlan?.stripeCurrentPeriodEnd!,
                      "MMM dd, yyyy"
                    )}
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
