#!/bin/bash

# Script to publish unpublished packages to npm
# Generated on 2025-12-12

echo "🚀 Publishing unpublished packages to npm..."
echo ""

# List of unpublished packages
PACKAGES=(
  "@dino-rn-primitives/accordion"
  "@dino-rn-primitives/checkbox"
  "@dino-rn-primitives/context-menu"
  "@dino-rn-primitives/menubar"
  "@dino-rn-primitives/popover"
  "@dino-rn-primitives/portal"
  "@dino-rn-primitives/select"
  "@dino-rn-primitives/table"
)

# Counter for success/failure
SUCCESS=0
FAILED=0
FAILED_PACKAGES=()

echo "📦 Total packages to publish: ${#PACKAGES[@]}"
echo ""

# Publish each package
for package in "${PACKAGES[@]}"; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📤 Publishing: $package"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  if pnpm turbo pub:release --filter="$package"; then
    echo "✅ Successfully published: $package"
    ((SUCCESS++))
  else
    echo "❌ Failed to publish: $package"
    ((FAILED++))
    FAILED_PACKAGES+=("$package")
  fi
  
  echo ""
done

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Successfully published: $SUCCESS"
echo "❌ Failed: $FAILED"

if [ $FAILED -gt 0 ]; then
  echo ""
  echo "Failed packages:"
  for pkg in "${FAILED_PACKAGES[@]}"; do
    echo "  - $pkg"
  done
  exit 1
fi

echo ""
echo "🎉 All packages published successfully!"
exit 0
