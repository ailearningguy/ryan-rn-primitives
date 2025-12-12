#!/usr/bin/env node

/**
 * Script to verify npm installation
 * Usage: node scripts/verify-npm-install.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkNpmLogin() {
  log('\n📝 Checking npm login...', 'cyan');
  try {
    const user = execSync('npm whoami', { encoding: 'utf8' }).trim();
    log(`✓ Logged in as: ${user}`, 'green');
    return true;
  } catch (error) {
    log('✗ Not logged in to npm', 'red');
    log('  Run: npm login', 'yellow');
    return false;
  }
}

function checkPackagesBuilt() {
  log('\n🔨 Checking if packages are built...', 'cyan');
  const packagesDir = path.join(process.cwd(), 'packages');
  const packages = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let allBuilt = true;
  let builtCount = 0;

  packages.forEach((pkg) => {
    const distDir = path.join(packagesDir, pkg, 'dist');
    if (fs.existsSync(distDir)) {
      builtCount++;
    } else {
      if (allBuilt) {
        log('✗ Some packages not built:', 'red');
        allBuilt = false;
      }
      log(`  - ${pkg}`, 'yellow');
    }
  });

  if (allBuilt) {
    log(`✓ All ${builtCount} packages are built`, 'green');
  } else {
    log(`  ${builtCount}/${packages.length} packages built`, 'yellow');
    log('  Run: pnpm build', 'yellow');
  }

  return allBuilt;
}

function checkPackagePublished(packageName) {
  try {
    const info = execSync(`npm view ${packageName} version`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return info;
  } catch (error) {
    return null;
  }
}

function checkAllPackagesPublished() {
  log('\n📦 Checking published packages on npm...', 'cyan');
  const packagesDir = path.join(process.cwd(), 'packages');
  const packages = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let publishedCount = 0;
  let notPublished = [];

  packages.forEach((pkg) => {
    const packageJsonPath = path.join(packagesDir, pkg, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const packageName = packageJson.name;
      const version = checkPackagePublished(packageName);

      if (version) {
        publishedCount++;
        log(`  ✓ ${packageName}@${version}`, 'green');
      } else {
        notPublished.push(packageName);
      }
    }
  });

  if (notPublished.length > 0) {
    log(`\n✗ ${notPublished.length} packages not published:`, 'red');
    notPublished.forEach((pkg) => log(`  - ${pkg}`, 'yellow'));
    log('\n  To publish all:', 'yellow');
    log('  pnpm publish-all:primitives', 'cyan');
  } else {
    log(`\n✓ All ${publishedCount} packages are published!`, 'green');
  }

  return notPublished.length === 0;
}

function showInstallCommands() {
  log('\n📥 Installation commands for your UI kit:', 'cyan');
  log('─'.repeat(60), 'cyan');

  const packagesDir = path.join(process.cwd(), 'packages');
  const packages = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const corePackages = packages.filter(
    (pkg) => !['hooks', 'portal', 'slot', 'types', 'utils'].includes(pkg)
  );

  const sharedPackages = packages.filter((pkg) =>
    ['hooks', 'portal', 'slot', 'types', 'utils'].includes(pkg)
  );

  log('\nCore Primitives:', 'green');
  corePackages.forEach((pkg) => {
    log(`  npm install @rn-primitives/${pkg}`, 'reset');
  });

  log('\nShared Packages:', 'yellow');
  sharedPackages.forEach((pkg) => {
    log(`  npm install @rn-primitives/${pkg}`, 'reset');
  });

  log('\nInstall all at once:', 'cyan');
  const allPackages = packages.map((pkg) => `@rn-primitives/${pkg}`).join(' \\\n  ');
  log(`  npm install \\\n  ${allPackages}`, 'reset');
}

function main() {
  log('═══════════════════════════════════════════════════════', 'cyan');
  log('  RN Primitives - npm Installation Verification', 'cyan');
  log('═══════════════════════════════════════════════════════', 'cyan');

  const isLoggedIn = checkNpmLogin();
  const isBuilt = checkPackagesBuilt();
  const isPublished = checkAllPackagesPublished();

  log('\n═══════════════════════════════════════════════════════', 'cyan');
  log('  Summary', 'cyan');
  log('═══════════════════════════════════════════════════════', 'cyan');

  log(`\n  npm login:        ${isLoggedIn ? '✓' : '✗'}`, isLoggedIn ? 'green' : 'red');
  log(`  Packages built:   ${isBuilt ? '✓' : '✗'}`, isBuilt ? 'green' : 'red');
  log(`  Packages published: ${isPublished ? '✓' : '✗'}`, isPublished ? 'green' : 'red');

  if (isLoggedIn && isBuilt && isPublished) {
    log('\n🎉 All checks passed! Ready to use in your UI kit!', 'green');
    showInstallCommands();
  } else {
    log('\n⚠️  Some checks failed. Follow the suggestions above.', 'yellow');

    if (!isLoggedIn) {
      log('\n1. Login to npm:', 'yellow');
      log('   npm login', 'cyan');
    }

    if (!isBuilt) {
      log('\n2. Build packages:', 'yellow');
      log('   pnpm build', 'cyan');
    }

    if (!isPublished) {
      log('\n3. Publish packages:', 'yellow');
      log('   pnpm publish-all:primitives', 'cyan');
    }
  }

  log('\n═══════════════════════════════════════════════════════\n', 'cyan');
}

main();
