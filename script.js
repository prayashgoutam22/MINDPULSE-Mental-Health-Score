/* =========================================================
   MindPulse — Mental Health Score Predictor
   Complete JS-driven UI — script.js
   ========================================================= */

// ──────────────────────────────────────────────────────────
// CONFIG
// ──────────────────────────────────────────────────────────
const API_URL  = 'https://mindpulse-mental-health-score.onrender.com';
const MAX_SCORE = 10;

// ──────────────────────────────────────────────────────────
// ICONS (inline SVG helpers)
// ──────────────────────────────────────────────────────────
const icon = {
  brain:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.16Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.16Z"/></svg>`,
  pulse:    `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  user:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  globe:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  phone:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  clock:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  moon:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  activity: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  book:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  zap:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  sun:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  darkMode: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  chevRight:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  chevLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  refresh:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  check:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  alert:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
  target:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  star:     `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  share:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
};

// ──────────────────────────────────────────────────────────
// CANVAS BACKGROUND  (flowing gradient mesh)
// ──────────────────────────────────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('mp-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const DARK_COLORS = [
    [124, 58, 237],   // violet
    [99, 102, 241],   // indigo
    [6, 182, 212],    // cyan
    [59, 130, 246],   // blue
  ];
  const LIGHT_COLORS = [
    [167, 139, 250],
    [165, 180, 252],
    [103, 232, 249],
    [147, 197, 253],
  ];

  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  class Orb {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.r = 160 + Math.random() * 220;
      this.vx = (Math.random() - 0.5) * 0.18;
      this.vy = (Math.random() - 0.5) * 0.18;
      this.alpha = 0.04 + Math.random() * 0.07;
      const colors = isDark() ? DARK_COLORS : LIGHT_COLORS;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -this.r) this.x = canvas.width + this.r;
      if (this.x > canvas.width + this.r) this.x = -this.r;
      if (this.y < -this.r) this.y = canvas.height + this.r;
      if (this.y > canvas.height + this.r) this.y = -this.r;
    }
    draw() {
      const [r, g, b] = this.color;
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      grd.addColorStop(0, `rgba(${r},${g},${b},${this.alpha})`);
      grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let orbs = [];
  function build() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    orbs = Array.from({ length: 7 }, () => new Orb());
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    orbs.forEach(o => { o.update(); o.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', build);
  build();
  loop();

  // recolor orbs on theme switch
  new MutationObserver(() => {
    orbs.forEach(o => {
      const colors = isDark() ? DARK_COLORS : LIGHT_COLORS;
      o.color = colors[Math.floor(Math.random() * colors.length)];
    });
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}

// ──────────────────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────────────────
const state = {
  step: 0,         // 0-based wizard step
  totalSteps: 3,
  values: {},      // collected form values
  errors: {},      // field → error string
};

// ──────────────────────────────────────────────────────────
// FORM SCHEMA — defines all fields, grouped by step
// ──────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'personal',
    eyebrow: 'Step 1 of 3',
    title: 'Tell us about <span>yourself</span>',
    icon: icon.user,
    label: 'Profile',
    fields: [
      {
        key: 'age',
        label: 'Age',
        icon: icon.user,
        type: 'number',
        placeholder: 'e.g. 22',
        min: 10, max: 100,
        validate: v => {
          if (v === '' || v === null || v === undefined) return 'Age is required.';
          const n = Number(v);
          if (isNaN(n) || n < 10 || n > 100) return 'Age must be 10–100.';
          return '';
        }
      },
      {
        key: 'gender',
        label: 'Gender',
        icon: icon.user,
        type: 'pill',
        options: ['Male', 'Female'],
        validate: v => v ? '' : 'Please select a gender.'
      },
      {
        key: 'country',
        label: 'Country',
        icon: icon.globe,
        type: 'text',
        placeholder: 'e.g. India',
        validate: v => (v && v.trim()) ? '' : 'Country is required.'
      },
      {
        key: 'academic_Level',
        label: 'Academic Level',
        icon: icon.book,
        type: 'select',
        options: ['Undergraduate', 'Graduate', 'High School'],
        placeholder: 'Select level',
        validate: v => v ? '' : 'Please select your academic level.'
      },
    ],
  },
  {
    id: 'social',
    eyebrow: 'Step 2 of 3',
    title: 'Social media <span>habits</span>',
    icon: icon.phone,
    label: 'Social',
    fields: [
      {
        key: 'most_Used_Platform',
        label: 'Most Used Platform',
        icon: icon.phone,
        type: 'select',
        options: ['Facebook','Instagram','LinkedIn','Snapchat','Twitter','YouTube','TikTok','LINE','KakaoTalk','VKontakte','WhatsApp','WeChat'],
        placeholder: 'Select platform',
        validate: v => v ? '' : 'Please select a platform.'
      },
      {
        key: 'purpose_Of_Use',
        label: 'Primary Purpose',
        icon: icon.target,
        type: 'select',
        options: ['Networking','Education','Entertainment','News'],
        placeholder: 'Select purpose',
        validate: v => v ? '' : 'Please select a purpose.'
      },
      {
        key: 'avg_Daily_Usage_Hours',
        label: 'Daily Usage Hours',
        icon: icon.clock,
        type: 'slider',
        min: 0, max: 16, step: 0.5,
        defaultVal: 4,
        unit: 'hrs',
        validate: v => {
          if (v === '' || v === null || v === undefined) return 'Required.';
          const n = Number(v);
          if (isNaN(n) || n < 0 || n > 24) return 'Must be 0–24.';
          return '';
        }
      },
      {
        key: 'daily_Unlocks',
        label: 'Daily Phone Unlocks',
        icon: icon.phone,
        type: 'slider',
        min: 0, max: 200, step: 5,
        defaultVal: 60,
        unit: 'times',
        validate: v => {
          if (v === '' || v === null || v === undefined) return 'Required.';
          const n = Number(v);
          if (isNaN(n) || n < 0) return 'Must be 0 or more.';
          return '';
        }
      },
    ],
  },
  {
    id: 'lifestyle',
    eyebrow: 'Step 3 of 3',
    title: 'Your <span>lifestyle</span>',
    icon: icon.activity,
    label: 'Lifestyle',
    fields: [
      {
        key: 'study_Hours',
        label: 'Study Hours / Day',
        icon: icon.book,
        type: 'slider',
        min: 0, max: 12, step: 0.5,
        defaultVal: 4,
        unit: 'hrs',
        validate: v => {
          if (v === '' || v === null || v === undefined) return 'Required.';
          const n = Number(v);
          if (isNaN(n) || n < 0 || n > 24) return 'Must be 0–24.';
          return '';
        }
      },
      {
        key: 'physical_Activity_Hours',
        label: 'Physical Activity / Day',
        icon: icon.activity,
        type: 'slider',
        min: 0, max: 8, step: 0.5,
        defaultVal: 1,
        unit: 'hrs',
        validate: v => {
          if (v === '' || v === null || v === undefined) return 'Required.';
          const n = Number(v);
          if (isNaN(n) || n < 0 || n > 24) return 'Must be 0–24.';
          return '';
        }
      },
      {
        key: 'sleep_Hours_Per_Night',
        label: 'Sleep Hours / Night',
        icon: icon.moon,
        type: 'slider',
        min: 3, max: 12, step: 0.5,
        defaultVal: 7,
        unit: 'hrs',
        validate: v => {
          if (v === '' || v === null || v === undefined) return 'Required.';
          const n = Number(v);
          if (isNaN(n) || n < 0 || n > 24) return 'Must be 0–24.';
          return '';
        }
      },
      {
        key: 'stress_Level',
        label: 'Stress Level',
        icon: icon.zap,
        type: 'pill',
        options: ['Low', 'Medium', 'High', 'Very High'],
        validate: v => v ? '' : 'Please select your stress level.'
      },
    ],
  },
];

// ──────────────────────────────────────────────────────────
// DOM BUILDER HELPERS
// ──────────────────────────────────────────────────────────
function el(tag, cls, attrs = {}, html = '') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'data') {
      Object.entries(v).forEach(([dk, dv]) => e.dataset[dk] = dv);
    } else {
      e.setAttribute(k, v);
    }
  });
  if (html) e.innerHTML = html;
  return e;
}

