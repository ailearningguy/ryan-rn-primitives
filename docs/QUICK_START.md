# Quick Start: Sử Dụng RN Primitives từ npm

## 🚀 Cài Đặt Nhanh (5 phút)

### Bước 1: Publish Primitives (Chỉ làm 1 lần)

```bash
# Trong ryan-rn-primitives repo
cd /Users/hoquithinh/Dev/mobile/ryan-rn-primitives

# Build tất cả packages
pnpm build

# Login npm (nếu chưa)
npm login

# Publish tất cả primitives
pnpm publish-all:primitives
```

### Bước 2: Cài Đặt trong UI Kit

```bash
# Trong UI kit repo của bạn
cd /path/to/your-ui-kit

# Install primitives bạn cần
npm install @dino-rn-primitives/accordion \
            @dino-rn-primitives/dialog \
            @dino-rn-primitives/tabs \
            @dino-rn-primitives/hooks \
            @dino-rn-primitives/slot \
            @dino-rn-primitives/types
```

### Bước 3: Sử Dụng

```typescript
// src/components/MyAccordion.tsx
import { Root, Item, Header, Trigger, Content } from '@dino-rn-primitives/accordion';
import { Text, StyleSheet } from 'react-native';

export function MyAccordion() {
  return (
    <Root type='single' collapsible>
      <Item value='item-1'>
        <Header>
          <Trigger style={styles.trigger}>
            <Text>Click me!</Text>
          </Trigger>
        </Header>
        <Content style={styles.content}>
          <Text>Content here</Text>
        </Content>
      </Item>
    </Root>
  );
}

const styles = StyleSheet.create({
  trigger: { padding: 16, backgroundColor: '#f0f0f0' },
  content: { padding: 16 },
});
```

---

## 📦 Danh Sách Packages Có Sẵn

### Core Primitives (27)

```bash
npm install @dino-rn-primitives/accordion
npm install @dino-rn-primitives/alert-dialog
npm install @dino-rn-primitives/aspect-ratio
npm install @dino-rn-primitives/avatar
npm install @dino-rn-primitives/checkbox
npm install @dino-rn-primitives/collapsible
npm install @dino-rn-primitives/context-menu
npm install @dino-rn-primitives/dialog
npm install @dino-rn-primitives/dropdown-menu
npm install @dino-rn-primitives/hover-card
npm install @dino-rn-primitives/label
npm install @dino-rn-primitives/menubar
npm install @dino-rn-primitives/navigation-menu
npm install @dino-rn-primitives/popover
npm install @dino-rn-primitives/progress
npm install @dino-rn-primitives/radio-group
npm install @dino-rn-primitives/select
npm install @dino-rn-primitives/separator
npm install @dino-rn-primitives/slider
npm install @dino-rn-primitives/switch
npm install @dino-rn-primitives/table
npm install @dino-rn-primitives/tabs
npm install @dino-rn-primitives/toast
npm install @dino-rn-primitives/toggle
npm install @dino-rn-primitives/toggle-group
npm install @dino-rn-primitives/toolbar
npm install @dino-rn-primitives/tooltip
```

### Shared Packages (5)

```bash
npm install @dino-rn-primitives/hooks
npm install @dino-rn-primitives/portal
npm install @dino-rn-primitives/slot
npm install @dino-rn-primitives/types
npm install @dino-rn-primitives/utils
```

---

## 💡 Install Tất Cả Cùng Lúc

```bash
npm install \
  @dino-rn-primitives/accordion \
  @dino-rn-primitives/alert-dialog \
  @dino-rn-primitives/aspect-ratio \
  @dino-rn-primitives/avatar \
  @dino-rn-primitives/checkbox \
  @dino-rn-primitives/collapsible \
  @dino-rn-primitives/context-menu \
  @dino-rn-primitives/dialog \
  @dino-rn-primitives/dropdown-menu \
  @dino-rn-primitives/hover-card \
  @dino-rn-primitives/label \
  @dino-rn-primitives/menubar \
  @dino-rn-primitives/navigation-menu \
  @dino-rn-primitives/popover \
  @dino-rn-primitives/progress \
  @dino-rn-primitives/radio-group \
  @dino-rn-primitives/select \
  @dino-rn-primitives/separator \
  @dino-rn-primitives/slider \
  @dino-rn-primitives/switch \
  @dino-rn-primitives/table \
  @dino-rn-primitives/tabs \
  @dino-rn-primitives/toast \
  @dino-rn-primitives/toggle \
  @dino-rn-primitives/toggle-group \
  @dino-rn-primitives/toolbar \
  @dino-rn-primitives/tooltip \
  @dino-rn-primitives/hooks \
  @dino-rn-primitives/portal \
  @dino-rn-primitives/slot \
  @dino-rn-primitives/types \
  @dino-rn-primitives/utils
```

---

## 🎨 Example: Tạo UI Kit Component

```typescript
// your-ui-kit/src/components/Accordion.tsx
import * as AccordionPrimitive from '@dino-rn-primitives/accordion';
import { StyleSheet } from 'react-native';

// Re-export với styles
export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = (props) => <AccordionPrimitive.Item style={styles.item} {...props} />;

export const AccordionTrigger = (props) => (
  <AccordionPrimitive.Trigger style={styles.trigger} {...props} />
);

export const AccordionContent = (props) => (
  <AccordionPrimitive.Content style={styles.content} {...props} />
);

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  trigger: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});
```

```typescript
// your-ui-kit/src/index.ts
export * from './components/Accordion';
export * from './components/Dialog';
// ... other components
```

---

## ✅ Kiểm Tra Cài Đặt

```bash
# Xem package đã install
npm list @dino-rn-primitives/accordion

# Xem version
npm view @dino-rn-primitives/accordion version

# Test import
node -e "console.log(require('@dino-rn-primitives/accordion'))"
```

---

## 📚 Documentation

- [Chi tiết đầy đủ](./NPM_INSTALLATION.md) - Hướng dẫn 7 bước chi tiết
- [Troubleshooting](./NPM_INSTALLATION.md#troubleshooting) - Giải quyết lỗi thường gặp
- [Best Practices](./NPM_INSTALLATION.md#best-practices) - Best practices

---

## 🆘 Cần Giúp?

**Lỗi thường gặp:**

```bash
# Package not found
npm view @dino-rn-primitives/accordion  # Kiểm tra đã publish chưa

# Peer dependency warnings
npm install react react-native  # Install peer deps

# TypeScript errors
npm install --save-dev @types/react @types/react-native
```

**Xem hướng dẫn đầy đủ:** [NPM_INSTALLATION.md](./NPM_INSTALLATION.md)
