'use client';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // ⬆️ more duration = softer scroll
      easing: (t) => t * (2 - t), // easeOutQuad — smoother and natural
      smoothWheel: true,
      smoothTouch: true,
      gestureOrientation: 'vertical', // optional but helps on touchpads
      wheelMultiplier: 0.9, // ⬇️ slower scroll on wheel
      touchMultiplier: 1.2, // ↔️ mobile scroll balance
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
