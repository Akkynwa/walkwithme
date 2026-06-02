// components/reading/SoulJournal.tsx
import { useState } from 'react';
import { useSanctuary } from '@/hooks/useSanctuary';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeContext: { 
    book: string; 
    chapter: number; 
  };
}

export const SoulJournal = ({ isOpen, onClose, activeContext }: Props) => {
  const [note, setNote] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { saveReflection, loading } = useSanctuary();

  const handleArchive = async () => {
    // 1. Sanitize incoming context parameters
    const cleanBook = activeContext?.book?.trim();
    const cleanChapter = Number(activeContext?.chapter);

    // Debug tracking setup to catch payload issues instantly in your browser dev tools
    console.log("⚡ Sanctuary Submit Payload Status:", {
      book: cleanBook,
      chapter: cleanChapter,
      noteLength: note.trim().length
    });

    if (!cleanBook || isNaN(cleanChapter) || !note.trim()) {
      console.error("❌ Save Blocked: Invalid string parameters or missing note content.");
      return;
    }
    
    try {
      // 2. Fire hook with exact primitive signatures
      await saveReflection(cleanBook, cleanChapter, note.trim());
      
      // 3. UI Success sequence
      setShowToast(true);
      setNote('');
      
      setTimeout(() => {
        setShowToast(false);
      }, 3500);

    } catch (error) {
      console.error("❌ API/Database pipeline execution error:", error);
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#FDFDFB] z-[100] shadow-[-20px_0_80px_rgba(0,0,0,0.08)] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* SUCCESS TOAST */}
      <div className={`absolute top-24 left-6 right-6 z-50 flex items-center gap-3 bg-[#3C3830] text-white px-5 py-3.5 rounded-xl shadow-xl border border-white/10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-[#D4AF37] text-xl">check_circle</span>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">Archived Successfully</span>
          <span className="text-[9px] text-gray-400 font-sans">Saved to {activeContext?.book} {activeContext?.chapter}</span>
        </div>
      </div>

      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10"></div>
      
      <div className="h-full flex flex-col px-8 md:px-12 py-10 relative">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-1">Sanctuary Notes</h4>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Connected</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all"
          >
            <span className="material-symbols-outlined text-gray-400">close</span>
          </button>
        </div>

        <div className="flex-1 relative group mt-4">
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[14px] text-primary">menu_book</span>
            <span className="text-[10px] font-black text-[#3C3830] tracking-tight uppercase">
              {activeContext?.book} {activeContext?.chapter}
            </span>
            <div className="w-px h-3 bg-gray-200 mx-1"></div>
            <span className="text-[9px] font-bold text-gray-400 uppercase">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-full bg-transparent border-none focus:ring-0 text-lg md:text-xl font-serif leading-relaxed text-[#3C3830] placeholder:text-gray-300 resize-none pt-16 relative z-10" 
            placeholder="What is the Spirit speaking to you through this scripture?..." 
          />
          
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] border-t border-black/10 mt-16" 
               style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '100% 2.8rem' }}>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 pt-6 border-t border-gray-100 mt-4">
          <button className="col-span-1 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button 
            onClick={handleArchive}
            disabled={loading || !note.trim()}
            className="col-span-4 h-14 bg-[#3C3830] text-white rounded-2xl font-black text-xs tracking-[0.25em] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-black disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            {loading ? 'SYNCING...' : 'ARCHIVE REFLECTION'}
          </button>
        </div>
      </div>
    </div>
  );
};