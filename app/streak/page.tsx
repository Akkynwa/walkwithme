'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '../layout-components/Sidebar';
import Header from '../layout-components/Header';
import Image from 'next/image';

type NodeStatus = 'completed' | 'active' | 'locked';

interface PathNodeData {
  id: string;
  title: string;
  desc: string;
  status: NodeStatus;
  position: 'center' | 'left' | 'right';
  icon: string;
}

interface PathStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
}

export default function SpiritualPathPage() {
  const { status } = useSession();
  const router = useRouter();
  
  const [nodes, setNodes] = useState<PathNodeData[]>([]);
  const [stats, setStats] = useState<PathStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<PathNodeData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      async function syncPathEngine() {
        try {
          const response = await fetch('/api/spiritual-path');
          const resJson = await response.json();
          if (resJson.success) {
            setNodes(resJson.nodes);
            setStats(resJson.stats);
          }
        } catch (err) {
          console.error('Error synchronizing active dashboard maps:', err);
        } finally {
          setLoading(false);
        }
      }
      syncPathEngine();
    }
  }, [status, router]);

  const handleOpenNode = (node: PathNodeData) => {
    if (node.status === 'locked') return;
    setSelectedNode(node);
    setIsPanelOpen(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
            alt="Peaceful sanctuary background"
            fill
            className="object-cover scale-110 blur-xl opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif italic text-gray-500 text-sm">Mapping out your sanctuary blueprint...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen overflow-x-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      {/* Subtle Animated Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />
      <Header />

      <main className="relative z-10 lg:ml-56 p-6 md:p-10 pt-20 max-w-4xl mx-auto w-full">
        
        {/* Alignment Performance Metrics row */}
        {stats && (
          <div className="mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
            <StreakCard label="Current Streak" value={stats.currentStreak.toString()} color="text-amber-700" />
            <StreakCard label="Longest Alignment" value={stats.longestStreak.toString()} color="text-amber-600" />
            <StreakCard label="Milestones Met" value={stats.totalDays.toString()} color="text-gray-700" />
          </div>
        )}

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-px bg-amber-400/40" />
            <span className="text-[8px] font-sans font-black uppercase tracking-wider text-amber-600">Sacred Journey</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-3 tracking-tight">My Spiritual Path</h1>
          <p className="text-sm text-gray-600 italic max-w-2xl mx-auto leading-relaxed">
            A linear sanctuary blueprint sequence. Complete your active focus node to unveil the next phase of your journey.
          </p>
        </div>

        {/* Dynamic Mapping Route */}
        <div className="relative max-w-[500px] mx-auto min-h-[800px] pb-10">
          <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-15" viewBox="0 0 400 1000" preserveAspectRatio="none">
            <path 
              className="stroke-amber-500 stroke-[2] fill-none" 
              style={{ strokeDasharray: '6 6' }}
              d="M200 0C200 100 350 150 350 250C350 350 50 450 50 550C50 650 350 750 350 850C350 950 200 1050 200 1200" 
            />
          </svg>
          
          <div className="relative z-10 flex flex-col gap-24 pt-6">
            {nodes.map((node) => (
              <PathNode 
                key={node.id} 
                node={node} 
                onClick={() => handleOpenNode(node)} 
              />
            ))}
          </div>
        </div>
      </main>

      {/* Slide-out Control Inspector Panel Overlay */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-xl shadow-2xl z-[70] border-l border-white/60 transition-transform duration-500 ease-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedNode && (
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <span className={`px-2.5 py-0.5 rounded-full text-[7px] font-sans font-black uppercase tracking-wider ${
                  selectedNode.status === 'active' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {selectedNode.status} Focus
                </span>
                <button onClick={() => setIsPanelOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-3">{selectedNode.title}</h2>
              
              <div className="w-full h-36 rounded-lg bg-amber-50 mb-5 relative overflow-hidden shadow-inner">
                <Image 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" 
                  alt="Focus Ambient View" 
                  fill 
                  className="object-cover" 
                />
              </div>
              
              <p className="text-xs font-sans leading-relaxed text-gray-600 mb-5">{selectedNode.desc}</p>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-sans text-[8px] font-black tracking-wider uppercase rounded-lg transition-all hover:shadow-lg hover:scale-[1.02]">
              {selectedNode.status === 'completed' ? 'Reflect Again' : 'Mark Destination Complete'}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

/**
 * HOOK & LAYOUT SUB-COMPONENTS
 */
function PathNode({ node, onClick }: { node: PathNodeData; onClick: () => void }) {
  const positionMapping = {
    center: 'items-center',
    left: 'items-center -translate-x-16 md:-translate-x-20',
    right: 'items-center translate-x-16 md:translate-x-20',
  };

  const statusThemes = {
    completed: 'bg-white/80 text-amber-600 border border-amber-200 shadow-sm opacity-80',
    active: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white scale-110 shadow-xl ring-4 ring-amber-500/20 cursor-pointer',
    locked: 'bg-gray-100/80 border border-gray-200 text-gray-400 cursor-not-allowed select-none',
  };

  return (
    <div className={`flex flex-col transition-all duration-300 ${positionMapping[node.position]}`}>
      <div 
        onClick={onClick}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-transform ${
          node.status !== 'locked' ? 'hover:scale-105 active:scale-95' : ''
        } ${statusThemes[node.status]}`}
      >
        <span className="material-symbols-outlined text-xl md:text-2xl">
          {node.icon}
        </span>
      </div>
      <div className="mt-2 text-center max-w-[120px]">
        <h3 className={`text-[9px] font-sans font-bold tracking-tight ${node.status === 'locked' ? 'text-gray-400' : 'text-gray-700'}`}>
          {node.title}
        </h3>
      </div>
    </div>
  );
}

function StreakCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all">
      <p className="text-[7px] font-black tracking-wider text-gray-500 uppercase mb-1">{label}</p>
      <p className={`text-2xl md:text-3xl font-bold tracking-tight ${color}`}>{value}</p>
    </div>
  );
}