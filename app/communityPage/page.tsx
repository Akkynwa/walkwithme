'use client';

import React, { useState } from 'react';
import CommunityFeeder from '../dashboard-components/CommunityFeeder';
import { PostCard } from '../dashboard-components/PostCard';

export default function CommunityPage() {
  const [activeSection] = useState<'revelations' | 'intercession'>('revelations');
  const [posts, setPosts] = useState<any[]>([]);

  const handlePostCreated = (_type: string, freshData: any) => {
    setPosts((prev) => [freshData, ...prev]);
  };

  // 2. Handle post deletion from PostCard admin control
  const handlePostDeleted = (deletedPostId: string) => {
    // Instantly remove post from state
    setPosts((prev) => prev.filter((post) => post.id !== deletedPostId));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      {/* CREATION FEEDER WITH SWITCHER */}
      <CommunityFeeder
        activeSection={activeSection}
        onPostCreated={handlePostCreated}
      />

      {/* FEED LIST WITH ADMIN MODERATION */}
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            postType={activeSection}
            onPostDeleted={handlePostDeleted}
          />
        ))}
      </div>
    </div>
  );
}