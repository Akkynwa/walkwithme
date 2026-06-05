'use client';

import { useState, useEffect, useTransition, useCallback } from 'react'; // 1. Added useCallback import
import { createDiscussion, getGroupDiscussions } from '../actions';
import Image from 'next/image';

interface DiscussionRecord {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: { name: string | null; image: string | null } | null;
}

export default function DiscussionFeed({ groupId }: { groupId: string }) {
  const [discussions, setDiscussions] = useState<DiscussionRecord[]>([]);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // 2. Wrapped syncFeed in useCallback with groupId dependency
  const syncFeed = useCallback(async () => {
    const response = await getGroupDiscussions(groupId);
    if (response.success && response.data) {
      setDiscussions(response.data as any);
    }
  }, [groupId]);

  // 3. Added syncFeed to the useEffect dependency array safely
  useEffect(() => {
    syncFeed();
  }, [syncFeed]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePublish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createDiscussion(formData, groupId);
      if (result.success) {
        form.reset();
        setIsFormExpanded(false);
        await syncFeed();
        triggerToast("Discussion blueprint dispatched safely.");
      } else {
        triggerToast(result.error || "Execution drop on runtime compilation.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-3 rounded-lg shadow-xl border border-slate-700 animate-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}

      {/* Triggerable Input Box Cluster */}
      <div className="bg-white/50 backdrop-blur-md border border-white/70 rounded-xl overflow-hidden transition-all duration-300">
        {!isFormExpanded ? (
          <button 
            onClick={() => setIsFormExpanded(true)}
            className="w-full p-4 text-left flex items-center justify-between text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="text-xs font-light">Initiate a synchronization thread inside this workspace...</span>
            <span className="material-symbols-outlined text-base text-amber-600">rate_review</span>
          </button>
        ) : (
          <form onSubmit={handlePublish} className="p-5 space-y-3 animate-in fade-in duration-200">
            <div>
              <label className="block text-[8px] font-black uppercase tracking-wider text-slate-400 mb-1">Thread Title</label>
              <input required disabled={isPending} name="title" type="text" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none text-xs text-slate-800 focus:border-amber-500/60" placeholder="Summary vectors of this discussion..." />
            </div>
            <div>
              <label className="block text-[8px] font-black uppercase tracking-wider text-slate-400 mb-1">Context Definition Parameters</label>
              <textarea required disabled={isPending} name="content" rows={4} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none text-xs text-slate-800 focus:border-amber-500/60 resize-none leading-relaxed" placeholder="Elaborate details for fellow cluster entities..." />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setIsFormExpanded(false)} className="px-4 py-2 border text-slate-500 rounded-md text-[8px] font-bold uppercase tracking-wider hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={isPending} className="px-5 py-2 bg-slate-900 text-white rounded-md text-[8px] font-black uppercase tracking-wider hover:bg-amber-700 transition-all flex items-center gap-1.5 disabled:opacity-50">
                {isPending ? "Broadcasting..." : "Dispatch Topic"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Discussion List Feed Matrix */}
      <div className="space-y-4">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <span>Active Context Operations</span>
          <div className="flex-1 h-px bg-slate-200/60" />
        </h3>

        {discussions.length === 0 ? (
          <div className="text-center py-12 bg-white/20 rounded-xl border border-dashed border-slate-200/60 text-slate-400 italic text-xs font-serif font-light">
            No thread logs recorded in this workspace index. Be the first to configure one.
          </div>
        ) : (
          discussions.map((topic) => (
            <article key={topic.id} className="bg-white/40 hover:bg-white backdrop-blur-sm border border-white/60 p-5 rounded-xl transition-all duration-200 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-serif font-bold text-[10px] overflow-hidden relative">
                  {topic.author?.image ? (
                    <Image src={topic.author.image} alt="User Avatar" fill className="object-cover" />
                  ) : (
                    topic.author?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-700 leading-none">
                    {topic.author?.name || "Anonymous User"}
                  </h4>
                  <span className="text-[7px] text-slate-400 font-light font-mono">
                    {new Date(topic.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>
              </div>
              <h2 className="text-sm font-serif font-black text-slate-800 tracking-tight leading-snug mb-1.5">{topic.title}</h2>
              <p className="text-[11px] text-slate-500 font-light leading-relaxed whitespace-pre-wrap">{topic.content}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}