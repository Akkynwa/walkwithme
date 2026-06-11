'use client';
import { usePathname, useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide the button if we are at the root
  if (pathname === '/') return null;

  return (
    <div className="w-full flex justify-end px-4 py-2">
      <button 
        onClick={() => router.back()}
        className="text-[11px] text-amber-700 hover:text-amber-900 font-medium transition-colors flex items-center gap-1 bg-white/50 backdrop-blur-sm px-2.5 py-1 rounded-md border border-amber-100 shadow-xs"
      >
        Back
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  );
}