#!/bin/bash

# Script to create a new RN Primitive
# Usage: ./scripts/create-primitive.sh <primitive-name>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if primitive name is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Primitive name is required${NC}"
  echo "Usage: ./scripts/create-primitive.sh <primitive-name>"
  echo "Example: ./scripts/create-primitive.sh button"
  exit 1
fi

PRIMITIVE_NAME=$1
PACKAGE_DIR="packages/${PRIMITIVE_NAME}"

# Check if primitive already exists
if [ -d "$PACKAGE_DIR" ]; then
  echo -e "${RED}Error: Primitive '${PRIMITIVE_NAME}' already exists at ${PACKAGE_DIR}${NC}"
  exit 1
fi

echo -e "${GREEN}Creating new primitive: ${PRIMITIVE_NAME}${NC}"

# Create directory structure
mkdir -p "${PACKAGE_DIR}/src"

# Convert primitive-name to PascalCase for component names
COMPONENT_NAME=$(echo "$PRIMITIVE_NAME" | sed -r 's/(^|-)([a-z])/\U\2/g')

echo -e "${YELLOW}Creating package.json...${NC}"
cat > "${PACKAGE_DIR}/package.json" << EOF
{
  "name": "@dino-rn-primitives/${PRIMITIVE_NAME}",
  "version": "0.0.1",
  "description": "Primitive ${PRIMITIVE_NAME}",
  "license": "MIT",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./dist/${PRIMITIVE_NAME}": {
      "import": "./dist/${PRIMITIVE_NAME}.mjs",
      "require": "./dist/${PRIMITIVE_NAME}.js",
      "types": "./dist/${PRIMITIVE_NAME}.d.ts",
      "default": "./dist/${PRIMITIVE_NAME}.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist",
    "pub:beta": "pnpm publish --no-git-checks --access public --tag beta",
    "pub:next": "pnpm publish --no-git-checks --access public --tag next",
    "pub:release": "pnpm publish --access public"
  },
  "dependencies": {
    "@dino-rn-primitives/hooks": "workspace:*",
    "@dino-rn-primitives/slot": "workspace:*",
    "@dino-rn-primitives/types": "workspace:*"
  },
  "devDependencies": {
    "@tsconfig/react-native": "^1.0.1",
    "@types/react": "~19.0.14",
    "react": "19.0.0",
    "react-native": "0.79.2",
    "tsup": "^8.1.0"
  },
  "peerDependencies": {
    "react": "*",
    "react-native": "*",
    "react-native-web": "*"
  },
  "peerDependenciesMeta": {
    "react-native": {
      "optional": true
    },
    "react-native-web": {
      "optional": true
    }
  }
}
EOF

echo -e "${YELLOW}Creating tsconfig.json...${NC}"
cat > "${PACKAGE_DIR}/tsconfig.json" << 'EOF'
{
  "extends": "@tsconfig/react-native/tsconfig.json",
  "include": [
    "."
  ],
  "compilerOptions": {
    "lib": [
      "dom",
      "es2019",
      "es2020.bigint",
      "es2020.date",
      "es2020.number",
      "es2020.promise",
      "es2020.string",
      "es2020.symbol.wellknown",
      "es2021.promise",
      "es2021.string",
      "es2021.weakref",
      "es2022.array",
      "es2022.object",
      "es2022.string"
    ],
  },
  "exclude": [
    "dist",
    "build",
    "node_modules"
  ],
}
EOF

echo -e "${YELLOW}Creating tsup.config.ts...${NC}"
cat > "${PACKAGE_DIR}/tsup.config.ts" << EOF
import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts', 'src/${PRIMITIVE_NAME}.tsx'],
  banner: {
    js: "'use client'",
  },
  clean: true,
  format: ['cjs', 'esm'],
  external: ['react', './${PRIMITIVE_NAME}'],
  dts: true,
  ...options,
  esbuildOptions(options) {
    options.jsx = 'preserve';
  },
}));
EOF

echo -e "${YELLOW}Creating CHANGELOG.md...${NC}"
cat > "${PACKAGE_DIR}/CHANGELOG.md" << EOF
# @dino-rn-primitives/${PRIMITIVE_NAME}

## 0.0.1

### Patch Changes

- Initial release
EOF

echo -e "${YELLOW}Creating src/index.ts...${NC}"
cat > "${PACKAGE_DIR}/src/index.ts" << EOF
export * from './${PRIMITIVE_NAME}';
export * from './types';
EOF

echo -e "${YELLOW}Creating src/types.ts...${NC}"
cat > "${PACKAGE_DIR}/src/types.ts" << EOF
import type { SlottableViewProps, ViewRef } from '@dino-rn-primitives/types';

type RootProps = SlottableViewProps & {
  // Add your custom props here
};

type RootRef = ViewRef;

export type { RootProps, RootRef };
EOF

echo -e "${YELLOW}Creating src/${PRIMITIVE_NAME}.tsx...${NC}"
cat > "${PACKAGE_DIR}/src/${PRIMITIVE_NAME}.tsx" << EOF
import * as Slot from '@dino-rn-primitives/slot';
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

Root.displayName = 'Root${COMPONENT_NAME}';

export { Root };
EOF

echo -e "${GREEN}✓ Primitive '${PRIMITIVE_NAME}' created successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Install dependencies:"
echo -e "   ${GREEN}pnpm install${NC}"
echo ""
echo "2. Start development mode:"
echo -e "   ${GREEN}pnpm dev:primitives${NC}"
echo ""
echo "3. Edit your component:"
echo -e "   ${GREEN}${PACKAGE_DIR}/src/${PRIMITIVE_NAME}.tsx${NC}"
echo ""
echo "4. Update types if needed:"
echo -e "   ${GREEN}${PACKAGE_DIR}/src/types.ts${NC}"
echo ""
echo -e "${YELLOW}Optional: Add Radix UI dependency if needed${NC}"
echo "   pnpm add @radix-ui/react-${PRIMITIVE_NAME} --filter @dino-rn-primitives/${PRIMITIVE_NAME}"
