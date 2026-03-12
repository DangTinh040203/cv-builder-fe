"use client";
import { useSignIn } from "@clerk/nextjs";
import { Errors, FieldError, OAuthStrategy } from '@clerk/shared/types'
import { Button } from "@shared/ui/components/button";
import Image from "next/image";
import { toast } from "@shared/ui/components/sonner";
import { motion } from "framer-motion";

const redirectUrl = process.env.NEXT_PUBLIC_REDIRECT_URL || null;

import { buttonScaleVariants, formItemVariants } from "@/styles/animation";

const SSOButtons = () => {
    const { isLoaded, signIn } = useSignIn();

    const signInWith = (strategy: OAuthStrategy) => {
        if (!isLoaded) return;
        if (!redirectUrl) return;

        return signIn
            .authenticateWithRedirect({
                strategy,
                redirectUrl: redirectUrl,
                redirectUrlComplete: '/',
            })
            .then((res) => {
                console.log(res)
            })
            .catch((err: Errors<FieldError>) => {
                toast.error(err.fields.message, {
                    description: err.fields.longMessage,
                })
            })
    }

    return (
        <motion.div
            variants={formItemVariants}
            className="flex gap-2 w-full"
        >
            <motion.div
                variants={buttonScaleVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <Button onClick={() => signInWith("oauth_google")} className="w-full" type="button" variant="outline">
                    <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                    Google
                </Button>
            </motion.div>

            <motion.div
                variants={buttonScaleVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
                <Button onClick={() => signInWith("oauth_github")} className="w-full" type="button" variant="outline">
                    <Image src="/icons/github.svg" alt="Github" width={20} height={20} />
                    Github
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default SSOButtons;
