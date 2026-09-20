import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { videoService } from '@/services/video.service';
import { cloudinaryService } from '@/services/cloudinary.service';
import { successResponse, errorResponse } from '@/types/api.types';

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const item = await videoService.getById(Number(params.id));
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
    const { title, description, videoUrl, thumbnailUrl } = body;

    const updateData: Partial<{
      title: string;
      description: string;
      videoUrl: string;
      thumbnailUrl: string;
    }> = {};

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl.trim();
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;

    const item = await videoService.update(Number(params.id), updateData as any);
    return NextResponse.json(successResponse(item, 'Video updated'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });

    // Fetch the item first to get its Cloudinary URLs before deleting from DB
    const item = await videoService.getById(Number(params.id));
    await videoService.delete(Number(params.id));

    // Delete both the video file and thumbnail from Cloudinary to free storage
    if (item?.videoUrl) {
      const publicId = cloudinaryService.extractPublicId(item.videoUrl);
      if (publicId) await cloudinaryService.deleteAsset(publicId, 'video');
    }
    if (item?.thumbnailUrl) {
      const publicId = cloudinaryService.extractPublicId(item.thumbnailUrl);
      if (publicId) await cloudinaryService.deleteAsset(publicId, 'image');
    }

    return NextResponse.json(successResponse(null, 'Video deleted'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
