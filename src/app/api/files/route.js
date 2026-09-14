import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { walkDir } from '@/lib/fs-utils';

export async function GET() {
  // Use environment variable if provided, otherwise default to the parent directory
  const targetDir = process.env.MD_ROOT_DIR 
    ? path.resolve(process.env.MD_ROOT_DIR) 
    : path.resolve(process.cwd(), '..');
  
  try {
    const tree = walkDir(targetDir, targetDir);
    return NextResponse.json({ tree, basePath: targetDir });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
