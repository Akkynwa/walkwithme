'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    author: { name: string };
    createdAt: string;
  };
  postType: 'revelations' | 'intercession';
  onPostDeleted?: (postId: string) => void;
}

export function PostCard({ post, postType, onPostDeleted }: PostCardProps) {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN';
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this post as an admin?')) return;

    setIsDeleting(true);
    try {
      const res = await fetch('/api/admin/posts/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, postType }),
      });

      if (res.ok) {
        toast.success('Post removed by moderation');
        if (onPostDeleted) onPostDeleted(post.id);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to remove post');
      }
    } catch (error) {
      toast.error('Server error deleting post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 border rounded-2xl mb-4 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 flex justify-between items-start gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm">{post.author.name}</span>
          <span className="text-xs text-slate-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* ADMIN-ONLY MODERATION CONTROL */}
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete as Admin"
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 shrink-0"
        >
          <span className="material-symbols-outlined text-lg block">delete</span>
        </button>
      )}
    </div>
  );
}