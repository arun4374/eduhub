import { NextResponse } from 'next/server';

// Mock data for subjects
const subjects = [
  { id: 1, name: 'Mathematics', code: 'MATH101', description: 'Foundational calculus and algebra.' },
  { id: 2, name: 'Physics', code: 'PHYS101', description: 'Introduction to classical mechanics.' },
  { id: 3, name: 'Computer Science', code: 'CS101', description: 'Basics of programming and algorithms.' },
  { id: 4, name: 'Literature', code: 'LIT101', description: 'Analysis of classical and modern texts.' },
];

export async function GET() {
  try {
    // In a real application, you would fetch this data from a database
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching subjects', error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.code) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newSubject = {
      id: subjects.length + 1,
      ...body,
    };

    // In a real app, you would save to a database here
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating subject', error }, { status: 500 });
  }
}
