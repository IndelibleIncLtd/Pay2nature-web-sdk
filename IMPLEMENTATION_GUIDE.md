# Pay2Nature SDK Implementation Guide

This comprehensive guide explains how to build an npm SDK that works across multiple frameworks.

## Architecture Overview

The SDK is built with a **layered architecture**:

1. **Core Layer** (`src/core/`): Framework-agnostic widget implementation
2. **Framework Wrappers** (`src/react/`, `src/vue/`, `src/jquery/`): Framework-specific adapters
3. **Build System**: Rollup for bundling multiple module formats

## Key Design Decisions

### 1. Multiple Module Formats

Why? Different frameworks and build tools expect different formats:

- **CommonJS (CJS)**: Node.js, older bundlers (Webpack 4)
- **ES Modules (ESM)**: Modern bundlers (Vite, Webpack 5, Rollup)
- **UMD**: Browser script tags, CDN usage

### 2. Shadow DOM

The widget uses Shadow DOM for:
- **Style Isolation**: Widget styles don't conflict with host page
- **Encapsulation**: Internal structure is hidden
- **Security**: Prevents external CSS from breaking the widget

### 3. Framework Wrappers

Each framework needs a wrapper because:
- **React**: Needs hooks (useEffect, useRef) for lifecycle
- **Vue**: Needs Composition API and SFC support
- **jQuery**: Needs plugin pattern
- **Vanilla JS**: Uses core class directly

## Step-by-Step Implementation

### Step 1: Core Widget Class

The core class (`Pay2NatureWidget`) is framework-agnostic:

```typescript
export class Pay2NatureWidget {
  constructor(options: Pay2NatureWidgetOptions) {
    // Initialize widget
  }
  
  // Public API methods
  destroy(): void
  updateConfig(config: Partial<WidgetConfig>): void
}
```

**Key Features:**
- No framework dependencies
- Uses native DOM APIs
- Shadow DOM for isolation
- Event-driven architecture

### Step 2: React Wrapper

React wrapper uses hooks for lifecycle management:

```typescript
export const Pay2NatureWidgetComponent: React.FC<Props> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetInstanceRef = useRef<Pay2NatureWidget | null>(null);

  useEffect(() => {
    // Initialize widget
    widgetInstanceRef.current = new Pay2NatureWidget({
      container: containerRef.current,
      ...props
    });

    return () => {
      // Cleanup
      widgetInstanceRef.current?.destroy();
    };
  }, [props.widgetToken, props.baseUrl]);

  return <div ref={containerRef} />;
};
```

**Why this approach:**
- `useRef` provides stable DOM reference
- `useEffect` handles initialization/cleanup
- Props changes trigger re-initialization

### Step 3: Vue Wrapper

Vue wrapper uses Composition API:

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const containerRef = ref<HTMLElement | null>(null);
let widgetInstance: Pay2NatureWidget | null = null;

onMounted(() => {
  widgetInstance = new Pay2NatureWidget({
    container: containerRef.value,
    // ... props
  });
});

onBeforeUnmount(() => {
  widgetInstance?.destroy();
});
</script>
```

**Why this approach:**
- Composition API is modern and flexible
- Works with both Vue 2 and Vue 3
- Template refs provide DOM access

### Step 4: jQuery Plugin

jQuery plugin follows jQuery plugin pattern:

```typescript
$.fn.pay2nature = function(options) {
  return this.each(function() {
    const instance = new Pay2NatureWidget({
      container: this,
      ...options
    });
    $(this).data('pay2nature', instance);
  });
};
```

**Why this approach:**
- Follows jQuery conventions
- Supports method calls (`$('#widget').pay2nature('destroy')`)
- Stores instance in jQuery data

### Step 5: Build Configuration

Rollup config generates multiple formats:

```javascript
export default [
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/index.cjs.js', format: 'cjs' },
      { file: 'dist/index.esm.js', format: 'esm' },
      { file: 'dist/index.umd.js', format: 'umd' }
    ]
  }
];
```

**Why Rollup:**
- Tree-shaking support
- Multiple output formats
- TypeScript support
- Small bundle size

## Framework-Specific Considerations

### React

**Next.js App Router:**
```tsx
'use client'; // Required for client components

