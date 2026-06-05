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
    const cleanBook = activeContext?.book?.trim();
    const cleanChapter = Number(activeContext?.chapter);

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
      await saveReflection(cleanBook, cleanChapter, note.trim());
      
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
    <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white/95 backdrop-blur-xl z-[100] shadow-2xl transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* Left decorative border */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent" />
      
      {/* Success Toast */}
      <div className={`absolute top-20 left-6 right-6 z-50 flex items-center gap-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white px-4 py-3 rounded-lg shadow-xl border border-amber-600/30 transition-all duration-500 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-amber-300 text-[18px]">check_circle</span>
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-white uppercase tracking-wider leading-none mb-0.5">Archived Successfully</span>
          <span className="text-[7px] text-amber-200 font-sans">Saved to {activeContext?.book} {activeContext?.chapter}</span>
        </div>
      </div>
      
      <div className="h-full flex flex-col px-6 md:px-8 py-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-amber-600 text-[14px]">edit_note</span>
              <h4 className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Sanctuary Notes</h4>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[7px] font-medium text-gray-500 uppercase tracking-wider">Connected</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-amber-50 hover:border-amber-300 transition-all"
          >
            <span className="material-symbols-outlined text-gray-500 text-[14px]">close</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative group mt-2">
          {/* Context Badge */}
          <div className="absolute top-0 left-0 z-20 flex items-center gap-1.5 bg-white/80 backdrop-blur-md border border-amber-200 px-2.5 py-1.5 rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-[12px] text-amber-600">menu_book</span>
            <span className="text-[8px] font-black text-gray-700 tracking-tight uppercase">
              {activeContext?.book} {activeContext?.chapter}
            </span>
            <div className="w-px h-2.5 bg-gray-300 mx-0.5" />
            <span className="text-[7px] font-bold text-gray-500 uppercase">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-full bg-transparent border-none focus:ring-0 text-base md:text-lg font-serif leading-relaxed text-gray-700 placeholder:text-gray-300 resize-none pt-12 relative z-10 outline-none" 
            placeholder="What is the Spirit speaking to you through this scripture?..." 
          />
          
          {/* Lined Paper Effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] border-t border-black/10 mt-12" 
            style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2rem' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-5 gap-2 pt-5 border-t border-gray-200/50 mt-3">
          <button className="col-span-1 h-12 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 transition-all">
            <span className="material-symbols-outlined text-[16px]">share</span>
          </button>
          <button 
            onClick={handleArchive}
            disabled={loading || !note.trim()}
            className="col-span-4 h-12 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-black text-[8px] tracking-wider shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[12px]">self_improvement</span>
            {loading ? (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined animate-spin text-[10px]">sync</span>
                SYNCING...
              </span>
            ) : (
              'ARCHIVE REFLECTION'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};