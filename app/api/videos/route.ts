import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { videoService } from '@/services/video.service';
import { successResponse, errorResponse } from '@/types/api.types';

export const revalidate = 60;

export async function GET() {
  try {
    const items = await videoService.getAll();
    return NextResponse.json(successResponse(items), {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });

    const body = await req.json();
    const { title, description, videoUrl, thumbnailUrl } = body;

    if (!title?.trim() || !videoUrl?.trim()) {
      return NextResponse.json(errorResponse('Title and video URL are required'), { status: 400 });
    }

    const item = await videoService.create({
      title: title.trim(),
      description: description?.trim() || '',
      videoUrl,
      thumbnailUrl: thumbnailUrl || '',
    });
    return NextResponse.json(successResponse(item, 'Video created'), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create';
    const status = message.includes('Maximum') ? 409 : 500;
    return NextResponse.json(errorResponse(message), { status });
  }
}
