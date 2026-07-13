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

    // We use the IP address to uniquely identify anonymous users to prevent duplicates.
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip')?.trim() || '';

    if (!ip) {
      // This is unlikely but possible. We block the request if we can't identify the user.
      return NextResponse.json({ success: false, message: 'Could not identify request source.' }, { status: 400 });
    }

    try {
      // Attempt to create a new interest record.
      // The database schema has a unique index on (anonymousId, featureId),
      // so this will fail if the same IP has already registered for this feature.
      await AppInterest.create({ featureId, anonymousId: ip });
    } catch (error: any) {
      // If it's a duplicate key error (code 11000), it means this IP has already registered.
      // This is not a "failure" from the user's perspective. We just don't create a new record.
      if (error.code !== 11000) {
        // If it's some other error, re-throw it to be caught by the outer catch block.
        throw error;
      }
      // For duplicate errors, we can log it and proceed gracefully.
      console.log(`Duplicate interest registration attempt from IP: ${ip} for feature: ${featureId}`);
    }

    // After adding the new interest, get the updated total count.
    const BASE_INTEREST_COUNT = 1347;
    const realUserCount = await AppInterest.countDocuments({ featureId });
    const totalCount = BASE_INTEREST_COUNT + realUserCount;

    return NextResponse.json({ success: true, count: totalCount }, { status: 200 });
  } catch (error) {
    console.error('POST /api/interest Error:', error);
    return NextResponse.json({ success: false, message: 'An internal server error occurred' }, { status: 500 });
  }
}