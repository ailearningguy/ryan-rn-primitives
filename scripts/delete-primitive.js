#!/usr/bin/env node

/**
 * Script to delete a primitive
 * Usage: node scripts/delete-primitive.js <primitive-name>
 * Or: pnpm delete:primitive <primitive-name>
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

async function deletePrimitive(primitiveName) {
  const packageDir = path.join(process.cwd(), 'packages', primitiveName);

  // Check if primitive exists
  if (!fs.existsSync(packageDir)) {
    log(`Error: Primitive '${primitiveName}' does not exist at ${packageDir}`, 'red');
    process.exit(1);
  }

  // Read package.json to show info
  const packageJsonPath = path.join(packageDir, 'package.json');
  let packageInfo = {};

  if (fs.existsSync(packageJsonPath)) {
    try {
      packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    } catch (e) {
      log('Warning: Could not read package.json', 'yellow');
    }
  }

  // Show warning
  log('\n⚠️  WARNING: You are about to delete a primitive!', 'yellow');
  log('─'.repeat(50), 'yellow');
  log(`Name: ${packageInfo.name || primitiveName}`, 'reset');
  log(`Version: ${packageInfo.version || 'unknown'}`, 'reset');
  log(`Description: ${packageInfo.description || 'N/A'}`, 'reset');
  log(`Path: ${packageDir}`, 'reset');
  log('─'.repeat(50), 'yellow');
  log('\nThis action cannot be undone!\n', 'red');

  // Ask for confirmation
  const answer = await askQuestion('Are you sure you want to delete this primitive? (yes/no): ');

  if (answer.toLowerCase() !== 'yes') {
    log('\nDeletion cancelled.', 'green');
    process.exit(0);
  }

  // Delete the directory
  try {
    fs.rmSync(packageDir, { recursive: true, force: true });
    log(`\n✓ Primitive '${primitiveName}' deleted successfully!`, 'green');
    log('\nNext steps:', 'yellow');
    log('1. Run `pnpm install` to update workspace', 'reset');
    log('2. Remove any imports of this primitive from your apps', 'reset');
  } catch (error) {
    log(`\nError deleting primitive: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Main execution
const primitiveName = process.argv[2];

if (!primitiveName) {
  log('Error: Primitive name is required', 'red');
  log('Usage: node scripts/delete-primitive.js <primitive-name>');
  log('Example: node scripts/delete-primitive.js button');
  process.exit(1);
}

deletePrimitive(primitiveName);
