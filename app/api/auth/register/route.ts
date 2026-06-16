import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { authSchema } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = authSchema.parse(body);

    const existingUser = await prisma.student.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.student.create({
      data: {
        name: name || 'Student',
        email,
        password: hashedPassword,
      }
    });

    return NextResponse.json({ 
      message: 'User registered successfully',
      userId: user.id 
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
