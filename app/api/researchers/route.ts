import { NextResponse } from 'next/server';
import { researcherService } from '@/services/researcher.service';
import { successResponse, errorResponse } from '@/types/api.types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const items = await researcherService.getAll();
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
