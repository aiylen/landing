/* ============================================================
   storage.js — data layer for the Mini Planner
   Single source of truth, persisted to localStorage.
   ============================================================ */

const STORAGE_KEY = 'miniPlanner.data.v1';
const PREFS_KEY = 'miniPlanner.prefs.v1';
const PROFILE_KEY = 'miniPlanner.profile.v1';

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}
function monthKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const QUOTES = [
  "Small steps, every day, become big change.",
  "Discipline is choosing what you want most over what you want now.",
  "Progress, not perfection.",
  "You don't have to be extreme, just consistent.",
  "A goal without a plan is just a wish.",
  "Do something today your future self will thank you for.",
  "Focus on the next right step, not the whole staircase."
];

function buildDemoData() {
  const mk = monthKey();
  const today = new Date().getDate();
  const grid = {};
  // Build a pattern relative to today: strong recent streaks, some gaps earlier for chart variety
  const patterns = {
    Reading: (day) => { const diff = today - day; if (diff < 0) return false; if (diff <= 5) return true; return diff % 4 !== 0; },
    Water: (day) => { const diff = today - day; if (diff < 0) return false; if (diff <= 8) return true; return diff % 3 !== 0; },
    Meditation: (day) => { const diff = today - day; if (diff < 0) return false; if (diff <= 2) return true; return diff % 3 === 0; }
  };
  Object.keys(patterns).forEach(h => {
    grid[h] = {};
    for (let d = 1; d <= 28; d++) grid[h][d] = patterns[h](d);
  });

  return {
    meta: { seededAt: Date.now(), version: 1 },

    daily: {
      [todayISO()]: {
        priorities: ['Finish Project', 'Workout', 'Study 2 Hours'],
        todos: [
          { id: uid(), text: 'Reply to client emails', done: true },
          { id: uid(), text: 'Push latest commits', done: false },
          { id: uid(), text: '30-min walk', done: false }
        ],
        schedule: { 7: 'Morning routine', 9: 'Deep work block', 13: 'Lunch', 15: 'Meetings', 19: 'Workout', 21: 'Wind down' },
        dontForget: ['Take vitamins', 'Call mom', 'Backup files'],
        goal: 'Ship v1 of the planner dashboard',
        goalDone: false
      }
    },

    weekly: {
      current: {
        goals: ['Launch new landing page', 'Hit 4 workouts', 'Read 50 pages'],
        days: {
          Mon: ['Team sync', 'Design review'],
          Tue: ['Client call'],
          Wed: ['Gym', 'Grocery run'],
          Thu: ['Write report'],
          Fri: ['Wrap sprint', 'Plan next week'],
          Sat: ['Rest'],
          Sun: ['Meal prep']
        },
        tasks: [
          { id: uid(), text: 'Finish onboarding flow', done: false },
          { id: uid(), text: 'Reply to Etsy messages', done: true }
        ],
        notes: 'Focus week — fewer meetings, more deep work.'
      }
    },

    monthly: {
      [mk]: {
        focus: 'Consistency over intensity',
        importantDates: [
          { id: uid(), date: `${mk}-05`, label: "Mom's birthday" },
          { id: uid(), date: `${mk}-14`, label: 'Rent due' },
          { id: uid(), date: `${mk}-22`, label: 'Product launch' }
        ],
        notes: ''
      }
    },

    goals: [
      {
        id: uid(),
        title: 'Launch planner on Etsy',
        why: 'Build a second income stream from digital products.',
        steps: [
          { text: 'Finish core app', done: true },
          { text: 'Design landing page', done: false },
          { text: 'Create mockups', done: false },
          { text: 'Publish listing', done: false }
        ],
        deadline: `${mk}-28`,
        reward: 'New mechanical keyboard',
        progress: 25
      },
      {
        id: uid(),
        title: 'Run a 10K',
        why: 'Improve health and mental clarity.',
        steps: [
          { text: 'Run 3x per week', done: true },
          { text: 'Build up to 8K', done: true },
          { text: 'Register for race', done: false }
        ],
        deadline: `${mk}-30`,
        reward: 'New running shoes',
        progress: 60
      }
    ],

    habits: {
      list: ['Reading', 'Water', 'Meditation'],
      month: mk,
      grid
    },

    finance: {
      income: [
        { id: uid(), source: 'Salary', amount: 42000 },
        { id: uid(), source: 'Freelance', amount: 8000 }
      ],
      expenses: [
        { id: uid(), category: 'Rent', amount: 9500 },
        { id: uid(), category: 'Groceries', amount: 4200 },
        { id: uid(), category: 'Transport', amount: 1800 },
        { id: uid(), category: 'Subscriptions', amount: 1200 },
        { id: uid(), category: 'Other', amount: 1800 }
      ],
      savingsGoal: 40000,
      history: [
        { month: 'Feb', income: 47000, expense: 20000 },
        { month: 'Mar', income: 48500, expense: 19200 },
        { month: 'Apr', income: 46000, expense: 21500 },
        { month: 'May', income: 49000, expense: 18800 },
        { month: 'Jun', income: 50000, expense: 19000 },
        { month: 'Jul', income: 50000, expense: 18500 }
      ]
    },

    meals: {
      [todayISO()]: {
        breakfast: 'Oats + banana',
        lunch: 'Rice + chicken + salad',
        dinner: 'Vegetable soup',
        snacks: 'Almonds, green tea'
      },
      grocery: [
        { id: uid(), text: 'Oats', done: true },
        { id: uid(), text: 'Chicken breast', done: false },
        { id: uid(), text: 'Spinach', done: false },
        { id: uid(), text: 'Almonds', done: true }
      ]
    },

    water: {
      [todayISO()]: { glasses: 6, goal: 8 }
    },

    selfcare: {
      [todayISO()]: {
        physical: [{ text: '20-min walk', done: true }, { text: 'Stretch before bed', done: false }],
        mental: [{ text: 'Read 10 pages', done: true }, { text: 'No phone first 30 min', done: false }],
        emotional: [{ text: 'Journal 3 lines', done: false }],
        spiritual: [{ text: '5-min quiet reflection', done: true }]
      }
    },

    notes: [
      { id: uid(), title: 'Etsy listing ideas', content: 'Bundle with a bonus budgeting PDF. Highlight dark mode + themes.', pinned: true, checklist: false, items: [] },
      { id: uid(), title: 'Packing checklist', content: '', pinned: false, checklist: true, items: [{ text: 'Charger', done: true }, { text: 'Passport', done: false }] }
    ]
  };
}

