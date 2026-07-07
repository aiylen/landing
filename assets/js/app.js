/* ============================================================
   app.js — shell, navigation, theming, shared UI helpers
   ============================================================ */

const Icons = {
  dashboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>',
  daily:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/></svg>',
  weekly:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M7 14h3M14 14h3M7 17h3M14 17h3"/></svg>',
  monthly:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><circle cx="8" cy="15" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="15" r="1.3" fill="currentColor" stroke="none"/><circle cx="16" cy="15" r="1.3" fill="currentColor" stroke="none"/></svg>',
  goals:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
  habits:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  finance:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  meals:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v8a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V2M15 12v10M7 2v20M4 6c0-2.5 1.5-4 3-4"/></svg>',
  water:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2s7 8.5 7 13a7 7 0 0 1-14 0c0-4.5 7-13 7-13Z"/></svg>',
  selfcare:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  notes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v13l-4 4H4V4Z"/><path d="M20 17h-4v4"/><path d="M8 9h8M8 13h5"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>',
  print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5M8 3h8l-1 6 3 3v2H6v-2l3-3-1-6Z"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>'
};

const NAV = [
  { group:'Overview', items:[ {id:'dashboard', label:'Dashboard', icon:'dashboard'} ] },
  { group:'Plan', items:[
    {id:'daily', label:'Daily Planner', icon:'daily'},
    {id:'weekly', label:'Weekly Planner', icon:'weekly'},
    {id:'monthly', label:'Monthly Planner', icon:'monthly'},
    {id:'goals', label:'Goal Planner', icon:'goals'}
  ]},
  { group:'Track', items:[
    {id:'habits', label:'Habit Tracker', icon:'habits'},
    {id:'finance', label:'Finance Tracker', icon:'finance'},
    {id:'meals', label:'Meal Planner', icon:'meals'},
    {id:'water', label:'Water Tracker', icon:'water'},
    {id:'selfcare', label:'Self-Care', icon:'selfcare'}
  ]},
  { group:'Capture', items:[ {id:'notes', label:'Notes', icon:'notes'} ] }
];

const VIEW_META = {
  dashboard:{title:'Dashboard', sub:'Your day at a glance'},
  daily:{title:'Daily Planner', sub:'Plan today with intention'},
  weekly:{title:'Weekly Planner', sub:'Monday through Sunday'},
  monthly:{title:'Monthly Planner', sub:'Zoom out and see the month'},
  goals:{title:'Goal Planner', sub:'Turn big goals into small steps'},
  habits:{title:'Habit Tracker', sub:'Consistency compounds'},
  finance:{title:'Finance Tracker', sub:'Know where every rupee goes'},
  meals:{title:'Meal Planner', sub:'Plan meals, skip the 6pm panic'},
  water:{title:'Water Tracker', sub:'Stay on top of hydration'},
  selfcare:{title:'Self-Care Planner', sub:'Physical, mental, emotional, spiritual'},
  notes:{title:'Notes', sub:'Quick thoughts and checklists'}
};

