import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { activityService } from '@/services/activity.service';
import { cloudinaryService } from '@/services/cloudinary.service';
import { successResponse, errorResponse } from '@/types/api.types';

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const item = await activityService.getById(Number(params.id));
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
    const updateData: { title?: string; description?: string; imageUrl?: string; canvaLink?: string } = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.description !== undefined) updateData.description = body.description.trim();
    const img = body.imageUrl || body.thumbnailUrl;
    if (img !== undefined) updateData.imageUrl = img;
    const canva = body.canvaLink || body.canvaUrl;
    if (canva !== undefined) updateData.canvaLink = canva.trim();

    const item = await activityService.update(Number(params.id), updateData);
    return NextResponse.json(successResponse(item, 'Activity updated'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });

    // Fetch item first to get the Cloudinary image URL before deleting from DB
    const item = await activityService.getById(Number(params.id));
    await activityService.delete(Number(params.id));

    // Delete thumbnail/image from Cloudinary to free storage
    if (item?.imageUrl) {
      const publicId = cloudinaryService.extractPublicId(item.imageUrl);
      if (publicId) await cloudinaryService.deleteAsset(publicId, 'image');
    }

    return NextResponse.json(successResponse(null, 'Activity deleted'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
