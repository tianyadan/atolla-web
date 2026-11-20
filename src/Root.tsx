import { Suspense, lazy } from 'react'
import App from './App'
import { isDocsPath, usePathname } from './router'

const DocsPage = lazy(() => import('./docs/DocsPage'))

/** 根据路径在官网首页与文档页之间切换 */
export default function Root() {
  const path = usePathname()
  if (isDocsPath(path)) {
    return (
      <Suspense fallback={<div className="docs-loading" />}>
        <DocsPage />
      </Suspense>
    )
  }
  return <App />
}
