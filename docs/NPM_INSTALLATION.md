# Cài Đặt RN Primitives từ npm Registry

## 📦 Tổng Quan

Hướng dẫn này sẽ chỉ bạn cách publish các RN Primitives lên npm registry và cài đặt chúng trong UI kit repo của bạn.

---

## 🚀 Bước 1: Publish lên npm Registry

### Prerequisites

1. **Tài khoản npm**

   ```bash
   # Đăng ký tại https://www.npmjs.com/signup
   # Hoặc login nếu đã có tài khoản
   npm login
   ```

2. **Build tất cả packages**
   ```bash
   cd ryan-rn-primitives
   pnpm build
   ```

### Publish Một Package

```bash
# Publish một primitive cụ thể
cd packages/accordion
pnpm pub:release

# Hoặc publish beta version
pnpm pub:beta

# Hoặc publish next version
pnpm pub:next
```

### Publish Tất Cả Packages

```bash
# Từ root directory
pnpm publish-all:primitives

# Hoặc publish tất cả với tag next
pnpm publish-all:primitives:next
```

### Kiểm Tra Package Đã Publish

```bash
# Xem package trên npm
npm view @ryan-rn-primitives/accordion

# Xem tất cả versions
npm view @ryan-rn-primitives/accordion versions
```

---

## 📥 Bước 2: Cài Đặt trong UI Kit Repo

### Setup UI Kit Project

```bash
# Tạo hoặc navigate đến UI kit repo
cd /path/to/your-ui-kit
```

### Cài Đặt Một Primitive

```bash
# Với npm
npm install @ryan-rn-primitives/accordion

# Với yarn
yarn add @ryan-rn-primitives/accordion

# Với pnpm
pnpm add @ryan-rn-primitives/accordion
```

### Cài Đặt Nhiều Primitives

```bash
# Install nhiều packages cùng lúc
npm install @ryan-rn-primitives/accordion \
            @ryan-rn-primitives/button \
            @ryan-rn-primitives/dialog \
            @ryan-rn-primitives/tabs
```

### Cài Đặt Shared Packages

```bash
# Thường bạn cần các shared packages
npm install @ryan-rn-primitives/hooks \
            @ryan-rn-primitives/slot \
            @ryan-rn-primitives/types
```

---

## 💻 Bước 3: Sử Dụng trong Code

### Import và Sử Dụng

```typescript
// src/components/MyAccordion.tsx
import * as React from 'react';
import { Root, Item, Header, Trigger, Content } from '@ryan-rn-primitives/accordion';
import { Text, View, StyleSheet } from 'react-native';

export function MyAccordion() {
  return (
    <Root type='single' collapsible>
      <Item value='item-1'>
        <Header>
          <Trigger style={styles.trigger}>
            <Text>What is RN Primitives?</Text>
          </Trigger>
        </Header>
        <Content style={styles.content}>
          <Text>Unstyled, accessible React Native components</Text>
        </Content>
      </Item>
    </Root>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 16,
  },
});
```

### Tạo Styled Components

```typescript
// src/components/ui/Accordion.tsx
import * as AccordionPrimitive from '@ryan-rn-primitives/accordion';
import { styled } from 'your-styling-library';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = styled(AccordionPrimitive.Item, {
  borderBottomWidth: 1,
  borderBottomColor: '#e5e5e5',
});

export const AccordionTrigger = styled(AccordionPrimitive.Trigger, {
  padding: 16,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const AccordionContent = styled(AccordionPrimitive.Content, {
  padding: 16,
  paddingTop: 0,
});
```

### Re-export trong UI Kit

```typescript
// src/index.ts
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/ui/Accordion';

export { Dialog, DialogTrigger, DialogContent } from './components/ui/Dialog';

// ... other components
```

---

## 📋 Bước 4: Package.json Configuration

### Thêm vào Dependencies

```json
{
  "name": "your-ui-kit",
  "version": "1.0.0",
  "dependencies": {
    "@ryan-rn-primitives/accordion": "^1.2.0",
    "@ryan-rn-primitives/alert-dialog": "^1.2.0",
    "@ryan-rn-primitives/avatar": "^1.2.0",
    "@ryan-rn-primitives/checkbox": "^1.2.0",
    "@ryan-rn-primitives/dialog": "^1.2.0",
    "@ryan-rn-primitives/hooks": "^1.3.0",
    "@ryan-rn-primitives/slot": "^1.2.0",
    "@ryan-rn-primitives/types": "^1.2.0",
    "react": "^18.0.0",
    "react-native": "^0.72.0"
  }
}
```

