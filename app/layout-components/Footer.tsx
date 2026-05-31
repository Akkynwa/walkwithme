'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  
  // Cleanly avoid rendering on dedicated authentication screens
  const isAuthView = pathname?.startsWith('/auth') || pathname?.startsWith('/forgot-password');
  if (isAuthView) return null;

  const links = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Support', href: '/support' },
  ];

  return (
    /* 
      This mimics the header's horizontal canvas perfectly. 
      It leaves a 64rem space on desktop for your sidebar, 
      but stays in the normal document flow so it sits neatly at the very end of the page.
    */
    <footer className="w-full lg:pl-64 bg-transparent border-t border-white/20 select-none mt-auto">
      <div className="w-full h-14 md:h-12 flex flex-col sm:flex-row justify-between items-center px-4 md:px-6 py-2 bg-white/40 backdrop-blur-md shadow-sm gap-2">
        
        {/* Branding & Copyright */}
        <div className="text-center sm:text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#4d6054] mr-2">
            WalkWithMe
          </span>
          <span className="text-[9px] text-[#5e5e5b]/60 font-medium uppercase tracking-wider">
            © {new Date().getFullYear()} A Digital Sanctuary.
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-4 md:gap-6 items-center">
          {links.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="text-[10px] font-bold text-[#5e5e5b]/60 hover:text-[#4d6054] transition-colors uppercase tracking-widest"
            >
              {item.label}
            </Link>
          ))}
        </div>

      </div>
    </footer>
  );
}