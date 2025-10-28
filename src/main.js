import './style.css'
import { initEditor } from './editor.js'
import { createPreview } from './preview.js'

// アプリのルートをシンプルな2カラムに置き換える
document.querySelector('#app').innerHTML = `
    <div id="cemt-root">
    <header class="app-header">
      <h1 class="title">Coding Enviroment for Mass Teaching(軽量版)</h1>
      <button id="chat-open-btn" class="chat-btn">AIに聞く</button>
    </header>
    <div class="split-root">
      <div class="pane">
        <div class="pane-header">エディター</div>
        <div id="editor" class="editor-root"></div>
      </div>
      <div class="pane preview">
        <div class="pane-header">プレビュー</div>
        <div id="preview" class="preview-content"></div>
      </div>
    </div>
  </div>
`

const editorContainer = document.getElementById('editor')
const previewContainer = document.getElementById('preview')

// プレビュー初期化
const updatePreview = createPreview(previewContainer)

// Monaco エディタ初期化。エディタの変更を受け取ってプレビューを更新する
initEditor(editorContainer, (value) => {
  // value は生の HTML としてプレビューに差し込む（必要ならサニタイズしてください）
  updatePreview(value)
}).catch(err => {
  console.error('Failed to initialize editor', err)
  previewContainer.textContent = 'エディタの初期化に失敗しました。コンソールを確認してください。'
})
