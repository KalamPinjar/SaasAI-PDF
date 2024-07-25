import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import {
  getKindeServerSession,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import { ModeToggle } from "./ui/theme-toggle";
import UserAccNav from "./UserAccNav";
import MobileNav from "./MobileNav";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return <></>;
  return (
    <nav className="top-0 z-30 sticky inset-x-0 border-gray-200 dark:border-gray-900 bg-white/75 dark:bg-black/75 dark:shadow-md dark:shadow-white/5 backdrop-blur-lg border-b w-full h-14 transition-all dark">
      <MaxWidthWrapper>
        <div className="flex justify-between items-center border-zinc-200 border-b dark:border-none h-14">
          <Link href="/" className="z-40 flex font-semibold text-zinc-500">
            <span>DocQuerry</span>
          </Link>
          {/* {add mobile nav bar} */}
          <MobileNav isAuth={!!user} />
          <div className="right-2 absolute sm:hidden">
            <UserAccNav
              name={
                !user.given_name || !user.family_name
                  ? "Your Account"
                  : `${user.given_name} ${user.family_name}`
              }
              email={user.email ?? ""}
              imageUrl={user.picture ?? ""}
            />
          </div>
          <div className="sm:flex items-center space-x-5 hidden">
            {!user ? (
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
                  style={{ color: "white" }}
                  className={buttonVariants({
                    size: "sm",
                    className: "",
                  })}
                >
                  Sign-in <ArrowRight className="ml-2 w-5 h-5" />
                </LoginLink>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  Dashboard
                </Link>

                <UserAccNav
                  name={
                    !user.given_name || !user.family_name
                      ? "Your Account"
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ""}
                  imageUrl={user.picture ?? ""}
                />
              </>
            )}
            <ModeToggle />
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
