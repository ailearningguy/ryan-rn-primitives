#!/usr/bin/env node

/**
 * Script to list all primitives in the monorepo
 * Usage: node scripts/list-primitives.js
 * Or: pnpm list:primitives
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function listPrimitives() {
  const packagesDir = path.join(process.cwd(), 'packages');

  if (!fs.existsSync(packagesDir)) {
    log('Error: packages directory not found', 'red');
    process.exit(1);
  }

  const packages = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();

  // Categorize packages
  const core = [];
  const shared = ['hooks', 'portal', 'slot', 'types', 'utils'];

  packages.forEach((pkg) => {
    if (shared.includes(pkg)) {
      return; // Skip shared packages for core list
    }
    core.push(pkg);
  });

  log('\n📦 RN Primitives Packages\n', 'cyan');

  // Display Core Primitives
  log('Core Primitives:', 'green');
  log('─'.repeat(50), 'gray');

  core.forEach((pkg, index) => {
    const packageJsonPath = path.join(packagesDir, pkg, 'package.json');
    let version = 'unknown';
    let description = '';

    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        version = packageJson.version || 'unknown';
        description = packageJson.description || '';
      } catch (e) {
        // Ignore errors
      }
    }

    const number = String(index + 1).padStart(2, ' ');
    log(`${number}. ${pkg.padEnd(20)} v${version.padEnd(8)} ${description}`, 'reset');
  });

  log('\n' + '─'.repeat(50), 'gray');
  log(`Total: ${core.length} primitives\n`, 'cyan');

  // Display Shared Packages
  log('Shared Packages:', 'yellow');
  log('─'.repeat(50), 'gray');

  shared.forEach((pkg, index) => {
    if (!packages.includes(pkg)) {
      return;
    }

    const packageJsonPath = path.join(packagesDir, pkg, 'package.json');
    let version = 'unknown';
    let description = '';

    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        version = packageJson.version || 'unknown';
        description = packageJson.description || '';
      } catch (e) {
        // Ignore errors
      }
    }

    const number = String(index + 1).padStart(2, ' ');
    log(`${number}. ${pkg.padEnd(20)} v${version.padEnd(8)} ${description}`, 'reset');
  });

  log('\n' + '─'.repeat(50), 'gray');
  log(`Total: ${shared.filter((pkg) => packages.includes(pkg)).length} shared packages\n`, 'cyan');

  // Summary
  log('Summary:', 'green');
  log(`  Total packages: ${packages.length}`, 'reset');
  log(`  Core primitives: ${core.length}`, 'reset');
  log(`  Shared packages: ${shared.filter((pkg) => packages.includes(pkg)).length}\n`, 'reset');
}

listPrimitives();
