'use client';

import React, { useState } from 'react';
import Sidebar from '../layout-components/Sidebar';
import Header from '../layout-components/Header';
import Image from 'next/image';

/** * TYPES 
 */
type NodeStatus = 'completed' | 'active' | 'locked';

interface PathNodeData {
  id: string;
  title: string;
  desc: string;
  status: NodeStatus;
  date?: string;
  position: 'center' | 'left' | 'right';
  icon: string;
}

const PATH_DATA: PathNodeData[] = [
  { id: '1', title: 'Read Psalm 23', desc: 'A reflection on divine protection and guidance.', status: 'completed', date: 'July 12', position: 'center', icon: 'check_circle' },
  { id: '2', title: '10-Minute Morning Meditation', desc: '10 minutes of silent presence and breathing.', status: 'completed', date: 'July 14', position: 'right', icon: 'check_circle' },
  { id: '3', title: '7-Day Gratitude Challenge', desc: 'Begin an intentional journey of identifying daily blessings.', status: 'active', position: 'left', icon: 'auto_awesome' },
  { id: '4', title: 'Set Monthly Spiritual Goal', desc: 'Setting intentions for the coming month of growth.', status: 'locked', position: 'right', icon: 'lock' },
  { id: '5', title: 'Service Reflection', desc: 'Exploring ways to serve others through light.', status: 'locked', position: 'center', icon: 'diversity_3' },
];

/**
 * MAIN COMPONENT
 */
export default function SpiritualPathPage() {
  const [selectedNode, setSelectedNode] = useState<PathNodeData | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleOpenNode = (node: PathNodeData) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#161c22] font-['Playfair_Display'] overflow-x-hidden">

      {/* 2. Main Content Area */}
      <main className="lg:ml-64 p-6 md:p-12 pt-24 lg:pt-12 max-w-[1200px] mx-auto relative">
        <Sidebar />
              <Header />
                
        {/* Streak Summary Section (Integrated from your React Code) */}
        <div className="max-w-[800px] mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-4 font-sans">
          <StreakCard label="Current Streak" value="24" color="text-[#4d6054]" />
          <StreakCard label="Longest Streak" value="47" color="text-[#5e5e5b]" />
          <StreakCard label="Total Days" value="156" color="text-[#605b55]" />
        </div>

        {/* Path Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#4d6054] mb-4">My Spiritual Path</h1>
          <p className="text-lg text-[#5e5e5b] max-w-2xl mx-auto leading-relaxed">
            A visual map of your journey toward peace and spiritual growth. Every step is a moment of light.
          </p>
        </div>

        {/* 3. The SVG Path & Nodes */}
        <div className="relative max-w-[600px] mx-auto min-h-[1000px]">
          <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 1000">
            <path 
              className="stroke-[#c3c8c2] stroke-[4] fill-none" 
              style={{ strokeDasharray: '12 12' }}
              d="M200 0C200 100 350 150 350 250C350 350 50 450 50 550C50 650 350 750 350 850C350 950 200 1050 200 1200" 
            />
          </svg>
          
          <div className="relative z-10 flex flex-col gap-32 pt-12">
            {PATH_DATA.map((node) => (
              <PathNode 
                key={node.id} 
                node={node} 
                onClick={() => handleOpenNode(node)} 
              />
            ))}
          </div>
        </div>

        {/* 4. Breathe Component */}
        <div className="max-w-[400px] mx-auto my-24 p-12 bg-[#e1dfdb]/30 rounded-[32px] text-center border border-[#c3c8c2]/30">
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#4d6054] rounded-full animate-ping opacity-20"></div>
            <div className="w-12 h-12 bg-[#4d6054] rounded-full z-10 shadow-lg"></div>
          </div>
          <h4 className="font-bold text-[#4d6054] mb-2">Breathe in Peace</h4>
          <p className="text-sm text-[#5e5e5b] font-sans">Take a moment to center your spirit.</p>
        </div>
      </main>

      {/* 5. Detail Side Panel (Slide-in) */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] border-l border-[#c3c8c2]/50 transition-transform duration-500 ease-in-out ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedNode && (
          <div className="p-8 h-full flex flex-col">
            <button onClick={() => setIsPanelOpen(false)} className="self-end p-2 text-[#5e5e5b] hover:text-[#4d6054]">
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            <div className="mt-8 flex-grow">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider ${
                selectedNode.status === 'active' ? 'bg-[#d2e8d8] text-[#0d1f15]' : 'bg-[#e9eef6] text-[#434844]'
              }`}>
                {selectedNode.status}
              </span>
              <h2 className="text-3xl font-bold text-[#4d6054] mb-4 leading-tight">{selectedNode.title}</h2>
              <div className="w-full h-48 rounded-2xl bg-[#e3e9f0] mb-6 overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop" alt="Meditative Scene" className="w-full h-full object-cover" />
              </div>
              <p className="text-[#434844] mb-8 leading-relaxed">{selectedNode.desc}</p>
              <div className="space-y-4 font-sans">
                <div className="flex gap-4 items-start">
                  <span className="material-symbols-outlined text-[#4d6054]">menu_book</span>
                  <p className="text-sm italic text-[#5e5e5b]">"Give thanks in all circumstances..." — 1 Thess 5:18</p>
                </div>
              </div>
            </div>
            <button className="w-full py-4 bg-[#4d6054] text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all mt-auto">
              {selectedNode.status === 'locked' ? 'Locked' : 'Continue Journey'}
            </button>
          </div>
        )}
      </aside>

      {/* Bottom Nav (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center p-4 bg-white border-t border-gray-100">
        <MobileNavItem icon="auto_awesome" label="Daily" />
        <MobileNavItem icon="route" label="Path" active />
        <MobileNavItem icon="history_edu" label="Journal" />
      </nav>
    </div>
  );
}

/**
 * SUB-COMPONENTS
 */

function PathNode({ node, onClick }: { node: PathNodeData; onClick: () => void }) {
  const alignment = {
    center: 'items-center',
    left: 'items-center -translate-x-24 md:-translate-x-32',
    right: 'items-center translate-x-24 md:translate-x-32',
  };

  const statusStyles = {
    completed: 'bg-[#b7ccbc] text-[#384b3f] shadow-primary/10',
    active: 'bg-[#4d6054] text-white scale-110 shadow-xl animate-pulse',
    locked: 'bg-[#e3e9f0] border-2 border-dashed border-[#737873] text-[#5e5e5b] opacity-50 grayscale',
  };

  return (
    <div className={`flex flex-col transition-all duration-500 group ${alignment[node.position]}`}>
      <div 
        onClick={onClick}
        className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${statusStyles[node.status]}`}
      >
        <span className="material-symbols-outlined text-3xl">
          {node.icon}
        </span>
      </div>
      <div className="mt-4 text-center">
        <h3 className={`text-sm font-bold ${node.status === 'active' ? 'text-[#4d6054]' : 'text-[#5e5e5b]'}`}>{node.title}</h3>
        {node.date && <p className="text-[10px] uppercase tracking-widest text-[#5e5e5b] opacity-60">{node.date}</p>}
      </div>
    </div>
  );
}

function StreakCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 text-center">
      <p className="text-xs text-[#5e5e5b] uppercase tracking-tighter mb-1">{label}</p>
      <p className={`text-4xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-400">Days</p>
    </div>
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