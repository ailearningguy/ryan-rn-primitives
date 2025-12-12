#!/usr/bin/env node

/**
 * Script to create a new RN Primitive
 * Usage: node scripts/create-primitive.js <primitive-name>
 * Or: pnpm create:primitive <primitive-name>
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function createPrimitive(primitiveName) {
  const packageDir = path.join(process.cwd(), 'packages', primitiveName);

  // Check if primitive already exists
  if (fs.existsSync(packageDir)) {
    log(`Error: Primitive '${primitiveName}' already exists at ${packageDir}`, 'red');
    process.exit(1);
  }

  log(`Creating new primitive: ${primitiveName}`, 'green');

  // Create directory structure
  fs.mkdirSync(path.join(packageDir, 'src'), { recursive: true });

  const componentName = toPascalCase(primitiveName);

  // Create package.json
  log('Creating package.json...', 'yellow');
  const packageJson = {
    name: `@dino-rn-primitives/${primitiveName}`,
    version: '0.0.1',
    description: `Primitive ${primitiveName}`,
    license: 'MIT',
    main: 'dist/index.js',
    module: 'dist/index.mjs',
    types: 'dist/index.d.ts',
    exports: {
      '.': {
        import: './dist/index.mjs',
        require: './dist/index.js',
        types: './dist/index.d.ts',
        default: './dist/index.js',
      },
      [`./dist/${primitiveName}`]: {
        import: `./dist/${primitiveName}.mjs`,
        require: `./dist/${primitiveName}.js`,
        types: `./dist/${primitiveName}.d.ts`,
        default: `./dist/${primitiveName}.js`,
      },
    },
    files: ['dist'],
    scripts: {
      build: 'tsup',
      dev: 'tsup --watch',
      clean: 'rm -rf dist',
      'pub:beta': 'pnpm publish --no-git-checks --access public --tag beta',
      'pub:next': 'pnpm publish --no-git-checks --access public --tag next',
      'pub:release': 'pnpm publish --access public',
    },
    dependencies: {
      '@dino-rn-primitives/hooks': 'workspace:*',
      '@dino-rn-primitives/slot': 'workspace:*',
      '@dino-rn-primitives/types': 'workspace:*',
    },
    devDependencies: {
      '@tsconfig/react-native': '^1.0.1',
      '@types/react': '~19.0.14',
      react: '19.0.0',
      'react-native': '0.79.2',
      tsup: '^8.1.0',
    },
    peerDependencies: {
      react: '*',
      'react-native': '*',
      'react-native-web': '*',
    },
    peerDependenciesMeta: {
      'react-native': {
        optional: true,
      },
      'react-native-web': {
        optional: true,
      },
    },
  };

  fs.writeFileSync(
    path.join(packageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2) + '\n'
  );

  // Create tsconfig.json
  log('Creating tsconfig.json...', 'yellow');
  const tsConfig = {
    extends: '@tsconfig/react-native/tsconfig.json',
    include: ['.'],
    compilerOptions: {
      lib: [
        'dom',
        'es2019',
        'es2020.bigint',
        'es2020.date',
        'es2020.number',
        'es2020.promise',
        'es2020.string',
        'es2020.symbol.wellknown',
        'es2021.promise',
        'es2021.string',
        'es2021.weakref',
        'es2022.array',
        'es2022.object',
        'es2022.string',
      ],
    },
    exclude: ['dist', 'build', 'node_modules'],
  };

  fs.writeFileSync(
    path.join(packageDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2) + '\n'
  );

  // Create tsup.config.ts
  log('Creating tsup.config.ts...', 'yellow');
  const tsupConfig = `import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts', 'src/${primitiveName}.tsx'],
  banner: {
    js: "'use client'",
  },
  clean: true,
  format: ['cjs', 'esm'],
  external: ['react', './${primitiveName}'],
  dts: true,
  ...options,
  esbuildOptions(options) {
    options.jsx = 'preserve';
  },
}));
`;

  fs.writeFileSync(path.join(packageDir, 'tsup.config.ts'), tsupConfig);

  // Create CHANGELOG.md
  log('Creating CHANGELOG.md...', 'yellow');
  const changelog = `# @dino-rn-primitives/${primitiveName}

## 0.0.1

### Patch Changes

- Initial release
`;

  fs.writeFileSync(path.join(packageDir, 'CHANGELOG.md'), changelog);

  // Create src/index.ts
  log('Creating src/index.ts...', 'yellow');
  const indexTs = `export * from './${primitiveName}';
export * from './types';
`;

  fs.writeFileSync(path.join(packageDir, 'src', 'index.ts'), indexTs);

  // Create src/types.ts
  log('Creating src/types.ts...', 'yellow');
  const typesTs = `import type { SlottableViewProps, ViewRef } from '@dino-rn-primitives/types';

type RootProps = SlottableViewProps & {
  // Add your custom props here
};

type RootRef = ViewRef;

export type { RootProps, RootRef };
`;

  fs.writeFileSync(path.join(packageDir, 'src', 'types.ts'), typesTs);

  // Create src/${primitiveName}.tsx
  log(`Creating src/${primitiveName}.tsx...`, 'yellow');
  const componentTsx = `import * as Slot from '@dino-rn-primitives/slot';
import * as React from 'react';
import { View } from 'react-native';
import type { RootProps, RootRef } from './types';

const Root = React.forwardRef<RootRef, RootProps>(
  ({ asChild, ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <Component
        ref={ref}
        {...props}
      />
    );
  }
);

Root.displayName = 'Root${componentName}';

export { Root };
`;

  fs.writeFileSync(path.join(packageDir, 'src', `${primitiveName}.tsx`), componentTsx);

  // Success message
  log(`\n✓ Primitive '${primitiveName}' created successfully!`, 'green');
  log('\nNext steps:', 'yellow');
  log('1. Install dependencies:');
  log('   pnpm install', 'green');
  log('\n2. Start development mode:');
  log('   pnpm dev:primitives', 'green');
  log('\n3. Edit your component:');
  log(`   ${packageDir}/src/${primitiveName}.tsx`, 'green');
  log('\n4. Update types if needed:');
  log(`   ${packageDir}/src/types.ts`, 'green');
  log('\nOptional: Add Radix UI dependency if needed', 'yellow');
  log(`   pnpm add @radix-ui/react-${primitiveName} --filter @dino-rn-primitives/${primitiveName}`);
}

// Main execution
const primitiveName = process.argv[2];

if (!primitiveName) {
  log('Error: Primitive name is required', 'red');
  log('Usage: node scripts/create-primitive.js <primitive-name>');
  log('Example: node scripts/create-primitive.js button');
  process.exit(1);
}

// Validate primitive name (lowercase with hyphens)
if (!/^[a-z]+(-[a-z]+)*$/.test(primitiveName)) {
  log('Error: Primitive name must be lowercase with hyphens (e.g., button, alert-dialog)', 'red');
  process.exit(1);
}

createPrimitive(primitiveName);
