#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');

// Get all package directories
const packageDirs = fs.readdirSync(PACKAGES_DIR).filter((dir) => {
  const packagePath = path.join(PACKAGES_DIR, dir);
  return (
    fs.statSync(packagePath).isDirectory() && fs.existsSync(path.join(packagePath, 'package.json'))
  );
});

console.log(`Found ${packageDirs.length} packages to check...\n`);

// Function to check if package exists on npm
function checkNpmPackage(packageName) {
  return new Promise((resolve) => {
    const url = `https://registry.npmjs.org/${packageName.replace('/', '%2F')}`;

    https
      .get(url, (res) => {
        if (res.statusCode === 200) {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              resolve({
                exists: true,
                version: json['dist-tags']?.latest || 'unknown',
                versions: Object.keys(json.versions || {}),
              });
            } catch (e) {
              resolve({ exists: false });
            }
          });
        } else if (res.statusCode === 404) {
          resolve({ exists: false });
        } else {
          resolve({ exists: false, error: `Status: ${res.statusCode}` });
        }
      })
      .on('error', (err) => {
        resolve({ exists: false, error: err.message });
      });
  });
}

// Check all packages
async function checkAllPackages() {
  const published = [];
  const unpublished = [];

  for (const dir of packageDirs) {
    const packageJsonPath = path.join(PACKAGES_DIR, dir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const packageName = packageJson.name;
    const localVersion = packageJson.version;

    process.stdout.write(`Checking ${packageName}...`);

    const result = await checkNpmPackage(packageName);

    if (result.exists) {
      console.log(` ✓ Published (latest: ${result.version}, local: ${localVersion})`);
      published.push({
        name: packageName,
        dir,
        localVersion,
        npmVersion: result.version,
        allVersions: result.versions,
      });
    } else {
      console.log(` ✗ NOT Published`);
      unpublished.push({ name: packageName, dir, localVersion });
    }

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\nSUMMARY:`);
  console.log(`  Total packages: ${packageDirs.length}`);
  console.log(`  Published: ${published.length}`);
  console.log(`  Unpublished: ${unpublished.length}`);

  if (unpublished.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('\nUNPUBLISHED PACKAGES:');
    unpublished.forEach((pkg, idx) => {
      console.log(`  ${idx + 1}. ${pkg.name} (v${pkg.localVersion}) - ${pkg.dir}`);
    });
  }

  if (published.length > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('\nPUBLISHED PACKAGES:');
    published.forEach((pkg, idx) => {
      const versionMatch = pkg.localVersion === pkg.npmVersion ? '✓' : '⚠';
      console.log(`  ${idx + 1}. ${pkg.name}`);
      console.log(`     Local: v${pkg.localVersion} | NPM: v${pkg.npmVersion} ${versionMatch}`);
    });
  }

  // Save results to JSON for later use
  const results = { published, unpublished, timestamp: new Date().toISOString() };
  fs.writeFileSync(path.join(__dirname, 'npm-status.json'), JSON.stringify(results, null, 2));
  console.log('\n' + '='.repeat(80));
  console.log(`\nResults saved to: scripts/npm-status.json`);
}

checkAllPackages().catch(console.error);
