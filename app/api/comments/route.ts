import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Comment, { IComment } from '@/models/comment';

/**
 * GET /api/comments
 * Fetches comments for a specific page.
 * Query params: pageType, pageId
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageType = searchParams.get('pageType');
  const pageId = searchParams.get('pageId');

  if (!pageType || !pageId) {
    return NextResponse.json({ success: false, error: 'pageType and pageId are required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const comments = await Comment.find({ pageType, pageId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error('GET /api/comments Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}

/**
 * POST /api/comments
 * Creates a new comment.
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { pageType, pageId, message, name, email } = body;

    if (!pageType || !pageId || !message || !name || !email) {
      return NextResponse.json({ success: false, error: 'All fields are required: pageType, pageId, message, name, email' }, { status: 400 });
    }

    const commentData: Partial<IComment> = {
      pageType,
      pageId,
      message,
      name,
      email,
    };

    const newComment = await Comment.create(commentData);

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });
  } catch (error: any) {
    // Handle Mongoose validation errors for better feedback
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ success: false, error: errors.join(', ') }, { status: 400 });
    }
    
    console.error('POST /api/comments Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}

/**
 * DELETE /api/comments
 * Deletes a comment by its ID. Restricted to admin users.
 * Query params: commentId
 */
export async function DELETE(req: NextRequest) {
  // This feature requires user authentication to identify an admin.
  // Since authentication has been removed, this endpoint is disabled.
  console.warn('Attempted to access disabled DELETE /api/comments endpoint.');
  return NextResponse.json({ success: false, error: 'This feature is currently disabled.' }, { status: 403 });
}