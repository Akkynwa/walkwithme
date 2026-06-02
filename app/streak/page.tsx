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
    if (node.status === 'locked') return; // Strict UX shield catch rule
    setSelectedNode(node);
    setIsPanelOpen(true);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7F5]">
        <div className="animate-pulse text-center">
          <div className="w-12 h-12 bg-[#4d6054]/20 rounded-full mb-4 mx-auto" />
          <p className="font-serif italic text-[#4d6054]">Mapping out your sanctuary blueprint...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#161c22] font-serif overflow-x-hidden">
      <Sidebar />
      <Header />

      <main className="lg:ml-64 p-6 md:p-12 pt-24 lg:pt-16 max-w-[1200px] mx-auto relative z-10">
        
        {/* Alignment Performance Metrics row */}
        {stats && (
          <div className="max-w-[800px] mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <StreakCard label="Current Streak" value={stats.currentStreak.toString()} color="text-[#4d6054]" />
            <StreakCard label="Longest Alignment" value={stats.longestStreak.toString()} color="text-[#e0a96d]" />
            <StreakCard label="Milestones Met" value={stats.totalDays.toString()} color="text-[#161c22]" />
          </div>
        )}

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4d6054] mb-4 tracking-tight">My Spiritual Path</h1>
          <p className="text-sm md:text-base font-sans text-[#434844]/70 max-w-2xl mx-auto leading-relaxed">
            A linear sanctuary blueprint sequence. Complete your active focus node to unveil the next phase of your journey.
          </p>
        </div>

        {/* Dynamic Mapping Route */}
        <div className="relative max-w-[600px] mx-auto min-h-[900px] pb-12">
          <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 1000" preserveAspectRatio="none">
            <path 
              className="stroke-[#4d6054] stroke-[3] fill-none" 
              style={{ strokeDasharray: '8 8' }}
              d="M200 0C200 100 350 150 350 250C350 350 50 450 50 550C50 650 350 750 350 850C350 950 200 1050 200 1200" 
            />
          </svg>
          
          <div className="relative z-10 flex flex-col gap-28 pt-6">
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
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] border-l border-gray-100 transition-transform duration-500 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedNode && (
          <div className="p-8 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-sans font-black uppercase tracking-widest ${
                  selectedNode.status === 'active' ? 'bg-[#d2e8d8] text-[#0d1f15]' : 'bg-[#f7ebd9] text-[#4d6054]'
                }`}>
                  {selectedNode.status} Focus
                </span>
                <button onClick={() => setIsPanelOpen(false)} className="p-2 text-gray-400 hover:text-black transition-colors">
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-[#161c22] mb-4">{selectedNode.title}</h2>
              
              <div className="w-full h-44 rounded-2xl bg-gray-100 mb-6 relative overflow-hidden shadow-inner">
                <Image 
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" 
                  alt="Focus Ambient View" 
                  fill 
                  className="object-cover" 
                />
              </div>
              
              <p className="text-sm font-sans leading-relaxed text-[#434844] mb-6">{selectedNode.desc}</p>
            </div>

            <button className="w-full py-4 bg-[#4d6054] text-white font-sans text-xs font-black tracking-widest uppercase rounded-xl transition-all hover:bg-[#3d4d43]">
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
    left: 'items-center -translate-x-16 md:-translate-x-28',
    right: 'items-center translate-x-16 md:translate-x-28',
  };

  const statusThemes = {
    completed: 'bg-white text-[#4d6054] border border-[#4d6054]/20 shadow-sm opacity-80',
    active: 'bg-[#4d6054] text-white scale-110 shadow-xl ring-4 ring-[#4d6054]/10 cursor-pointer',
    locked: 'bg-gray-100 border border-gray-200 text-gray-300 cursor-not-allowed select-none',
  };

  return (
    <div className={`flex flex-col transition-all duration-300 ${positionMapping[node.position]}`}>
      <div 
        onClick={onClick}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-transform ${
          node.status !== 'locked' ? 'hover:scale-105 active:scale-95' : ''
        } ${statusThemes[node.status]}`}
      >
        <span className="material-symbols-outlined text-2xl">
          {node.icon}
        </span>
      </div>
      <div className="mt-3 text-center max-w-[140px]">
        <h3 className={`text-xs font-sans font-bold tracking-tight ${node.status === 'locked' ? 'text-gray-300' : 'text-[#161c22]'}`}>
          {node.title}
        </h3>
      </div>
    </div>
  );
}

function StreakCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm text-center">
      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-1">{label}</p>
      <p className={`text-3xl font-bold tracking-tight ${color}`}>{value}</p>
    </div>
  );
}