import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cloudinaryService } from '@/services/cloudinary.service';
import { successResponse, errorResponse } from '@/types/api.types';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });

    const body = await req.json();
    const { folder } = body;

    if (!folder) {
      return NextResponse.json(errorResponse('Folder is required'), { status: 400 });
    }

    const params = cloudinaryService.generateSignedUploadParams(folder);
    return NextResponse.json(successResponse(params));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sign upload';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
