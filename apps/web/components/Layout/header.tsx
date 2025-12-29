"use client";

import { Button } from "@shared/ui/components/button";
import { cn } from "@shared/ui/lib/utils";
import { FileText, Menu, MessageSquare, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/builder", label: "CV Builder", icon: Sparkles },
  { href: "/interview", label: "Mock Interview", icon: MessageSquare },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`
        glass border-border/50 fixed top-0 right-0 left-0 z-50 border-b
      `}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div
              className={`
                gradient-bg flex h-9 w-9 items-center justify-center rounded-lg
                shadow-md transition-shadow duration-300
                group-hover:shadow-glow
              `}
            >
              <FileText className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold">
              CV<span className="gradient-text">Craft</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div
            className={`
              hidden items-center gap-1
              md:flex
            `}
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href) ? "secondary" : "ghost"}
                  className={cn(
                    "gap-2",
                    isActive(link.href) && "bg-primary/10 text-primary",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div
            className={`
              hidden items-center gap-2
              md:flex
            `}
          >
            <Link href="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth">
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            className={`
              border-border/50 animate-slide-up border-t py-4
              md:hidden
            `}
          >
            <div className="flex flex-col gap-2">
              <Link href="/auth" onClick={() => setIsOpen(false)}>
                <Button variant="gradient" className="mt-2 w-full">
                  Sign In / Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
