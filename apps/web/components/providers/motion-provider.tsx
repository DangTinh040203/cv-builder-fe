"use client";

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
} from "framer-motion";
import { type PropsWithChildren } from "react";

/**
 * LazyMotion provider that loads only the `domAnimation` feature set.
 * This reduces framer-motion bundle by ~60% compared to the full bundle.
 * Only includes: animate, exit, variants, whileHover, whileTap, whileInView
 * Does NOT include: layout animations, drag, path animations
 *
 * MotionConfig `reducedMotion="user"` honors prefers-reduced-motion (WCAG 2.3.3).
 */
export default function MotionProvider({ children }: PropsWithChildren) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>{children}</LazyMotion>
    </MotionConfig>
  );
}
