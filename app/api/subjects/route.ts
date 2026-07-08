import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import SubjectModel from '../../../models/subject';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const department = searchParams.get('department');
  const regulation = searchParams.get('regulation');

  try {
    await dbConnect();

    const filter: { department?: RegExp; regulation?: string } = {};
    if (department) {
      // Use a case-insensitive regex for matching the department
      filter.department = new RegExp(`^${department}$`, 'i');
    }

    if (regulation) {
      filter.regulation = regulation;
    }

    // Using .lean() for performance, as we only need plain JS objects.
    const subjects = await SubjectModel.find(filter).sort({ semester: 1, name: 1 }).lean();

    // The response from Mongoose is already serializable by NextResponse.json,
    // including converting ObjectId to string.
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("GET /api/subjects Error:", error);
    return NextResponse.json({ message: 'Error fetching subjects' }, { status: 500 });
  }
}
