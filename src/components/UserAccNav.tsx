import { getUserSubscriptionPlan } from "@/lib/stripe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";
import { Gem, UserIcon } from "lucide-react";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface UserAccNavProps {
  email: string | undefined;
  imageUrl: string;
  name: string;
}

const UserAccNav: React.FC<UserAccNavProps> = async ({
  email,
  imageUrl,
  name,
}) => {
  const subsctiptionPlan = await getUserSubscriptionPlan();
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Button className="bg-slate-400 dark:bg-slate-700 rounded-full w-8 h-8 aspect-square">
          <Avatar className="relative w-8 h-8">
            {imageUrl ? (
              <Image
                fill
                src={imageUrl}
                alt="Avatar picture"
                className="rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <AvatarFallback>
                <span className="sr-only">{name}</span>
                <UserIcon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-white hover:bg-slate-100 dark:bg-black"
        align="end"
      >
        <div className="flex justify-start items-center gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            {name && <p className="font-medium text-sm">{name}</p>}
            {email && (
              <p className="text-slate-500 text-sm dark:text-slate-400">
                {email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {subsctiptionPlan.isSubscribed ? (
            <Link href="/dashboard/billing">Manage Subsciption</Link>
          ) : (
            <Link href="/pricing">
              Upgrade <Gem className="ml-1.5 w-4 h-4 text-blue-600" />
            </Link>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <LogoutLink>Sign out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccNav;
