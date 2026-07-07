/* ============================================================
   views/selfcare.js
   ============================================================ */
window.Views = window.Views || {};

Views.selfcare = function(root){
  const d = Store.data;
  const key = todayISO();
  if (!d.selfcare[key]) d.selfcare[key] = { physical:[], mental:[], emotional:[], spiritual:[] };
  const sc = d.selfcare[key];

  const CATS = [
    { id:'physical', label:'Physical', emoji:'🏃' },
    { id:'mental', label:'Mental', emoji:'🧠' },
    { id:'emotional', label:'Emotional', emoji:'💛' },
    { id:'spiritual', label:'Spiritual', emoji:'🕊️' }
  ];

  function pct(cat){
    const items = sc[cat] || [];
    return items.length ? Math.round(items.filter(i=>i.done).length/items.length*100) : 0;
  }

  root.innerHTML = `
    <div class="grid grid-4" style="margin-bottom:18px;">
      ${CATS.map(c=>`
        <div class="card" style="text-align:center;">
          <div style="font-size:22px;margin-bottom:6px;">${c.emoji}</div>
          <div style="font-weight:700;font-size:13px;margin-bottom:10px;">${c.label}</div>
          <div style="display:flex;justify-content:center;">${ringSVG(pct(c.id), 66, 6)}</div>
        </div>
      `).join('')}
    </div>

    <div class="grid grid-4">
      ${CATS.map(c=>`
        <div class="card">
          <div class="card-head"><h3>${c.emoji} ${c.label}</h3></div>
          <div class="row-list" data-cat="${c.id}">
            ${(sc[c.id]||[]).map((item,i)=>`
              <div class="check-row ${item.done?'done':''}" data-i="${i}">
                <input type="checkbox" class="sc-check" data-cat="${c.id}" data-i="${i}" ${item.done?'checked':''}>
                <span>${esc(item.text)}</span>
                <button class="row-del sc-del" data-cat="${c.id}" data-i="${i}">${Icons.trash}</button>
              </div>`).join('') || `<div class="empty-state">Nothing here yet.</div>`}
          </div>
          <div class="add-row">
            <input type="text" class="sc-new" data-cat="${c.id}" placeholder="Add ${c.label.toLowerCase()} care">
            <button class="btn btn-ghost btn-sm sc-add" data-cat="${c.id}">${Icons.plus}</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  function persist(){ Store.save(); }
  function rerender(){ App.switchView('selfcare'); }

  root.querySelectorAll('.sc-check').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      sc[cb.dataset.cat][+cb.dataset.i].done = cb.checked;
      persist(); rerender();
    });
  });
  root.querySelectorAll('.sc-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      sc[btn.dataset.cat].splice(+btn.dataset.i, 1);
      persist(); rerender();
    });
  });
  root.querySelectorAll('.sc-add').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const inp = root.querySelector(`.sc-new[data-cat="${btn.dataset.cat}"]`);
      if (!inp.value.trim()) return;
      sc[btn.dataset.cat] = sc[btn.dataset.cat] || [];
      sc[btn.dataset.cat].push({ text: inp.value.trim(), done:false });
      persist(); rerender();
    });
  });
};
