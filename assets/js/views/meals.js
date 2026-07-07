/* ============================================================
   views/meals.js
   ============================================================ */
window.Views = window.Views || {};

Views.meals = function(root){
  const d = Store.data;
  const key = todayISO();
  if (!d.meals[key]) d.meals[key] = { breakfast:'', lunch:'', dinner:'', snacks:'' };
  const today = d.meals[key];
  const grocery = d.meals.grocery;
  const doneGrocery = grocery.filter(g=>g.done).length;

  const MEAL_ICONS = { breakfast:'🍳', lunch:'🍛', dinner:'🥗', snacks:'🥜' };

  root.innerHTML = `
    <div class="grid grid-4" style="margin-bottom:18px;">
      ${['breakfast','lunch','dinner','snacks'].map(meal=>`
        <div class="card">
          <div class="card-head"><h3 style="text-transform:capitalize;">${MEAL_ICONS[meal]} ${meal}</h3></div>
          <textarea class="meal-input" data-meal="${meal}" style="min-height:70px;" placeholder="What's for ${meal}?">${esc(today[meal])}</textarea>
        </div>
      `).join('')}
    </div>

    <div class="card">
      <div class="card-head"><h3>Grocery List</h3><span class="muted">${doneGrocery}/${grocery.length} picked up</span></div>
      <div class="pbar" style="margin-bottom:14px;"><span style="width:${grocery.length ? doneGrocery/grocery.length*100 : 0}%"></span></div>
      <div class="row-list" id="groceryList">
        ${grocery.map(g=>`
          <div class="check-row ${g.done?'done':''}" data-id="${g.id}">
            <input type="checkbox" class="grocery-check" ${g.done?'checked':''}>
            <span>${esc(g.text)}</span>
            <button class="row-del grocery-del">${Icons.trash}</button>
          </div>`).join('') || `<div class="empty-state">Grocery list is empty.</div>`}
      </div>
      <div class="add-row">
        <input type="text" id="newGrocery" placeholder="Add a grocery item">
        <button class="btn btn-primary btn-sm" id="addGroceryBtn">${Icons.plus}Add</button>
      </div>
    </div>
  `;

  function persist(){ Store.save(); }
  function rerender(){ App.switchView('meals'); }

  root.querySelectorAll('.meal-input').forEach(ta=>{
    ta.addEventListener('input', ()=>{ today[ta.dataset.meal] = ta.value; persist(); });
  });

  document.getElementById('addGroceryBtn').addEventListener('click', ()=>{
    const inp = document.getElementById('newGrocery');
    if (!inp.value.trim()) return;
    grocery.push({ id:uid(), text:inp.value.trim(), done:false });
    persist(); rerender();
  });
  root.querySelectorAll('.grocery-check').forEach(cb=>{
    cb.addEventListener('change', ()=>{
      const row = cb.closest('.check-row');
      grocery.find(g=>g.id===row.dataset.id).done = cb.checked;
      persist(); rerender();
    });
  });
  root.querySelectorAll('.grocery-del').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const row = btn.closest('.check-row');
      d.meals.grocery = grocery.filter(g=>g.id!==row.dataset.id);
      persist(); rerender();
    });
  });
};
