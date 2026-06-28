"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span" | "section";
};

const MAP = {
  div: motion.div,
  li: motion.li,
  span: motion.span,
  section: motion.section,
} as const;

export default function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const Tag = MAP[as];

  // The server can't read the client's reduced-motion preference, so it renders
  // the animated element. We match that on the first client paint, then drop to
  // a static element only after mount — otherwise hydration mismatches.
  useEffect(() => setMounted(true), []);

  if (reduceMotion && mounted) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
