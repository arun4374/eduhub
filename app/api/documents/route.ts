import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import DocumentModel from '@/models/document';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10; // Increased for better UX

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`, 10);
    const limit = parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10);

    const skip = (page - 1) * limit;

    await dbConnect();

    const filter: any = {
      type: 'question_paper'
    };

    if (query) {
      const searchRegex = new RegExp(query, 'i'); // case-insensitive search
      filter.$or = [
        { subject_name: searchRegex },
        { code: searchRegex },
        { exam_period: searchRegex },
        { regulation: searchRegex },
      ];
    }

    const documentsPromise = DocumentModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const totalDocumentsPromise = DocumentModel.countDocuments(filter);

    const [documents, totalDocuments] = await Promise.all([documentsPromise, totalDocumentsPromise]);
    
    const totalPages = Math.ceil(totalDocuments / limit) || 1;

    // Serialize documents
    const serializedDocs = documents.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
      subjectId: doc.subjectId ? doc.subjectId.toString() : undefined,
    }));

    return NextResponse.json({
      success: true,
      data: {
        documents: serializedDocs,
        pagination: { currentPage: page, totalPages, totalDocuments },
      },
    });
  } catch (error) {
    console.error('GET /api/documents Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}