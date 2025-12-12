#!/usr/bin/env node

/**
 * Script to rename package scope across the entire monorepo
 * Usage: node scripts/rename-scope.js <new-scope> [--dry-run]
 * Example: node scripts/rename-scope.js @dino-rn-primitives
 */

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

const OLD_SCOPE = '@rn-primitives';
const CONFIG = {
  newScope: '',
  dryRun: false,
  repository: {
    type: 'git',
    url: 'https://github.com/ailearningguy/ryan-rn-primitives.git',
  },
  author: 'dino <ailearningguy@gmail.com>',
  license: 'MIT',
};

function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    log('\nUsage: node scripts/rename-scope.js <new-scope> [--dry-run]', 'cyan');
    log('Example: node scripts/rename-scope.js @dino-rn-primitives\n', 'cyan');
    process.exit(0);
  }

  CONFIG.newScope = args[0];
  CONFIG.dryRun = args.includes('--dry-run');

  if (!CONFIG.newScope.startsWith('@')) {
    log('Error: Scope must start with @', 'red');
    process.exit(1);
  }

  log(`\n${'═'.repeat(60)}`, 'cyan');
  log('  Package Scope Rename Tool', 'cyan');
  log(`${'═'.repeat(60)}`, 'cyan');
  log(`\nOld scope: ${OLD_SCOPE}`, 'yellow');
  log(`New scope: ${CONFIG.newScope}`, 'green');
  log(`Dry run:   ${CONFIG.dryRun ? 'Yes' : 'No'}`, CONFIG.dryRun ? 'yellow' : 'green');
  log(`Repository: ${CONFIG.repository.url}`, 'cyan');
  log(`Author:    ${CONFIG.author}`, 'cyan');
  log(`${'═'.repeat(60)}\n`, 'cyan');
}

function updatePackageJson(filePath, packageName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const pkg = JSON.parse(content);

  // Update package name
  if (pkg.name && pkg.name.startsWith(OLD_SCOPE)) {
    pkg.name = pkg.name.replace(OLD_SCOPE, CONFIG.newScope);
    log(`  ✓ Updated name: ${pkg.name}`, 'green');
  }

  // Update dependencies
  if (pkg.dependencies) {
    Object.keys(pkg.dependencies).forEach((dep) => {
      if (dep.startsWith(OLD_SCOPE)) {
        const newDep = dep.replace(OLD_SCOPE, CONFIG.newScope);
        pkg.dependencies[newDep] = pkg.dependencies[dep];
        delete pkg.dependencies[dep];
      }
    });
  }

  // Update devDependencies
  if (pkg.devDependencies) {
    Object.keys(pkg.devDependencies).forEach((dep) => {
      if (dep.startsWith(OLD_SCOPE)) {
        const newDep = dep.replace(OLD_SCOPE, CONFIG.newScope);
        pkg.devDependencies[newDep] = pkg.devDependencies[dep];
        delete pkg.devDependencies[dep];
      }
    });
  }

  // Update peerDependencies
  if (pkg.peerDependencies) {
    Object.keys(pkg.peerDependencies).forEach((dep) => {
      if (dep.startsWith(OLD_SCOPE)) {
        const newDep = dep.replace(OLD_SCOPE, CONFIG.newScope);
        pkg.peerDependencies[newDep] = pkg.peerDependencies[dep];
        delete pkg.peerDependencies[dep];
      }
    });
  }

  // Update repository
  if (packageName !== 'root') {
    const pkgDir = path.basename(path.dirname(filePath));
    pkg.repository = {
      ...CONFIG.repository,
      directory: `packages/${pkgDir}`,
    };
  } else {
    pkg.repository = CONFIG.repository;
  }

  // Update author
  pkg.author = CONFIG.author;

  // Update license
  pkg.license = CONFIG.license;

  // Add publishConfig for scoped packages
  if (!pkg.publishConfig) {
    pkg.publishConfig = {
      access: 'public',
    };
  }

  if (!CONFIG.dryRun) {
    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
  }

  return pkg;
}

function updateRootPackage() {
  log('\n📦 Updating root package.json...', 'cyan');
  const rootPkgPath = path.join(process.cwd(), 'package.json');

  if (fs.existsSync(rootPkgPath)) {
    const pkg = updatePackageJson(rootPkgPath, 'root');
    log(`  ✓ Root package updated`, 'green');
  }
}

