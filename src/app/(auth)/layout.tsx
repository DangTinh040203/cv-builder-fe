import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

import { auth } from "@/auth";

const AuthLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  const session = await auth();

  /* Prevent when user click back button after login */
  if (session?.user && !session.isExpired) {
    redirect("/");
  }

  return children;
};

export default AuthLayout;
