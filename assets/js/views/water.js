/* ============================================================
   views/water.js
   ============================================================ */
window.Views = window.Views || {};

Views.water = function(root){
  const d = Store.data;
  const key = todayISO();
  if (!d.water[key]) d.water[key] = { glasses:0, goal:8 };
  const w = d.water[key];
  const pct = Math.min(100, Math.round(w.glasses/w.goal*100));

  root.innerHTML = `
    <div class="grid grid-12">
      <div class="card span-4" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;">
        <div class="card-head" style="width:100%;"><h3>Today's Progress</h3></div>
        ${ringSVG(pct, 130, 12)}
        <p style="font-size:13px;color:var(--text-dim);">${w.glasses} of ${w.goal} glasses</p>
      </div>
      <div class="card span-8">
        <div class="card-head">
          <h3>Daily Water Glasses</h3>
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="margin:0;">Goal</label>
            <input type="number" id="waterGoal" value="${w.goal}" style="width:64px;">
          </div>
        </div>
        <div class="water-track">
          ${Array.from({length: Math.max(w.goal, w.glasses)}, (_, i)=>`
            <div class="glass ${i < w.glasses ? 'filled' : ''}" data-i="${i}" title="Glass ${i+1}"></div>
          `).join('')}
        </div>
        <div style="display:flex;gap:8px;margin-top:16px;">
          <button class="btn btn-ghost btn-sm" id="waterMinus">– Remove glass</button>
          <button class="btn btn-primary btn-sm" id="waterPlus">${Icons.plus}Add glass</button>
        </div>
      </div>
    </div>
  `;

  function persist(){ Store.save(); }
  function rerender(){ App.switchView('water'); App.refreshIfActive('dashboard'); }

  root.querySelectorAll('.glass').forEach(g=>{
    g.addEventListener('click', ()=>{
      const i = +g.dataset.i;
      w.glasses = i < w.glasses ? i : i + 1;
      persist(); rerender();
    });
  });
  document.getElementById('waterPlus').addEventListener('click', ()=>{ w.glasses++; persist(); rerender(); });
  document.getElementById('waterMinus').addEventListener('click', ()=>{ w.glasses = Math.max(0, w.glasses-1); persist(); rerender(); });
  document.getElementById('waterGoal').addEventListener('input', (e)=>{
    w.goal = Math.max(1, Number(e.target.value)||1); persist(); rerender();
  });
};
