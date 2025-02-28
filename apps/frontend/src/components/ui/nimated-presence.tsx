// src/components/ui/animated-presence.tsx
"use client"

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  variants?: any;
  initial?: string | object;
  animate?: string | object;
  exit?: string | object;
  transition?: object;
}

export function AnimatedContainer({
  children,
  className,
  variants,
  initial = "hidden",
  animate = "visible",
  exit = "exit",
  transition = { duration: 0.2 },
}: AnimatedContainerProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

export function FadePresence({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      <AnimatedContainer 
        variants={variants} 
        className={className}
      >
        {children}
      </AnimatedContainer>
    </AnimatePresence>
  );
}