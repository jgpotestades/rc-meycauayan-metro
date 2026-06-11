// app/api/images/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dirPath = path.join(process.cwd(), 'public', 'image-masonry');
    
    // Create directory gracefully if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(dirPath);
    
    // Filter out extensions matching both .jpg and .png
    const validImages = files
      .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map(file => `/image-masonry/${file}`);

    return NextResponse.json(validImages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read media assets' }, { status: 500 });
  }
}