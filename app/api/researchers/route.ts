import { NextResponse } from 'next/server';
import { researcherService } from '@/services/researcher.service';
import { successResponse, errorResponse } from '@/types/api.types';

export const revalidate = 60;

export async function GET() {
  try {
    const items = await researcherService.getAll();
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