function buildEmptyData() {
  return {
    meta: { seededAt: Date.now(), version: 1, blank: true },
    daily: {},
    weekly: {
      current: {
        goals: [],
        days: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
        tasks: [],
        notes: ''
      }
    },
    monthly: {},
    goals: [],
    habits: { list: [], month: monthKey(), grid: {} },
    finance: { income: [], expenses: [], savingsGoal: 0, history: [] },
    meals: { grocery: [] },
    water: {},
    selfcare: {},
    notes: []
  };
}

const Store = {
  data: null,
  storageOk: true,

  load() {
    let raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); }
    catch (e) { this.storageOk = false; console.warn('localStorage unavailable:', e); }

    if (raw) {
      try {
        this.data = JSON.parse(raw);
        return this.data;
      } catch (e) {
        console.warn('Corrupt planner data, reseeding demo data.');
      }
    }
    this.data = buildDemoData();
    this.save();
    return this.data;
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.storageOk = true;
      return true;
    } catch (e) {
      this.storageOk = false;
      console.warn('Could not save to localStorage:', e);
      return false;
    }
  },

  reset() {
    this.data = buildEmptyData();
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    return this.save();
  },

  quote() {
    const day = new Date().getDate();
    return QUOTES[day % QUOTES.length];
  },

  // ---- profile (buyer's display name) ----
  loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('localStorage unavailable for profile:', e); }
    return { name: 'Asad', sub: 'Demo account' };
  },
  saveProfile(profile) {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
    catch (e) { console.warn('Could not save profile:', e); }
  },

  // ---- prefs (theme / mode) ----
  loadPrefs() {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('localStorage unavailable for prefs:', e); }
    return { color: 'violet', mode: 'light' };
  },
  savePrefs(prefs) {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); }
    catch (e) { console.warn('Could not save prefs:', e); }
  }
};
