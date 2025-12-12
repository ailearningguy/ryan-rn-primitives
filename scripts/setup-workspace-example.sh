#!/bin/bash

# Script để tạo ví dụ workspace monorepo
# Sử dụng: ./scripts/setup-workspace-example.sh /path/to/your-project

set -e

if [ -z "$1" ]; then
    echo "❌ Error: Please provide project path"
    echo "Usage: ./scripts/setup-workspace-example.sh /path/to/your-project"
    exit 1
fi

PROJECT_PATH="$1"
PRIMITIVES_PATH="$(cd "$(dirname "$0")/.." && pwd)"

echo "🚀 Setting up workspace monorepo..."
echo "   Project: $PROJECT_PATH"
echo "   Primitives: $PRIMITIVES_PATH"
echo ""

# Kiểm tra project path tồn tại
if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Error: Project path does not exist: $PROJECT_PATH"
    exit 1
fi

cd "$PROJECT_PATH"

# Tạo thư mục packages nếu chưa có
echo "📁 Creating packages directory..."
mkdir -p packages

# Copy hoặc symlink primitives
echo "🔗 Linking ryan-rn-primitives..."
if [ -d "packages/ryan-rn-primitives" ]; then
    echo "⚠️  packages/ryan-rn-primitives already exists, skipping..."
else
    ln -s "$PRIMITIVES_PATH" packages/ryan-rn-primitives
    echo "✓ Linked primitives"
fi

# Tạo pnpm-workspace.yaml
echo "📝 Creating pnpm-workspace.yaml..."
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - 'packages/ryan-rn-primitives/packages/*'
  - '.'
EOF
echo "✓ Created pnpm-workspace.yaml"

# Backup package.json nếu tồn tại
if [ -f "package.json" ]; then
    echo "💾 Backing up package.json..."
    cp package.json package.json.backup
    echo "✓ Backed up to package.json.backup"
fi

# Hướng dẫn tiếp theo
echo ""
echo "✅ Workspace setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Update your package.json dependencies:"
echo "   Replace version numbers with 'workspace:*' for primitives packages"
echo "   Example:"
echo '   "@dino-rn-primitives/accordion": "workspace:*"'
echo ""
echo "2. Install dependencies:"
echo "   pnpm install"
echo ""
echo "3. Build primitives:"
echo "   cd packages/ryan-rn-primitives"
echo "   pnpm build"
echo ""
echo "4. Or run in dev mode:"
echo "   pnpm dev:primitives"
echo ""
echo "🎉 Happy coding!"
