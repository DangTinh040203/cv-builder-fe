"use client";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/components/form";
import { Input } from "@shared/ui/components/input";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { handleClerkError } from "@/lib/clerk-toast";
import {
  buttonScaleVariants,
  formContainerVariants,
  formItemVariants,
} from "@/styles/animation";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, "Please enter your email address")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Please enter your password")
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });

      // Send OTP to email
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Redirect to verify OTP page
      router.push(`/auth/verify-otp?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      handleClerkError(error, {
        fallbackMessage: "Something went wrong, please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      variants={formContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Input
                        placeholder="Enter your email"
                        disabled={isLoading}
                        {...field}
                      />
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <Input
                        {...field}
                        placeholder="Create a password"
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size={"icon"}
                        type="button"
                        className="absolute top-1/2 right-2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={formItemVariants}>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative"
                    >
                      <Input
                        {...field}
                        placeholder="Confirm your password"
                        type={showConfirmPassword ? "text" : "password"}
                        disabled={isLoading}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size={"icon"}
                        type="button"
                        className="absolute top-1/2 right-2 -translate-y-1/2"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </Button>
                    </motion.div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            variants={buttonScaleVariants}
            whileHover={
              isLoading
                ? {}
                : {
                    scale: 1.02,
                  }
            }
            whileTap={isLoading ? {} : { scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account
                </>
              ) : (
                <>
                  Create Account
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </>
              )}
            </Button>
          </motion.div>

          <motion.p
            variants={formItemVariants}
            className="text-muted-foreground text-center text-sm"
          >
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className={`
                text-primary font-medium transition-all
                hover:underline
              `}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                Sign In
              </motion.span>
            </Link>
          </motion.p>
        </form>
      </Form>
    </motion.div>
  );
};

export default SignUp;
