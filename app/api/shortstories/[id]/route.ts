import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { shortStoryService } from '@/services/shortstory.service';
import { cloudinaryService } from '@/services/cloudinary.service';
import { successResponse, errorResponse } from '@/types/api.types';

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const item = await shortStoryService.getById(Number(params.id));
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
    const updateData: { title?: string; content?: string; coverImage?: string } = {};
    if (body.title !== undefined) updateData.title = body.title.trim();
    if (body.content !== undefined) updateData.content = body.content ? body.content.trim() : '';
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage ? body.coverImage.trim() : '';
    const item = await shortStoryService.update(Number(params.id), updateData);
    return NextResponse.json(successResponse(item, 'Short story updated'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });

    // Fetch item first to get the Cloudinary cover image URL before deleting from DB
    const item = await shortStoryService.getById(Number(params.id));
    await shortStoryService.delete(Number(params.id));

    // Delete cover image from Cloudinary to free storage
    if (item?.coverImage) {
      const publicId = cloudinaryService.extractPublicId(item.coverImage);
      if (publicId) await cloudinaryService.deleteAsset(publicId, 'image');
    }

    return NextResponse.json(successResponse(null, 'Short story deleted'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
