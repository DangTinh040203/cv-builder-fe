"use client";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { authService } from "@/services/auth.service";
import { type ResponseError } from "@/types/error.type";

const VerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const params = useSearchParams();
  const router = useRouter();

  const email = useMemo(() => {
    return params.get("email");
  }, [params]);

  const handleVerifyOtp = async () => {
    try {
      if (!email || otp.length !== 6) {
        toast.error("Invalid OTP or email.");
        return;
      }

      setLoading(true);
      await authService.verifyEmail(otp, email);
      toast.success("Email verified successfully!");
      router.push("/sign-in");
      setOtp("");
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
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="w-full max-w-sm min-w-sm">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
          <CardDescription>
            Enter the OTP sent to your email to verify your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-center">
            <InputOTP maxLength={6} onChange={(value) => setOtp(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button type="submit" className="w-full" onClick={handleVerifyOtp}>
            {loading && <Spinner />} Verify OTP
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
    </div>
  );
};

export default VerifyOtp;
