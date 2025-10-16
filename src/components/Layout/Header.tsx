import React from "react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";

const Header = () => {
  return (
    <div className="container flex items-center justify-between py-4">
      <div>Logo</div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button variant={"outline"}>Sign Up</Button>
        <Button>Sign In</Button>
      </div>
    </div>
  );
};

export default Header;
