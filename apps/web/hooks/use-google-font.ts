"use client";
import { useEffect } from "react";

import { getGoogleFontUrl } from "@/configs/font.config";

/**
 * Dynamically loads a Google Font by injecting a <link> tag into the <head>.
 * Removes the previous font link when the font changes.
 */
export const useGoogleFont = (fontFamily: string) => {
  useEffect(() => {
    const url = getGoogleFontUrl(fontFamily);
    if (!url) return;

    const id = "google-font-template";
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [fontFamily]);
};
