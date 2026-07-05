import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import VisitorCount from '../../../models/VisitorCount';

export const dynamic = 'force-dynamic'; // Ensure this route is not cached

export async function GET() {
    try {
        await dbConnect();

        // Atomically find and increment the global visitor count.
        // - `upsert: true` creates the document if it doesn't exist.
        // - `new: true` returns the document *after* the update.
        const updatedCount = await VisitorCount.findOneAndUpdate(
            { identifier: 'global' },
            { $inc: { count: 1 } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();

        if (!updatedCount) {
            return NextResponse.json({ success: false, message: "Could not retrieve visitor count." }, { status: 500 });
        }

        return NextResponse.json({ success: true, count: updatedCount.count }, { status: 200 });

    } catch (error) {
        console.error("GET /api/visitors error:", error);
        return NextResponse.json({ success: false, message: "An internal server error occurred." }, { status: 500 });
    }
}