'use client';

import { useState, useEffect } from 'react';
import SupportPopup from './SupportPopup';

export default function FloatingSupportButton() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect navbar height to avoid overlap
  useEffect(() => {
    const findNavbar = () => {
      const navbar = document.querySelector('nav, header, [class*="navbar"], [class*="header"]');
      if (navbar) {
        const height = navbar.getBoundingClientRect().height;
        setNavbarHeight(height);
      }
    };
    
    findNavbar();
    window.addEventListener('resize', findNavbar);
    return () => window.removeEventListener('resize', findNavbar);
  }, []);

  // Hide button when scrolling down, show when scrolling up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Calculate bottom position to avoid navbar
  const getBottomPosition = () => {
    if (isMobile && navbarHeight > 0) {
      return `${navbarHeight + 12}px`;
    }
    return '24px';
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className={`fixed z-[9999] transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
        style={{
          bottom: getBottomPosition(),
          right: isMobile ? '16px' : '24px',
        }}
      >
        {/* Ripple effect rings */}
        <div className="absolute inset-0 rounded-full">
          <div className={`absolute inset-0 rounded-full bg-orange-400/30 transition-all duration-1000 ${
            isHovered ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
          }`} />
          <div className={`absolute inset-0 rounded-full bg-orange-400/20 transition-all duration-1000 delay-300 ${
            isHovered ? 'scale-200 opacity-0' : 'scale-100 opacity-100'
          }`} />
        </div>

        {/* Main Button */}
        <button
          onClick={() => setIsPopupOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
          }}
          aria-label="Support"
        >
          {/* Animated icon */}
          <div className="relative">
            <span className="text-xl transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              💬
            </span>
            {/* Notification dot */}
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
          </div>
          
          {/* Text that appears on hover - hidden on mobile */}
          {!isMobile && (
            <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium text-white transition-all duration-300 group-hover:max-w-xs group-hover:ml-1">
              Need help?
            </span>
          )}
        </button>
      </div>

      <SupportPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </>
  );
}