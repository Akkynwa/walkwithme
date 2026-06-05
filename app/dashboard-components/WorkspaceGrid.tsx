import Image from 'next/image';
import Link from 'next/link';

const WORKSPACES = [
  {
    title: 'Spiritual Walker AI',
    desc: 'Deep theological reflection and spiritual guidance through conversational AI.',
    img: 'https://images.unsplash.com/photo-1507692049790-de58290a4334',
    href: '/ai/chat',
    icon: 'self_improvement'
  },
  {
    title: 'Dream Interpreter',
    desc: 'Unveil the symbolic language of your subconscious through biblical dream analysis.',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c',
    href: '/ai/chat',
    icon: 'nights_stay'
  },
  {
    title: 'Sanctuary Journal',
    desc: 'Record the shifts in your heart and track your spiritual progression over time.',
    img: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
    href: '/journal/create',
    icon: 'edit_note'
  }
];

export function WorkspaceGrid() {
  return (
    <section className="space-y-5">
      {/* Section Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-4 h-px bg-gray-400/40" />
        <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
          Workspace Entryways
        </h3>
        <div className="flex-1 h-px bg-gray-200/50" />
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {WORKSPACES.map((item) => (
          <Link 
            key={item.title} 
            href={item.href} 
            className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
          >
            {/* Background Image */}
            <Image 
              src={item.img} 
              alt={item.title} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-7000 ease-out" 
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            {/* Glass Reflection Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-x-5 bottom-5 text-white">
              {/* Icon */}
              <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-[18px]">
                  {item.icon}
                </span>
              </div>
              
              {/* Title */}
              <h4 className="text-lg font-serif font-semibold mb-1 group-hover:text-amber-100 transition-colors">
                {item.title}
              </h4>
              
              {/* Description */}
              <p className="text-[11px] text-white/70 leading-relaxed line-clamp-2">
                {item.desc}
              </p>

              {/* Subtle Indicator */}
              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[8px] font-medium uppercase tracking-wider text-white/50">
                  Enter
                </span>
                <span className="material-symbols-outlined text-white/50 text-[12px]">
                  arrow_forward
                </span>
              </div>
            </div>

            {/* Bottom Border Accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:via-white/60 transition-all duration-500" />
          </Link>
        ))}
      </div>
    </section>
  );
}