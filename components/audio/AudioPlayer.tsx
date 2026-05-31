'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface AudioPlayerProps {
  src?: string; // Optional if loading via loadAudio
  title: string;
  narrator?: string;
  book?: string;
  chapter?: number;
  version?: string;
  playbackSpeed?: number;
  bgImage?: string;
}

export function AudioPlayer({
  src,
  title,
  narrator = "Julianna Thorne",
  book,
  chapter,
  version = "eng-KJV",
  playbackSpeed = 1,
  bgImage = "https://images.unsplash.com/photo-1444492417251-9c84a5fa1c10?q=80&w=1000",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioSrc, setAudioSrc] = useState<string>(src || '');
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // 1. Fetch Audio Source from API if book/chapter provided
  const fetchAudioUrl = useCallback(async () => {
    if (!book || !chapter) return;
    
    setIsAudioLoading(true);
    try {
      const res = await fetch(`/api/bible/audio?book=${book}&chapter=${chapter}&versionId=${version}`);
      const data = await res.json();
      if (data.url) {
        setAudioSrc(data.url);
      }
    } catch (err) {
      console.error("Audio Sanctuary Error:", err);
    } finally {
      setIsAudioLoading(false);
    }
  }, [book, chapter, version]);

  useEffect(() => {
    if (!src) {
      fetchAudioUrl();
    }
  }, [fetchAudioUrl, src]);

  // 2. Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlay = () => {
    if (!audioRef.current || isAudioLoading) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full max-w-[800px] h-[500px] rounded-[40px] overflow-hidden flex items-center justify-center shadow-2xl group">
      {/* Optimized Background Image */}
      <Image 
        src={bgImage} 
        alt="Sanctuary Background" 
        fill
        priority
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      <div className="relative z-10 w-[90%] max-w-[500px] bg-white/10 backdrop-blur-[32px] border border-white/20 rounded-[32px] p-8 flex flex-col items-center text-center shadow-inner">
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          preload="metadata"
        />

        <div className="mb-6">
          <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">
            {isAudioLoading ? 'Preparing Sanctuary...' : 'Now Playing'}
          </span>
          <h2 className="text-2xl font-serif text-white mt-2 leading-tight">
            {title} {book && chapter ? `— ${book} ${chapter}` : ''}
          </h2>
          <p className="text-white/60 italic font-serif text-sm mt-1">Narrated by {narrator}</p>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full mb-6 px-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={isAudioLoading}
            className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white transition-all hover:h-2"
            style={{
              background: `linear-gradient(to right, white ${progressPercentage}%, rgba(255,255,255,0.2) ${progressPercentage}%)`
            }}
          />
          <div className="flex justify-between w-full mt-3">
            <span className="text-white/70 text-[10px] font-mono tracking-tighter">{formatTime(currentTime)}</span>
            <span className="text-white/70 text-[10px] font-mono tracking-tighter">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Hub */}
        <div className="flex items-center gap-10">
          <button 
            onClick={() => skip(-10)} 
            className="text-white/60 hover:text-white transition-colors active:scale-90"
            aria-label="Rewind 10 seconds"
          >
            <span className="material-symbols-outlined text-2xl">replay_10</span>
          </button>

          <button 
            onClick={togglePlay} 
            disabled={isAudioLoading}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all
              ${isAudioLoading ? 'bg-white/20 cursor-wait' : 'bg-white text-[#3C3830] hover:scale-105'}
            `}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isAudioLoading ? (
              <div className="w-6 h-6 border-2 border-[#3C3830]/30 border-t-[#3C3830] rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            )}
          </button>

          <button 
            onClick={() => skip(10)} 
            className="text-white/60 hover:text-white transition-colors active:scale-90"
            aria-label="Forward 10 seconds"
          >
            <span className="material-symbols-outlined text-2xl">forward_10</span>
          </button>
        </div>
      </div>
    </div>
  );
}