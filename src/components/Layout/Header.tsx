"use client";
import { Award, LogOut, Settings, UserPen } from "lucide-react";
import Link from "next/link";
import { getSession, signOut } from "next-auth/react";
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
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { type User } from "@/types/user.type";

const Header = () => {
  const { user } = useAppSelector(userSelector);

  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    const checkUser = async () => {
      const session = await getSession();
      if (session) {
        dispatch(setUser(session.user));
      }
    };

    void checkUser();
  }, [dispatch]);

  const handleSignOut = async () => {
    await signOut();

    dispatch(setUser(null));
  };

  return (
    <div className="border-b">
      <div className={`container-full flex items-center justify-between py-4`}>
        <p>LOGO</p>

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
