# Ví dụ: Tạo một Button Primitive

Hướng dẫn từng bước để tạo một button primitive hoàn chỉnh.

## Bước 1: Tạo primitive mới

```bash
pnpm create:primitive button
```

Output:

```
Creating new primitive: button
Creating package.json...
Creating tsconfig.json...
Creating tsup.config.ts...
Creating CHANGELOG.md...
Creating src/index.ts...
Creating src/types.ts...
Creating src/button.tsx...

✓ Primitive 'button' created successfully!
```

## Bước 2: Cài đặt dependencies

```bash
pnpm install
```

## Bước 3: Thêm Radix UI dependency (optional)

Nếu bạn muốn sử dụng Radix UI cho web compatibility:

```bash
pnpm add @radix-ui/react-slot --filter @rn-primitives/button
```

## Bước 4: Cập nhật Types

Mở `packages/button/src/types.ts` và thêm các props cho button:

```typescript
import type { PressableRef, SlottablePressableProps } from '@rn-primitives/types';

type ButtonProps = SlottablePressableProps & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
};

type ButtonRef = PressableRef;

export type { ButtonProps, ButtonRef };
```

## Bước 5: Implement Component

Mở `packages/button/src/button.tsx` và implement:

```tsx
import * as Slot from '@rn-primitives/slot';
import * as React from 'react';
import { Pressable } from 'react-native';
import type { ButtonProps, ButtonRef } from './types';

const Root = React.forwardRef<ButtonRef, ButtonProps>(
  ({ asChild, disabled = false, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;

    return (
      <Component ref={ref} disabled={disabled} role='button' aria-disabled={disabled} {...props} />
    );
  }
);

Root.displayName = 'RootButton';

export { Root };
```

## Bước 6: Start Development Mode

```bash
pnpm dev:primitives
```

## Bước 7: Test trong App

Sử dụng primitive trong app của bạn:

```tsx
import { Root as Button } from '@rn-primitives/button';
import { Text, StyleSheet } from 'react-native';

export function MyComponent() {
  return (
    <Button style={styles.button} onPress={() => console.log('Pressed!')}>
      <Text style={styles.text}>Click me</Text>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontWeight: '600',
  },
});
```

## Bước 8: Build và Publish

Khi sẵn sàng publish:

```bash
# Build
pnpm build

# Publish beta version
cd packages/button
pnpm pub:beta

# Or publish release version
pnpm pub:release
```

## Advanced: Thêm nhiều components

Nhiều primitives có nhiều sub-components. Ví dụ với Card:

### 1. Tạo primitive

```bash
pnpm create:primitive card
```

### 2. Tạo thêm các sub-components

Tạo `packages/card/src/card-header.tsx`:

```tsx
import * as Slot from '@rn-primitives/slot';
import * as React from 'react';
import { View } from 'react-native';
import type { CardHeaderProps, CardHeaderRef } from './types';

const Header = React.forwardRef<CardHeaderRef, CardHeaderProps>(({ asChild, ...props }, ref) => {
  const Component = asChild ? Slot.View : View;
  return <Component ref={ref} {...props} />;
});

Header.displayName = 'CardHeader';

export { Header };
```

### 3. Export tất cả trong `src/index.ts`

```typescript
export { Root, Header, Content, Footer } from './card';
export * from './types';
```

### 4. Cập nhật `tsup.config.ts`

```typescript
export default defineConfig((options: Options) => ({
  entry: [
    'src/index.ts',
    'src/card.tsx',
    'src/card-header.tsx',
    'src/card-content.tsx',
    'src/card-footer.tsx',
  ],
  // ... rest of config
}));
```

## Tips

1. **Luôn sử dụng `asChild` pattern** để cho phép composition
2. **Thêm accessibility props** (role, aria-\*)
3. **Support ref forwarding** với `React.forwardRef`
4. **Sử dụng types từ `@rn-primitives/types`** để consistency
5. **Test trên cả native và web** nếu có thể
6. **Document props** trong types với JSDoc comments

## Troubleshooting

**Build errors:**

```bash
# Clean và rebuild
pnpm clean
pnpm build
```

**Type errors:**

```bash
# Kiểm tra tsconfig
cat packages/button/tsconfig.json
```

**Import errors trong app:**

```bash
# Đảm bảo đã install
pnpm install

# Restart dev server
pnpm dev:primitives
```
