import type React from "react";
import { type PropsWithChildren } from "react";

import Header from "@/components/Layout/Header";
import { ScrollToTopButton } from "@/components/ui/scroll-to-top-button";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <ScrollToTopButton />

      <Header />
      {children}
    </div>
  );
};

export default MainLayout;
