"use client";
import { Award, LogOut, Settings, UserPen } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { useLayoutEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Route } from "@/constants/route.constant";
import { setUser, userSelector } from "@/stores/features/user.slice";
import { persistor, useAppDispatch, useAppSelector } from "@/stores/store";

const DownloadPdf = dynamic(
  () => import("@/components/Templates/DownloadPdf"),
  { ssr: false },
);

const Header = () => {
  const { user } = useAppSelector(userSelector);
  const { data } = useSession();
  const router = useRouter();

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const checkUser = async () => {
      if (data) {
        if (data.isExpired) {
          dispatch(setUser(null));
          router.replace(Route.SignIn);
        } else {
          dispatch(setUser(data.user));
        }
      }
    };

    void checkUser();
  }, [data, dispatch, router]);

  const handleSignOut = async () => {
    await signOut();
    await persistor.purge();
    dispatch({ type: "root/reset" });
    localStorage.clear();
    sessionStorage.clear();

    router.push(Route.SignIn);
  };

  return (
    <div className="flex h-14 w-full border-b">
      <div
        className={`container-full flex w-full items-center justify-between`}
      >
        <Link href={Route.Home}>
          <p>LOGO</p>
        </Link>

        <DownloadPdf />

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link href={Route.SignUp}>
                <Button
                  className="min-w-24 rounded-full"
                  variant={"outline"}
                  size={"lg"}
                >
                  Sign Up
                </Button>
              </Link>
              <Link href={Route.SignIn}>
                <Button className="min-w-24 rounded-full" size={"lg"}>
                  Sign In
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer select-none">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.displayName}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-44" align="end" side="bottom">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>
                      <UserPen />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Billing
                    <DropdownMenuShortcut>
                      <Award />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    Settings
                    <DropdownMenuShortcut>
                      <Settings />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Log out
                  <DropdownMenuShortcut>
                    <LogOut />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
