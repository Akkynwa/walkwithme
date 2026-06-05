import Image from 'next/image';
import Link from 'next/link';

interface AdItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  actionUrl: string;
  actionText: string;
}

// Internal ad matrix configurations
const AD_RESOURCES: AdItem[] = [
  {
    id: 'ad-1',
    tag: 'Featured Resource',
    title: 'Daily Devotional Vol. 3',
    description: 'Deepen your synchronization loops with our curated structural blueprints for spiritual quiet times.',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad58565b90?auto=format&fit=crop&w=600&q=80',
    actionUrl: '#',
    actionText: 'Access Library'
  },
  {
    id: 'ad-2',
    tag: 'Community Summit',
    title: 'Global Cohort Gathering',
    description: 'Join fellow workspace entities next Friday for an immersive, real-time sync session.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
    actionUrl: '#',
    actionText: 'Reserve Seat'
  }
];

export default function WorkspacePromoAds() {
  return (
    <aside className="lg:col-span-1 space-y-4 lg:sticky lg:top-28">
      <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 px-1">
        <span>Workspace Notices</span>
        <div className="flex-1 h-px bg-slate-200/60" />
      </h3>

      {AD_RESOURCES.map((ad) => (
        <div 
          key={ad.id} 
          className="bg-white/40 hover:bg-white backdrop-blur-md border border-white/70 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm group/card"
        >
          {/* Promo Card Image Cover */}
          <div className="w-full h-32 relative bg-slate-100">
            <Image 
              src={ad.image} 
              alt={ad.title} 
              fill 
              className="object-cover group-hover/card:scale-105 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[6px] font-bold uppercase tracking-wider">
              {ad.tag}
            </span>
          </div>

          {/* Promo Details Section */}
          <div className="p-4">
            <h4 className="text-xs font-serif font-black text-slate-800 tracking-tight leading-snug">
              {ad.title}
            </h4>
            <p className="text-[10px] text-slate-500 font-light mt-1 leading-relaxed">
              {ad.description}
            </p>
            <Link 
              href={ad.actionUrl} 
              className="mt-3.5 w-full inline-flex items-center justify-center bg-slate-900 hover:bg-amber-700 text-white text-[7px] font-black uppercase tracking-wider py-2 rounded-lg transition-all shadow-sm gap-1"
            >
              <span>{ad.actionText}</span>
              <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span>
            </Link>
          </div>
        </div>
      ))}
    </aside>
  );
}