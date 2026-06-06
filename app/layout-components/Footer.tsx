'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Footer() {
  const pathname = usePathname();
  const [currentYear, setCurrentYear] = useState(2024);
  
  // Cleanly avoid rendering on dedicated authentication screens
  const isAuthView = pathname?.startsWith('/auth') || pathname?.startsWith('/forgot-password');
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  if (isAuthView) return null;

  const footerLinks = [
    { label: 'About', href: '/about', icon: 'info' },
    { label: 'Privacy', href: '/privacy', icon: 'privacy_tip' },
    { label: 'Terms', href: '/terms', icon: 'gavel' },
    { label: 'Support', href: '/support', icon: 'support_agent' },
  ];

  const socialLinks = [
    { label: 'Instagram', icon: 'photo_camera', href: 'https://instagram.com' },
    { label: 'Twitter', icon: 'alternate_email', href: 'https://twitter.com' },
    { label: 'YouTube', icon: 'smart_display', href: 'https://youtube.com' },
  ];

  return (
    <footer className="w-full lg:pl-56 bg-transparent select-none mt-auto">
      {/* Main Footer Bar */}
      <div className="w-full bg-white/40 backdrop-blur-xl border-t border-white/50 shadow-lg">
        
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between px-6 py-3">
          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-[12px]">self_improvement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-gray-700">
                WalkWithMe
              </span>
              <span className="text-[7px] text-gray-500 font-medium tracking-wide">
                © {currentYear} A Digital Sanctuary
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {footerLinks.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:text-orange-600 transition-all duration-200 hover:bg-white/50"
              >
                <span className="material-symbols-outlined text-[14px] group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-1">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-orange-600 hover:bg-white/50 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Mobile Layout - Compact & Clean */}
        <div className="flex md:hidden flex-col px-4 py-3 gap-3">
          {/* Main Links - Scrollable Row */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
            {footerLinks.map((item) => (
              <Link 
                key={item.label} 
                href={item.href} 
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/30 text-gray-600 hover:text-orange-600 hover:bg-white/60 transition-all shrink-0"
              >
                <span className="material-symbols-outlined text-[12px]">{item.icon}</span>
                <span className="text-[8px] font-bold uppercase tracking-wider">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/40">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[10px]">self_improvement</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-700 tracking-tighter">WalkWithMe</span>
                <span className="text-[6px] text-gray-500">Digital Sanctuary</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/30 text-gray-500 hover:text-orange-600 transition-all"
                >
                  <span className="material-symbols-outlined text-[12px]">{item.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-1">
            <span className="text-[7px] text-gray-400 font-medium tracking-wide">
              © {currentYear} WalkWithMe. All rights reserved.
            </span>
          </div>
        </div>
      </div>

      {/* Decorative gradient line at the top */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-orange-400/50 to-transparent"></div>
    </footer>
  );
}