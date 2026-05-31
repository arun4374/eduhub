import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Document from '../../../models/document';

// Helper function to ensure Mongoose is connected
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI environment variable');
  }
  await mongoose.connect(process.env.MONGODB_URI);
};

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Extract search parameters from the URL
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    
    // Build a query object
    const query: Record<string, any> = {};
    if (subjectId) {
      query.subjectId = subjectId;
    }

    // Fetch documents based on the query, sorted by newest first
    const documents = await Document.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: documents }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const newDocument = await Document.create(body);
    
    return NextResponse.json({ success: true, data: newDocument }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating document:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
