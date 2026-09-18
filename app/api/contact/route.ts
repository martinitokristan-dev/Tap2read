import { NextRequest, NextResponse } from 'next/server';
import { mailService } from '@/services/mail.service';
import { successResponse, errorResponse } from '@/types/api.types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const senderName = (body.senderName || body.name)?.trim();
    const senderEmail = (body.senderEmail || body.email)?.trim();
    const subject = body.subject?.trim();
    const rawMessage = body.message?.trim();

    if (!senderName || !senderEmail || !rawMessage) {
      return NextResponse.json(errorResponse('All fields are required'), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      return NextResponse.json(errorResponse('Invalid email address'), { status: 400 });
    }

    const message = rawMessage;

    await mailService.sendContactEmail({ senderName, senderEmail, message, subject });
    return NextResponse.json(successResponse(null, 'Message sent successfully'), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
