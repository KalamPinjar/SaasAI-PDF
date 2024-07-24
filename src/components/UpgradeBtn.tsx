"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";
import toast from "react-hot-toast";

const UpgradeBtn = () => {
  const { mutate: createStripeSession } = trpc.createStripeSession.useMutation({
    onSuccess: ({ url }) => {
      toast.success("Payment successful");
      window.location.href = url ?? "/dashboard/billing";
    },
    onError: () => {
      toast.error("Payment failed");
    },
  });
  return (
    <Button onClick={() => createStripeSession()} className="w-full">
      Upgrade now <ArrowRight className="ml-1.5 w-5 h-5" />
    </Button>
  );
};

export default UpgradeBtn;
