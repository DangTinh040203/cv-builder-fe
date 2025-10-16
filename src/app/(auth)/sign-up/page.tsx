"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { authService } from "@/services/auth.service";
import { type ResponseError } from "@/types/error.type";

const formSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be between 6 and 50 characters")
      .max(50, "Password must be between 6 and 50 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be between 6 and 50 characters")
      .max(50, "Password must be between 6 and 50 characters"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      setLoading(true);
      await authService.signUp(values);

      toast.success("Account created successfully. Please verify your email.");
      form.reset();

      router.push(`/verify-otp?email=${values.email}`);
    } catch (error) {
      if (isAxiosError(error)) {
        const { message } = error.response?.data as ResponseError;
        toast.error(message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full min-w-sm">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Enter your email below to create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl className="relative">
                        <div className="relative">
                          <Input
                            autoComplete="off"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />

                          <div
                            className={`
                              absolute top-1/2 right-4 z-10 -translate-y-1/2
                              cursor-pointer
                            `}
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <Eye size={16} className="opacity-70" />
                            ) : (
                              <EyeOff size={16} className="opacity-70" />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl className="relative">
                        <div className="relative">
                          <Input
                            autoComplete="off"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />

                          <div
                            className={`
                              absolute top-1/2 right-4 z-10 -translate-y-1/2
                              cursor-pointer
                            `}
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <Eye size={16} className="opacity-70" />
                            ) : (
                              <EyeOff size={16} className="opacity-70" />
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <Link
                    href="/reset-password"
                    className={`
                      ml-auto inline-block text-sm underline-offset-4
                      hover:underline
                    `}
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Spinner />} Sign Up
              </Button>
              <Separator className="my-2" />
              <p className="text-center text-sm">
                <span>{`Already have an account?`}</span>
                <Link href="/sign-in">
                  <Button variant="link">Login</Button>
                </Link>
              </p>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default SignUp;
