import Image from 'next/image';
import Link from 'next/link';

const WORKSPACES = [
  {
    title: 'Spiritual Walker AI',
    desc: 'Deep theological reflection & intuition.',
    img: 'https://images.unsplash.com/photo-1507692049790-de58290a4334',
    href: '/ai/chat',
    icon: '✦'
  },
  {
    title: 'Dream Interpreter',
    desc: 'Unveil the symbolic language of your rest.',
    img: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c',
    href: '/ai/dreams',
    icon: '☾'
  },
  {
    title: 'Sanctuary Journal',
    desc: 'Record the shifts in your heart today.',
    img: 'https://images.unsplash.com/photo-1517842645767-c639042777db',
    href: '/reflect',
    icon: '✎'
  }
];

export function WorkspaceGrid() {
  return (
    <section>
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#434844]/40 mb-6 flex items-center gap-4">
        Workspace Entryways <span className="h-px flex-1 bg-[#4d6054]/10"></span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {WORKSPACES.map((item) => (
          <Link key={item.title} href={item.href} className="group relative h-80 rounded-[32px] overflow-hidden shadow-lg hover:shadow-[#4d6054]/10 transition-all duration-700">
            <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-[5s]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161c22]/90 via-[#161c22]/20 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-white">
              <span className="text-2xl mb-2 block">{item.icon}</span>
              <h4 className="text-xl font-serif font-bold mb-1">{item.title}</h4>
              <p className="text-xs text-white/70 leading-relaxed line-clamp-2">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}