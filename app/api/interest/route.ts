import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AppInterest from '@/models/appInterest.js';

/**
 * GET /api/interest
 * Fetches the total interest count for a feature.
 * @param req - The Next.js API request object.
 * @returns A JSON response with the count.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featureId = searchParams.get('featureId');

  if (!featureId) {
    return NextResponse.json({ success: false, error: 'featureId is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const BASE_INTEREST_COUNT = 1347;
    const realUserCount = await AppInterest.countDocuments({ featureId });

    const totalCount = BASE_INTEREST_COUNT + realUserCount;

    return NextResponse.json({
      success: true,
      count: totalCount,
    });

  } catch (error) {
    console.error('GET /api/interest Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}

/**
 * POST /api/interest
 * This endpoint is disabled as it requires user authentication.
 * @param req - The Next.js API request object containing the featureId.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(req: NextRequest) {
  // This feature requires user authentication to associate interest with a user.
  // Since authentication has been removed, this endpoint is disabled.
  console.warn('Attempted to access disabled POST /api/interest endpoint.');
  return NextResponse.json({ success: false, error: 'This feature is currently disabled.' }, { status: 403 });
}