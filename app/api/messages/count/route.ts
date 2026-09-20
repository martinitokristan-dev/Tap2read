import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mailService } from '@/services/mail.service';
import { successResponse, errorResponse } from '@/types/api.types';

// GET /api/messages/count — teacher only: get count of unread messages
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    }

    const unreadCount = await mailService.getUnreadCount();
    return NextResponse.json(successResponse({ unreadCount }));
  } catch (error) {
    console.error('[API Messages Count Error]:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch unread count';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
