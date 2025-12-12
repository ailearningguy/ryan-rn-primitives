# @ryan-rn-primitives

Meta package that includes all Ryan RN Primitives - unstyled, accessible React Native components.

## Installation

### Install all primitives at once

```bash
npm install @ryan-rn-primitives
# or
yarn add @ryan-rn-primitives
# or
pnpm add @ryan-rn-primitives
```

### Install individual packages

```bash
npm install @ryan-rn-primitives/accordion
npm install @ryan-rn-primitives/dialog
npm install @ryan-rn-primitives/tabs
# ... etc
```

## Usage

### Using the meta package

```tsx
import { Accordion, Dialog, Tabs } from '@ryan-rn-primitives';

function MyComponent() {
  return (
    <Accordion.Root type='single' collapsible>
      <Accordion.Item value='item-1'>
        <Accordion.Header>
          <Accordion.Trigger>
            <Text>Section 1</Text>
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <Text>Content 1</Text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
```

### Using individual packages

```tsx
import * as Accordion from '@ryan-rn-primitives/accordion';
import * as Dialog from '@ryan-rn-primitives/dialog';
import * as Tabs from '@ryan-rn-primitives/tabs';
```

## Available Primitives

| Package           | Description                                   |
| ----------------- | --------------------------------------------- |
| `accordion`       | Collapsible content sections                  |
| `alert-dialog`    | Modal dialog for alerts with required actions |
| `aspect-ratio`    | Maintain consistent width-to-height ratio     |
| `avatar`          | User profile image with fallback              |
| `checkbox`        | Toggle boolean state                          |
| `collapsible`     | Show/hide content                             |
| `context-menu`    | Right-click menu (web) / long-press menu      |
| `dialog`          | Modal overlay for content                     |
| `dropdown-menu`   | Menu triggered by a button                    |
| `hooks`           | Shared React hooks                            |
| `hover-card`      | Preview card on hover                         |
| `label`           | Accessible form labels                        |
| `menubar`         | Horizontal menu bar                           |
| `navigation-menu` | Site navigation component                     |
| `popover`         | Floating content panel                        |
| `portal`          | Render children outside parent DOM            |
| `progress`        | Progress indicator                            |
| `radio-group`     | Single choice from multiple options           |
| `select`          | Dropdown selection                            |
| `separator`       | Visual divider                                |
| `slider`          | Range input                                   |
| `slot`            | Component composition utility                 |
| `switch`          | Toggle on/off                                 |
| `table`           | Data table component                          |
| `tabs`            | Tabbed content                                |
| `toast`           | Notification messages                         |
| `toggle`          | Two-state button                              |
| `toggle-group`    | Group of toggle buttons                       |
| `toolbar`         | Grouping of action buttons                    |
| `tooltip`         | Hover/focus information                       |
| `types`           | Shared TypeScript types                       |
| `utils`           | Shared utilities                              |

## License

MIT
