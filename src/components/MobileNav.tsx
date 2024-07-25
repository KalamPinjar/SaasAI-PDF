"use client";

import { ArrowRight, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ModeToggle } from "./ui/theme-toggle";

const MobileNav = ({ isAuth }: { isAuth: boolean }) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  const toggleOpen = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (isOpen) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const closeOnCurrent = (href: string) => {
    if (pathname === href) {
      setOpen(false);
    }
  };

  return (
    <>
      <div className="sm:hidden">
        <Menu
          onClick={toggleOpen}
          className="relative -right-[4rem] z-50 w-5 h-5 text-zinc-300 dark:text-zinc-400"
        />

        {isOpen && (
          <div className="z-0 fixed inset-0 slide-in-from-top-5 w-full animate-in fade-in-20">
            <ul className="absolute gap-3 border-zinc-200 grid bg-slate-950 shadow-xl px-10 pt-20 pb-8 border-b w-full text-white">
              {!isAuth ? (
                <>
                  <li className="hover:bg-gray-300 dark:hover:bg-slate-900 px-4 py-3 transition-all">
                    <Link
                      onClick={() => closeOnCurrent("/sign-up")}
                      className="flex items-center w-full font-semibold text-green-600"
                      href="/dashboard"
                    >
                      Get started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </li>
                  <li className="bg-gray-300 dark:bg-zinc-700 my-3 w-full h-px" />
                  <li className="hover:bg-gray-300 dark:hover:bg-slate-900 px-4 py-3 transition-all">
                    <LoginLink
                      onClick={() => closeOnCurrent("/sign-in")}
                      className="flex items-center w-full font-semibold"
                    >
                      Sign in
                    </LoginLink>
                  </li>
                  <li className="bg-gray-300 dark:bg-zinc-700 my-3 w-full h-px" />
                  <li className="hover:bg-gray-300 dark:hover:bg-slate-900 px-4 py-3 transition-all">
                    <Link
                      onClick={() => closeOnCurrent("/pricing")}
                      className="flex items-center w-full font-semibold"
                      href="/pricing"
                    >
                      Pricing
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="hover:bg-gray-300 dark:hover:bg-slate-900 px-4 py-3 transition-all">
                    <Link
                      onClick={() => closeOnCurrent("/dashboard")}
                      className="flex items-center w-full font-semibold"
                      href="/dashboard"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li className="bg-gray-300 dark:bg-zinc-700 my-3 w-full h-px" />
                  <li className="hover:bg-gray-300 dark:hover:bg-slate-900 px-4 py-3 transition-all">
                    <LogoutLink className="flex items-center w-full font-semibold">
                      Sign out
                    </LogoutLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="relative right-12 sm:hidden">
        <ModeToggle />
      </div>
    </>
  );
};

export default MobileNav;
