import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Update from '@/models/updates';

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }
  await mongoose.connect(process.env.MONGODB_URI);
}

export async function GET() {
  try {
    await connectDB();

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
