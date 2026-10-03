// field.js : modul i Dalux-presentasjonen. Lastes i rekkefolge fra index.html. Ingen byggesteg, rediger direkte.
// ============================
// PAGE SWITCHING
// ============================
let activePage = 1;
let prevPage = 1;
let pageTransitioning = false;
function showPage(n) {
  if(n === activePage || pageTransitioning) return;
  pageTransitioning = true;
  const dir = n > prevPage ? 'left' : 'right';
  const outClass = 'slide-out-' + dir;
  const inClass = dir === 'left' ? 'slide-in-right' : 'slide-in-left';
  const oldPage = document.getElementById('page' + activePage);
  const newPage = document.getElementById('page' + n);
  
  document.querySelectorAll('#modField .page-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('pb' + n).classList.add('active');
  if (n === 2) {
    window.scrollTo(0, 0);
    // Match page2 header position to page1 header
    const p1h = document.querySelector('#page1 header');
    if(p1h) {
      const top = p1h.getBoundingClientRect().top;
      document.querySelector('#page2 header').style.marginTop = (top - 52) + 'px';
    }
    document.getElementById('page2').classList.add('intro');
    document.querySelectorAll('.sc-btn').forEach(b=>b.classList.remove('active'));
    lcCurrent=-1;
  }
  
  oldPage.classList.remove('visible');
  oldPage.classList.add(outClass);
  
  setTimeout(() => {
    oldPage.classList.remove(outClass);
    oldPage.style.display = 'none';
    newPage.style.display = '';
    newPage.classList.add(inClass);
    setTimeout(() => {
      newPage.classList.remove(inClass);
      newPage.classList.add('visible');
      prevPage = n;
      activePage = n;
      document.getElementById('lcControls').classList.toggle('visible', n===2 && !document.getElementById('page2').classList.contains('intro'));
      pageTransitioning = false;
    }, 500);
  }, 300);
}

// ============================
// PAGE 1: HUB (unchanged)
// ============================
const ues = [
  { c:'41.00', n:'Internentreprise', col:'#6fa032', bg:'#c8e6a0' },
  { c:'41.100', n:'[Byggherre] Utvikling av byggeprosjekter', col:'#7ba899', bg:'#d4c9a8' },
  { c:'43.110', n:'Riving av bygninger og andre konstruksjoner', col:'#6db86d', bg:'#b8e986' },
  { c:'43.120', n:'Grunnarbeid', col:'#7ba899', bg:'#e8e8e0' },
  { c:'43.130', n:'Prøveboring', col:'#7ba899', bg:'#e8e8e0' },
  { c:'43.210', n:'Elektrisk installasjonsarbeid', col:'#d4a017', bg:'#f0c8c8' },
  { c:'43.221', n:'Rørleggerarbeid', col:'#8DC63F', bg:'#e8b8b8' },
  { c:'43.223', n:'Ventilasjonsarbeid', col:'#7ba899', bg:'#c8e8c8' },
  { c:'43.310', n:'Stukkatørarbeid og pussing', col:'#8e6abf', bg:'#f0e8c0' },
  { c:'43.330', n:'Gulvlegging og tapetsering', col:'#6db86d', bg:'#c8e8c8' },
  { c:'43.341', n:'Malerarbeid', col:'#8e6abf', bg:'#e8e8e0' },
  { c:'43.342', n:'Glassarbeid', col:'#5da0c5', bg:'#c0d8e8' },
  { c:'43.911', n:'Blikkenslagerarbeid', col:'#8DC63F', bg:'#c8e8c8' },
  { c:'43.919', n:'Takarbeid', col:'#c9785d', bg:'#e8e8e0' },
  { c:'43.991', n:'Betongelementmontasje', col:'#c9785d', bg:'#f0d8c0' },
  { c:'43.992', n:'Betong og støpearbeid', col:'#c9785d', bg:'#f0d8c0' },
  { c:'43.993', n:'Tømrerarbeid', col:'#d4a017', bg:'#d8e8a8' },
  { c:'43.994', n:'Murerarbeid', col:'#c9785d', bg:'#c8d8b8' },
];
const shortNames = {
  '41.00':'Internentr.','41.100':'Byggherre',
  '43.110':'Riving','43.120':'Grunnarbeid','43.130':'Prøveboring',
  '43.210':'Elektriker','43.221':'Rørlegger','43.223':'Ventilasjon',
  '43.310':'Stukkatør','43.330':'Gulv/Tapet','43.341':'Maler',
  '43.342':'Glass','43.911':'Blikkenslager','43.919':'Tak',
  '43.991':'Betongelement','43.992':'Betong/Støp','43.993':'Tømrer','43.994':'Murer',
};
const hubStage = document.getElementById('hubStage');
const listChrome = document.getElementById('listChrome');
const listRowH=30, listHeaderH=75;
// Design-koordinater for SVG viewBox - DOM-posisjoner regnes responsivt fra disse
const HUB_DESIGN_W=1100, HUB_DESIGN_H=620;
function getHubLayout(){
  const w = hubStage.offsetWidth || HUB_DESIGN_W;
  const h = hubStage.offsetHeight || HUB_DESIGN_H;
  const scale = w / HUB_DESIGN_W;
  return {
    w, h, scale,
    cx: w * 0.5,
    cy: h * (290/HUB_DESIGN_H),
    rx: w * (400/HUB_DESIGN_W),
    ry: h * (240/HUB_DESIGN_H),
    nodeW: Math.max(115, Math.min(165, 165*scale)),
    nodeH: 34,
    listX: w * (240/HUB_DESIGN_W),
    listW: w * (620/HUB_DESIGN_W),
  };
}
const hubNodes=[];
ues.forEach((u,i)=>{
  const el=document.createElement('div');
  el.className='node';
  el.innerHTML=`<span class="code">${u.c}</span><span class="name">${u.n}</span>`;
  el.dataset.fullName=u.n; el.dataset.shortName=shortNames[u.c]||u.n;
  el.dataset.bg=u.bg||'';
  el.style.cursor='pointer'; el.onclick=()=>openWf(i);
  hubStage.appendChild(el); hubNodes.push(el);
});
function getListPos(i, L){L=L||getHubLayout();return{left:L.listX,top:listHeaderH+i*listRowH,w:L.listW,h:listRowH};}
function getHubPos(i, L){L=L||getHubLayout();const a=(i/ues.length)*Math.PI*2-Math.PI/2;const r=i%2===0?1:.68;return{left:L.cx+Math.cos(a)*L.rx*r-L.nodeW/2,top:L.cy+Math.sin(a)*L.ry*r-L.nodeH/2,w:L.nodeW,h:L.nodeH};}
function applyPos(fn){const L=getHubLayout();hubNodes.forEach((el,i)=>{const p=fn(i,L);el.style.left=p.left+'px';el.style.top=p.top+'px';el.style.width=p.w+'px';el.style.height=p.h+'px';});}
function genHubSvg(){
  // SVG bruker design-koordinater (viewBox 0 0 1100 620) og skaleres automatisk
  const cx=HUB_DESIGN_W/2, cy=290, rx=400, ry=240;
  let s='';
  ues.forEach((u,i)=>{
    const a=(i/ues.length)*Math.PI*2-Math.PI/2;
    const r=i%2===0?1:.68;
    s+=`<line x1="${cx}" y1="${cy}" x2="${cx+Math.cos(a)*rx*r}" y2="${cy+Math.sin(a)*ry*r}" stroke="${u.col}"/>`;
  });
  document.getElementById('hubSvg').innerHTML=s;
}
const hubDots=[];
function updateDotPositions(){
  const L=getHubLayout();
  hubDots.forEach((dot,i)=>{
    const a=(i/ues.length)*Math.PI*2-Math.PI/2;
    const r=i%2===0?1:.68;
    dot._cx=L.cx; dot._cy=L.cy;
    dot._ex=L.cx+Math.cos(a)*L.rx*r;
    dot._ey=L.cy+Math.sin(a)*L.ry*r;
  });
}
function createDots(){
  ues.forEach((u,i)=>{
    const dot=document.createElement('div');
    dot.className='hub-dot';
    dot.style.background=u.col;
    dot.style.opacity=0;
    dot._col=u.col;
    dot._phase=0;
    dot._progress=0;
    dot._baseSpeed=0.004+Math.random()*0.002;
    dot._active=false;
    hubStage.appendChild(dot);
    hubDots.push(dot);
  });
  updateDotPositions();
}
function positionHubCenter(){
  const L=getHubLayout();
  const hc=document.getElementById('hubCenter');
  const cw=Math.max(200, Math.min(260, 260*L.scale));
  hc.style.left=(L.cx-cw/2)+'px';
  hc.style.top=(L.cy-24)+'px';
  hc.style.width=cw+'px';
}
function applyHubLayout(){
  positionHubCenter();
  updateDotPositions();
  applyPos(currentView==='list' ? getListPos : getHubPos);
}
const DOT_PHASES=[
  {label:'Ny →',       move:'in',  speed:1},
  {label:'Vurderes',   move:'none',speed:2.5},
  {label:'← Utbedres', move:'out', speed:1},
  {label:'Utført',     move:'none',speed:2},
  {label:'Kontroll →', move:'in',  speed:1},
  {label:'Lukket ✓',   move:'none',speed:2.5},
];
const MAX_ACTIVE=3;
let dotAnimId=null, dotTimer=0;
function pickNewDot(){
  const inactive=hubDots.filter(d=>!d._active);
  if(!inactive.length)return;
  const d=inactive[Math.floor(Math.random()*inactive.length)];
  d._active=true; d._phase=0; d._progress=0;
}
function animateDots(){
  dotTimer++;
  // Activate new dots periodically if below max
  if(dotTimer%120===0){
    const activeCount=hubDots.filter(d=>d._active).length;
    if(activeCount<MAX_ACTIVE) pickNewDot();
  }
  hubDots.forEach(dot=>{
    if(!dot._active){dot.style.opacity=0;return;}
    const ph=DOT_PHASES[dot._phase];
    dot._progress+=dot._baseSpeed*ph.speed;
    const p=Math.min(dot._progress,1);
    const ease=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    let x,y,opacity=1;
    if(ph.move==='in'){
      x=dot._ex+(dot._cx-dot._ex)*ease;
      y=dot._ey+(dot._cy-dot._ey)*ease;
      if(p<.15)opacity=p/.15;
    } else if(ph.move==='out'){
      x=dot._cx+(dot._ex-dot._cx)*ease;
      y=dot._cy+(dot._ey-dot._cy)*ease;
    } else {
      if(dot._phase<=1||dot._phase>=4){x=dot._cx;y=dot._cy;}
      else{x=dot._ex;y=dot._ey;}
      if(dot._phase===5) opacity=Math.max(1-p,0);
    }
    dot.textContent=ph.label;
    dot.style.left=(x-dot.offsetWidth/2)+'px';
    dot.style.top=(y-11)+'px';
    dot.style.opacity=opacity;
    if(dot._progress>=1){
      dot._progress=0;
      dot._phase++;
      if(dot._phase>=DOT_PHASES.length){
        dot._active=false; dot.style.opacity=0;
      }
    }
  });
  dotAnimId=requestAnimationFrame(animateDots);
}
function startDotAnim(){
  if(!dotAnimId){
    // Start with a couple active
    pickNewDot(); pickNewDot();
    animateDots();
  }
}
function stopDotAnim(){
  if(dotAnimId){cancelAnimationFrame(dotAnimId);dotAnimId=null;}
  hubDots.forEach(d=>{d._active=false;d.style.opacity=0;});
  dotTimer=0;
}
let currentView='list';
const hubCaptions={list:'Klikk på en entreprise for å se arbeidsforløpene',hub:'Klikk på en entreprise for å se arbeidsforløpene. All kommunikasjon går via systemeier'};
function setView(view){if(view===currentView)return;currentView=view;document.querySelectorAll('.hub-tab').forEach(t=>t.classList.remove('on'));document.getElementById('t'+view.charAt(0).toUpperCase()+view.slice(1)).classList.add('on');hubStage.className='hub-stage '+view+'-view';listChrome.classList.toggle('hidden',view!=='list');hubNodes.forEach((el,i)=>{el.querySelector('.name').textContent=view==='list'?el.dataset.fullName:el.dataset.shortName;if(view==='hub'){el.style.borderLeftColor=ues[i].col;el.style.borderLeftWidth='3px';el.style.background='';}else{el.style.borderLeftColor='';el.style.borderLeftWidth='';el.style.background=el.dataset.bg||'#fff';}});applyPos(view==='list'?getListPos:getHubPos);if(view==='hub')startDotAnim();else stopDotAnim();document.getElementById('hubCaption').textContent=hubCaptions[view];}
function openWf(idx){
  const u=ues[idx], short=shortNames[u.c]||u.n;
  document.getElementById('wfDot').style.background=u.col;
  document.getElementById('wfName').textContent=u.c+' '+short;
  // Erstatt alle Fag-placeholders med entreprisens kortnavn
  document.querySelectorAll('#wfOverlay .wf-fag').forEach(el=>{el.textContent=short;});
  // Reset til "Lite prosjekt"-modus ved åpning
  setWfMode('lite');
  document.getElementById('wfOverlay').classList.add('show');
}
const wfModeHints={
  lite:'I små prosjekter behandler totalentreprenøren alle saker, ofte fordi samme person har flere "hatter". HMS-observasjoner kan alle på prosjektet opprette, de sendes til HMS-lederne utenfor arbeidsforløpene, og kommer tilbake som en HMS-oppgave for utbedring.',
  stort:'I større prosjekter splittes arbeidet på dedikerte fagledere. Slik unngår du at folk får varsler om saker som ikke er deres ansvar. HMS-observasjoner kan alle på prosjektet opprette, de sendes til HMS-lederne utenfor arbeidsforløpene, og kommer tilbake som en HMS-oppgave for utbedring.',
};
function setWfMode(mode){
  document.querySelectorAll('#wfOverlay .wf-mode-tabs .hub-tab').forEach(b=>{
    b.classList.toggle('on', b.dataset.mode===mode);
  });
  document.querySelectorAll('#wfOverlay .wf-flow-set').forEach(s=>{
    s.classList.toggle('on', s.dataset.mode===mode);
  });
  const hint=document.getElementById('wfModeHint');
  if(hint) hint.textContent=wfModeHints[mode]||'';
}
function closeWf(){document.getElementById('wfOverlay').classList.remove('show');}
function toggleFS(){if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen();}
let activeModule=null;
let activeBoxTrack=null;
let activeCommonTrack=null;
function openModule(mod){
  document.getElementById('splash').classList.add('hidden');
  if(activeModule){document.getElementById('mod'+activeModule.charAt(0).toUpperCase()+activeModule.slice(1)).classList.remove('active');}
  activeModule=mod;
  const modEl=document.getElementById('mod'+mod.charAt(0).toUpperCase()+mod.slice(1));
  modEl.classList.add('active');
  if(mod==='box'){
    document.getElementById('boxSelector').classList.add('active');
    // Hide all tracks
    document.querySelectorAll('.box-track').forEach(t=>t.classList.remove('active'));
    activeBoxTrack=null;
  }
  document.querySelectorAll('.fs-btn').forEach(b=>{b.style.opacity='1';b.style.pointerEvents='';});
  // Stagene har offsetWidth=0 mens de er display:none. Recompute når de blir synlige.
  if(mod==='field'){requestAnimationFrame(()=>applyHubLayout());}
}
function backToSplash(){
  if(activeModule==='box'&&activeBoxTrack){backToBoxSelector();return;}
  if(activeModule){document.getElementById('mod'+activeModule.charAt(0).toUpperCase()+activeModule.slice(1)).classList.remove('active');}
  if(activeCommonTrack){document.querySelectorAll('.common-track').forEach(t=>t.classList.remove('active'));}
  activeModule=null;
  activeBoxTrack=null;
  activeCommonTrack=null;
  document.getElementById('splash').classList.remove('hidden');
  document.querySelectorAll('.fs-btn').forEach(b=>{b.style.opacity='0';b.style.pointerEvents='none';});
}
function openCommonTrack(track){
  document.getElementById('splash').classList.add('hidden');
  if(activeModule){
    document.getElementById('mod'+activeModule.charAt(0).toUpperCase()+activeModule.slice(1)).classList.remove('active');
  }
  activeModule=null;
  activeBoxTrack=null;
  document.querySelectorAll('.common-track').forEach(t=>t.classList.remove('active'));
  const trackMap={brukergrupper:'trackBrukergrupper'};
  document.getElementById(trackMap[track]).classList.add('active');
  activeCommonTrack=track;
  document.querySelectorAll('.fs-btn').forEach(b=>{b.style.opacity='1';b.style.pointerEvents='';});
}
function openBoxTrack(track){
  document.getElementById('boxSelector').classList.remove('active');
  document.querySelectorAll('.box-track').forEach(t=>t.classList.remove('active'));
  const trackMap={comm:'boxTrackComm',files:'boxTrackFiles',iso:'boxTrackIso'};
  document.getElementById(trackMap[track]).classList.add('active');
  activeBoxTrack=track;
  if(track==='iso'){showBoxPage(1);}
  if(track==='files'){
    filesActivePage=1;
    document.getElementById('filesPage1').classList.add('visible');
    document.getElementById('filesPage2').classList.remove('visible');
    document.querySelectorAll('#filesNav .page-btn').forEach((b,i)=>b.classList.toggle('active',i===0));
    flInitFiles();
  }
}
function backToBoxSelector(){
  document.querySelectorAll('.box-track').forEach(t=>t.classList.remove('active'));
  document.getElementById('boxSelector').classList.add('active');
  activeBoxTrack=null;
}
document.addEventListener('fullscreenchange',()=>{const t=document.fullscreenElement?'✕ Avslutt fullskjerm':'⛶ Fullskjerm';document.querySelectorAll('.fs-btn').forEach(b=>b.textContent=t);});
genHubSvg();createDots();applyHubLayout();
hubNodes.forEach(el=>{el.style.background=el.dataset.bg||'#fff';});

