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
    const formatted = messages.map((m) => ({
      id: String(m.id),
      name: m.senderName,
      email: m.senderEmail,
      senderName: m.senderName,
      senderEmail: m.senderEmail,
      message: m.message,
      createdAt: m.sentAt.toISOString(),
      sentAt: m.sentAt.toISOString(),
    }));
    return NextResponse.json(successResponse(formatted));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch';
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
