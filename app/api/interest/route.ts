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

    const interestDoc = await AppInterest.findOne({ featureId }).lean();

    // If no document exists, it means no 'real' interest has been registered yet.
    // We return the base count, which is the default value in the model.
    if (!interestDoc) {
      return NextResponse.json({ success: true, count: 1347 });
    }

    return NextResponse.json({
      success: true,
      count: interestDoc.count,
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

    // Atomically find the feature's document and increment its count.
    // - `upsert: true` creates the document if it doesn't exist.
    // - `new: true` returns the document *after* the update.
    // - `setDefaultsOnInsert: true` ensures our `default: 1347` is applied on creation.
    const updatedInterest = await AppInterest.findOneAndUpdate(
      { featureId: featureId },
      { $inc: { count: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    if (!updatedInterest) {
      // This should not happen with the `upsert: true` option.
      throw new Error("Failed to update or create interest count document.");
    }

    // Return 200 OK, as we are successfully updating a resource.
    // The frontend will receive the new, authoritative count.
    return NextResponse.json({ success: true, count: updatedInterest.count }, { status: 200 });
  } catch (error) {
    console.error('POST /api/interest Error:', error);
    return NextResponse.json({ success: false, message: 'An internal server error occurred' }, { status: 500 });
  }
}