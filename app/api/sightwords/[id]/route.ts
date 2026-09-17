import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sightWordService } from '@/services/sightword.service';
import { successResponse, errorResponse } from '@/types/api.types';

type Params = { params: { id: string } };

// GET /api/sightwords/[id] — public
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const item = await sightWordService.getById(Number(params.id));
    return NextResponse.json(successResponse(item));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Not found';
    return NextResponse.json(errorResponse(message), { status: 404 });
  }
}

// PUT /api/sightwords/[id] — teacher only
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });

    const body = await req.json();
    const updateData: { word?: string; imageUrl?: string } = {};
    if (body.word !== undefined) updateData.word = body.word ? body.word.trim() : '';
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    const item = await sightWordService.update(Number(params.id), updateData);
    return NextResponse.json(successResponse(item, 'Sight word updated'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

// DELETE /api/sightwords/[id] — teacher only
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });

    await sightWordService.delete(Number(params.id));
    return NextResponse.json(successResponse(null, 'Sight word deleted'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
