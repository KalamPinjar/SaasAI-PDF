import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import { ModeToggle } from "./ui/theme-toggle";

const Navbar = () => {
  return (
    <nav className="top-0 z-30 sticky inset-x-0 border-gray-200 dark:border-gray-900 bg-white/75 dark:bg-black/75 dark:shadow-md dark:shadow-white/5 backdrop-blur-lg border-b w-full h-14 transition-all dark">
      <MaxWidthWrapper>
        <div className="flex justify-between items-center border-zinc-200 border-b dark:border-none h-14">
          <Link href="/" className="z-40 flex font-semibold">
            <span>DocQuerry</span>
          </Link>
          {/* {add mobile nav bar} */}
          <div className="sm:flex items-center space-x-4 hidden">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                })}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                  className: "",
                })}
              >
                Sign-in
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </RegisterLink>
            </>
            <ModeToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
