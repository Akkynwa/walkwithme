'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '../layout-components/Sidebar';
import Header from '../layout-components/Header';
import { getCommunityGroups, toggleGroupMembership, createCommunityGroup } from './actions';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  image: string;
  isFeatured?: boolean;
  isJoined: boolean;
}

interface ToastNotification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function CommunityPage() {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Groups');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const [isPending, startTransition] = useTransition();

  // Helper utility to trigger auto-dismissing notifications
  const triggerNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Automatically clear notification toasts after timeout
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const syncWorkspaceData = () => {
    startTransition(async () => {
      const response = await getCommunityGroups();
      if (response.success && response.data) {
        setGroups(response.data.map(g => ({ ...g, members: g.memberCount })));
      } else {
        triggerNotification(response.error || "System synchronization dropped.", 'error');
      }
    });
  };

  useEffect(() => {
    syncWorkspaceData();
  }, []);

  const handleJoinToggle = (id: string, currentlyJoined: boolean) => {
    const targetGroup = groups.find(g => g.id === id);
    
    // Performance Optimistic UI update
    setGroups(prev => prev.map(g => g.id === id ? { 
      ...g, 
      isJoined: !currentlyJoined, 
      members: currentlyJoined ? g.members - 1 : g.members + 1 
    } : g));

    if (targetGroup) {
      triggerNotification(
        currentlyJoined ? `Left ${targetGroup.name} workspace.` : `Successfully joined ${targetGroup.name}!`,
        'info'
      );
    }

    startTransition(async () => {
      const result = await toggleGroupMembership(id, currentlyJoined);
      if (!result.success) {
        syncWorkspaceData(); // Rolling back changes if network fails
        triggerNotification("Could not synchronize roster status across clusters.", 'error');
      }
    });
  };

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const targetName = formData.get('name') as string;