import { Pay2NatureWidgetComponent } from '@pay2nature/widget-sdk';

export default function Page() {
  return <Pay2NatureWidgetComponent {...props} />;
}
```

**Next.js Pages Router:**
```tsx
// No 'use client' needed
import { Pay2NatureWidgetComponent } from '@pay2nature/widget-sdk';
```

**Server-Side Rendering:**
- Widget requires browser APIs (DOM, fetch)
- Use dynamic import with `ssr: false`:
```tsx
import dynamic from 'next/dynamic';

const Pay2NatureWidget = dynamic(
  () => import('@pay2nature/widget-sdk').then(mod => mod.Pay2NatureWidgetComponent),
  { ssr: false }
);
```

### Vue.js

**Vue 2:**
```javascript
// Requires @vue/composition-api plugin
import { createApp } from 'vue';
import Pay2NatureWidget from '@pay2nature/widget-sdk/vue/Pay2NatureWidget.vue';
```

**Vue 3:**
```javascript
// Native support
import { createApp } from 'vue';
import Pay2NatureWidget from '@pay2nature/widget-sdk/vue/Pay2NatureWidget.vue';
```

**Nuxt.js:**
```vue
<template>
  <ClientOnly>
    <Pay2NatureWidget :widget-token="token" :base-url="baseUrl" />
  </ClientOnly>
</template>
```

### jQuery

**CDN Usage:**
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://unpkg.com/@pay2nature/widget-sdk/dist/index.umd.js"></script>
<script>
  $('#widget').pay2nature({
    widgetToken: 'token',
    baseUrl: 'https://api.pay2nature.com'
  });
</script>
```

**Module Bundler:**
```javascript
import $ from 'jquery';
import '@pay2nature/widget-sdk/jquery';
```

## Testing Strategy

### Unit Tests
- Test core widget class in isolation
- Mock DOM APIs
- Test error handling

### Integration Tests
- Test with each framework
- Test in different browsers
- Test SSR scenarios

### E2E Tests
- Test full payment flow
- Test mobile money flow
- Test error scenarios

## Publishing Checklist

Before publishing to npm:

- [ ] Update version in `package.json`
- [ ] Run `npm run build` successfully
- [ ] Test in all target frameworks
- [ ] Update README with examples
- [ ] Add CHANGELOG entry
- [ ] Run `npm pack --dry-run` to verify files
- [ ] Test installation: `npm install ./pay2nature-sdk-1.0.0.tgz`
- [ ] Publish: `npm publish --access public`

## Common Issues and Solutions

### Issue: Module not found in Next.js

**Solution:** Ensure proper exports in package.json:
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  }
}
```

### Issue: Styles not loading

**Solution:** Widget uses Shadow DOM, styles are encapsulated. No external CSS needed.

### Issue: jQuery plugin not working

**Solution:** Ensure jQuery is loaded before the SDK:
```html
<script src="jquery.js"></script>
<script src="widget-sdk.js"></script>
```

### Issue: TypeScript errors in Vue

**Solution:** Ensure Vue SFC compiler is configured in your build tool.

## Performance Considerations

1. **Bundle Size**: Keep dependencies minimal
2. **Lazy Loading**: Widget loads config on init (async)
3. **Shadow DOM**: Minimal performance impact
4. **Event Delegation**: Efficient event handling

## Security Considerations

1. **XSS Prevention**: Shadow DOM provides isolation
2. **CSP Compliance**: No inline scripts/styles
3. **Token Security**: Widget token in options, not hardcoded
4. **HTTPS**: Always use HTTPS for API calls

## Future Enhancements

1. **React Native Support**: Create React Native wrapper
2. **Angular Support**: Create Angular directive
3. **Svelte Support**: Create Svelte component
4. **Web Components**: Native web component version
5. **TypeScript Strict Mode**: Enable strict type checking
6. **Internationalization**: Multi-language support

## Resources

- [Rollup Documentation](https://rollupjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Shadow DOM Spec](https://dom.spec.whatwg.org/#shadow-trees)

