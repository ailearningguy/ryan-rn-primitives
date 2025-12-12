#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');
const OUTPUT_DIR = path.join(__dirname, '..', 'packed-packages');

// Tạo thư mục output
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Lấy tất cả packages
const packageDirs = fs.readdirSync(PACKAGES_DIR).filter((dir) => {
  const packagePath = path.join(PACKAGES_DIR, dir);
  return (
    fs.statSync(packagePath).isDirectory() && fs.existsSync(path.join(packagePath, 'package.json'))
  );
});

console.log(`Found ${packageDirs.length} packages to pack...\n`);

const results = {
  success: [],
  failed: [],
};

for (const dir of packageDirs) {
  const packagePath = path.join(PACKAGES_DIR, dir);
  const packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'));
  const packageName = packageJson.name;

  try {
    console.log(`📦 Packing ${packageName}...`);

    // Build package
    execSync('pnpm build', {
      cwd: packagePath,
      stdio: 'inherit',
    });

    // Pack package
    execSync(`pnpm pack --pack-destination "${OUTPUT_DIR}"`, {
      cwd: packagePath,
      stdio: 'inherit',
    });

    results.success.push(packageName);
    console.log(`✓ Successfully packed ${packageName}\n`);
  } catch (error) {
    results.failed.push(packageName);
    console.error(`✗ Failed to pack ${packageName}\n`);
  }
}

console.log('='.repeat(80));
console.log('\n📊 SUMMARY:\n');
console.log(`  ✓ Success: ${results.success.length}`);
console.log(`  ✗ Failed: ${results.failed.length}`);
console.log(`\n📁 Output directory: ${OUTPUT_DIR}\n`);

// List all .tgz files
const tgzFiles = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.tgz'));
console.log(`Total .tgz files: ${tgzFiles.length}\n`);

tgzFiles.forEach((file, idx) => {
  const stats = fs.statSync(path.join(OUTPUT_DIR, file));
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`  ${idx + 1}. ${file} (${sizeKB} KB)`);
});

console.log('\n' + '='.repeat(80) + '\n');
