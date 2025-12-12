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
npm install @ryan-rn-primitives/accordion \
            @ryan-rn-primitives/dialog \
            @ryan-rn-primitives/tabs \
            @ryan-rn-primitives/hooks \
            @ryan-rn-primitives/slot \
            @ryan-rn-primitives/types
```

### Bước 3: Sử Dụng

```typescript
// src/components/MyAccordion.tsx
import { Root, Item, Header, Trigger, Content } from '@ryan-rn-primitives/accordion';
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
npm install @ryan-rn-primitives/accordion
npm install @ryan-rn-primitives/alert-dialog
npm install @ryan-rn-primitives/aspect-ratio
npm install @ryan-rn-primitives/avatar
npm install @ryan-rn-primitives/checkbox
npm install @ryan-rn-primitives/collapsible
npm install @ryan-rn-primitives/context-menu
npm install @ryan-rn-primitives/dialog
npm install @ryan-rn-primitives/dropdown-menu
npm install @ryan-rn-primitives/hover-card
npm install @ryan-rn-primitives/label
npm install @ryan-rn-primitives/menubar
npm install @ryan-rn-primitives/navigation-menu
npm install @ryan-rn-primitives/popover
npm install @ryan-rn-primitives/progress
npm install @ryan-rn-primitives/radio-group
npm install @ryan-rn-primitives/select
npm install @ryan-rn-primitives/separator
npm install @ryan-rn-primitives/slider
npm install @ryan-rn-primitives/switch
npm install @ryan-rn-primitives/table
npm install @ryan-rn-primitives/tabs
npm install @ryan-rn-primitives/toast
npm install @ryan-rn-primitives/toggle
npm install @ryan-rn-primitives/toggle-group
npm install @ryan-rn-primitives/toolbar
npm install @ryan-rn-primitives/tooltip
```

### Shared Packages (5)

```bash
npm install @ryan-rn-primitives/hooks
npm install @ryan-rn-primitives/portal
npm install @ryan-rn-primitives/slot
npm install @ryan-rn-primitives/types
npm install @ryan-rn-primitives/utils
```

---

## 💡 Install Tất Cả Cùng Lúc

```bash
npm install \
  @ryan-rn-primitives/accordion \
  @ryan-rn-primitives/alert-dialog \
  @ryan-rn-primitives/aspect-ratio \
  @ryan-rn-primitives/avatar \
  @ryan-rn-primitives/checkbox \
  @ryan-rn-primitives/collapsible \
  @ryan-rn-primitives/context-menu \
  @ryan-rn-primitives/dialog \
  @ryan-rn-primitives/dropdown-menu \
  @ryan-rn-primitives/hover-card \
  @ryan-rn-primitives/label \
  @ryan-rn-primitives/menubar \
  @ryan-rn-primitives/navigation-menu \
  @ryan-rn-primitives/popover \
  @ryan-rn-primitives/progress \
  @ryan-rn-primitives/radio-group \
  @ryan-rn-primitives/select \
  @ryan-rn-primitives/separator \
  @ryan-rn-primitives/slider \
  @ryan-rn-primitives/switch \
  @ryan-rn-primitives/table \
  @ryan-rn-primitives/tabs \
  @ryan-rn-primitives/toast \
  @ryan-rn-primitives/toggle \
  @ryan-rn-primitives/toggle-group \
  @ryan-rn-primitives/toolbar \
  @ryan-rn-primitives/tooltip \
  @ryan-rn-primitives/hooks \
  @ryan-rn-primitives/portal \
  @ryan-rn-primitives/slot \
  @ryan-rn-primitives/types \
  @ryan-rn-primitives/utils
```

---

## 🎨 Example: Tạo UI Kit Component

```typescript
// your-ui-kit/src/components/Accordion.tsx
import * as AccordionPrimitive from '@ryan-rn-primitives/accordion';
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
npm list @ryan-rn-primitives/accordion

# Xem version
npm view @ryan-rn-primitives/accordion version

# Test import
node -e "console.log(require('@ryan-rn-primitives/accordion'))"
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
npm view @ryan-rn-primitives/accordion  # Kiểm tra đã publish chưa

# Peer dependency warnings
npm install react react-native  # Install peer deps

# TypeScript errors
npm install --save-dev @types/react @types/react-native
```

**Xem hướng dẫn đầy đủ:** [NPM_INSTALLATION.md](./NPM_INSTALLATION.md)
