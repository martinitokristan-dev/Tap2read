import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/types/api.types';

// GET /api/admin/stats - fast parallel counts for admin dashboard
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const [sightWords, shortStories, videos, activities, messages] = await Promise.all([
      prisma.sightWord.count(),
      prisma.shortStory.count(),
      prisma.video.count(),
      prisma.activity.count(),
      prisma.contactMessage.count(),
    ]);

    return NextResponse.json(
      successResponse({
        sightWords,
        shortStories,
        videos,
        activities,
        researchers: 6,
        messages,
      })
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch dashboard stats';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
