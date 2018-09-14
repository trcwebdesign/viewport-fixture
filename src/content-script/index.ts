import { getOptions } from '../persist'

function createViewportMetaElement(viewport: MetaViewportProperties) {
  const meta = document.createElement('meta')
  meta.name = 'viewport'
  meta.content = Object.entries(viewport)
    .filter(([, value]) => !!value)
    .map(([key, value]) => `${ key }=${ value }`)
    .join(', ')
  return meta
}

document.addEventListener('DOMContentLoaded', async () => {
  document.head.appendChild(createViewportMetaElement(await getOptions()))
})
