import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { playwright } from '@vitest/browser-playwright';
import type { Plugin } from 'vite';

const angularPlugins = angular({ jit: true }) as Plugin[];

const browserSafePlugins = angularPlugins.filter(
  (p) =>
    !p.name?.startsWith('@analogjs/vitest-angular')
);

function stripInlineSourceMaps(): Plugin {
  return {
    name: 'strip-inline-sourcemaps',
    enforce: 'post',
    transform(code, _id) {
      const marker = '//# sourceMappingURL=data:application/json;base64,';
      const idx = code.lastIndexOf(marker);
      if (idx === -1) return null;

      const base64 = code.slice(idx + marker.length).trim();
      const cleanCode = code.slice(0, idx);
      try {
        const map = JSON.parse(Buffer.from(base64, 'base64').toString());
        return { code: cleanCode, map };
      } catch {
        return { code: cleanCode, map: null };
      }
    },
  };
}

export default defineConfig({
  plugins: [...browserSafePlugins, nxViteTsPaths(), stripInlineSourceMaps()],
  optimizeDeps: {
    include: ['tslib'],
  },
  test: {
    name: 'browser-tests',
    globals: true,
    include: ['tests/browser/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
