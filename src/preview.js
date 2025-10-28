// preview.js
// - createPreview(container) をエクスポートし、返り値は content を受け取る update 関数
// - DOMPurify を CDN から読み込み、<script>/<style> を許可しつつ属性のサニタイズ（on* や javascript:）を行う
// - プレビューは sandbox="allow-scripts" の iframe に srcdoc として流し込む（親から隔離）

function loadDOMPurify() {
  // Try dynamic ESM import first (more reliable for modern bundlers/environments),
  // fall back to inserting the UMD script if import is not allowed.
  return new Promise((resolve, reject) => {
    if (window.DOMPurify) return resolve(window.DOMPurify)

    const esmUrl = 'https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.es.js'
    // Try dynamic import
    try {
      import(esmUrl).then(mod => {
        const dp = mod.default || mod.DOMPurify || mod
        if (dp) {
          // attach to window for other code paths
          window.DOMPurify = dp
          setupHooks(dp)
          return resolve(dp)
        }
        // fallthrough to UMD loader
        loadUmd()
      }).catch(() => {
        loadUmd()
      })
    } catch (e) {
      // import() may throw in some environments; fallback
      loadUmd()
    }

    function loadUmd() {
      const existing = document.querySelector('script[data-dompurify]')
      if (existing) {
        existing.addEventListener('load', onLoaded)
        existing.addEventListener('error', () => reject(new Error('failed to load DOMPurify')))
        return
      }
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js'
      s.async = true
      s.setAttribute('data-dompurify', '1')
      s.onload = onLoaded
      s.onerror = () => reject(new Error('failed to load DOMPurify'))
      document.head.appendChild(s)

      function onLoaded() {
        const dp = window.DOMPurify
        if (!dp) return reject(new Error('DOMPurify loaded but not available on window'))
        try {
          setupHooks(dp)
        } catch (e) {
          // ignore hook setup errors
        }
        resolve(dp)
      }
    }

    function setupHooks(dp) {
      try {
        if (dp && dp.addHook) {
          dp.addHook('beforeSanitizeAttributes', function (node) {
            if (!node || !node.attributes) return
            for (let i = node.attributes.length - 1; i >= 0; i--) {
              const attr = node.attributes[i]
              if (!attr) continue
              const name = attr.name || ''
              const val = attr.value || ''
              if (/^on/i.test(name)) {
                node.removeAttribute(name)
                continue
              }
              if (/^href$|^src$/i.test(name) && /^\s*javascript:/i.test(val)) {
                node.removeAttribute(name)
                continue
              }
            }
          })
        }
      } catch (e) {
        // ignore
      }
    }
  })
}

export function createPreview(container) {
  if (!container) throw new Error('preview container is required')
  container.style.padding = '0'
  container.style.overflow = 'hidden'
  container.style.height = '100%'
  container.style.boxSizing = 'border-box'

  // iframe を作成して常に同じ要素を再利用する
  let iframe = container.querySelector('iframe.preview-iframe')
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.className = 'preview-iframe'
    iframe.setAttribute('sandbox', 'allow-scripts') // スクリプトは実行するが親ドキュメントとは隔離
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.border = '0'
    container.innerHTML = ''
    container.appendChild(iframe)
  }

  async function update(content) {
    if (!content) {
      iframe.srcdoc = '<div style="padding:12px;color:#888">No content</div>'
      return
    }

    try {
      const DOMPurify = await loadDOMPurify()
      let clean = DOMPurify.sanitize(content, {
        ADD_TAGS: ['script', 'style'],
        WHOLE_DOCUMENT: true
      })

      // DOMPurify may return a Document/Node in some modes; ensure string for srcdoc
      if (typeof clean !== 'string') {
        try {
          if (window.XMLSerializer && (clean instanceof Node || clean.nodeType)) {
            clean = new XMLSerializer().serializeToString(clean)
          } else {
            clean = String(clean)
          }
        } catch (serErr) {
          console.warn('Could not serialize sanitized output, falling back to String():', serErr)
          clean = String(clean)
        }
      }

      // iframe に流し込むことで、CSS/JS は分離されたコンテキストで動作します
      iframe.srcdoc = clean
    } catch (err) {
      const msg = 'Preview error: ' + (err && err.message ? err.message : String(err))
      iframe.srcdoc = `<div style="padding:12px;color:#c00">${msg}</div>`
      // 追加ログで原因追跡を容易にする
      console.error('preview update error', err)
    }
  }

  return update
}
