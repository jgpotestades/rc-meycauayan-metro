'use client';
import React, { useEffect, useState } from 'react';

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 }); // Start off-screen
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-pointer: coarse)').matches;
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, select, textarea, .cursor-pointer'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Universal blanket rule to completely hide the default system mouse pointer */}
      <style jsx global>{`
        @media (pointer: fine) {
          *, *::before, *::after, body, html, a, button, input, select, textarea, [role="button"], p, span, h1, h2, h3, div {
            cursor: none !important;
          }
        }
      `}</style>

      {/* 1. Core Pointer - Rendered via your custom PNG asset
          Adjust width (w-6) and height (h-6) below if your image needs to be larger or smaller!
      */}
      <div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] hidden md:block"
        style={{
          transform: `translate3d(calc(${position.x}px - 50%), calc(${position.y}px - 50%), 0) scale(${isHovering ? 0.85 : 1})`,
          backgroundImage: "url('/customcursor.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          transition: 'transform 0.04s linear'
        }}
      />

      {/* 2. Premium Outer Tracking Halo Ring 
          This complements your custom image pointer by tracking slightly behind with a smooth delay.
      */}
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] hidden md:block border transition-all ${
          isHovering 
            ? 'w-16 h-16 bg-amber-500/10 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]' 
            : 'w-10 h-10 border-amber-500/40'
        }`}
        style={{
          transform: `translate3d(calc(${position.x}px - 50%), calc(${position.y}px - 50%), 0)`,
          transition: 'transform 0.12s ease-out, width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border-color 0.2s ease'
        }}
      />
    </>
  );
}