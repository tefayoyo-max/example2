// ── Footer year ──────────────────────────────────────────────
(function(){
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

// ── Active nav highlight ──────────────────────────────────────
(function(){
  const page = document.documentElement.getAttribute('data-page');
  if (!page) return;
  document.querySelectorAll(`[data-nav="${page}"]`).forEach(a => a.classList.add('active'));
})();

// ── Dropdowns: click-only, close on outside click ────────────
(function(){
  const triggers = document.querySelectorAll('.has-dropdown > a');
  if (!triggers.length) return;

  const closeAll = (except) => {
    document.querySelectorAll('.has-dropdown.open').forEach(p => {
      if (p !== except) {
        p.classList.remove('open');
        const a = p.querySelector(':scope > a');
        if (a) a.setAttribute('aria-expanded', 'false');
      }
    });
  };

  triggers.forEach(trigger => {
    const parent = trigger.parentElement;
    const menu = parent.querySelector('.dropdown');
    if (!menu) return;

    trigger.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = parent.classList.contains('open');
      closeAll(isOpen ? null : parent);
      parent.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  document.addEventListener('click', () => closeAll(null));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(null); });
})();

// ── File Upload dropzone ──────────────────────────────────────
(function(){
  const dz   = document.getElementById('dropzone');
  const fi   = document.getElementById('fileInput');
  const list = document.getElementById('uploadsList');
  if (!dz || !fi) return;

  const categoryEl = () => document.getElementById('category');
  const periodEl   = () => document.getElementById('period');

  const statusBadge = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (['xlsx','xls','csv'].includes(ext)) return '<span class="badge badge-success">✓ Valid format</span>';
    if (ext === 'pdf') return '<span class="badge badge-info">PDF</span>';
    return '<span class="badge badge-warning">Validating…</span>';
  };

  const addFiles = files => {
    if (!list) return;
    [...files].forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${f.name}</td>
        <td>${categoryEl()?.value || '—'}</td>
        <td>${periodEl()?.value || '—'}</td>
        <td>${statusBadge(f.name)}</td>
        <td><button class="btn btn-ghost btn-sm" onclick="this.closest('tr').remove()">Remove</button></td>`;
      list.prepend(tr);
    });
  };

  dz.addEventListener('click', () => fi.click());
  dz.addEventListener('dragover',  e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('drag-over'); addFiles(e.dataTransfer.files); });
  fi.addEventListener('change', e => addFiles(e.target.files));
})();

// ── Contact form submission ───────────────────────────────────
(function(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = '✓ Sent!'; btn.disabled = true; }
    setTimeout(() => { if (btn) { btn.textContent = 'Send Message'; btn.disabled = false; } }, 3000);
  });
})();

// ── Settings form save ────────────────────────────────────────
(function(){
  document.querySelectorAll('form[aria-label]').forEach(form => {
    if (form.id === 'contactForm' || form.id === 'uploadForm') return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { const orig = btn.textContent; btn.textContent = '✓ Saved'; btn.disabled = true;
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 2000); }
    });
  });
})();

// ── Tabs ──────────────────────────────────────────────────────
(function(){
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        if (target) {
          document.querySelectorAll('[data-tab-content]').forEach(c => {
            c.style.display = c.dataset.tabContent === target ? '' : 'none';
          });
        }
      });
    });
  });
})();

// ── Charts via Chart.js ───────────────────────────────────────
(function(){
  if (typeof Chart === 'undefined') return;

  Chart.defaults.font.family = '"Inter","Segoe UI",Roboto,Arial,sans-serif';
  Chart.defaults.font.size   = 12;
  Chart.defaults.color       = '#7A7A7A';

  const palette = {
    primary:   '#0E6B5C',
    success:   '#1e8e52',
    info:      '#1976d2',
    danger:    '#cc3b3b',
    warning:   '#e6a817',
    primaryBg: 'rgba(14,107,92,.1)',
  };

  const make = (id, config) => {
    const el = document.getElementById(id);
    if (!el) return;
    new Chart(el.getContext('2d'), config);
  };

  // Trend / Line chart
  make('trendChart', {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets: [{
        label: 'CO₂ Score',
        data: [38,42,50,63,72,74,81,83,88,89,92,94],
        borderColor: palette.primary,
        backgroundColor: palette.primaryBg,
        tension: .35, fill: true, pointRadius: 3, pointHoverRadius: 5,
      }]
    },
    options: { responsive:true, plugins:{ legend:{ display:false }}, scales:{ y:{ beginAtZero:true, suggestedMax:100, grid:{ color:'rgba(0,0,0,.05)' }}}}
  });

  // Donut chart
  make('donutChart', {
    type: 'doughnut',
    data: {
      labels: ['Met','In Progress','Not Met'],
      datasets: [{ data:[80,15,5], backgroundColor:[palette.success, palette.info, palette.danger], borderWidth:0 }]
    },
    options: { cutout:'62%', plugins:{ legend:{ position:'bottom', labels:{ padding:16, boxWidth:12 }}}}
  });

  // Waste composition bar
  make('wasteChart', {
    type: 'bar',
    data: {
      labels: ['Organic','Plastic','Metal','Glass','Paper','Hazardous'],
      datasets: [{
        label: 'Tonnes',
        data: [8.4, 4.2, 2.1, 1.8, 3.6, 0.9],
        backgroundColor: [palette.success, palette.info, palette.warning, '#7e57c2', palette.primary, palette.danger],
        borderRadius: 6,
      }]
    },
    options: { responsive:true, plugins:{ legend:{ display:false }}, scales:{ y:{ beginAtZero:true, grid:{ color:'rgba(0,0,0,.05)' }}}}
  });

  // Analytics trend2
  make('trend2Chart', {
    type: 'line',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [
        { label:'Recycled', data:[55,60,58,65,70,74], borderColor:palette.success, backgroundColor:'rgba(30,142,82,.08)', tension:.3, fill:true, pointRadius:3 },
        { label:'Landfill',  data:[45,40,42,35,30,26], borderColor:palette.danger,  backgroundColor:'rgba(204,59,59,.06)', tension:.3, fill:true, pointRadius:3 },
      ]
    },
    options:{ responsive:true, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:12, padding:14 }}}, scales:{ y:{ beginAtZero:true, grid:{ color:'rgba(0,0,0,.05)' }}}}
  });
})();
