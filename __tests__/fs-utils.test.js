import { walkDir } from '../src/lib/fs-utils';
import fs from 'fs';
import path from 'path';
import os from 'os';

describe('fs-utils walkDir', () => {
  let testDir;

  beforeAll(() => {
    // Create a temporary directory for tests
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jest-md-browser-'));
    
    // Create some test files and folders
    // testDir/
    // ├── A-old.md
    // ├── Z-new.md
    // ├── ignore.txt
    // └── sub/
    //     └── sub.md
    
    fs.writeFileSync(path.join(testDir, 'ignore.txt'), 'ignore me');
    
    // Create files with slight delay to ensure different creation times
    const aPath = path.join(testDir, 'A-old.md');
    fs.writeFileSync(aPath, '# Old file');
    
    // Fake the birthtime using utimes to ensure sorting works deterministically
    const oldTime = new Date('2020-01-01').getTime() / 1000;
    fs.utimesSync(aPath, oldTime, oldTime);

    const zPath = path.join(testDir, 'Z-new.md');
    fs.writeFileSync(zPath, '# New file');
    const newTime = new Date('2022-01-01').getTime() / 1000;
    fs.utimesSync(zPath, newTime, newTime);

    fs.mkdirSync(path.join(testDir, 'sub'));
    fs.writeFileSync(path.join(testDir, 'sub', 'sub.md'), '# Sub file');
  });

  afterAll(() => {
    // Clean up temporary directory
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it('should only return .md files and directories containing them', () => {
    const result = walkDir(testDir, testDir);
    
    // 1 directory ('sub') and 2 files ('A-old.md', 'Z-new.md') at the root level
    expect(result).toHaveLength(3);
    
    const dirs = result.filter(item => item.type === 'directory');
    const files = result.filter(item => item.type === 'file');
    
    expect(dirs).toHaveLength(1);
    expect(dirs[0].name).toBe('sub');
    expect(dirs[0].children).toHaveLength(1);
    expect(dirs[0].children[0].name).toBe('sub.md');
    
    expect(files).toHaveLength(2);
    // Ignore.txt should not be present
    expect(files.find(f => f.name === 'ignore.txt')).toBeUndefined();
  });

  it('should sort files by creation date (oldest first)', () => {
    const result = walkDir(testDir, testDir);
    const files = result.filter(item => item.type === 'file');
    
    expect(files).toHaveLength(2);
    expect(files[0].name).toBe('A-old.md'); // Older
    expect(files[1].name).toBe('Z-new.md'); // Newer
  });
});
