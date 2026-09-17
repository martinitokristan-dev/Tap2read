import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { activityService } from '@/services/activity.service';
import { successResponse, errorResponse } from '@/types/api.types';

export const revalidate = 60;

export async function GET() {
  try {
    const items = await activityService.getAll();
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
    const title = body.title;
    const description = body.description;
    const imageUrl = body.imageUrl || body.thumbnailUrl;
    const canvaLink = body.canvaLink || body.canvaUrl;

    if (!title?.trim() || !canvaLink?.trim() || !imageUrl?.trim()) {
      return NextResponse.json(errorResponse('Title, image, and Canva link are required'), { status: 400 });
    }

    const item = await activityService.create({
      title: title.trim(),
      description: description?.trim() || '',
      imageUrl,
      canvaLink: canvaLink.trim(),
    });
    return NextResponse.json(successResponse(item, 'Activity created'), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create';
    const status = message.includes('Maximum') ? 409 : 500;
    return NextResponse.json(errorResponse(message), { status });
  }
}
