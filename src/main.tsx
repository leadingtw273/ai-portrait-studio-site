import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/noto-sans-tc/400.css'
import '@fontsource/noto-sans-tc/600.css'
import '@fontsource/noto-sans-tc/700.css'
import './styles/globals.css'
import { App } from './App'
import { LanguageProvider } from './i18n/LanguageProvider'

const tree = (
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
)

/**
 * Mount the React app into the given container.
 *
 * - If container has children (Task 16 prerendered HTML), uses `hydrateRoot` to
 *   take over the existing DOM (preserves prerender content; React attaches event handlers).
 * - If container is empty (dev mode `localhost:5173`, or any future SPA shell case),
 *   uses `createRoot` to render from scratch.
 *
 * Exported for unit testing the branch logic without needing to mock window/document.
 */
export function mountApp(container: HTMLElement) {
  if (container.hasChildNodes()) {
    hydrateRoot(container, tree)
  } else {
    createRoot(container).render(tree)
  }
}

// Auto-mount in browser context
if (typeof document !== 'undefined') {
  const root = document.getElementById('root')
  if (root) mountApp(root)
}
