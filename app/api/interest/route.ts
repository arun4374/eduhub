import { NextResponse, type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Assuming auth options are in lib/auth
import dbConnect from '@/lib/dbConnect'; // Assuming a db connection utility
import AppInterest from '@/models/appInterest';

/**
 * GET /api/interest
 * Fetches the total interest count for a feature and checks if the current user is interested.
 * @param req - The Next.js API request object.
 * @returns A JSON response with the count and the user's interest status.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const featureId = searchParams.get('featureId');

  if (!featureId) {
    return NextResponse.json({ success: false, error: 'featureId is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    
    // Get total count and check user interest in parallel for better performance
    const [count, userInterest] = await Promise.all([
      AppInterest.countDocuments({ featureId }),
      session?.user?._id 
        ? AppInterest.findOne({ featureId, userId: session.user._id }).lean()
        : Promise.resolve(null)
    ]);

    return NextResponse.json({
      success: true,
      count,
      isInterested: !!userInterest,
    });

  } catch (error) {
    console.error('GET /api/interest Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}

/**
 * POST /api/interest
 * Registers a user's interest in a specific feature.
 * @param req - The Next.js API request object containing the featureId.
 * @returns A JSON response indicating success or failure.
 */
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?._id) {
      return NextResponse.json({ success: false, error: 'Unauthorized: User must be logged in.' }, { status: 401 });
    }

    const body = await req.json();
    const { featureId } = body;

    if (!featureId) {
      return NextResponse.json({ success: false, error: 'featureId is required in the request body' }, { status: 400 });
    }

    // The unique index on the model will prevent duplicates.
    // If a user tries to register interest twice, this will throw an error.
    await AppInterest.create({ featureId, userId: session.user._id });

    return NextResponse.json({ success: true, message: 'Interest registered successfully' }, { status: 201 });

  } catch (error: any) {
    // Check for MongoDB's duplicate key error (code 11000)
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: 'User has already registered interest for this feature' }, { status: 409 });
    }
    
    console.error('POST /api/interest Error:', error);
    return NextResponse.json({ success: false, error: 'An internal server error occurred' }, { status: 500 });
  }
}