function ripple(btn) {
  btn.addEventListener('click', ev => {
    const r = btn.getBoundingClientRect();
    const sp = el('span', 'ripple');
    const s = Math.max(r.width, r.height);
    sp.style.cssText = `width:${s}px;height:${s}px;left:${ev.clientX - r.left - s / 2}px;top:${ev.clientY - r.top - s / 2}px`;
    btn.appendChild(sp);
    sp.addEventListener('animationend', () => sp.remove());
  });
}

// ──────────────────────────────────────────────────────────
// FIELD BUILDERS
// ──────────────────────────────────────────────────────────
function buildTextField(field) {
  const wrap = el('div', 'field');
  wrap.dataset.key = field.key;

  const label = el('label', 'field-label', {for: `f-${field.key}`},
    `${field.icon || ''} ${field.label}`);
  wrap.appendChild(label);

  const input = el('input', 'field-input', {
    type: field.type === 'text' ? 'text' : 'number',
    id: `f-${field.key}`,
    placeholder: field.placeholder || '',
    ...(field.min !== undefined ? {min: field.min} : {}),
    ...(field.max !== undefined ? {max: field.max} : {}),
    ...(field.step !== undefined ? {step: field.step} : {}),
  });

  if (state.values[field.key] !== undefined) input.value = state.values[field.key];

  input.addEventListener('input', () => {
    state.values[field.key] = input.value;
    if (state.errors[field.key]) validateAndShow(field, input, errSpan);
  });
  input.addEventListener('blur', () => validateAndShow(field, input, errSpan));

  wrap.appendChild(input);

  const errSpan = el('span', 'field-error');
  wrap.appendChild(errSpan);

  if (state.errors[field.key]) {
    errSpan.textContent = state.errors[field.key];
    input.classList.add('invalid');
  }

  return wrap;
}

