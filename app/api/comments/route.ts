import { NextResponse } from 'next/server';

export async function GET() {
  // Your logic to fetch comments here
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(request: Request) {
  // Your logic to create a comment here
  const body = await request.json();
  return NextResponse.json({ success: true, data: body }, { status: 201 });
}
