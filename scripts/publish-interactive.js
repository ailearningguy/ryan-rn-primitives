#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');
const STATUS_FILE = path.join(__dirname, 'npm-status.json');

// Check if status file exists
if (!fs.existsSync(STATUS_FILE)) {
  console.error('Error: npm-status.json not found. Please run check-npm-status.js first.');
  process.exit(1);
}

// Read the status file
const status = JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'));
const unpublished = status.unpublished;

if (unpublished.length === 0) {
  console.log('✓ All packages are already published!');
  process.exit(0);
}

console.log('='.repeat(80));
console.log('\n📦 UNPUBLISHED PACKAGES:\n');
unpublished.forEach((pkg, idx) => {
  console.log(`  ${idx + 1}. ${pkg.name} (v${pkg.localVersion}) - ${pkg.dir}`);
});
console.log('\n' + '='.repeat(80));

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to ask question
function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Function to publish a single package
async function publishPackage(pkg) {
  const packageDir = path.join(PACKAGES_DIR, pkg.dir);

  console.log('\n' + '='.repeat(80));
  console.log(`\nPackage: ${pkg.name} v${pkg.localVersion}`);
  console.log(`Directory: ${packageDir}\n`);

  const answer = await askQuestion('Do you want to publish this package? (y/n/q to quit): ');

  if (answer.toLowerCase() === 'q') {
    console.log('\nQuitting...');
    return 'quit';
  }

  if (answer.toLowerCase() !== 'y') {
    console.log('Skipped.');
    return 'skip';
  }

  try {
    // First, build the package
    console.log('\n📦 Building package...');
    execSync('pnpm build', {
      cwd: packageDir,
      stdio: 'inherit',
    });

    console.log('\n✓ Build completed successfully\n');

    // Then publish
    console.log('🚀 Publishing to npm...');
    execSync('pnpm pub:release', {
      cwd: packageDir,
      stdio: 'inherit',
    });

    console.log(`\n✓ Successfully published ${pkg.name} v${pkg.localVersion}\n`);
    return 'success';
  } catch (error) {
    console.error(`\n✗ Failed to publish ${pkg.name}`);
    console.error(`Error: ${error.message}\n`);

    const retry = await askQuestion('Do you want to continue with next package? (y/n): ');
    return retry.toLowerCase() === 'y' ? 'continue' : 'quit';
  }
}

// Main function
async function main() {
  const results = {
    published: [],
    skipped: [],
    failed: [],
  };

  for (const pkg of unpublished) {
    const result = await publishPackage(pkg);

    if (result === 'quit') {
      break;
    } else if (result === 'success') {
      results.published.push(pkg.name);
    } else if (result === 'skip') {
      results.skipped.push(pkg.name);
    } else if (result === 'continue') {
      results.failed.push(pkg.name);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY:\n');
  console.log(`  ✓ Published: ${results.published.length}`);
  console.log(`  ⊘ Skipped: ${results.skipped.length}`);
  console.log(`  ✗ Failed: ${results.failed.length}`);

  if (results.published.length > 0) {
    console.log('\n✓ Published packages:');
    results.published.forEach((pkg, idx) => {
      console.log(`  ${idx + 1}. ${pkg}`);
    });
  }

  if (results.skipped.length > 0) {
    console.log('\n⊘ Skipped packages:');
    results.skipped.forEach((pkg, idx) => {
      console.log(`  ${idx + 1}. ${pkg}`);
    });
  }

  if (results.failed.length > 0) {
    console.log('\n✗ Failed packages:');
    results.failed.forEach((pkg, idx) => {
      console.log(`  ${idx + 1}. ${pkg}`);
    });
  }

  console.log('\n' + '='.repeat(80) + '\n');

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