function buildSelectField(field) {
  const wrap = el('div', 'field');
  wrap.dataset.key = field.key;

  const label = el('label', 'field-label', {for: `f-${field.key}`},
    `${field.icon || ''} ${field.label}`);
  wrap.appendChild(label);

  const select = el('select', 'field-select', {id: `f-${field.key}`});
  const def = el('option', '', {value: '', disabled: '', selected: ''}, field.placeholder || 'Select...');
  select.appendChild(def);
  field.options.forEach(opt => {
    const o = el('option', '', {value: opt}, opt);
    if (state.values[field.key] === opt) o.selected = true;
    select.appendChild(o);
  });

  select.addEventListener('change', () => {
    state.values[field.key] = select.value;
    validateAndShow(field, select, errSpan);
  });

  wrap.appendChild(select);
  const errSpan = el('span', 'field-error');
  wrap.appendChild(errSpan);

  if (state.errors[field.key]) {
    errSpan.textContent = state.errors[field.key];
    select.classList.add('invalid');
  }

  return wrap;
}

function buildPillField(field) {
  const wrap = el('div', 'field');
  wrap.dataset.key = field.key;

  const label = el('label', 'field-label', {},
    `${field.icon || ''} ${field.label}`);
  wrap.appendChild(label);

  const group = el('div', 'pill-group');
  field.options.forEach(opt => {
    const btn = el('button', 'pill-btn', {type: 'button'}, opt);
    if (state.values[field.key] === opt) btn.classList.add('active');
    btn.addEventListener('click', () => {
      group.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.values[field.key] = opt;
      delete state.errors[field.key];
      errSpan.textContent = '';
    });
    ripple(btn);
    group.appendChild(btn);
  });
  wrap.appendChild(group);

  const errSpan = el('span', 'field-error');
  wrap.appendChild(errSpan);

  if (state.errors[field.key]) errSpan.textContent = state.errors[field.key];

  return wrap;
}

