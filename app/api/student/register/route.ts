import { NextRequest, NextResponse } from 'next/server';
import { studentService } from '@/services/student.service';
import { successResponse, errorResponse } from '@/types/api.types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json(errorResponse('Full name is required'), { status: 400 });
    }

    const session = await studentService.register(fullName);

    const response = NextResponse.json(
      successResponse({ fullName: session.fullName }, 'Registered successfully'),
      { status: 201 }
    );

    // Set session cookie (7 days)
    response.cookies.set('student_session', session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json(errorResponse(message), { status: 500 });
  }
}
