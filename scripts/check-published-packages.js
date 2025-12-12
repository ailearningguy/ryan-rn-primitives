#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir);

console.log('🔍 Checking publication status for all packages...\n');

const unpublished = [];
const published = [];
const errors = [];

packages.forEach((pkg) => {
  const pkgPath = path.join(packagesDir, pkg);
  const packageJsonPath = path.join(pkgPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const { name, version } = packageJson;

  if (!name || name.startsWith('@dino-rn-primitives/monorepo')) {
    return;
  }

  try {
    // Check if this specific version exists on npm
    execSync(`npm view ${name}@${version} version`, {
      stdio: 'pipe',
      encoding: 'utf8',
    });
    published.push({ name, version, path: pkg });
    console.log(`✅ ${name}@${version} - Already published`);
  } catch (error) {
    // Check if package exists at all
    try {
      const latestVersion = execSync(`npm view ${name} version`, {
        stdio: 'pipe',
        encoding: 'utf8',
      }).trim();
      unpublished.push({ name, version, path: pkg, latestVersion });
      console.log(`🆕 ${name}@${version} - Not published (latest: ${latestVersion})`);
    } catch (e) {
      unpublished.push({ name, version, path: pkg, latestVersion: 'none' });
      console.log(`🆕 ${name}@${version} - Never published`);
    }
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📊 Summary:`);
console.log(`   ✅ Published: ${published.length}`);
console.log(`   🆕 Unpublished: ${unpublished.length}`);
console.log(`   ❌ Errors: ${errors.length}`);

if (unpublished.length > 0) {
  console.log('\n' + '='.repeat(80));
  console.log('\n📦 Unpublished packages:\n');
  unpublished.forEach(({ name, version, path, latestVersion }) => {
    console.log(`   ${name}@${version} (latest on npm: ${latestVersion})`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n🚀 To publish unpublished packages, run:\n');

  // Generate individual publish commands
  unpublished.forEach(({ name, path }) => {
    console.log(`   pnpm turbo pub:release --filter=${name}`);
  });

  console.log('\n   Or publish all at once:\n');
  const filterList = unpublished.map(({ name }) => `--filter=${name}`).join(' ');
  console.log(`   pnpm turbo pub:release ${filterList}`);
}

console.log('\n' + '='.repeat(80) + '\n');

// Save results to JSON for scripting
const results = {
  published,
  unpublished,
  errors,
  timestamp: new Date().toISOString(),
};

fs.writeFileSync(path.join(__dirname, '../.publish-status.json'), JSON.stringify(results, null, 2));

console.log('💾 Results saved to .publish-status.json\n');