function buildSliderField(field) {
  const wrap = el('div', 'field');
  wrap.dataset.key = field.key;

  const label = el('label', 'field-label', {for: `f-${field.key}`},
    `${field.icon || ''} ${field.label}`);
  wrap.appendChild(label);

  const sliderWrap = el('div', 'slider-wrap');
  const row = el('div', 'slider-row');

  const currentVal = state.values[field.key] !== undefined
    ? state.values[field.key]
    : field.defaultVal;

  const input = el('input', 'slider-track', {
    type: 'range',
    id: `f-${field.key}`,
    min: field.min,
    max: field.max,
    step: field.step || 1,
    value: currentVal,
  });

  const valDisplay = el('span', 'slider-val',
    {}, `${currentVal}${field.unit ? ' ' + field.unit : ''}`);

  // Initialize state
  state.values[field.key] = Number(currentVal);

  // Update fill track bg
  function updateTrack() {
    const pct = ((input.value - field.min) / (field.max - field.min)) * 100;
    input.style.background = `linear-gradient(to right, #7c3aed ${pct}%, var(--border) ${pct}%)`;
  }

  input.addEventListener('input', () => {
    state.values[field.key] = Number(input.value);
    valDisplay.textContent = `${input.value}${field.unit ? ' ' + field.unit : ''}`;
    updateTrack();
  });

  updateTrack();

  row.appendChild(input);
  row.appendChild(valDisplay);
  sliderWrap.appendChild(row);
  wrap.appendChild(sliderWrap);

  const errSpan = el('span', 'field-error');
  wrap.appendChild(errSpan);
  if (state.errors[field.key]) errSpan.textContent = state.errors[field.key];

  return wrap;
}

function validateAndShow(field, inputEl, errEl) {
  const err = field.validate(state.values[field.key]);
  if (err) {
    state.errors[field.key] = err;
    inputEl.classList.add('invalid');
    errEl.innerHTML = `${icon.alert} ${err}`;
  } else {
    delete state.errors[field.key];
    inputEl.classList.remove('invalid');
    errEl.textContent = '';
  }
  return !err;
}

function buildField(field) {
  switch (field.type) {
    case 'text':
    case 'number': return buildTextField(field);
    case 'select':  return buildSelectField(field);
    case 'pill':    return buildPillField(field);
    case 'slider':  return buildSliderField(field);
  }
}

// ──────────────────────────────────────────────────────────
// STEPPER BUILDER
// ──────────────────────────────────────────────────────────
function buildStepper() {
  const stepper = el('div', 'stepper', {'aria-label': 'Progress'});
  STEPS.forEach((step, i) => {
    const item = el('div', `step-item${i < state.step ? ' done' : i === state.step ? ' active' : ''}`);
    const num = el('div', 'step-num');
    num.innerHTML = i < state.step ? icon.check : String(i + 1);
    item.appendChild(num);
    const lbl = el('span', 'step-label', {}, step.label);
    item.appendChild(lbl);
    stepper.appendChild(item);

    if (i < STEPS.length - 1) {
      const conn = el('div', `step-connector${i < state.step ? ' done' : ''}`);
      stepper.appendChild(conn);
    }
  });
  return stepper;
}

// ──────────────────────────────────────────────────────────
// STEP PANEL BUILDER
// ──────────────────────────────────────────────────────────
function buildStepPanel(stepDef, idx) {
  const panel = el('div', `wizard-step${idx === state.step ? ' active' : ''}`, {
    id: `step-panel-${idx}`,
    role: 'tabpanel',
  });

  const header = el('div', 'step-header');
  header.appendChild(el('div', 'step-eyebrow', {}, stepDef.eyebrow));
  header.appendChild(el('h2', 'step-title', {}, stepDef.title));
  panel.appendChild(header);

  const grid = el('div', 'fields-grid');
  stepDef.fields.forEach(field => {
    const fieldEl = buildField(field);
    // Make pill/slider fields full width
    if (field.type === 'pill' || (field.type === 'slider' && stepDef.fields.length % 2 !== 0)) {
      fieldEl.style.gridColumn = '1 / -1';
    }
    grid.appendChild(fieldEl);
  });

  panel.appendChild(grid);
  return panel;
}

// ──────────────────────────────────────────────────────────
// VALIDATION — validate current step fields
// ──────────────────────────────────────────────────────────
function validateCurrentStep() {
  const stepDef = STEPS[state.step];
  let allValid = true;

  stepDef.fields.forEach(field => {
    const err = field.validate(state.values[field.key]);
    if (err) {
      state.errors[field.key] = err;
      allValid = false;
    } else {
      delete state.errors[field.key];
    }
  });

  // Update UI to show errors
  stepDef.fields.forEach(field => {
    const wrap = document.querySelector(`[data-key="${field.key}"]`);
    if (!wrap) return;
    const errEl = wrap.querySelector('.field-error');
    const inputEl = wrap.querySelector('.field-input, .field-select, .slider-track');
    if (state.errors[field.key]) {
      if (errEl) errEl.innerHTML = `${icon.alert} ${state.errors[field.key]}`;
      if (inputEl) inputEl.classList.add('invalid');
    } else {
      if (errEl) errEl.textContent = '';
      if (inputEl) inputEl.classList.remove('invalid');
    }
  });

  return allValid;
}

