export function showModal(content, buttons = []) {
  const existing = document.querySelector('.modal-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  const box = document.createElement('div');
  box.className = 'modal-box';
  
  // Крестик в правом верхнем углу
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '[X]';
  closeBtn.className = 'modal-close-btn';
  closeBtn.onclick = () => overlay.remove();
  
  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = content;
  contentDiv.style.marginTop = '0.5rem';
  
  const actionsDiv = document.createElement('div');
  actionsDiv.style.marginTop = '1.5rem';
  
  buttons.forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn.text;
    if (btn.class) button.className = btn.class;
    button.onclick = () => {
      if (btn.callback) btn.callback();
      overlay.remove();
    };
    actionsDiv.appendChild(button);
  });
  
  box.appendChild(closeBtn);
  box.appendChild(contentDiv);
  box.appendChild(actionsDiv);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}