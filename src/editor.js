// editor.js
// - CDN 経由で Monaco を読み込み、指定したコンテナにエディタを初期化します
// - initEditor(container, onChange) をエクスポート。onChange は編集内容の文字列を受け取る

export function initEditor(container, onChange) {
  return new Promise((resolve, reject) => {
    if (!container) return reject(new Error('editor container is required'))

    // 既にロード済みなら直接初期化
    const loadMonaco = () => {
      // require が存在する前提で進める
      try {
        // eslint-disable-next-line no-undef
        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs' } })

        // Worker の設定（CDNから直接読み込むため data: スキームで作る）
        // eslint-disable-next-line no-undef
        window.MonacoEnvironment = {
          getWorkerUrl: function () {
            const base = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/';
            const workerSource = `self.MonacoEnvironment={baseUrl:'${base}'};importScripts('${base}vs/base/worker/workerMain.js');`;
            return 'data:text/javascript;charset=utf-8,' + encodeURIComponent(workerSource);
          }
        }

        // eslint-disable-next-line no-undef
        require(['vs/editor/editor.main'], function () {
          // eslint-disable-next-line no-undef
          const editor = monaco.editor.create(container, {
            value: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: system-ui, sans-serif; padding: 12px }
      .box { padding: 12px; background: #eef; border-radius:6px }
    </style>
  </head>
  <body>
    <h1>Hello</h1>
    <div class="box">Edit this HTML/CSS/JS and see the preview.</div>
    <script>
      // This script runs inside the sandboxed iframe
      console.log('preview script running')
    <\/script>
  </body>
</html>`,
            language: 'html',
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            theme: 'vs-dark'
          })

          const model = editor.getModel()
          // 初期値を通知
          onChange && onChange(model.getValue())

          // 変更イベント
          const disposable = editor.onDidChangeModelContent(() => {
            const val = model.getValue()
            onChange && onChange(val)
          })

          resolve({ editor, disposable })
        })
      } catch (err) {
        reject(err)
      }
    }

    // loader が未ロードなら CDN から読み込む
    if (typeof window.require === 'undefined' || typeof window.monaco === 'undefined') {
      const existing = document.querySelector('script[data-monaco-loader]')
      if (!existing) {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/loader.js'
        s.async = true
        s.setAttribute('data-monaco-loader', '1')
        s.onload = () => loadMonaco()
        s.onerror = (e) => reject(new Error('Failed to load Monaco loader: ' + e.message))
        document.head.appendChild(s)
      } else {
        existing.addEventListener('load', () => loadMonaco())
        existing.addEventListener('error', (e) => reject(new Error('Failed to load Monaco loader')))
      }
    } else {
      loadMonaco()
    }
  })
}
