(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const t of e.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&o(t)}).observe(document,{childList:!0,subtree:!0});function d(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerPolicy&&(e.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?e.credentials="include":n.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function o(n){if(n.ep)return;n.ep=!0;const e=d(n);fetch(n.href,e)}})();function p(i,r){return new Promise((d,o)=>{if(!i)return o(new Error("editor container is required"));const n=()=>{try{require.config({paths:{vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs"}}),window.MonacoEnvironment={getWorkerUrl:function(){const e="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/",t=`self.MonacoEnvironment={baseUrl:'${e}'};importScripts('${e}vs/base/worker/workerMain.js');`;return"data:text/javascript;charset=utf-8,"+encodeURIComponent(t)}},require(["vs/editor/editor.main"],function(){const e=monaco.editor.create(i,{value:`<!doctype html>
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
</html>`,language:"html",automaticLayout:!0,minimap:{enabled:!1},scrollBeyondLastLine:!1,theme:"vs-dark"}),t=e.getModel();r&&r(t.getValue());const a=e.onDidChangeModelContent(()=>{const s=t.getValue();r&&r(s)});d({editor:e,disposable:a})})}catch(e){o(e)}};if(typeof window.require>"u"||typeof window.monaco>"u"){const e=document.querySelector("script[data-monaco-loader]");if(e)e.addEventListener("load",()=>n()),e.addEventListener("error",t=>o(new Error("Failed to load Monaco loader")));else{const t=document.createElement("script");t.src="https://cdn.jsdelivr.net/npm/monaco-editor@0.47.0/min/vs/loader.js",t.async=!0,t.setAttribute("data-monaco-loader","1"),t.onload=()=>n(),t.onerror=a=>o(new Error("Failed to load Monaco loader: "+a.message)),document.head.appendChild(t)}}else n()})}function m(){return new Promise((i,r)=>{if(window.DOMPurify)return i(window.DOMPurify);const d="https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.es.js";try{import(d).then(e=>{const t=e.default||e.DOMPurify||e;if(t)return window.DOMPurify=t,n(t),i(t);o()}).catch(()=>{o()})}catch{o()}function o(){const e=document.querySelector("script[data-dompurify]");if(e){e.addEventListener("load",a),e.addEventListener("error",()=>r(new Error("failed to load DOMPurify")));return}const t=document.createElement("script");t.src="https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js",t.async=!0,t.setAttribute("data-dompurify","1"),t.onload=a,t.onerror=()=>r(new Error("failed to load DOMPurify")),document.head.appendChild(t);function a(){const s=window.DOMPurify;if(!s)return r(new Error("DOMPurify loaded but not available on window"));try{n(s)}catch{}i(s)}}function n(e){try{e&&e.addHook&&e.addHook("beforeSanitizeAttributes",function(t){if(!(!t||!t.attributes))for(let a=t.attributes.length-1;a>=0;a--){const s=t.attributes[a];if(!s)continue;const c=s.name||"",u=s.value||"";if(/^on/i.test(c)){t.removeAttribute(c);continue}if(/^href$|^src$/i.test(c)&&/^\s*javascript:/i.test(u)){t.removeAttribute(c);continue}}})}catch{}}})}function f(i){if(!i)throw new Error("preview container is required");i.style.padding="0",i.style.overflow="hidden",i.style.height="100%",i.style.boxSizing="border-box";let r=i.querySelector("iframe.preview-iframe");r||(r=document.createElement("iframe"),r.className="preview-iframe",r.setAttribute("sandbox","allow-scripts"),r.style.width="100%",r.style.height="100%",r.style.border="0",i.innerHTML="",i.appendChild(r));async function d(o){if(!o){r.srcdoc='<div style="padding:12px;color:#888">No content</div>';return}try{let e=(await m()).sanitize(o,{ADD_TAGS:["script","style"],WHOLE_DOCUMENT:!0});if(typeof e!="string")try{window.XMLSerializer&&(e instanceof Node||e.nodeType)?e=new XMLSerializer().serializeToString(e):e=String(e)}catch(t){console.warn("Could not serialize sanitized output, falling back to String():",t),e=String(e)}r.srcdoc=e}catch(n){const e="Preview error: "+(n&&n.message?n.message:String(n));r.srcdoc=`<div style="padding:12px;color:#c00">${e}</div>`,console.error("preview update error",n)}}return d}document.querySelector("#app").innerHTML=`
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
`;const h=document.getElementById("editor"),l=document.getElementById("preview"),y=f(l);p(h,i=>{y(i)}).catch(i=>{console.error("Failed to initialize editor",i),l.textContent="エディタの初期化に失敗しました。コンソールを確認してください。"});const b="https://udify.app/chatbot/iVMkwl5mpQPQynim";function v(){const i=`
  /* Modal styles injected by chat.js */
  .chat-modal.hidden { display:none; }
  .chat-modal { position:fixed; inset:0; z-index:10000; display:flex; align-items:center; justify-content:center; }
  .chat-modal-backdrop { position:absolute; inset:0; background:rgba(0,0,0,0.45); }
  .chat-modal-panel { position:relative; width:min(96vw,1000px); height:min(90vh,900px); background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.3); }
  .chat-panel-header { display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#f7f7f7; border-bottom:1px solid #eee; }
  /* Add bottom padding inside the panel so the chat input area in the iframe has visual breathing room */
  .chat-panel-body { padding:0 0 28px 0; box-sizing:border-box; height:calc(100% - 44px); }
  /* Ensure iframe leaves space for the padding; use !important to override inline heights */
  .chat-panel-body iframe { border:0; width:100%; height:calc(100% - 28px) !important; }
  .chat-close-btn { background:transparent; border:0; font-size:18px; cursor:pointer; }
  `,r=document.createElement("style");r.setAttribute("data-generated-by","chat.js"),r.textContent=i,document.head.appendChild(r)}function g(){const i=document.createElement("div");i.id="chat-modal",i.className="chat-modal hidden",i.setAttribute("aria-hidden","true");const r=document.createElement("div");r.className="chat-modal-backdrop",r.id="chat-backdrop";const d=document.createElement("div");d.className="chat-modal-panel",d.setAttribute("role","dialog"),d.setAttribute("aria-modal","true"),d.setAttribute("aria-label","チャットウィンドウ");const o=document.createElement("div");o.className="chat-panel-header";const n=document.createElement("span");n.textContent="チャット";const e=document.createElement("button");e.className="chat-close-btn",e.id="chat-close-btn",e.setAttribute("aria-label","閉じる"),e.textContent="✕",o.appendChild(n),o.appendChild(e);const t=document.createElement("div");t.className="chat-panel-body";const a=document.createElement("iframe");a.src=b,a.style.width="100%",a.style.height="100%",a.style.minHeight="700px",a.setAttribute("frameborder","0"),a.setAttribute("allow","microphone"),t.appendChild(a),d.appendChild(o),d.appendChild(t),i.appendChild(r),i.appendChild(d),document.body.appendChild(i);function s(){i.classList.add("hidden"),i.setAttribute("aria-hidden","true")}return r.addEventListener("click",s),e.addEventListener("click",s),document.addEventListener("keydown",c=>{c.key==="Escape"&&s()}),i}document.addEventListener("DOMContentLoaded",()=>{v();const i=document.getElementById("chat-open-btn");if(!i)return;let r=null;function d(){r||(r=g()),r.classList.remove("hidden"),r.setAttribute("aria-hidden","false")}i.addEventListener("click",d)});
