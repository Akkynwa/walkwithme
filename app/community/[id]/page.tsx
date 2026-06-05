export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Sidebar from '../../layout-components/Sidebar';
import Header from '../../layout-components/Header';
import DiscussionFeed from './DiscussionFeed'; 
import WorkspacePromoAds from '../../../components/WorkspacePromoAds'; // 🌟 Import the new Ads component

interface PageProps {
  params: {
    id: string;
  };
}

export default async function GroupWorkspacePage({ params }: PageProps) {
  const { id } = params;

  // Hydrate core group configuration directly on the server
  const group = await prisma.communityGroup.findUnique({
    where: { id: id },
    include: {
      _count: {
        select: { discussions: true }
      }
    }
  });

  if (!group) notFound();

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-slate-50/30">
      {/* Immersive ambient background blur */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src={group.image}
          alt="Group contextual cover"
          fill
          className="object-cover scale-110 blur-3xl opacity-15 select-none"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/90 via-white/50 to-amber-50/10" />
      </div>

      <Sidebar />
      <Header />

      <main className="relative z-10 lg:ml-56 p-6 md:p-10 pt-24 lg:pt-32 max-w-6xl mx-auto w-full pb-24 font-sans">
        
        <Link href="/community" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-700 text-[10px] uppercase font-black tracking-wider mb-6 transition-colors group">
          <span className="material-symbols-outlined text-xs group-hover:-translate-x-0.5 transition-transform">arrow_left_alt</span>
          Back to Directory
        </Link>

        {/* MAIN WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT & CENTER FEED PANEL */}
          <div className="lg:col-span-2 space-y-6">
            {/* Clean side-by-side header exactly as it was initially */}
            <header className="relative bg-white/40 backdrop-blur-md border border-white/70 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center shadow-sm">
              <div className="w-24 h-24 sm:w-28 sm:h-28 relative rounded-xl overflow-hidden shrink-0 shadow-inner bg-slate-100 border border-white/40">
                <Image src={group.image} alt={group.name} fill className="object-cover" priority />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider">{group.category}</span>
                <h1 className="text-2xl font-serif font-black text-slate-800 tracking-tight mt-1.5">{group.name}</h1>
                <p className="text-xs text-slate-500 font-light mt-1 max-w-xl leading-relaxed">{group.description}</p>
              </div>
            </header>

            {/* Discussion interactive feed component */}
            <DiscussionFeed groupId={id} />
          </div>

          {/* RIGHT PANEL: Clean independent ads component */}
          <WorkspacePromoAds />

        </div>
      </main>
    </div>
  );
}