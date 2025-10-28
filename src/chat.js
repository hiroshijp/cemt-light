// chat.js
// Adds behavior for opening a modal containing the udify iframe when the button is clicked.

const IFRAME_SRC = 'https://udify.app/chatbot/iVMkwl5mpQPQynim';

function createStyles() {
  const css = `
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
  `;
  const style = document.createElement('style');
  style.setAttribute('data-generated-by','chat.js');
  style.textContent = css;
  document.head.appendChild(style);
}

function createModal() {
  const modal = document.createElement('div');
  modal.id = 'chat-modal';
  modal.className = 'chat-modal hidden';
  modal.setAttribute('aria-hidden','true');

  const backdrop = document.createElement('div');
  backdrop.className = 'chat-modal-backdrop';
  backdrop.id = 'chat-backdrop';

  const panel = document.createElement('div');
  panel.className = 'chat-modal-panel';
  panel.setAttribute('role','dialog');
  panel.setAttribute('aria-modal','true');
  panel.setAttribute('aria-label','チャットウィンドウ');

  const header = document.createElement('div');
  header.className = 'chat-panel-header';
  const title = document.createElement('span');
  title.textContent = 'チャット';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'chat-close-btn';
  closeBtn.id = 'chat-close-btn';
  closeBtn.setAttribute('aria-label','閉じる');
  closeBtn.textContent = '✕';
  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'chat-panel-body';

  // create iframe lazily on open to avoid loading until needed
  const iframe = document.createElement('iframe');
  iframe.src = IFRAME_SRC;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.minHeight = '700px';
  iframe.setAttribute('frameborder','0');
  iframe.setAttribute('allow','microphone');

  body.appendChild(iframe);
  panel.appendChild(header);
  panel.appendChild(body);
  modal.appendChild(backdrop);
  modal.appendChild(panel);
  document.body.appendChild(modal);

  // close handlers
  function close() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden','true');
  }
  backdrop.addEventListener('click', close);
  closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  return modal;
}

document.addEventListener('DOMContentLoaded', () => {
  // inject styles for modal
  createStyles();

  const openBtn = document.getElementById('chat-open-btn');
  if (!openBtn) {
    // nothing to attach
    return;
  }

  let modal = null;
  function open() {
    if (!modal) modal = createModal();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden','false');
  }

  openBtn.addEventListener('click', open);
});