// ──────────────────────────────────────────────────────────
// RESULT RENDERING
// ──────────────────────────────────────────────────────────
const SCORE_ZONES = [
  { max: 25,  label: 'Needs Attention', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   desc: 'Your score suggests significant mental health challenges. Consider speaking with a professional.' },
  { max: 50,  label: 'Fair',            color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',   desc: 'There is room for improvement. Small lifestyle changes can make a meaningful difference.' },
  { max: 75,  label: 'Good',            color: '#22c55e', bg: 'rgba(34,197,94,0.12)',    desc: 'You are in a good place! Keep maintaining your healthy habits and routines.' },
  { max: 100, label: 'Excellent',       color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',    desc: 'Outstanding mental wellness! Your lifestyle habits are positively supporting your mental health.' },
];

function getZone(pct) {
  return SCORE_ZONES.find(z => pct <= z.max) || SCORE_ZONES[SCORE_ZONES.length - 1];
}

function buildResultView(rawScore) {
  const pct = Math.max(0, Math.min(100, (rawScore / MAX_SCORE) * 100));
  const zone = getZone(pct);

  // circumference for r=90: 2π*90 ≈ 565
  const CIRC = 565;

  const container = el('div', 'result-container visible', {id: 'resultContainer'});

  // ── Hero card
  const hero = el('div', 'result-hero');
  hero.appendChild(el('div', 'result-badge', {}, `${icon.pulse} &nbsp; Analysis Complete`));

  // Score ring
  const ringWrap = el('div', 'score-ring-wrap');
  ringWrap.innerHTML = `
    <svg class="score-ring-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <circle class="score-ring-bg" cx="100" cy="100" r="90"/>
      <circle id="scoreRingFill" class="score-ring-fill" cx="100" cy="100" r="90"
        stroke="${zone.color}" stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}"/>
    </svg>
    <div class="score-ring-center">
      <span class="score-value" id="scoreVal">0.0</span>
      <span class="score-max">/ ${MAX_SCORE}</span>
    </div>
  `;
  hero.appendChild(ringWrap);

  // Label badge
  const lbl = el('div', 'result-label-badge', {id: 'resultLabel'}, zone.label);
  lbl.style.background = zone.bg;
  lbl.style.color = zone.color;
  hero.appendChild(lbl);

  hero.appendChild(el('p', 'result-desc', {}, zone.desc));
  container.appendChild(hero);

  // ── Insights
  const insightData = [
    {
      icon: icon.clock,
      val: `${state.values.avg_Daily_Usage_Hours}h`,
      key: 'Daily Screen Time',
    },
    {
      icon: icon.moon,
      val: `${state.values.sleep_Hours_Per_Night}h`,
      key: 'Sleep / Night',
    },
    {
      icon: icon.activity,
      val: `${state.values.physical_Activity_Hours}h`,
      key: 'Activity / Day',
    },
  ];

  const grid = el('div', 'insights-grid');
  insightData.forEach(d => {
    const card = el('div', 'insight-card');
    card.innerHTML = `
      <div class="insight-icon">${d.icon}</div>
      <div class="insight-val">${d.val}</div>
      <div class="insight-key">${d.key}</div>
    `;
    grid.appendChild(card);
  });
  container.appendChild(grid);

  // ── Actions
  const actions = el('div', 'result-actions');
  const btnNew = el('button', 'btn-new', {type: 'button', id: 'btnNew'});
  btnNew.innerHTML = `${icon.refresh}&nbsp; New Prediction`;
  ripple(btnNew);
  btnNew.addEventListener('click', resetAll);
  actions.appendChild(btnNew);
  container.appendChild(actions);

  return { container, pct, rawScore };
}

function animateRing(pct, rawScore) {
  const CIRC = 565;
  const fill = document.getElementById('scoreRingFill');
  const valEl = document.getElementById('scoreVal');
  if (!fill || !valEl) return;

  const targetOffset = CIRC * (1 - pct / 100);
  const duration = 1200;
  const start = performance.now();

  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    const offset = CIRC - (CIRC - targetOffset) * eased;
    fill.style.strokeDashoffset = offset;
    const score = rawScore * eased;
    valEl.textContent = score.toFixed(1);
    if (t < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ──────────────────────────────────────────────────────────
// MAIN RENDER
// ──────────────────────────────────────────────────────────
function render() {
  const root = document.getElementById('root');
  root.innerHTML = '';

  // Canvas bg
  const canvas = el('canvas', '', {id: 'mp-canvas', 'aria-hidden': 'true'});
  root.appendChild(canvas);

  // Noise overlay
  root.appendChild(el('div', 'noise-overlay', {'aria-hidden': 'true'}));

  const wrapper = el('div', 'app-wrapper');

  // ── Topbar
  const topbar = el('div', 'topbar');
  const brand = el('div', 'brand');
  brand.innerHTML = `
    <div class="brand-logo">${icon.brain}</div>
    <span class="brand-name">MindPulse</span>
  `;
  topbar.appendChild(brand);

  const actions = el('div', 'topbar-actions');
  const themeBtn = el('button', 'icon-btn', {
    type: 'button',
    id: 'themeBtn',
    'aria-label': 'Toggle theme',
    title: 'Toggle theme',
  });
  themeBtn.innerHTML = `
    <span class="icon-sun">${icon.sun}</span>
    <span class="icon-moon">${icon.darkMode}</span>
  `;
  themeBtn.addEventListener('click', toggleTheme);
  ripple(themeBtn);
  actions.appendChild(themeBtn);
  topbar.appendChild(actions);
  wrapper.appendChild(topbar);

  // ── Hero
  const hero = el('div', 'hero');
  hero.innerHTML = `
    <div class="hero-badge">
      <span class="hero-badge-dot"></span>
      ML-Powered Analysis
    </div>
    <h1 class="hero-title">Mental Health<br><span>Score Predictor</span></h1>
    <p class="hero-sub">Understand how your social media habits and lifestyle impact your mental wellness — powered by machine learning.</p>
  `;
  wrapper.appendChild(hero);

  // ── Stepper
  wrapper.appendChild(buildStepper());

  // ── Wizard Card
  const card = el('div', 'wizard-card', {id: 'wizardCard'});

  // Step panels
  STEPS.forEach((stepDef, i) => {
    card.appendChild(buildStepPanel(stepDef, i));
  });

  // API error bar
  const apiErr = el('div', 'api-error', {id: 'apiError'});
  apiErr.innerHTML = `${icon.alert} <span id="apiErrMsg"></span>`;
  card.appendChild(apiErr);

  // Loading overlay
  const loading = el('div', 'predict-loading', {id: 'predictLoading'});
  loading.innerHTML = `
    <div class="loading-orb">${icon.brain}</div>
    <p class="loading-text">Analyzing your data…</p>
    <p class="loading-sub">Our model is computing your mental health score</p>
  `;
  card.appendChild(loading);

  // Nav
  const nav = el('div', 'wizard-nav');

  const btnBack = el('button', 'btn-back', {
    type: 'button', id: 'btnBack',
    ...(state.step === 0 ? {disabled: ''} : {}),
  });
  btnBack.innerHTML = `${icon.chevLeft} Back`;
  btnBack.addEventListener('click', goBack);
  ripple(btnBack);

  const counter = el('span', 'step-counter', {}, `${state.step + 1} / ${state.totalSteps}`);

  const btnNext = el('button', 'btn-next', {type: 'button', id: 'btnNext'});
  const isLast = state.step === state.totalSteps - 1;
  btnNext.innerHTML = isLast
    ? `${icon.pulse} &nbsp; Predict Score`
    : `Next &nbsp; ${icon.chevRight}`;
  btnNext.addEventListener('click', isLast ? handlePredict : goNext);
  ripple(btnNext);

  nav.appendChild(btnBack);
  nav.appendChild(counter);
  nav.appendChild(btnNext);
  card.appendChild(nav);

  wrapper.appendChild(card);

  // ── Footer
  const footer = el('div', 'footer');
  footer.innerHTML = `
    <p class="footer-text">
      Powered by FastAPI
      <span class="footer-dot"></span>
      Machine Learning
      <span class="footer-dot"></span>
      MindPulse UI
    </p>
  `;
  wrapper.appendChild(footer);

  root.appendChild(wrapper);

  // Init canvas
  initCanvas();
}

// ──────────────────────────────────────────────────────────
// NAVIGATION
// ──────────────────────────────────────────────────────────
function goNext() {
  if (!validateCurrentStep()) return;
  state.step++;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  if (state.step === 0) return;
  state.step--;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ──────────────────────────────────────────────────────────
// PREDICTION
// ──────────────────────────────────────────────────────────
async function handlePredict() {
  if (!validateCurrentStep()) return;

  const loading = document.getElementById('predictLoading');
  const card    = document.getElementById('wizardCard');
  const apiErr  = document.getElementById('apiError');
  const nav     = card.querySelector('.wizard-nav');
  const panels  = card.querySelectorAll('.wizard-step');
  const errMsg  = document.getElementById('apiErrMsg');

  // Hide panels + nav, show loading
  panels.forEach(p => (p.style.display = 'none'));
  apiErr.classList.remove('visible');
  if (nav) nav.style.display = 'none';
  loading.classList.add('visible');

  const payload = {
    age:                     Number(state.values.age),
    gender:                  state.values.gender,
    country:                 String(state.values.country || '').trim(),
    academic_Level:          state.values.academic_Level,
    most_Used_Platform:      state.values.most_Used_Platform,
    purpose_Of_Use:          state.values.purpose_Of_Use,
    avg_Daily_Usage_Hours:   Number(state.values.avg_Daily_Usage_Hours),
    daily_Unlocks:           Number(state.values.daily_Unlocks),
    study_Hours:             Number(state.values.study_Hours),
    physical_Activity_Hours: Number(state.values.physical_Activity_Hours),
    sleep_Hours_Per_Night:   Number(state.values.sleep_Hours_Per_Night),
    stress_Level:            state.values.stress_Level,
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    loading.classList.remove('visible');

    if (!res.ok) {
      let body = null;
      try { body = await res.json(); } catch (_) {}
      const msg = parseFastApiError(body);
      errMsg.textContent = msg;
      apiErr.classList.add('visible');
      // Restore panels + nav so user can edit
      panels.forEach(p => (p.style.display = ''));
      if (nav) nav.style.display = '';
      return;
    }

    const data = await res.json();
    showResult(data.prediction_mental_score);

  } catch (_) {
    loading.classList.remove('visible');
    errMsg.textContent = 'Cannot connect to the API. Please make sure the FastAPI server is running on port 8000.';
    apiErr.classList.add('visible');
    panels.forEach(p => (p.style.display = ''));
    if (nav) nav.style.display = '';
  }
}

function parseFastApiError(body) {
  if (!body || !body.detail) return 'Validation failed. Check your inputs.';
  if (Array.isArray(body.detail)) {
    return body.detail
      .map(e => `${Array.isArray(e.loc) ? e.loc[e.loc.length - 1] : 'field'}: ${e.msg}`)
      .join(' | ');
  }
  return String(body.detail);
}

function showResult(rawScore) {
  const wrapper = document.querySelector('.app-wrapper');
  const card    = document.getElementById('wizardCard');

  // Hide wizard
  card.style.display = 'none';

  // Hide stepper
  const stepper = document.querySelector('.stepper');
  if (stepper) stepper.style.display = 'none';

  // Build result view
  const { container, pct } = buildResultView(rawScore);
  wrapper.insertBefore(container, card);

  // Animate ring after paint
  requestAnimationFrame(() => {
    setTimeout(() => animateRing(pct, rawScore), 120);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ──────────────────────────────────────────────────────────
// RESET
// ──────────────────────────────────────────────────────────
function resetAll() {
  state.step = 0;
  state.values = {};
  state.errors = {};
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ──────────────────────────────────────────────────────────
// THEME
// ──────────────────────────────────────────────────────────
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('mp-theme', next);
}

// ──────────────────────────────────────────────────────────
// BOOT
// ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  render();
});
