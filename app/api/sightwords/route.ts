import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sightWordService } from '@/services/sightword.service';
import { successResponse, errorResponse } from '@/types/api.types';

export const dynamic = 'force-dynamic';

// GET /api/sightwords — public
export async function GET() {
  try {
    const items = await sightWordService.getAll();
    return NextResponse.json(successResponse(items), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'CDN-Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

// POST /api/sightwords — teacher only
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });

    const body = await req.json();
    const { word, imageUrl } = body;

    if (!imageUrl?.trim()) {
      return NextResponse.json(errorResponse('Image is required'), { status: 400 });
    }

    const item = await sightWordService.create({ word: word ? word.trim() : '', imageUrl });
    return NextResponse.json(successResponse(item, 'Sight word created'), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create';
    const status = message.includes('Maximum') ? 409 : 500;
    return NextResponse.json(errorResponse(message), { status });
  }
}
