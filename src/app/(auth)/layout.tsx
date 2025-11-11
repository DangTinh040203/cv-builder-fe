import { redirect } from "next/navigation";
import { type PropsWithChildren } from "react";

import { auth } from "@/auth";

const AuthLayout: React.FC<PropsWithChildren> = async ({ children }) => {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return children;
};

export default AuthLayout;