const App = {
  currentView:'dashboard',
  prefs:null,

  init(){
    Store.load();
    this.prefs = Store.loadPrefs();
    document.documentElement.setAttribute('data-theme', this.prefs.color);
    document.documentElement.setAttribute('data-mode', this.prefs.mode);

    this.renderSidebar();
    this.renderProfile();
    this.bindTopbar();
    this.bindSidebarToggle();
    this.switchView('dashboard');
    this.tickClock();
    setInterval(()=>this.tickClock(), 30000);
  },

  renderProfile(){
    const profile = Store.loadProfile();
    const name = profile.name || 'You';
    document.getElementById('userName').textContent = name;
    document.getElementById('userSub').textContent = profile.sub || '';
    document.getElementById('userAvatar').textContent = name.trim().charAt(0).toUpperCase() || 'Y';
  },

  renderSidebar(){
    const nav = document.getElementById('nav');
    nav.innerHTML = NAV.map(group => `
      <div class="nav-group-label">${group.group}</div>
      ${group.items.map(item => `
        <button class="nav-item" data-view="${item.id}" title="${item.label}">
          ${Icons[item.icon]}<span>${item.label}</span>
        </button>
      `).join('')}
    `).join('');

    nav.querySelectorAll('.nav-item').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        this.switchView(btn.dataset.view);
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarScrim').classList.remove('show');
      });
    });
  },

  switchView(id){
    this.currentView = id;
    document.querySelectorAll('.nav-item').forEach(b=> b.classList.toggle('active', b.dataset.view===id));
    const meta = VIEW_META[id];
    document.getElementById('viewTitle').textContent = meta.title;
    document.getElementById('viewSub').textContent = meta.sub;
    const root = document.getElementById('viewRoot');
    root.innerHTML = '';
    root.classList.remove('view');
    void root.offsetWidth;
    root.classList.add('view');
    if (Views[id]) Views[id](root);
  },

  refreshIfActive(id){
    if (this.currentView === id) this.switchView(id);
  },

  bindTopbar(){
    document.querySelectorAll('.theme-dot').forEach(dot=>{
      dot.classList.toggle('active', dot.dataset.c === this.prefs.color);
      dot.addEventListener('click', ()=>{
        this.prefs.color = dot.dataset.c;
        document.documentElement.setAttribute('data-theme', this.prefs.color);
        document.querySelectorAll('.theme-dot').forEach(d=>d.classList.toggle('active', d===dot));
        Store.savePrefs(this.prefs);
      });
    });

    const modeBtn = document.getElementById('modeToggle');
    this.setModeIcon(modeBtn);
    modeBtn.addEventListener('click', ()=>{
      this.prefs.mode = this.prefs.mode === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-mode', this.prefs.mode);
      Store.savePrefs(this.prefs);
      this.setModeIcon(modeBtn);
    });

    document.getElementById('printBtn').addEventListener('click', ()=> window.print());

    document.getElementById('searchInput').addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll('.nav-item').forEach(btn=>{
        const label = btn.querySelector('span').textContent.toLowerCase();
        btn.style.display = !q || label.includes(q) ? '' : 'none';
      });
    });

    document.getElementById('resetBtn').addEventListener('click', ()=>{
      Modal.confirm('Clear all data & start fresh?', 'This removes the demo content — and anything you&rsquo;ve added — so you can start with a clean planner. This can&rsquo;t be undone.', ()=>{
        Modal.promptText('What should we call you?', 'This name shows up on your dashboard instead of the demo account.', 'Your name', (name)=>{
          Store.reset();
          Store.saveProfile({ name: name || 'You', sub: 'Your planner' });
          this.renderProfile();
          this.switchView(this.currentView);
          Toast.show('All clear — start adding your own data');
        });
      });
    });
  },

  setModeIcon(btn){
    btn.innerHTML = this.prefs.mode === 'dark' ? Icons.sun : Icons.moon;
  },

  bindSidebarToggle(){
    document.getElementById('menuToggle').addEventListener('click', ()=>{
      document.getElementById('sidebar').classList.add('open');
      document.getElementById('sidebarScrim').classList.add('show');
    });
    document.getElementById('sidebarScrim').addEventListener('click', ()=>{
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarScrim').classList.remove('show');
    });
  },

  tickClock(){
    const el = document.getElementById('clock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' });
  }
};

/* ---------------- Shared UI helpers ---------------- */
const Toast = {
  show(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(this._timer);
    this._timer = setTimeout(()=> t.classList.remove('show'), 2200);
  }
};

const Modal = {
  confirm(title, body, onConfirm){
    const backdrop = document.getElementById('modalBackdrop');
    backdrop.innerHTML = `
      <div class="modal">
        <h3>${title}</h3>
        <p style="font-size:13px;color:var(--text-dim);line-height:1.5;">${body}</p>
        <div class="modal-actions">
          <button class="btn btn-ghost" id="modalCancel">Cancel</button>
          <button class="btn btn-danger" id="modalOk">Confirm</button>
        </div>
      </div>`;
    backdrop.classList.add('show');
    const close = ()=> backdrop.classList.remove('show');
    document.getElementById('modalCancel').onclick = close;
    document.getElementById('modalOk').onclick = ()=>{ close(); onConfirm(); };
    backdrop.onclick = (e)=>{ if (e.target === backdrop) close(); };
  },

  promptText(title, body, placeholder, onSubmit, defaultValue){
    const backdrop = document.getElementById('modalBackdrop');
    backdrop.innerHTML = `
      <div class="modal">
        <h3>${title}</h3>
        <p style="font-size:13px;color:var(--text-dim);line-height:1.5;margin-bottom:14px;">${body}</p>
        <input type="text" id="modalInput" placeholder="${esc(placeholder || '')}" value="${esc(defaultValue || '')}" autocomplete="off">
        <div class="modal-actions">
          <button class="btn btn-ghost" id="modalCancel">Cancel</button>
          <button class="btn btn-primary" id="modalOk">Save &amp; continue</button>
        </div>
      </div>`;
    backdrop.classList.add('show');
    const input = document.getElementById('modalInput');
    setTimeout(()=> input.focus(), 50);
    const close = ()=> backdrop.classList.remove('show');
    const submit = ()=>{ const val = input.value.trim(); close(); onSubmit(val); };
    document.getElementById('modalCancel').onclick = close;
    document.getElementById('modalOk').onclick = submit;
    input.addEventListener('keydown', (e)=>{ if (e.key === 'Enter') submit(); });
    backdrop.onclick = (e)=>{ if (e.target === backdrop) close(); };
  }
};

function esc(str){
  return (str || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function fmtINR(n){
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}
function ringSVG(pct, size=64, stroke=8, id=''){
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, pct)) / 100) * c;
  return `
    <div class="ring" style="width:${size}px;height:${size}px;">
      <svg width="${size}" height="${size}">
        <circle class="ring-track" cx="${size/2}" cy="${size/2}" r="${r}"></circle>
        <circle class="ring-fill" cx="${size/2}" cy="${size/2}" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${off}"></circle>
      </svg>
      <span class="ring-label">${Math.round(pct)}%</span>
    </div>`;
}

document.addEventListener('DOMContentLoaded', ()=> App.init());
