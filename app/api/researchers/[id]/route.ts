import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { researcherService } from '@/services/researcher.service';
import { successResponse, errorResponse } from '@/types/api.types';

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const item = await researcherService.getById(Number(params.id));
    return NextResponse.json(successResponse(item));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Not found';
    return NextResponse.json(errorResponse(message), { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    const body = await req.json();
    const updateData: { fullName?: string; role?: string; photoUrl?: string; description?: string } = {};
    if (body.fullName !== undefined) updateData.fullName = body.fullName.trim();
    else if (body.name !== undefined) updateData.fullName = body.name.trim();

    if (body.role !== undefined) updateData.role = body.role.trim();

    if (body.description !== undefined) updateData.description = body.description.trim();
    else if (body.bio !== undefined) updateData.description = body.bio.trim();

    if (body.photoUrl !== undefined) updateData.photoUrl = body.photoUrl;
    else if (body.imageUrl !== undefined) updateData.photoUrl = body.imageUrl;

    const item = await researcherService.update(Number(params.id), updateData);
    return NextResponse.json(successResponse(item, 'Researcher updated'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
