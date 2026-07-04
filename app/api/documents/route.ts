import { NextRequest, NextResponse } from 'next/server';
import { searchQuestionPapers } from '@/lib/documents';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`, 10);
    const limit = parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`, 10);

    // Delegates to the same function the server-rendered /question-papers
    // page uses, so client-side searches and the initial SSR page always
    // return identical results for the same query — and inherit the regex
    // escaping + input clamping fixes in one place.
    const { documents, pagination } = await searchQuestionPapers({ query, page, limit });

    return NextResponse.json({
      success: true,
      data: { documents, pagination },
    });
  } catch (error) {
    console.error('GET /api/documents Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}