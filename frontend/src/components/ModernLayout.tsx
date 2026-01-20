'use client';

import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface ModernLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export default function ModernLayout({ children, showFooter = true }: ModernLayoutProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMouse);
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
      {/* Spotlight */}
      <div
        className="pointer-events-none fixed z-[9998] w-[420px] h-[420px] bg-pink-400/15 rounded-full blur-[100px] transition-transform duration-200 ease-out"
        style={{ transform: `translate(${mousePos.x - 210}px, ${mousePos.y - 210}px)` }}
      />

      <Header />
      
      <main className="pt-24">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
