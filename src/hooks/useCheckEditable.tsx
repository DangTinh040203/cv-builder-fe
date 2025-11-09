// useCheckEditable.ts
"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Route } from "@/constants/route.constant";
import useGetTemplates from "@/hooks/useGetTemplates";

const useCheckEditable = () => {
  const { templates, templateSelected } = useGetTemplates();
  const router = useRouter();

  useEffect(() => {
    if (!templateSelected || !templates[templateSelected]) {
      toast.error("Please select a template to edit your CV.");
      router.push(Route.Home);
    }
  }, [templateSelected, templates, router]);

  return templateSelected;
};

export default useCheckEditable;
