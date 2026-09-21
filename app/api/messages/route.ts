import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { mailService } from '@/services/mail.service';
import { successResponse, errorResponse } from '@/types/api.types';

// GET /api/messages — teacher only: view all contact messages
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    const messages = await mailService.getAllMessages();
    const formatted = messages.map((m) => {
      let subject: string | null = null;
      let cleanMessage = m.message;

      const subjectMatch = m.message.match(/^\[Subject:\s*([^\]]+)\]\s*\n*/i);
      if (subjectMatch) {
        subject = subjectMatch[1].trim();
        cleanMessage = m.message.slice(subjectMatch[0].length).trim();
      }

      return {
        id: String(m.id),
        name: m.senderName,
        email: m.senderEmail,
        senderName: m.senderName,
        senderEmail: m.senderEmail,
        subject,
        message: cleanMessage,
        isRead: m.isRead ?? false,
        createdAt: m.sentAt.toISOString(),
        sentAt: m.sentAt.toISOString(),
        replies: ((m as any).replies || []).map((r: any) => ({
          id: String(r.id),
          senderType: r.senderType,
          senderName: r.senderName,
          senderEmail: r.senderEmail,
          content: r.content,
          sentAt: r.sentAt instanceof Date ? r.sentAt.toISOString() : String(r.sentAt),
        })),
      };
    });
    return NextResponse.json(successResponse(formatted));
  } catch (error) {
    console.error('[API Messages GET Error]:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

// PATCH /api/messages — teacher only: mark message as read / unread
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    const { id, isRead } = await req.json();
    if (!id) return NextResponse.json(errorResponse('ID required'), { status: 400 });

    if (isRead !== false) {
      await mailService.markAsRead(Number(id));
    } else {
      await mailService.markAsUnread(Number(id));
    }
    return NextResponse.json(successResponse(null, 'Status updated'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

// DELETE /api/messages?id=x — teacher only: delete a message
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json(errorResponse('Unauthorized'), { status: 401 });
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json(errorResponse('ID required'), { status: 400 });
    await mailService.deleteMessage(Number(id));
    return NextResponse.json(successResponse(null, 'Message deleted'));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}

