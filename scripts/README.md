# Scripts

Thư mục này chứa các script tiện ích để phát triển RN Primitives.

## Danh Sách Scripts

- **create-primitive** - Tạo primitive mới tự động
- **list-primitives** - Liệt kê tất cả primitives
- **delete-primitive** - Xóa primitive (với xác nhận)

---

## create-primitive

Script tự động tạo một primitive mới với tất cả các file cần thiết.

### Cách sử dụng

**Cách 1: Sử dụng npm script (Khuyến nghị)**

```bash
pnpm create:primitive <primitive-name>
```

**Cách 2: Chạy trực tiếp Node.js script**

```bash
node scripts/create-primitive.js <primitive-name>
```

**Cách 3: Chạy bash script**

```bash
./scripts/create-primitive.sh <primitive-name>
```

### Ví dụ

```bash
# Tạo primitive button
pnpm create:primitive button

# Tạo primitive alert-dialog
pnpm create:primitive alert-dialog

# Tạo primitive custom-component
pnpm create:primitive custom-component
```

### Lưu ý

- Tên primitive phải viết thường và sử dụng dấu gạch ngang để phân tách từ (ví dụ: `button`, `alert-dialog`)
- Script sẽ tự động tạo:
  - `package.json` với cấu hình đầy đủ
  - `tsconfig.json` cho TypeScript
  - `tsup.config.ts` cho build configuration
  - `CHANGELOG.md` để theo dõi thay đổi
  - `src/index.ts` - entry point
  - `src/types.ts` - type definitions
  - `src/<primitive-name>.tsx` - component implementation

### Các bước sau khi tạo primitive

1. **Cài đặt dependencies:**

   ```bash
   pnpm install
   ```

2. **Bắt đầu development mode:**

   ```bash
   pnpm dev:primitives
   ```

3. **Chỉnh sửa component của bạn:**

   - Mở file `packages/<primitive-name>/src/<primitive-name>.tsx`
   - Implement logic cho component

4. **Cập nhật types nếu cần:**

   - Mở file `packages/<primitive-name>/src/types.ts`
   - Thêm các props tùy chỉnh

5. **Thêm Radix UI dependency (nếu cần):**
   ```bash
   pnpm add @radix-ui/react-<primitive-name> --filter @dino-rn-primitives/<primitive-name>
   ```

### Cấu trúc thư mục được tạo

```
packages/<primitive-name>/
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── tsup.config.ts        # Build configuration
├── CHANGELOG.md          # Version history
└── src/
    ├── index.ts          # Exports
    ├── types.ts          # Type definitions
    └── <primitive-name>.tsx  # Component implementation
```

### Template Component

Script tạo một component cơ bản với cấu trúc sau:

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

Bạn có thể tùy chỉnh component này theo nhu cầu của mình.

### Troubleshooting

**Lỗi: "Primitive already exists"**

- Kiểm tra xem thư mục `packages/<primitive-name>` đã tồn tại chưa
- Sử dụng tên khác hoặc xóa thư mục cũ nếu muốn tạo lại

**Lỗi: "Primitive name must be lowercase with hyphens"**

- Đảm bảo tên primitive chỉ chứa chữ thường và dấu gạch ngang
- Ví dụ đúng: `button`, `alert-dialog`, `custom-component`
- Ví dụ sai: `Button`, `alertDialog`, `custom_component`

**Script không chạy được**

- Đảm bảo bạn đang ở thư mục root của project
- Kiểm tra quyền thực thi: `chmod +x scripts/create-primitive.sh`
- Sử dụng Node.js script thay vì bash script nếu gặp vấn đề

---

## list-primitives

Script để liệt kê tất cả primitives trong monorepo với thông tin version và description.

### Cách sử dụng

```bash
pnpm list:primitives
```

Hoặc:

```bash
node scripts/list-primitives.js
```

### Output

Script sẽ hiển thị:

- Danh sách tất cả **Core Primitives** với version và description
- Danh sách tất cả **Shared Packages** (hooks, portal, slot, types, utils)
- Tổng số packages

### Ví dụ Output

```
📦 RN Primitives Packages

Core Primitives:
──────────────────────────────────────────────────
 1. accordion            v1.2.0    Primitive accordion
 2. alert-dialog         v1.2.0    Primitive alert dialog
 3. button               v0.0.1    Primitive button
...

Total: 27 primitives

Shared Packages:
──────────────────────────────────────────────────
 1. hooks                v1.3.0    Primitive hooks
 2. portal               v1.3.0    Primitive portal
...

Summary:
  Total packages: 32
  Core primitives: 27
  Shared packages: 5
```

### Use Cases

- Kiểm tra danh sách primitives hiện có
- Xem version của từng primitive
- Đếm tổng số packages trong monorepo

---

## delete-primitive

Script để xóa một primitive với xác nhận an toàn.

### Cách sử dụng

```bash
pnpm delete:primitive <primitive-name>
```

Hoặc:

```bash
node scripts/delete-primitive.js <primitive-name>
```

### Ví dụ

```bash
# Xóa primitive button
pnpm delete:primitive button

# Xóa primitive custom-component
pnpm delete:primitive custom-component
```

### Quy trình

1. Script kiểm tra xem primitive có tồn tại không
2. Hiển thị thông tin về primitive (name, version, description, path)
3. Yêu cầu xác nhận (phải gõ "yes")
4. Xóa thư mục primitive
5. Hiển thị next steps

### Ví dụ Output

```
⚠️  WARNING: You are about to delete a primitive!
──────────────────────────────────────────────────
Name: @dino-rn-primitives/button
Version: 0.0.1
Description: Primitive button
Path: /path/to/packages/button
──────────────────────────────────────────────────

This action cannot be undone!

Are you sure you want to delete this primitive? (yes/no): yes

✓ Primitive 'button' deleted successfully!

Next steps:
1. Run `pnpm install` to update workspace
2. Remove any imports of this primitive from your apps
```

### Lưu ý

- ⚠️ **Hành động này không thể hoàn tác!**
- Phải gõ chính xác "yes" để xác nhận
- Sau khi xóa, cần chạy `pnpm install` để cập nhật workspace
- Cần xóa tất cả imports của primitive trong apps

### Troubleshooting

**Lỗi: "Primitive does not exist"**

- Kiểm tra tên primitive có đúng không
- Chạy `pnpm list:primitives` để xem danh sách primitives

**Không thể xóa**

- Kiểm tra quyền truy cập file system
- Đảm bảo không có process nào đang sử dụng thư mục

---

## Tổng Kết

### Workflow Hoàn Chỉnh

```bash
# 1. Xem danh sách primitives hiện có
pnpm list:primitives

# 2. Tạo primitive mới
pnpm create:primitive my-component

# 3. Cài đặt dependencies
pnpm install

# 4. Start development
pnpm dev:primitives

# 5. (Optional) Xóa primitive nếu không cần
pnpm delete:primitive my-component
```

### Quick Commands Reference

| Command                        | Description               |
| ------------------------------ | ------------------------- |
| `pnpm create:primitive <name>` | Tạo primitive mới         |
| `pnpm list:primitives`         | Liệt kê tất cả primitives |
| `pnpm delete:primitive <name>` | Xóa primitive             |
| `pnpm dev:primitives`          | Start dev mode            |
| `pnpm build`                   | Build tất cả primitives   |

### Tài Liệu Liên Quan

- [EXAMPLE.md](./EXAMPLE.md) - Ví dụ chi tiết tạo Button primitive
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Tham khảo nhanh
- [SUMMARY.md](./SUMMARY.md) - Tổng quan hệ thống
