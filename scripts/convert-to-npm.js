#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.join(__dirname, '..', 'packages');

// 1. Get all packages
const packageDirs = fs.readdirSync(PACKAGES_DIR).filter((dir) => {
  const pkgPath = path.join(PACKAGES_DIR, dir);
  return fs.statSync(pkgPath).isDirectory() && fs.existsSync(path.join(pkgPath, 'package.json'));
});

console.log(
  `Found ${packageDirs.length} packages. Converting protocol 'workspace:*' to '*' for NPM compatibility...\n`
);

let changedCount = 0;

packageDirs.forEach((dir) => {
  const pkgJsonPath = path.join(PACKAGES_DIR, dir, 'package.json');
  let content = fs.readFileSync(pkgJsonPath, 'utf8');

  // Replace "workspace:*" with "*" for dependencies
  // Regex looks for: "some-package": "workspace:*"
  const regex = /:\s*"workspace:\*"/g;

  if (regex.test(content)) {
    content = content.replace(regex, ': "*"');
    fs.writeFileSync(pkgJsonPath, content);
    console.log(`✓ Updated ${dir}/package.json`);
    changedCount++;
  }
});

console.log(`\nConverted ${changedCount} packages.`);
console.log(`\nNOTE: You can now use this repository with NPM workspaces.`);
console.log(
  `Don't forget to remove 'pnpm-workspace.yaml' and use 'workspaces' in root package.json.`
);
