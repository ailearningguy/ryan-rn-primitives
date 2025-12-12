#!/usr/bin/env node

/**
 * Script to rename package scope from @dino-rn-primitives to @ryan-rn-primitives
 */

const fs = require('fs');
const path = require('path');

const OLD_SCOPE = '@dino-rn-primitives';
const NEW_SCOPE = '@ryan-rn-primitives';

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

function updatePackageJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const pkg = JSON.parse(content);
  let updated = false;

  // Update package name
  if (pkg.name && pkg.name.includes(OLD_SCOPE)) {
    pkg.name = pkg.name.replace(OLD_SCOPE, NEW_SCOPE);
    updated = true;
  }

  // Update dependencies
  if (pkg.dependencies) {
    Object.keys(pkg.dependencies).forEach((dep) => {
      if (dep.includes(OLD_SCOPE)) {
        const newDep = dep.replace(OLD_SCOPE, NEW_SCOPE);
        pkg.dependencies[newDep] = pkg.dependencies[dep];
        delete pkg.dependencies[dep];
        updated = true;
      }
    });
  }

  // Update devDependencies
  if (pkg.devDependencies) {
    Object.keys(pkg.devDependencies).forEach((dep) => {
      if (dep.includes(OLD_SCOPE)) {
        const newDep = dep.replace(OLD_SCOPE, NEW_SCOPE);
        pkg.devDependencies[newDep] = pkg.devDependencies[dep];
        delete pkg.devDependencies[dep];
        updated = true;
      }
    });
  }

  // Update peerDependencies
  if (pkg.peerDependencies) {
    Object.keys(pkg.peerDependencies).forEach((dep) => {
      if (dep.includes(OLD_SCOPE)) {
        const newDep = dep.replace(OLD_SCOPE, NEW_SCOPE);
        pkg.peerDependencies[newDep] = pkg.peerDependencies[dep];
        delete pkg.peerDependencies[dep];
        updated = true;
      }
    });
  }

  if (updated) {
    fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
  }

  return updated;
}

function updateSourceFiles(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      updateSourceFiles(filePath);
    } else if (
      file.endsWith('.ts') ||
      file.endsWith('.tsx') ||
      file.endsWith('.js') ||
      file.endsWith('.md')
    ) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(OLD_SCOPE)) {
        content = content.replace(new RegExp(OLD_SCOPE, 'g'), NEW_SCOPE);
        fs.writeFileSync(filePath, content);
        log(`  ✓ Updated ${filePath}`, 'green');
      }
    }
  });
}

function main() {
  log('\n════════════════════════════════════════════════════════════', 'cyan');
  log('  Rename Scope: @dino-rn-primitives → @ryan-rn-primitives', 'cyan');
  log('════════════════════════════════════════════════════════════\n', 'cyan');

  // Update root package.json
  log('📦 Updating root package.json...', 'yellow');
  const rootPkgPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(rootPkgPath)) {
    let content = fs.readFileSync(rootPkgPath, 'utf8');
    content = content.replace(new RegExp(OLD_SCOPE, 'g'), NEW_SCOPE);
    fs.writeFileSync(rootPkgPath, content);
    log('  ✓ Root package.json updated', 'green');
  }

  // Update all packages
  log('\n📦 Updating packages...', 'yellow');
  const packagesDir = path.join(process.cwd(), 'packages');
  const packages = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  packages.forEach((pkg) => {
    const pkgJsonPath = path.join(packagesDir, pkg, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
      updatePackageJson(pkgJsonPath);
      log(`  ✓ Updated ${pkg}/package.json`, 'green');
    }
  });

  // Update source files
  log('\n📝 Updating source files...', 'yellow');
  updateSourceFiles(path.join(process.cwd(), 'packages'));

  // Update docs
  log('\n📚 Updating documentation...', 'yellow');
  const docsDir = path.join(process.cwd(), 'docs');
  if (fs.existsSync(docsDir)) {
    updateSourceFiles(docsDir);
  }

  // Update README
  const readmePath = path.join(process.cwd(), 'README.md');
  if (fs.existsSync(readmePath)) {
    let content = fs.readFileSync(readmePath, 'utf8');
    if (content.includes(OLD_SCOPE)) {
      content = content.replace(new RegExp(OLD_SCOPE, 'g'), NEW_SCOPE);
      fs.writeFileSync(readmePath, content);
      log('  ✓ Updated README.md', 'green');
    }
  }

  log('\n════════════════════════════════════════════════════════════', 'cyan');
  log('  ✅ Scope rename completed!', 'green');
  log('════════════════════════════════════════════════════════════\n', 'cyan');

  log('Next steps:', 'yellow');
  log('  1. pnpm install', 'cyan');
  log('  2. pnpm build', 'cyan');
  log('  3. git add . && git commit -m "rename to @ryan-rn-primitives"', 'cyan');
  log('  4. pnpm publish-all:primitives\n', 'cyan');
}

main();
