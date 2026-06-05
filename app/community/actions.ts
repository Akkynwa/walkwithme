'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

/**
 * Security Wrapper: Resolves session identity securely on the server
 */
async function getAuthenticatedUserId(): Promise<string> {
  // HOOK: Replace this line with your platform's session extraction wrapper
  // e.g., const session = await auth(); return session.user.id;
  const systemUser = await prisma.user.findFirst({ select: { id: true } });
  if (!systemUser) throw new Error("UNAUTHORIZED_ACCESS_EXCEPTION");
  return systemUser.id;
}

export async function getCommunityGroups() {
  try {
    const userId = await getAuthenticatedUserId();

    const groups = await prisma.communityGroup.findMany({
      include: {
        _count: {
          select: { members: true }
        },
        members: {
          where: { userId },
          select: { userId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return {
      success: true,
      data: groups.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description,
        category: group.category,
        image: group.image,
        isFeatured: group.isFeatured,
        memberCount: group._count.members,
        isJoined: group.members.length > 0
      }))
    };
  } catch (error) {
    console.error("[COMMUNITY_FETCH_ERROR]:", error);
    return { success: false, data: [], error: "Failed to pull community register." };
  }
}

export async function toggleGroupMembership(groupId: string, isJoined: boolean) {
  try {
    const userId = await getAuthenticatedUserId();

    if (isJoined) {
      await prisma.groupMember.delete({
        where: {
          userId_groupId: { userId, groupId }
        }
      });
    } else {
      await prisma.groupMember.create({
        data: { userId, groupId }
      });
    }

    revalidatePath('/community');
    revalidatePath(`/community/${groupId}`);
    return { success: true };
  } catch (error) {
    console.error("[MEMBERSHIP_MUTATION_ERROR]:", error);
    return { success: false, error: "Mutation failed to propagate across cluster." };
  }
}

export async function createCommunityGroup(formData: FormData) {
  try {
    const userId = await getAuthenticatedUserId();
    
    const name = (formData.get('name') as string)?.trim();
    const description = (formData.get('description') as string)?.trim();
    const category = formData.get('category') as string;
    const fallbackImage = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800';
    const image = (formData.get('image') as string)?.trim() || fallbackImage;

    if (!name || !description || !category) {
      return { success: false, error: "Validation parameters incomplete." };
    }

    const newGroup = await prisma.communityGroup.create({
      data: {
        name,
        description,
        category,
        image,
        creatorId: userId
      }
    });

    // Auto-enroll owner into the group membership roster
    await prisma.groupMember.create({
      data: { userId, groupId: newGroup.id }
    });

    revalidatePath('/community');
    return { success: true, groupId: newGroup.id };
  } catch (error) {
    console.error("[GROUP_CREATION_ERROR]:", error);
    return { success: false, error: "System encountered an error writing database record." };
  }
}

/**
 * Discussion Action: Commits a new contextual text log thread to a target community workspace
 */
export async function createDiscussion(formData: FormData, groupId: string) {
  try {
    const userId = await getAuthenticatedUserId();
    
    const title = (formData.get('title') as string)?.trim();
    const content = (formData.get('content') as string)?.trim();

    if (!title || !content || !groupId) {
      return { success: false, error: "Validation footprint incomplete." };
    }

    await prisma.discussion.create({
      data: {
        title,
        content,
        groupId,
        authorId: userId
      }
    });

    // Bust client side routes cache matrix to reflect changes immediately
    revalidatePath(`/community/${groupId}`);
    return { success: true };
  } catch (error) {
    console.error("[DISCUSSION_CREATION_ERROR]:", error);
    return { success: false, error: "System encountered an error writing thread record." };
  }
}

/**
 * Feed Hydration Action: Compiles and extracts ongoing discussions filtered via space identification parameters
 */
export async function getGroupDiscussions(groupId: string) {
  try {
    if (!groupId) {
      return { success: false, data: [], error: "Missing matrix identity reference." };
    }

    const discussions = await prisma.discussion.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: discussions };
  } catch (error) {
    console.error("[DISCUSSION_FETCH_ERROR]:", error);
    return { success: false, data: [], error: "Failed to compile thread indices." };
  }
}