### Peer Dependencies

Đảm bảo UI kit của bạn có peer dependencies phù hợp:

```json
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-native": ">=0.72.0"
  }
}
```

---

## 🎨 Bước 5: Tạo UI Kit Components

### Example: Button Component

```typescript
// src/components/Button.tsx
import * as React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import * as Slot from '@ryan-rn-primitives/slot';

interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
}

export function Button({
  variant = 'default',
  size = 'md',
  asChild,
  children,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot.Pressable : Pressable;

  return (
    <Component style={[styles.base, styles[variant], styles[size]]} {...props}>
      {asChild ? children : <Text>{children}</Text>}
    </Component>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  default: {
    backgroundColor: '#007AFF',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
});
```

---

## 🔄 Bước 6: Update Dependencies

### Kiểm Tra Updates

```bash
# Xem packages có version mới
npm outdated

# Hoặc với pnpm
pnpm outdated
```

### Update Packages

```bash
# Update một package
npm update @ryan-rn-primitives/accordion

# Update tất cả @ryan-rn-primitives packages
npm update @ryan-rn-primitives/*

# Hoặc install version cụ thể
npm install @ryan-rn-primitives/accordion@1.3.0
```

---

## 📦 Bước 7: Bundle UI Kit

### Build UI Kit

```json
{
  "scripts": {
    "build": "tsc && tsup",
    "prepublishOnly": "pnpm build"
  }
}
```

### Publish UI Kit

```bash
# Build và publish UI kit của bạn
pnpm build
npm publish
```

---

## ✅ Checklist

- [ ] Đăng nhập npm: `npm login`
- [ ] Build primitives: `pnpm build`
- [ ] Publish primitives: `pnpm publish-all:primitives`
- [ ] Tạo UI kit project
- [ ] Install primitives: `npm install @ryan-rn-primitives/...`
- [ ] Import và sử dụng trong code
- [ ] Tạo styled components
- [ ] Re-export trong UI kit
- [ ] Test components
- [ ] Build UI kit
- [ ] Publish UI kit

---

## 🐛 Troubleshooting

### Lỗi: "Package not found"

```bash
# Kiểm tra package có tồn tại trên npm
npm view @ryan-rn-primitives/accordion

# Nếu không có, publish lại
cd packages/accordion
pnpm pub:release
```

### Lỗi: "Peer dependency warnings"

```bash
# Install peer dependencies
npm install react react-native
```

### Lỗi: "Module not found"

```bash
# Đảm bảo đã build primitives trước khi publish
cd ryan-rn-primitives
pnpm build
pnpm publish-all:primitives
```

### Lỗi: "TypeScript types not found"

```bash
# Kiểm tra types được export trong package.json
# "types": "dist/index.d.ts"

# Rebuild nếu cần
pnpm build
```

---

## 📚 Best Practices

### 1. Version Management

```bash
# Sử dụng semantic versioning
# ^1.2.0 - Cho phép minor và patch updates
# ~1.2.0 - Chỉ cho phép patch updates
# 1.2.0 - Lock exact version
```

### 2. Lock File

```bash
# Commit package-lock.json hoặc pnpm-lock.yaml
git add package-lock.json
git commit -m "chore: update dependencies"
```

### 3. Testing

```typescript
// Test primitives trước khi publish UI kit
import { render } from '@testing-library/react-native';
import { MyAccordion } from './MyAccordion';

test('accordion renders', () => {
  const { getByText } = render(<MyAccordion />);
  expect(getByText('What is RN Primitives?')).toBeTruthy();
});
```

### 4. Documentation

```markdown
# Trong UI kit README.md

## Dependencies

This UI kit is built on top of:

- [@ryan-rn-primitives](https://www.npmjs.com/org/rn-primitives) - Unstyled primitives
- React Native 0.72+
- React 18+
```

---

## 🎯 Next Steps

1. **Publish primitives** lên npm registry
2. **Install trong UI kit** của bạn
3. **Tạo styled components** với design system
4. **Test thoroughly**
5. **Publish UI kit** của bạn
6. **Share với team**!

---

## 📞 Support

Nếu gặp vấn đề:

- Xem [npm documentation](https://docs.npmjs.com/)
- Kiểm tra [RN Primitives issues](https://github.com/your-repo/issues)
- Đọc [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
