import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const response = await fetch(`${process.env.API_URL}/hosts/${params.id}/claim`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to submit claim');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting claim:', error);
    return NextResponse.json(
      { error: 'Failed to submit claim' },
      { status: 500 }
    );
  }
}