import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }
    // Simulate saving the file (in real use, save to disk, S3, etc.)
    // const arrayBuffer = await file.arrayBuffer();
    // ...save logic here...
    return NextResponse.json({ success: true, message: 'File uploaded successfully!' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred during upload. Please try again.' },
      { status: 500 },
    );
  }
}
