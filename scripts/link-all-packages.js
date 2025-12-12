#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');

const packageDirs = fs.readdirSync(PACKAGES_DIR).filter((dir) => {
  const packagePath = path.join(PACKAGES_DIR, dir);
  return (
    fs.statSync(packagePath).isDirectory() && fs.existsSync(path.join(packagePath, 'package.json'))
  );
});

console.log(`Found ${packageDirs.length} packages to link...\n`);

for (const dir of packageDirs) {
  const packagePath = path.join(PACKAGES_DIR, dir);
  const packageJson = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'));
  const packageName = packageJson.name;

  try {
    console.log(`🔗 Linking ${packageName}...`);
    execSync('pnpm link --global', {
      cwd: packagePath,
      stdio: 'inherit',
    });
    console.log(`✓ Successfully linked ${packageName}\n`);
  } catch (error) {
    console.error(`✗ Failed to link ${packageName}\n`);
  }
}

console.log('='.repeat(80));
console.log('\n✓ All packages linked globally!\n');
console.log('To use in your project, run:');
console.log('  pnpm link --global @dino-rn-primitives/<package-name>\n');
console.log('='.repeat(80) + '\n');
