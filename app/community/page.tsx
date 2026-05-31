/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../layout-components/Sidebar';
import Header from '../layout-components/Header';

/**
 * TYPES
 */
interface CommunityGroup {
  id: number;
  name: string;
  description: string;
  members: string;
  image: string;
  isFeatured?: boolean;
}

/**
 * MAIN COMPONENT
 */
export default function CommunityPage() {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Enhanced mock data to match HTML visuals
    const mockGroups: CommunityGroup[] = [
      {
        id: 1,
        name: 'Spiritual Growth Circle',
        description: 'A dedicated space for daily mindfulness, deep biblical reflections, and intentional living.',
        members: '1.2k',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
        isFeatured: true,
      },
      {
        id: 2,
        name: 'Bible Study Group',
        description: 'Weekly in-depth analysis of the New Testament with group discussions and prayer sessions.',
        members: '840',
        image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 3,
        name: 'Prayer Warriors',
        description: 'A global community lifting each other up in prayer and spiritual warfare for breakthrough.',
        members: '3.5k',
        image: 'https://images.unsplash.com/photo-1445108849639-1e24fff70140?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 4,
        name: 'Quiet Reflection',
        description: 'A low-velocity space for sharing poems, art, and meditative experiences in silence.',
        members: '215',
        image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800&auto=format&fit=crop',
      },
      {
        id: 5,
        name: 'Daily Gratitude',
        description: 'Sharing one thing we are grateful for every morning to start the day in Light.',
        members: '1.8k',
        image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
      }
    ];
    setGroups(mockGroups);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#161c22] font-['Playfair_Display'] overflow-x-hidden">
      <Sidebar />
      <Header />

      {/* Main Content Area */}
      <main className="lg:ml-64 p-6 md:p-12 pt-24 lg:pt-12 max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <header className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[#4d6054] mb-2">Community Groups</h2>
          <p className="text-lg text-[#5e5e5b] max-w-2xl leading-relaxed">
            Find your spiritual home. Join a group to share, reflect, and grow together in a supportive digital sanctuary.
          </p>
        </header>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 font-sans">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              type="text"
              placeholder="Search by name or interest..."
              className="w-full pl-12 pr-4 py-4 bg-[#eff4fc] border-none rounded-2xl focus:ring-1 focus:ring-[#4d6054] text-sm transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <FilterButton label="All Groups" active />
            <FilterButton label="Bible Study" />
            <FilterButton label="Meditation" />
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>

        {/* Create Group CTA Section */}
        <section className="bg-[#eff4fc] rounded-[32px] p-8 md:p-12 border border-[#c3c8c2]/20 relative overflow-hidden">
          {/* Animated background decoration */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#4d6054] opacity-[0.03] rounded-full animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold text-[#4d6054] mb-2">Can't find what you're looking for?</h3>
              <p className="text-[#5e5e5b] font-sans">Start your own community focused on your specific spiritual journey.</p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto font-sans">
              <button className="px-10 py-5 bg-[#4d6054] text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                Create New Group
              </button>
              <p className="text-xs text-center text-gray-400">It only takes 2 minutes.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button for Mobile */}
      <button className="fixed right-6 bottom-24 lg:bottom-10 lg:right-10 w-14 h-14 bg-[#4d6054] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined">add</span>
      </button>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center p-4 bg-white border-t border-gray-100 font-sans">
        <MobileNavItem icon="auto_awesome" label="Daily" />
        <MobileNavItem icon="groups" label="Groups" active />
        <MobileNavItem icon="history_edu" label="Journal" />
      </nav>
    </div>
  );
}

/**
 * SUB-COMPONENTS
 */

function GroupCard({ group }: { group: CommunityGroup }) {
  return (
    <div className="bg-white border border-[#c3c8c2]/30 rounded-3xl overflow-hidden group hover:shadow-[0_20px_50px_rgba(77,96,84,0.08)] transition-all duration-500 flex flex-col">
      <div className="h-52 overflow-hidden relative">
        <img 
          src={group.image} 
          alt={group.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        {group.isFeatured && (
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#4d6054] font-sans">
            Featured
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-[#161c22] leading-tight">{group.name}</h3>
          <div className="flex items-center gap-1 text-gray-400 font-sans">
            <span className="material-symbols-outlined text-sm">person</span>
            <span className="text-xs font-bold">{group.members}</span>
          </div>
        </div>
        <p className="text-[#5e5e5b] text-sm font-sans mb-6 line-clamp-2 leading-relaxed">
          {group.description}
        </p>
        <button className="w-full py-4 bg-[#4d6054] text-white rounded-xl font-bold font-sans text-sm hover:opacity-90 transition-all mt-auto shadow-md">
          Join Group
        </button>
      </div>
    </div>
  );
}


function FilterButton({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button className={`whitespace-nowrap px-8 py-4 rounded-full text-sm font-bold transition-all ${
      active ? 'bg-[#4d6054] text-white shadow-lg shadow-[#4d6054]/20' : 'bg-[#e3e9f0] text-[#5e5e5b] hover:bg-gray-200'
    }`}>
      {label}
    </button>
  );
}

function MobileNavItem({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? 'text-[#4d6054]' : 'text-gray-400'}`}>
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-[10px] font-bold uppercase">{label}</span>
    </div>
  );
}