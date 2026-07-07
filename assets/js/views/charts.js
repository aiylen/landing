/* ============================================================
   charts.js — shared Chart.js helpers, themed to match the app
   ============================================================ */

const ChartKit = {
  _instances: {},

  colors(){
    const cs = getComputedStyle(document.documentElement);
    return {
      primary: cs.getPropertyValue('--primary').trim(),
      primaryDim: cs.getPropertyValue('--primary-dim').trim(),
      accent: cs.getPropertyValue('--accent').trim(),
      text: cs.getPropertyValue('--text-dim').trim(),
      grid: cs.getPropertyValue('--border').trim(),
      surface: cs.getPropertyValue('--surface').trim()
    };
  },

  destroy(id){
    if (this._instances[id]) { this._instances[id].destroy(); delete this._instances[id]; }
  },

  line(canvasId, labels, datasetsRaw){
    this.destroy(canvasId);
    const c = this.colors();
    const ctx = document.getElementById(canvasId);
    if (!ctx || typeof Chart === 'undefined') return;
    const datasets = datasetsRaw.map((d,i)=>({
      label: d.label,
      data: d.data,
      borderColor: i===0 ? c.primary : c.accent,
      backgroundColor: i===0 ? c.primary+'22' : c.accent+'22',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: i===0 ? c.primary : c.accent,
      borderWidth: 2.5
    }));
    this._instances[canvasId] = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display: datasets.length>1, labels:{ color:c.text, font:{family:'Inter', size:11}, boxWidth:10 } } },
        scales:{
          x:{ ticks:{color:c.text, font:{size:11}}, grid:{color:c.grid} },
          y:{ ticks:{color:c.text, font:{size:11}}, grid:{color:c.grid} }
        }
      }
    });
  },

  doughnut(canvasId, labels, data){
    this.destroy(canvasId);
    const c = this.colors();
    const ctx = document.getElementById(canvasId);
    if (!ctx || typeof Chart === 'undefined') return;
    const palette = [c.primary, c.accent, c.primaryDim, '#F5A623', '#FF6584', '#3768E8'];
    this._instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: { labels, datasets:[{ data, backgroundColor: palette, borderWidth:2, borderColor:c.surface }] },
      options: {
        responsive:true, maintainAspectRatio:false, cutout:'68%',
        plugins:{ legend:{ position:'bottom', labels:{ color:c.text, font:{family:'Inter', size:11}, boxWidth:10, padding:12 } } }
      }
    });
  },

  bar(canvasId, labels, datasetsRaw){
    this.destroy(canvasId);
    const c = this.colors();
    const ctx = document.getElementById(canvasId);
    if (!ctx || typeof Chart === 'undefined') return;
    const datasets = datasetsRaw.map((d,i)=>({
      label:d.label, data:d.data,
      backgroundColor: i===0 ? c.primary : c.accent,
      borderRadius:6, maxBarThickness:22
    }));
    this._instances[canvasId] = new Chart(ctx, {
      type:'bar',
      data:{ labels, datasets },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ display: datasets.length>1, labels:{color:c.text, font:{family:'Inter', size:11}} } },
        scales:{ x:{ ticks:{color:c.text, font:{size:11}}, grid:{display:false} }, y:{ ticks:{color:c.text, font:{size:11}}, grid:{color:c.grid} } }
      }
    });
  }
};
