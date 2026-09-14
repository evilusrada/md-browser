import fs from 'fs';
import path from 'path';

const IGNORED_DIRS = ['node_modules', '.git', '.next', '.gemini'];

// Recursively walks the directory and returns a tree of folders and .md files
export function walkDir(currentPath, basePath) {
  let entries;
  try {
    entries = fs.readdirSync(currentPath, { withFileTypes: true });
  } catch (err) {
    return null;
  }

  let children = [];

  for (const entry of entries) {
    if (IGNORED_DIRS.includes(entry.name)) continue;

    const fullPath = path.join(currentPath, entry.name);
    const relativePath = path.relative(basePath, fullPath);

    if (entry.isDirectory()) {
      const dirChildren = walkDir(fullPath, basePath);
      if (dirChildren && dirChildren.length > 0) {
        children.push({
          name: entry.name,
          type: 'directory',
          path: relativePath,
          children: dirChildren,
        });
      }
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      const stats = fs.statSync(fullPath);
      children.push({
        name: entry.name,
        type: 'file',
        path: relativePath,
        createdAt: stats.birthtimeMs, // for sorting
      });
    }
  }

  // Sort files by creation date
  const dirs = children.filter(c => c.type === 'directory').sort((a, b) => a.name.localeCompare(b.name));
  const files = children.filter(c => c.type === 'file').sort((a, b) => a.createdAt - b.createdAt);

  return [...dirs, ...files];
}
