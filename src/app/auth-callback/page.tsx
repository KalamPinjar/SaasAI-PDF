"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  // trpc.authCallback.useQuery(undefined, {
  //   onSuccess: ({ success }) => {
  //     if (success) {
  //       router.push(origin ? `/${origin}` : "/dashboard");
  //     }
  //   },
  //   onError: (err) => {
  //     if (err.data?.code === "UNAUTHORIZED") {
  //       router.push("/sign-in");
  //     }
  //   },
  //   retry: true,
  //   retryDelay: 500,
  // });

  const { data, error, isLoading } = trpc.authCallback.useQuery(undefined);

  if (!isLoading && data?.success) {
    const redirectPath = origin ? `/${origin}` : "/dashboard";
    router.push(redirectPath);
  }
  if (!isLoading && error) {
    router.push("/sign-in");
  }

  return (
    <div className="flex justify-center mt-24 w-full">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-4 h-4 text-black animate-spin" />
        <h3 className="font-semibold text-2xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default AuthPage;

// // Assuming `data` contains a `success` field
// if (!isLoading && data?.success) {
//   const redirectPath = origin ? `/${origin}` : "/dashboard";
//   router.push(redirectPath);
// }
// if (!isLoading && error) {
//   router.push("/sign-in");
// }
