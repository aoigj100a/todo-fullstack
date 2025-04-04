// src/components/ui/nimated-presence.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, AnimationProps } from 'framer-motion';

interface AnimatedContainerProps extends Omit<AnimationProps, 'className'> {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedContainer({
  children,
  className,
  variants,
  initial = 'hidden',
  animate = 'visible',
  exit = 'exit',
  transition = { duration: 0.2 },
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadePresence({
  children,
  className,
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
      <AnimatedContainer variants={variants} className={className}>
        {children}
      </AnimatedContainer>
    </AnimatePresence>
  );
}
