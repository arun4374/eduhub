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
 * Registers interest for a feature and returns the new total count.
 * @param req - The Next.js API request object containing the featureId.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { featureId } = body;

    if (!featureId) {
      return NextResponse.json({ success: false, message: 'featureId is required' }, { status: 400 });
    }

    // Create a new entry to register interest. Each click will create a new document,
    // effectively just incrementing a counter.
    await AppInterest.create({ featureId });

    // After adding the new interest, get the updated total count.
    const BASE_INTEREST_COUNT = 1347;
    const realUserCount = await AppInterest.countDocuments({ featureId });
    const totalCount = BASE_INTEREST_COUNT + realUserCount;

    // Return 201 Created as a new interest record was created.
    return NextResponse.json({ success: true, count: totalCount }, { status: 201 });
  } catch (error) {
    console.error('POST /api/interest Error:', error);
    return NextResponse.json({ success: false, message: 'An internal server error occurred' }, { status: 500 });
  }
}