
// Footer year
const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

// Active nav highlight
(function(){
  const page = document.documentElement.getAttribute('data-page');
  if (!page) return;
  document.querySelectorAll(`[data-nav="${page}"]`).forEach(a=>a.classList.add('active'));
})();

// Dropdowns: click-only
(function(){
  const triggers = document.querySelectorAll('.has-dropdown > a');
  if (!triggers.length) return;
  const closeAll = ()=> document.querySelectorAll('.has-dropdown.open').forEach(p=>p.classList.remove('open'));
  triggers.forEach(trigger=>{
    const parent = trigger.parentElement; const menu = parent.querySelector('.dropdown'); if (!menu) return;
    trigger.addEventListener('click', e=>{ e.preventDefault(); const open = parent.classList.contains('open'); closeAll(); if(!open) parent.classList.add('open'); trigger.setAttribute('aria-expanded', String(parent.classList.contains('open'))); });
    document.addEventListener('click', e=>{ if (!parent.contains(e.target)) { parent.classList.remove('open'); trigger.setAttribute('aria-expanded','false'); } });
  });
})();

// Upload demo (if present)
(function(){
  const dz = document.getElementById('dropzone');
  const fi = document.getElementById('fileInput');
  const list = document.getElementById('uploadsList');
  if (!dz || !fi) return;
  const addFiles = files => { [...files].forEach(f=>{ const tr = document.createElement('tr'); tr.innerHTML = `<td>${f.name}</td><td>${document.getElementById('category')?.value||'-'}</td><td>${document.getElementById('period')?.value||'-'}</td><td><span class="badge badge-warning">Validating</span></td><td><button class="btn btn-ghost btn-sm">View</button></td>`; list?.prepend(tr); }); };
  dz.addEventListener('click', ()=> fi.click());
  dz.addEventListener('dragover', e=>{ e.preventDefault(); dz.style.background = '#f4faf7'; });
  dz.addEventListener('dragleave', ()=> dz.style.background = '');
  dz.addEventListener('drop', e=>{ e.preventDefault(); dz.style.background=''; addFiles(e.dataTransfer.files); });
  fi.addEventListener('change', e=> addFiles(e.target.files));
})();

// Charts via Chart.js when available
(function(){
  if (typeof Chart==='undefined') return;
  const trendEl = document.getElementById('trendChart');
  const donutEl = document.getElementById('donutChart');
  if (trendEl){ new Chart(trendEl.getContext('2d'), { type:'line', data:{ labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], datasets:[{ label:'Score', data:[38,42,50,63,72,74,81,83,88,89,92,94], borderColor:'#166d4c', backgroundColor:'rgba(22,109,76,.1)', tension:.3, fill:true }]}, options:{ responsive:true, scales:{ y:{ beginAtZero:true, suggestedMax:100 }}, plugins:{ legend:{ display:false }}}}); }
  if (donutEl){ new Chart(donutEl.getContext('2d'), { type:'doughnut', data:{ labels:['Met','In Progress','Not Met'], datasets:[{ data:[80,15,5], backgroundColor:['#1e8e52','#1976d2','#cc3b3b'] }]}, options:{ cutout:'60%', plugins:{ legend:{ display:false }}}}); }
})();
