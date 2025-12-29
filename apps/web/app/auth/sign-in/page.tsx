"use client";
import { Button } from "@shared/ui/components/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import React from "react";

const SignIn = () => {
  return (
    <div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button type="submit" size="lg" className="w-full rounded-full">
          Sign In
          <ArrowRight className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default SignIn;
