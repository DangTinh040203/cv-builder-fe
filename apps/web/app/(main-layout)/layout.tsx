import React, { type PropsWithChildren } from "react";

import Footer from "@/components/Layout/footer";
import Header from "@/components/Layout/header";

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
