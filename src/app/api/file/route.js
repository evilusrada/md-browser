import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');

  if (!filePath) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  // Use environment variable if provided, otherwise default to the parent directory
  const basePath = process.env.MD_ROOT_DIR 
    ? path.resolve(process.env.MD_ROOT_DIR) 
    : path.resolve(process.cwd(), '..');
  const fullPath = path.join(basePath, filePath);

  // Security check: ensure we don't read outside the base path
  if (!fullPath.startsWith(basePath)) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  try {
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
