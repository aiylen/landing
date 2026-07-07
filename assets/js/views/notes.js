/* ============================================================
   views/notes.js
   ============================================================ */
window.Views = window.Views || {};

Views.notes = function(root){
  const d = Store.data;
  const sorted = [...d.notes].sort((a,b)=> (b.pinned - a.pinned));

  function noteCard(n){
    if (n.checklist){
      const done = n.items.filter(i=>i.done).length;
      return `
        <div class="note-card ${n.pinned?'pinned':''}" data-id="${n.id}">
          <button class="note-pin-btn ${n.pinned?'active':''}" data-pin="${n.id}">${Icons.pin}</button>
          <input type="text" class="note-title-input" data-id="${n.id}" value="${esc(n.title)}" style="border:none;background:transparent;padding:0;font-family:var(--font-display);font-weight:700;font-size:13.5px;">
          <div class="row-list">
            ${n.items.map((it,i)=>`
              <div class="check-row" style="padding:5px 8px;font-size:12px;" data-i="${i}">
                <input type="checkbox" class="note-item-check" data-note="${n.id}" data-i="${i}" ${it.done?'checked':''}>
                <span>${esc(it.text)}</span>
                <button class="row-del note-item-del" data-note="${n.id}" data-i="${i}">${Icons.trash}</button>
              </div>`).join('')}
          </div>
          <div class="add-row">
            <input type="text" class="note-item-new" data-note="${n.id}" placeholder="Add item" style="font-size:12px;">
            <button class="btn btn-ghost btn-sm note-item-add" data-note="${n.id}">${Icons.plus}</button>
          </div>
          <span class="badge" style="align-self:flex-start;">${done}/${n.items.length} checked</span>
          <button class="row-del note-del" data-id="${n.id}" style="align-self:flex-end;">${Icons.trash}</button>
        </div>`;
    }
    return `
      <div class="note-card ${n.pinned?'pinned':''}" data-id="${n.id}">
        <button class="note-pin-btn ${n.pinned?'active':''}" data-pin="${n.id}">${Icons.pin}</button>
        <input type="text" class="note-title-input" data-id="${n.id}" value="${esc(n.title)}" style="border:none;background:transparent;padding:0;font-family:var(--font-display);font-weight:700;font-size:13.5px;">
        <textarea class="note-body-input" data-id="${n.id}" style="min-height:80px;background:transparent;border:none;padding:0;font-size:12.5px;color:var(--text-dim);">${esc(n.content)}</textarea>
        <button class="row-del note-del" data-id="${n.id}" style="align-self:flex-end;">${Icons.trash}</button>
      </div>`;
  }

  root.innerHTML = `
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:14px;">
      <button class="btn btn-ghost btn-sm" id="addChecklistBtn">${Icons.plus}Checklist</button>
      <button class="btn btn-primary btn-sm" id="addNoteBtn">${Icons.plus}Note</button>
    </div>
    <div class="grid grid-3">
      ${sorted.map(noteCard).join('') || `<div class="empty-state">No notes yet — add one above.</div>`}
    </div>
  `;

  function persist(){ Store.save(); }
  function rerender(){ App.switchView('notes'); }

  document.getElementById('addNoteBtn').addEventListener('click', ()=>{
    d.notes.unshift({ id:uid(), title:'Untitled note', content:'', pinned:false, checklist:false, items:[] });
    persist(); rerender();
  });
  document.getElementById('addChecklistBtn').addEventListener('click', ()=>{
    d.notes.unshift({ id:uid(), title:'Untitled checklist', content:'', pinned:false, checklist:true, items:[] });
    persist(); rerender();
  });

  root.querySelectorAll('.note-pin-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const n = d.notes.find(n=>n.id===btn.dataset.pin);
      n.pinned = !n.pinned; persist(); rerender();
    });
  });
  root.querySelectorAll('.note-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      d.notes = d.notes.filter(n=>n.id!==btn.dataset.id); persist(); rerender();
    });
  });
  root.querySelectorAll('.note-title-input').forEach(inp=>{
    inp.addEventListener('input', ()=>{ d.notes.find(n=>n.id===inp.dataset.id).title = inp.value; persist(); });
  });
  root.querySelectorAll('.note-body-input').forEach(ta=>{
    ta.addEventListener('input', ()=>{ d.notes.find(n=>n.id===ta.dataset.id).content = ta.value; persist(); });
  });

  root.querySelectorAll('.note-item-check').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const n = d.notes.find(n=>n.id===cb.dataset.note);
      n.items[+cb.dataset.i].done = cb.checked; persist(); rerender();
    });
  });
  root.querySelectorAll('.note-item-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const n = d.notes.find(n=>n.id===btn.dataset.note);
      n.items.splice(+btn.dataset.i, 1); persist(); rerender();
    });
  });
  root.querySelectorAll('.note-item-add').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const inp = root.querySelector(`.note-item-new[data-note="${btn.dataset.note}"]`);
      if (!inp.value.trim()) return;
      const n = d.notes.find(n=>n.id===btn.dataset.note);
      n.items.push({ text: inp.value.trim(), done:false });
      persist(); rerender();
    });
  });
};
