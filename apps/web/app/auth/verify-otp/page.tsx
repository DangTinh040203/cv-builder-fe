"use client";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@shared/ui/components/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@shared/ui/components/input-otp";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mail, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getClerkErrorMessage, handleClerkError } from "@/libs/clerk-toast";

const formSchema = z.object({
  code: z
    .string()
    .min(6, "Please enter the complete verification code")
    .max(6, "Verification code must be 6 digits"),
});

function VerifyOTPContent() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(60);
  const [error, setError] = React.useState("");

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isLoaded) return;

    setIsLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: values.code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        toast.success("Email verified successfully! Welcome to CVCraft.");
        router.push("/");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (error) {
      setError(getClerkErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendCode() {
    if (!isLoaded || !signUp || resendCooldown > 0) return;

    setIsResending(true);
    setError("");

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("A new verification code has been sent to your email.");
      setResendCooldown(60);
    } catch (error) {
      handleClerkError(error, { fallbackMessage: "Failed to resend code" });
    } finally {
      setIsResending(false);
    }
  }

  const codeValue = form.watch("code");

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with Icon */}
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className={`
            bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center
            justify-center rounded-full
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
        >
          <Mail className="text-primary h-8 w-8" />
        </motion.div>
        <h2 className="font-display mb-2 text-3xl font-bold">
          Verify Your Email
        </h2>
        <p className="text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="text-foreground mt-1 font-medium">
          {email || "your email"}
        </p>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            bg-destructive/10 text-destructive mb-6 rounded-lg p-3 text-center
            text-sm
          `}
        >
          {error}
        </motion.div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* OTP Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormControl>
                    <InputOTP maxLength={6} disabled={isLoading} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            whileHover={
              isLoading || codeValue.length !== 6 ? {} : { scale: 1.02 }
            }
            whileTap={
              isLoading || codeValue.length !== 6 ? {} : { scale: 0.98 }
            }
          >
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full"
              disabled={isLoading || codeValue.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Resend & Back Links */}
          <motion.div
            className="space-y-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-muted-foreground text-sm">
              <p>Didn&apos;t receive the code?</p>{" "}
              <Button
                variant={"ghost"}
                type="button"
                onClick={handleResendCode}
                disabled={isResending || resendCooldown > 0}
                className={`
                  text-primary inline-flex items-center gap-1 font-medium
                  hover:underline
                  disabled:cursor-not-allowed disabled:opacity-50
                `}
              >
                <RefreshCw
                  className={`
                    h-4 w-4
                    ${isResending ? "animate-spin" : ""}
                  `}
                />
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend code"}
              </Button>
            </div>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-8">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  );
}