    startTransition(async () => {
      const result = await createCommunityGroup(formData);
      if (result.success) {
        form.reset();
        setIsModalOpen(false);
        syncWorkspaceData();
        triggerNotification(`"${targetName}" initialized successfully!`, 'success');
      } else {
        triggerNotification(result.error || "Failed to create fellowship scope.", 'error');
      }
    });
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Groups' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All Groups', 'Bible Study', 'Meditation', 'Prayer'];

  return (
    <div className="relative flex min-h-screen overflow-x-hidden bg-slate-50/30 selection:bg-amber-200">
      {/* Dynamic Ambient Background Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Platform ambient background"
          fill
          className="object-cover scale-110 blur-2xl opacity-25 select-none"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-white/40 to-amber-50/20" />
      </div>

      {/* Global Interactive Notification Banner Container */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-full font-sans animate-in slide-in-from-top-4 duration-300">
          <div className={`p-4 rounded-xl border backdrop-blur-md shadow-xl flex items-start gap-3 transition-all ${
            toast.type === 'success' ? 'bg-emerald-50/95 border-emerald-500/30 text-emerald-900' :
            toast.type === 'error' ? 'bg-rose-50/95 border-rose-500/30 text-rose-900' :
            'bg-amber-50/95 border-amber-500/30 text-amber-900'
          }`}>
            <span className="material-symbols-outlined mt-0.5 text-base shrink-0">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <div className="flex-1">
              <p className="text-xs font-bold leading-tight tracking-wide">
                {toast.type === 'success' ? 'Operation Success' : toast.type === 'error' ? 'System Exception' : 'Status Registry Update'}
              </p>
              <p className="text-[10px] opacity-90 mt-0.5 leading-normal">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="opacity-40 hover:opacity-100 self-center text-xs p-0.5 transition-opacity">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      <Sidebar />
      <Header />

      <main className="relative z-10 lg:ml-56 p-6 md:p-10 pt-24 max-w-6xl mx-auto w-full pb-24">
        
        <header className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-px bg-amber-500/50" />
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-700 font-sans">Ecosystem Directory</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-800 tracking-tight">Community Hub</h2>
            <p className="text-xs text-slate-500 font-sans font-light mt-1">Discover, enroll, and build synchronous workspaces configured for fellowship.</p>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)} 
            className="group flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-xs group-hover:rotate-90 transition-transform duration-300">add</span>
            Initialize Workspace
          </button>
        </header>

        {/* Directory Controls Filter Panels */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 font-sans bg-white/30 backdrop-blur-md border border-white/60 p-3 rounded-xl shadow-sm">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
            <input 
              type="text"
              placeholder="Filter scopes via title, tag keywords, or blueprint definitions..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500/60 text-xs outline-none text-slate-700 transition-all placeholder:text-slate-400 font-light"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto items-center pb-1 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm' 
                    : 'bg-white/60 text-slate-600 border border-slate-100 hover:bg-white hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Async Hydration States */}
        {isPending && groups.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white/40 border border-white/60 rounded-xl h-80 animate-pulse overflow-hidden flex flex-col">
                <div className="bg-slate-200/60 h-40 w-full" />
                <div className="p-5 flex-1 space-y-3">
                  <div className="h-4 bg-slate-200/60 rounded w-2/3" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 bg-slate-200/40 rounded w-full" />
                    <div className="h-2.5 bg-slate-200/40 rounded w-5/6" />
                  </div>
                  <div className="flex gap-2 pt-4 mt-auto">
                    <div className="h-8 bg-slate-200/40 rounded flex-1" />
                    <div className="h-8 bg-slate-200/50 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 bg-white/20 backdrop-blur-sm rounded-xl p-8 max-w-xl mx-auto mb-12">
            <span className="material-symbols-outlined text-3xl text-amber-500/60 mb-2">find_in_page</span>
            <p className="text-sm font-serif font-bold text-slate-700 italic">No matching fellowship paths resolved</p>
            <p className="text-[10px] text-slate-500 font-sans mt-1">Refine your query vectors or establish a custom context scope above.</p>
          </div>
        ) : (
          /* Dynamic Grid Matrix Display */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredGroups.map((group) => (
              <div key={group.id} className="group relative bg-white/50 backdrop-blur-sm border border-white/70 rounded-xl overflow-hidden flex flex-col hover:bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                
                {/* Image Section */}
                <Link href={`/community/${group.id}`} className="h-44 relative block overflow-hidden bg-slate-100">
                  <Image 
                    src={group.image} 
                    alt={group.name}
                    fill
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Category Pill Tag Badge */}
                  <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider text-slate-800 shadow-sm border border-white">
                    {group.category}
                  </span>
                  
                  {group.isFeatured && (
                    <span className="absolute top-3 right-3 bg-amber-500 px-2 py-0.5 rounded-md text-[6px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Featured
                    </span>
                  )}
                </Link>

                {/* Meta Description Layer Body */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <Link href={`/community/${group.id}`} className="hover:text-amber-700 transition-colors">
                      <h3 className="text-base font-serif font-black text-slate-800 leading-snug tracking-tight">{group.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-sans text-[8px] font-black shrink-0">
                      <span className="material-symbols-outlined text-[10px]">group</span> {group.members}
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 font-sans mb-5 line-clamp-3 leading-relaxed font-light">{group.description}</p>
                  
                  {/* Interactive Trigger Clustered Buttons */}
                  <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100/60">
                    <Link href={`/community/${group.id}`} className="flex-1 flex items-center justify-center gap-1 text-center py-2 border border-slate-200 text-slate-700 rounded-lg font-bold text-[8px] uppercase tracking-wider bg-slate-50/50 hover:bg-slate-100 hover:text-amber-700 transition-all">
                      Open Space
                      <span className="material-symbols-outlined text-[10px]">arrow_right_alt</span>
                    </Link>
                    <button 
                      onClick={() => handleJoinToggle(group.id, group.isJoined)}
                      disabled={isPending}
                      className={`px-4 py-2 rounded-lg font-black text-[8px] uppercase tracking-wider transition-all shadow-sm ${
                        group.isJoined 
                          ? 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100' 
                          : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white active:scale-95'
                      }`}
                    >
                      {group.isJoined ? 'Leave' : 'Join'}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Custom Showcase Action Banner Box Block */}
        <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-white tracking-tight">Establish Custom Fellowship Circle</h3>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5 max-w-xl font-light leading-relaxed">Deploy an entirely unique workspace dynamic blueprint specific to your platform user targets, community curriculum, or private focus parameters.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="whitespace-nowrap px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-[8px] font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              Commission Matrix
            </button>
          </div>
        </section>
      </main>

      {/* Structured Configuration Configuration Dialog Modal Box Container */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto animate-in scale-in-from-95 duration-200">
            
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-serif font-black text-slate-800">New Fellowship Configuration</h3>
                <p className="text-[9px] text-slate-400 font-sans">Set runtime context initialization metadata.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-full hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined text-sm block">close</span>
              </button>
            </div>

            <form onSubmit={handleFormSubmission} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Group Identifier Name</label>
                <input required disabled={isPending} name="name" type="text" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 text-slate-800 placeholder:text-slate-300 font-light" placeholder="e.g., Acts Chapter Study" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Classification Target Category</label>
                <div className="relative">
                  <select disabled={isPending} name="category" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 text-slate-700 appearance-none font-light">
                    <option value="Bible Study">Bible Study</option>
                    <option value="Meditation">Meditation</option>
                    <option value="Prayer">Prayer</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-sm">unfold_more</span>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cover Picture URL (Unsplash/CDN)</label>
                <input disabled={isPending} name="image" type="url" className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 text-slate-800 placeholder:text-slate-300 font-light" placeholder="https://images.unsplash.com/your-image-id..." />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Core Purpose Vision Blueprint</label>
                <textarea required disabled={isPending} name="description" rows={3} className="w-full p-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10 text-slate-800 placeholder:text-slate-300 font-light leading-relaxed resize-none" placeholder="What is the active focal core of this fellowship workspace?..." />
              </div>
              
              <div className="pt-2 flex items-center gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3 border border-slate-200 text-slate-500 font-bold tracking-wider uppercase rounded-lg text-[8px] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isPending} 
                  className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black tracking-wider uppercase rounded-lg text-[8px] shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                  {isPending ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Writing Cluster...</span>
                    </>
                  ) : (
                    <span>Commission Space</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}