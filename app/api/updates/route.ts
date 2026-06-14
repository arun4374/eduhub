import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Update from '@/models/updates';

export async function GET() {
  try {
    await dbConnect();

    const updates = await Update.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      count: updates.length,
      data: updates,
    });
  } catch (error) {
    console.error('Error fetching updates:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch updates',
      },
      { status: 500 }
    );
  }
}
