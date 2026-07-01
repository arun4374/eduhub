import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Update from '@/models/updates';

export async function GET() {
  try {
    await dbConnect();

    const updates = await Update.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({ success: true, data: updates });
  } catch (error) {
    console.error('GET /api/updates Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}