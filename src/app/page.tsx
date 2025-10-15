"use client";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { Env } from "@/configs/env.config";

export default function Home() {
  return (
    <div className="container">
      <ModeToggle />

      {Env.NEXT_PUBLIC_BASE_URL}
    </div>
  );
}
