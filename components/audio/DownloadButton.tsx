'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface DownloadButtonProps {
  audioUrl: string;
  title: string;
}

export function DownloadButton({ audioUrl, title }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Your sanctuary audio is ready.');
    } catch (error) {
      toast.error('Unable to save audio at this time.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="group flex flex-col items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
      aria-label={`Download ${title}`}
    >
      <div className="w-12 h-12 rounded-full border border-[#c3c8c2] bg-white/50 backdrop-blur-sm flex items-center justify-center text-[#4d6054] group-hover:bg-[#4d6054] group-hover:text-white group-hover:border-[#4d6054] transition-all duration-300">
        {loading ? (
          <span className="material-symbols-outlined animate-spin text-xl">sync</span>
        ) : (
          <span className="material-symbols-outlined text-xl">download</span>
        )}
      </div>
      <span className="text-[10px] font-bold text-[#5e5e5b] uppercase tracking-[0.15em] opacity-70 group-hover:opacity-100 transition-opacity">
        {loading ? 'Preparing...' : 'Offline'}
      </span>
    </button>
  );
}