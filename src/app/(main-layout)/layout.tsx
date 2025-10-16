import type React from "react";
import { type PropsWithChildren } from "react";

import Header from "@/components/Layout/Header";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default MainLayout;
