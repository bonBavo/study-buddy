import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Triggers inference engine
  return NextResponse.json({ message: 'Predictions triggered' });
}
