import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

const external = [
  ...Object.keys(packageJson.peerDependencies || {}),
  ...Object.keys(packageJson.dependencies || {}),
];

const baseConfig = {
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/*.test.ts', '**/*.test.tsx', '**/*.vue'],
    }),
  ],
  external: (id) => {
    // Don't bundle peer dependencies
    if (external.some((dep) => id === dep || id.startsWith(`${dep}/`))) {
      return true;
    }
    // Don't bundle node built-ins
    if (id.startsWith('node:')) {
      return true;
    }
    // Don't bundle Vue files (they need special handling)
    if (id.endsWith('.vue')) {
      return true;
    }
    return false;
  },
};

export default [
  // Main entry point - Build for multiple formats
  {
    ...baseConfig,
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: packageJson.browser,
        format: 'umd',
        name: 'Pay2NatureWidget',
        sourcemap: true,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          vue: 'Vue',
        },
      },
    ],
  },
  // React component
  {
    ...baseConfig,
    input: 'src/react/Pay2NatureWidget.tsx',
    output: [
      {
        file: 'dist/react/Pay2NatureWidget.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/react/Pay2NatureWidget.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
  },
  // jQuery plugin
  {
    ...baseConfig,
    input: 'src/jquery/index.ts',
    output: [
      {
        file: 'dist/jquery/pay2nature.jquery.cjs.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/jquery/pay2nature.jquery.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
  },
  // Generate TypeScript definitions
  {
    input: 'src/index.ts',
    output: {
      file: packageJson.types,
      format: 'es',
    },
    plugins: [dts()],
    external: [/\.css$/, /\.vue$/],
  },
  // Generate React component TypeScript definitions
  {
    input: 'src/react/Pay2NatureWidget.tsx',
    output: {
      file: 'dist/react/Pay2NatureWidget.d.ts',
      format: 'es',
    },
    plugins: [dts()],
    external: [/\.css$/, /\.vue$/],
  },
];

