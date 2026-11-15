import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealOptions {
  dependencies?: React.DependencyList;
  reducedMotion?: boolean;
}

/**
 * useScrollReveal: A custom hook providing a memory-safe GSAP Context
 * scoped to a container element. Automatically cleans up all ScrollTriggers
 * and tweens when the component unmounts.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  callback: (context: gsap.Context) => void,
  options: ScrollRevealOptions = {}
) {
  const containerRef = useRef<T | null>(null);
  const { dependencies = [], reducedMotion = false } = options;

  useEffect(() => {
    // If user prefers reduced motion, skip scroll-triggered animation setup
    if (reducedMotion) return;
    if (!containerRef.current) return;

    const ctx = gsap.context((self) => {
      callback(self);
    }, containerRef);

    return () => {
      ctx.revert(); // Kills tweens and ScrollTriggers created inside this context
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...dependencies]);

  return containerRef;
}

export default useScrollReveal;
