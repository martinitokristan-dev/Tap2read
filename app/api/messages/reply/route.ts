import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mailService } from '@/services/mail.service';
import { successResponse, errorResponse } from '@/types/api.types';

// POST /api/messages/reply — teacher only: send direct email reply
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(errorResponse('Unauthorized. Please log in.'), { status: 401 });
    }

    const body = await req.json();
    const { messageId, to, toName, subject, replyMessage, originalMessage } = body;

    if (!to || !to.trim()) {
      return NextResponse.json(errorResponse('Recipient email is required.'), { status: 400 });
    }

    if (!replyMessage || !replyMessage.trim()) {
      return NextResponse.json(errorResponse('Reply message cannot be empty.'), { status: 400 });
    }

    await mailService.sendReplyEmail({
      messageId: messageId ? Number(messageId) : undefined,
      to: to.trim(),
      toName: toName?.trim(),
      subject: subject?.trim() || 'Tap2Read Inquiry Response',
      replyMessage: replyMessage.trim(),
      originalMessage: originalMessage?.trim(),
      senderName: (session.user as any)?.name || 'Teacher / Tap2Read Team',
    });

    return NextResponse.json(successResponse(null, 'Reply sent successfully!'));
  } catch (error: any) {
    console.error('[API Messages Reply] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send reply';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
