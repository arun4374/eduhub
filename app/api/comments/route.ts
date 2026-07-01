import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Comment from '@/models/comment';

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
    const session = await getServerSession(authOptions);

    const body = await req.json();
    const { pageType, pageId, message, name, email } = body;

    if (!pageType || !pageId || !message) {
      return NextResponse.json({ success: false, error: 'pageType, pageId, and message are required' }, { status: 400 });
    }

    const commentData: any = { pageType, pageId, message };

    // If user is logged in, use their session data for name/email
    if (session?.user) {
      commentData.userId = session.user._id;
      commentData.name = session.user.name;
      commentData.email = session.user.email;
    } else {
      // For guests, validate the provided name and email
      if (!name || !email) {
        return NextResponse.json({ success: false, error: 'Name and email are required for guest comments' }, { status: 400 });
      }
      commentData.name = name;
      commentData.email = email;
    }

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
  try {
    const session = await getServerSession(authOptions);

    // Ensure user is an admin
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
      return NextResponse.json({ success: false, error: 'commentId is required' }, { status: 400 });
    }

    await dbConnect();

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/comments Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}