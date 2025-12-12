# Quick Reference - Tạo Primitives

## 🚀 Tạo Primitive Mới

```bash
pnpm create:primitive <tên-primitive>
```

## 📁 Cấu Trúc File

```
packages/<tên-primitive>/
├── package.json          # Cấu hình package
├── tsconfig.json         # Cấu hình TypeScript
├── tsup.config.ts        # Cấu hình build
├── CHANGELOG.md          # Lịch sử phiên bản
└── src/
    ├── index.ts          # Entry point - exports
    ├── types.ts          # Type definitions
    └── <tên>.tsx         # Component chính
```

## 📝 Template Component Cơ Bản

```tsx
import * as Slot from '@dino-rn-primitives/slot';
import * as React from 'react';
import { View } from 'react-native';
import type { RootProps, RootRef } from './types';

const Root = React.forwardRef<RootRef, RootProps>(({ asChild, ...props }, ref) => {
  const Component = asChild ? Slot.View : View;
  return <Component ref={ref} {...props} />;
});

Root.displayName = 'Root<ComponentName>';

export { Root };
```

## 🎯 Types Template

```typescript
import type { SlottableViewProps, ViewRef } from '@dino-rn-primitives/types';

type RootProps = SlottableViewProps & {
  // Custom props
};

type RootRef = ViewRef;

export type { RootProps, RootRef };
```

## 🔧 Các Lệnh Thường Dùng

| Lệnh                           | Mô tả                       |
| ------------------------------ | --------------------------- |
| `pnpm create:primitive <name>` | Tạo primitive mới           |
| `pnpm list:primitives`         | Liệt kê tất cả primitives   |
| `pnpm delete:primitive <name>` | Xóa primitive (có xác nhận) |
| `pnpm install`                 | Cài đặt dependencies        |
| `pnpm dev:primitives`          | Start dev mode (watch)      |
| `pnpm build`                   | Build tất cả primitives     |
| `pnpm clean`                   | Xóa build artifacts         |

## 📦 Thêm Dependencies

```bash
# Thêm dependency cho một primitive cụ thể
pnpm add <package> --filter @dino-rn-primitives/<primitive-name>

# Ví dụ: Thêm Radix UI
pnpm add @radix-ui/react-button --filter @dino-rn-primitives/button
```

## 🎨 Component Types

### View-based Component

```typescript
import type { SlottableViewProps, ViewRef } from '@dino-rn-primitives/types';

type Props = SlottableViewProps & {
  /* ... */
};
type Ref = ViewRef;
```

### Pressable-based Component

```typescript
import type { SlottablePressableProps, PressableRef } from '@dino-rn-primitives/types';

type Props = SlottablePressableProps & {
  /* ... */
};
type Ref = PressableRef;
```

### Text-based Component

```typescript
import type { SlottableTextProps, TextRef } from '@dino-rn-primitives/types';

type Props = SlottableTextProps & {
  /* ... */
};
type Ref = TextRef;
```

## ✅ Checklist Khi Tạo Primitive

- [ ] Tạo primitive với script
- [ ] Cài đặt dependencies (`pnpm install`)
- [ ] Cập nhật types trong `src/types.ts`
- [ ] Implement component trong `src/<name>.tsx`
- [ ] Thêm accessibility props (role, aria-\*)
- [ ] Support ref forwarding
- [ ] Test với `asChild` prop
- [ ] Start dev mode (`pnpm dev:primitives`)
- [ ] Test trong app
- [ ] Update CHANGELOG.md
- [ ] Build (`pnpm build`)

## 🔍 Debugging

### Build Errors

```bash
pnpm clean
pnpm build
```

### Type Errors

```bash
# Kiểm tra tsconfig
cat packages/<name>/tsconfig.json

# Xem types được export
cat packages/<name>/src/types.ts
```

### Import Errors

```bash
# Reinstall
pnpm install

# Restart dev server
pnpm dev:primitives
```

## 📚 Best Practices

1. **Luôn sử dụng `asChild` pattern**

   ```tsx
   const Component = asChild ? Slot.View : View;
   ```

2. **Forward refs**

   ```tsx
   React.forwardRef<Ref, Props>((props, ref) => {
     /* ... */
   });
   ```

3. **Accessibility**

   ```tsx
   <Component role='button' aria-label='Close' aria-disabled={disabled} />
   ```

4. **Display names**

   ```tsx
   Root.displayName = 'RootComponentName';
   ```

5. **Type safety**
   ```typescript
   // Import từ @dino-rn-primitives/types
   import type { SlottableViewProps, ViewRef } from '@dino-rn-primitives/types';
   ```

## 🌐 Resources

- [Main README](../README.md)
- [Scripts README](./README.md)
- [Example Guide](./EXAMPLE.md)
- [Radix UI Docs](https://www.radix-ui.com/)

## 💡 Examples

### Simple Separator

```tsx
const Root = React.forwardRef<ViewRef, SeparatorProps>(
  ({ asChild, decorative, orientation = 'horizontal', ...props }, ref) => {
    const Component = asChild ? Slot.View : View;
    return (
      <Component
        role={decorative ? 'presentation' : 'separator'}
        aria-orientation={orientation}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Interactive Button

```tsx
const Root = React.forwardRef<PressableRef, ButtonProps>(
  ({ asChild, disabled = false, onPress, ...props }, ref) => {
    const Component = asChild ? Slot.Pressable : Pressable;
    return (
      <Component
        ref={ref}
        disabled={disabled}
        onPress={onPress}
        role='button'
        aria-disabled={disabled}
        {...props}
      />
    );
  }
);
```

### Text Component

```tsx
const Root = React.forwardRef<TextRef, LabelProps>(({ asChild, ...props }, ref) => {
  const Component = asChild ? Slot.Text : Text;
  return <Component ref={ref} role='label' {...props} />;
});
```
