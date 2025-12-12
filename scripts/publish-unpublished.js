#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

console.log(`Found ${unpublished.length} unpublished packages:\n`);
unpublished.forEach((pkg, idx) => {
  console.log(`  ${idx + 1}. ${pkg.name} (v${pkg.localVersion})`);
});

console.log('\n' + '='.repeat(80));
console.log('\nStarting publication process...\n');

// Function to publish a single package
function publishPackage(pkg, index, total) {
  const packageDir = path.join(PACKAGES_DIR, pkg.dir);

  console.log('='.repeat(80));
  console.log(`\n[${index + 1}/${total}] Publishing: ${pkg.name} v${pkg.localVersion}`);
  console.log(`Directory: ${packageDir}\n`);

  try {
    // First, build the package
    console.log('📦 Building package...');
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
    return { success: true, package: pkg.name };
  } catch (error) {
    console.error(`\n✗ Failed to publish ${pkg.name}`);
    console.error(`Error: ${error.message}\n`);
    return { success: false, package: pkg.name, error: error.message };
  }
}

// Publish all unpublished packages
const results = {
  successful: [],
  failed: [],
};

for (let i = 0; i < unpublished.length; i++) {
  const result = publishPackage(unpublished[i], i, unpublished.length);

  if (result.success) {
    results.successful.push(result.package);
  } else {
    results.failed.push({ package: result.package, error: result.error });
  }

  // Small delay between publications
  if (i < unpublished.length - 1) {
    console.log('Waiting 2 seconds before next publication...\n');
    execSync('sleep 2');
  }
}

// Print summary
console.log('='.repeat(80));
console.log('\n📊 PUBLICATION SUMMARY:\n');
console.log(`  Total packages: ${unpublished.length}`);
console.log(`  ✓ Successful: ${results.successful.length}`);
console.log(`  ✗ Failed: ${results.failed.length}`);

if (results.successful.length > 0) {
  console.log('\n✓ Successfully published:');
  results.successful.forEach((pkg, idx) => {
    console.log(`  ${idx + 1}. ${pkg}`);
  });
}

if (results.failed.length > 0) {
  console.log('\n✗ Failed to publish:');
  results.failed.forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.package}`);
    console.log(`     Error: ${item.error}`);
  });
}

console.log('\n' + '='.repeat(80));

// Save results
const resultsFile = path.join(__dirname, 'publish-results.json');
fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
console.log(`\nResults saved to: scripts/publish-results.json\n`);

// Exit with error code if any failed
if (results.failed.length > 0) {
  process.exit(1);
}
