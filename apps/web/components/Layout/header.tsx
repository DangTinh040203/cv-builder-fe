"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shared/ui/components/avatar";
import { Button } from "@shared/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/components/dropdown-menu";
import { cn } from "@shared/ui/lib/utils";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  CreditCard,
  FileText,
  LogOut,
  Menu,
  MessageSquare,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/builder", label: "CV Builder", icon: Sparkles },
  { href: "/interview", label: "Mock Interview", icon: MessageSquare },
];

// Animation variants
const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
  exit: { opacity: 0, x: -20 },
};

const Header = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 rgba(0,0,0,0)", "0 4px 20px rgba(0,0,0,0.1)"],
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <motion.nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        isScrolled && "glass border-border/50 border-b shadow-md",
      )}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      style={{
        boxShadow: headerShadow,
      }}
    >
      <div className="container mx-auto overflow-x-hidden px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Animated Logo */}
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/"
              className="group flex items-center gap-2 select-none"
            >
              <motion.div
                className={`
                  gradient-bg flex h-9 w-9 items-center justify-center
                  rounded-lg shadow-md
                `}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                  boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <motion.div>
                  <FileText className="text-primary-foreground h-5 w-5" />
                </motion.div>
              </motion.div>
              <motion.span
                className="font-display text-xl font-bold"
                whileHover={{ scale: 1.05 }}
              >
                CV<span className="gradient-text">Craft</span>
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation with staggered animation */}
          <div
            className={`
              hidden items-center gap-4
              md:flex
            `}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                custom={i}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      className={cn("relative gap-2 overflow-hidden")}
                      variant={isActive(link.href) ? "default" : "ghost"}
                    >
                      <motion.span
                        animate={
                          isActive(link.href) ? { rotate: [0, -10, 10, 0] } : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        <link.icon className="h-4 w-4" />
                      </motion.span>
                      {link.label}
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons with animation */}
          <div
            className={`
              hidden items-center gap-2
              md:flex
            `}
          >
            {!isLoaded ? (
              // Loading state placeholder - keep layout stable
              <div className="h-10 w-24"></div>
            ) : isSignedIn ? (
              <motion.div
                custom={navLinks.length}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger>
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage
                        src={user.imageUrl}
                        alt={user.fullName || ""}
                      />
                      <AvatarFallback>
                        {user.firstName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm leading-none font-medium">
                          {user.fullName}
                        </p>
                        <p
                          className={`
                            text-muted-foreground text-xs leading-none
                          `}
                        >
                          {user.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/subscription" className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Subscription
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <SignOutButton>
                        <div className="flex w-full cursor-pointer items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </div>
                      </SignOutButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ) : (
              <>
                <motion.div
                  custom={navLinks.length}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link href="/auth/sign-in">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="ghost">Sign In</Button>
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.div
                  custom={navLinks.length + 1}
                  variants={navItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link href="/auth/sign-in">
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                    >
                      <Button variant="gradient">Get Started</Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Animated Mobile Menu Button */}
          <motion.div className="md:hidden" whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Animated Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`
                border-border/50 overflow-hidden border-t
                md:hidden
              `}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-col gap-2 py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Link href={link.href} onClick={() => setIsOpen(false)}>
                      <motion.div whileTap={{ scale: 0.98, x: 5 }}>
                        <Button
                          variant={isActive(link.href) ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3"
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  custom={navLinks.length}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {isSignedIn ? (
                    <>
                      <div className="border-border/10 mb-2 border-b px-4 py-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.imageUrl} />
                            <AvatarFallback>
                              {user.firstName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">
                              {user.fullName}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {user.primaryEmailAddress?.emailAddress}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                      <Link
                        href="/subscription"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                        >
                          <CreditCard className="h-4 w-4" />
                          Subscription
                        </Button>
                      </Link>
                      <div className="border-border/10 mt-2 border-t pt-2">
                        <SignOutButton>
                          <Button
                            variant="ghost"
                            className={`
                              w-full justify-start gap-3 text-red-500
                              hover:bg-red-50 hover:text-red-500
                            `}
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </Button>
                        </SignOutButton>
                      </div>
                    </>
                  ) : (
                    <Link href="/auth/sign-in" onClick={() => setIsOpen(false)}>
                      <motion.div whileTap={{ scale: 0.98 }} whileHover={{}}>
                        <Button variant="gradient" className="mt-2 w-full">
                          Sign In / Sign Up
                        </Button>
                      </motion.div>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Header;
