import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  // Logic to fetch subject details by slug
  const subject = {
    id: 1,
    name: slug.charAt(0).toUpperCase() + slug.slice(1),
    slug: slug,
    description: `This is the course content for ${slug}.`,
  };

  if (!subject) {
    return NextResponse.json({ success: false, message: 'Subject not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: subject });
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const body = await request.json();
  // Logic to update subject by slug
  return NextResponse.json({ success: true, data: { slug: params.slug, ...body } });
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Logic to delete subject by slug
  return NextResponse.json({ success: true, message: `Subject ${params.slug} deleted` });
}
