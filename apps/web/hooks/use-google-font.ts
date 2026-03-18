"use client";
import { useEffect } from "react";

import { getLocalFontsCSS } from "@/configs/font.config";

/**
 * Loads local fonts (from /public/fonts) for the given font family.
 * Injects a <style> tag with @font-face rules. All fonts are loaded at once
 * to avoid flicker when switching fonts.
 */
export const useGoogleFont = (fontFamily: string) => {
  useEffect(() => {
    const id = "google-font-template";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.textContent = getLocalFontsCSS();
    document.head.appendChild(style);
  }, [fontFamily]);
};
