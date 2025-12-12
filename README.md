# RN Primitives

Universal Style agnostic and accessible react-native components

## Unstyled Nature

RN Primitives provides unstyled components, offering a high degree of customization freedom. By default, the components come without any predefined styles, allowing developers to seamlessly match their app's aesthetics.

## Accessibility

Accessibility is a significant focus within RN Primitives. We are dedicated to ensuring our components align with accessibility standards. Our ongoing efforts involve designing and testing components with appropriate labels, roles, and behaviors, aiming to provide an inclusive user experience.

### Getting started for contributors

1. Fork, clone, and install the dependencies with `pnpm`

```bash
pnpm i
```

2. Build and watch all of the primitive packages:

> This builds all of the primitive packages, it watches them for changes. This prevents the need to run the `build` command every time a primitive file is changed.

```bash
pnpm dev:primitives
```

3. Start the app of your choice:

```bash
# Start the Expo NativeWind app
pnpm dev:expo-nativewind
# Or start the Nextjs NativeWind app
pnpm dev:nextjs-nativewind
# Or the Documentation app
pnpm dev:docs
```

### Creating a new primitive

To quickly scaffold a new primitive with all necessary boilerplate:

```bash
pnpm create:primitive <primitive-name>
```

Example:

```bash
pnpm create:primitive button
```

This will automatically create:

- Package configuration (`package.json`, `tsconfig.json`, `tsup.config.ts`)
- Source files (`src/index.ts`, `src/types.ts`, `src/<primitive-name>.tsx`)
- Changelog (`CHANGELOG.md`)

After creating a new primitive:

1. Run `pnpm install` to install dependencies
2. Run `pnpm dev:primitives` to start development mode
3. Edit your component in `packages/<primitive-name>/src/<primitive-name>.tsx`

For more details, see [scripts/README.md](./scripts/README.md)

### Primitives

#### Core

- `accordion`
- `alert-dialog`
- `aspect-ratio`
- `avatar`
- `checkbox`
- `collapsible`
- `context-menu`
- `dialog`
- `dropdown-menu`
- `hover-card`
- `label`
- `menubar`
- `navigation-menu`
- `popover`
- `progress`
- `radio-group`
- `select`
- `separator`
- `slider`
- `switch`
- `table`
- `tabs`
- `toast`
- `toggle`
- `toggle-group`
- `toolbar`
- `tooltip`

#### Shared

- `hooks`
- `portal`
- `slot`
- `types`
- `utils`