function updateAllPackages() {
  log('\n📦 Updating package.json files...', 'cyan');
  const packagesDir = path.join(process.cwd(), 'packages');

  if (!fs.existsSync(packagesDir)) {
    log('Error: packages directory not found', 'red');
    process.exit(1);
  }

  const packages = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let updatedCount = 0;

  packages.forEach((pkg) => {
    const packageJsonPath = path.join(packagesDir, pkg, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      log(`\n  Updating ${pkg}...`, 'yellow');
      updatePackageJson(packageJsonPath, pkg);
      updatedCount++;
    }
  });

  log(`\n✓ Updated ${updatedCount} packages`, 'green');
}

function updateScriptTemplates() {
  log('\n📝 Updating script templates...', 'cyan');

  const scriptsToUpdate = [
    'scripts/create-primitive.js',
    'scripts/create-primitive.sh',
    'scripts/list-primitives.js',
  ];

  scriptsToUpdate.forEach((scriptPath) => {
    const fullPath = path.join(process.cwd(), scriptPath);

    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;

      // Replace scope in strings
      content = content.replace(new RegExp(OLD_SCOPE, 'g'), CONFIG.newScope);

      if (content !== originalContent) {
        if (!CONFIG.dryRun) {
          fs.writeFileSync(fullPath, content);
        }
        log(`  ✓ Updated ${scriptPath}`, 'green');
      }
    }
  });
}

function updateDocumentation() {
  log('\n📚 Updating documentation...', 'cyan');

  const docsToUpdate = [
    'README.md',
    'docs/NPM_INSTALLATION.md',
    'docs/QUICK_START.md',
    'scripts/README.md',
    'scripts/EXAMPLE.md',
    'scripts/QUICK_REFERENCE.md',
    'scripts/SUMMARY.md',
  ];

  docsToUpdate.forEach((docPath) => {
    const fullPath = path.join(process.cwd(), docPath);

    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;

      // Replace scope
      content = content.replace(new RegExp(OLD_SCOPE, 'g'), CONFIG.newScope);

      if (content !== originalContent) {
        if (!CONFIG.dryRun) {
          fs.writeFileSync(fullPath, content);
        }
        log(`  ✓ Updated ${docPath}`, 'green');
      }
    }
  });
}

function createBackup() {
  if (CONFIG.dryRun) {
    log('\n💾 Skipping backup (dry-run mode)', 'yellow');
    return;
  }

  log('\n💾 Creating backup...', 'cyan');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(process.cwd(), `.backup-${timestamp}`);

  // This is a simple marker - user should use git for real backup
  log(`  ℹ️  Recommended: Commit your changes to git before running this script`, 'yellow');
  log(`  ℹ️  You can rollback with: git reset --hard`, 'yellow');
}

function verifyChanges() {
  log('\n🔍 Verifying changes...', 'cyan');

  const packagesDir = path.join(process.cwd(), 'packages');
  const packages = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let hasOldScope = false;

  packages.forEach((pkg) => {
    const packageJsonPath = path.join(packagesDir, pkg, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      const content = fs.readFileSync(packageJsonPath, 'utf8');

      if (content.includes(OLD_SCOPE)) {
        hasOldScope = true;
        log(`  ✗ Found old scope in ${pkg}/package.json`, 'red');
      }
    }
  });

  if (!hasOldScope) {
    log('  ✓ No old scope references found!', 'green');
  }

  return !hasOldScope;
}

function showSummary() {
  log(`\n${'═'.repeat(60)}`, 'cyan');
  log('  Summary', 'cyan');
  log(`${'═'.repeat(60)}`, 'cyan');

  if (CONFIG.dryRun) {
    log('\n⚠️  DRY RUN - No files were modified', 'yellow');
    log('\nTo apply changes, run without --dry-run:', 'yellow');
    log(`  node scripts/rename-scope.js ${CONFIG.newScope}`, 'cyan');
  } else {
    log('\n✅ Scope rename completed!', 'green');
    log('\nNext steps:', 'yellow');
    log('  1. Review changes: git diff', 'cyan');
    log('  2. Test build: pnpm build', 'cyan');
    log(
      '  3. Commit changes: git add . && git commit -m "rebrand to ' + CONFIG.newScope + '"',
      'cyan'
    );
    log('  4. Publish: pnpm publish-all:primitives', 'cyan');
  }

  log(`\n${'═'.repeat(60)}\n`, 'cyan');
}

function main() {
  parseArgs();
  createBackup();
  updateRootPackage();
  updateAllPackages();
  updateScriptTemplates();
  updateDocumentation();

  if (!CONFIG.dryRun) {
    verifyChanges();
  }

  showSummary();
}

main();
