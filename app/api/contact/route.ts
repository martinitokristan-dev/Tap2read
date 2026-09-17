import { NextRequest, NextResponse } from 'next/server';
import { mailService } from '@/services/mail.service';
import { successResponse, errorResponse } from '@/types/api.types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderName, senderEmail, message } = body;

    if (!senderName?.trim() || !senderEmail?.trim() || !message?.trim()) {
      return NextResponse.json(errorResponse('All fields are required'), { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      return NextResponse.json(errorResponse('Invalid email address'), { status: 400 });
    }

    await mailService.sendContactEmail({ senderName, senderEmail, message });
    return NextResponse.json(successResponse(null, 'Message sent successfully'), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to send message';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
