// box-samhandling.js : modul i Dalux-presentasjonen. Lastes i rekkefolge fra index.html. Ingen byggesteg, rediger direkte.
// ============================
// BOX MODULE
// ============================
let boxActivePage=1;
let isoView='iso';

// =========================================
// BOX COMM: List ↔ Hub
// =========================================
const commGroups=[
  {code:'71.122',name:'RiB',full:'Rådgivende ingeniør bygg',perms:[1,1,0],col:'#8b5cf6',members:['Per Betong','Lise Stålsen']},
  {code:'71.123',name:'ARK',full:'Arkitekt',perms:[1,1,0],col:'#ef4444',members:['Kari Fasade']},
  {code:'71.124',name:'RiE',full:'Rådgivende ingeniør elektro',perms:[1,1,0],col:'#f59e0b',members:['Tor Ampere']},
  {code:'71.127',name:'RiV',full:'Rådgivende ingeniør VVS',perms:[1,1,0],col:'#10b981',members:['Ole Ventansen','Anna Rørvik']},
  {code:'41.00',name:'Totalentreprise',full:'Totalentreprise',perms:[1,1,0],col:'#06b6d4',members:['Lars Anlegg','Erik Montasje','Nina Fremdrift']},
  {code:'',name:'Prosj.leder',full:'Prosjekteringsleder',perms:[1,1,1],col:'#ec4899',members:['Ingrid Plansson','Jonas Koordinsen','Frida Ledersen'],isCenter:true},
];
const commCenterGroup={code:'',name:'Prosj.leder',full:'Prosjekteringsleder',perms:[1,1,1],col:'#ec4899',members:['Ingrid Plansson','Jonas Koordinsen','Frida Ledersen']};
const commPermLabels=['Les','Rediger','Lukk'];
const commStage=document.getElementById('commStage');
const commNodes=[];
const commDots=[];
const COMM_DOT_N=1;
let commView='list';

// Build nodes
commGroups.forEach((g,i)=>{
  const el=document.createElement('div');
  el.className='comm-node';
  let permsHtml='';
  g.perms.forEach((p,pi)=>{
    permsHtml+=`<div class="comm-perm"><span class="comm-perm-dot ${p?'perm-on':'perm-off'}" style="${p?'background:'+g.col:''}"></span>${commPermLabels[pi]}</div>`;
  });
  const membersHtml=g.members.length?g.members.slice(0,2).join(', ')+(g.members.length>2?` + ${g.members.length-2} mer`:''):'Tom gruppe';
  el.innerHTML=`
    ${g.code?`<div class="comm-node-code">${g.code}</div>`:''}
    <div class="comm-node-name">${g.full}</div>
    <div class="comm-node-perms">${permsHtml}</div>
    <div class="comm-node-members">${membersHtml}</div>
  `;
  el.dataset.col=g.col;
  el.dataset.shortName=g.name;
  el.dataset.fullName=g.full;
  commStage.appendChild(el);
  commNodes.push(el);
});

// Build dots
for(let i=0;i<COMM_DOT_N;i++){
  const d=document.createElement('div');
  d.className='comm-dot';d._active=false;
  commStage.appendChild(d);commDots.push(d);
}

// Position center hub
const commCenterEl=document.getElementById('commCenter');

// Design-koordinater for SVG viewBox - DOM-posisjoner regnes responsivt fra disse
const COMM_DESIGN_W=1100, COMM_DESIGN_H=600;
function getCommLayout(){
  const w = commStage.offsetWidth || COMM_DESIGN_W;
  const h = commStage.offsetHeight || COMM_DESIGN_H;
  const scale = w / COMM_DESIGN_W;
  return {
    w, h, scale,
    cx: w * 0.5,
    cy: h * (280/COMM_DESIGN_H),
    rx: w * (380/COMM_DESIGN_W),
    ry: h * (220/COMM_DESIGN_H),
    hubNodeW: Math.max(140, Math.min(180, 180*scale)),
    hubNodeH: 80,
    listNodeW: Math.max(210, Math.min(270, 270*scale)),
    listNodeH: 120,
    centerW: Math.max(170, Math.min(210, 210*scale)),
    centerH: 84,
  };
}

// List positions: 3-column grid
function getCommListPos(i, L){
  L=L||getCommLayout();
  const cols=3, gapX=16, gapY=14, offY=50;
  const col=i%cols, row=Math.floor(i/cols);
  const totalW=cols*L.listNodeW+(cols-1)*gapX;
  const startX=(L.w-totalW)/2;
  return {left:startX+col*(L.listNodeW+gapX), top:offY+row*(L.listNodeH+gapY), w:L.listNodeW, h:L.listNodeH};
}

// Hub positions: ellipse
function getCommHubPos(i, L){
  L=L||getCommLayout();
  // Skip center group in ellipse
  const outerGroups=commGroups.filter(g=>!g.isCenter);
  const outerIdx=commGroups.slice(0,i+1).filter(g=>!g.isCenter).length-1;
  if(commGroups[i].isCenter){
    return {left:L.cx-90, top:L.cy-40, w:0, h:0, hide:true};
  }
  const n=outerGroups.length;
  const a=(outerIdx/n)*Math.PI*2-Math.PI/2;
  return {left:L.cx+Math.cos(a)*L.rx-L.hubNodeW/2, top:L.cy+Math.sin(a)*L.ry-L.hubNodeH/2, w:L.hubNodeW, h:L.hubNodeH};
}

function applyCommPos(fn){
  const L=getCommLayout();
  commNodes.forEach((el,i)=>{
    const p=fn(i,L);
    if(p.hide){
      el.style.opacity='0';el.style.pointerEvents='none';
      el.style.left=p.left+'px';el.style.top=p.top+'px';
      el.style.width='0px';el.style.height='0px';
    }else{
      el.style.opacity='1';el.style.pointerEvents='auto';
      el.style.left=p.left+'px';el.style.top=p.top+'px';
      el.style.width=p.w+'px';el.style.height=p.h+'px';
    }
  });
}

function genCommSvg(){
  // SVG bruker design-koordinater (viewBox 0 0 1100 600) og skaleres automatisk
  const cx=COMM_DESIGN_W/2, cy=280, rx=380, ry=220;
  const outer=[];
  commGroups.forEach((g,i)=>{
    if(g.isCenter)return;
    const outerIdx=outer.length;
    const n=commGroups.filter(g=>!g.isCenter).length;
    const a=(outerIdx/n)*Math.PI*2-Math.PI/2;
    outer.push({x:cx+Math.cos(a)*rx, y:cy+Math.sin(a)*ry, col:g.col});
  });
  let s='';
  // Lines between outer nodes
  for(let i=0;i<outer.length;i++){
    for(let j=i+1;j<outer.length;j++){
      s+=`<line x1="${outer[i].x}" y1="${outer[i].y}" x2="${outer[j].x}" y2="${outer[j].y}" stroke="${outer[i].col}"/>`;
    }
    // Lines from each outer to center
    s+=`<line x1="${outer[i].x}" y1="${outer[i].y}" x2="${cx}" y2="${cy}" stroke="${commCenterGroup.col}" opacity=".25" stroke-dasharray="8 4" stroke-width="2"/>`;
  }
  document.getElementById('commSvg').innerHTML=s;
}

const commCaptions={
  list:'Kommunikasjonsflyten viser hvilke grupper som kan kommunisere sammen',
  hub:'Følg kommentaren mellom gruppene. Den lukkes av Prosjekteringsleder'
};

function setCommView(view){
  if(view===commView)return;
  commView=view;
  commSyncTabs();

  // Vis/skjul info-containere
  document.getElementById('commInfoList').style.display = view==='list' ? 'block' : 'none';
  document.getElementById('commInfoHub').style.display = view==='hub' ? 'block' : 'none';
  document.getElementById('commInfoStatus').style.display = view==='status' ? 'block' : 'none';

  // Stage og caption skjules helt i status-modus (statuser handler ikke om gruppene)
  commStage.style.display = view==='status' ? 'none' : '';
  document.getElementById('commCaption').style.display = view==='status' ? 'none' : '';

  if(view==='status'){
    stopCommDotAnim();
    statusActivate();
    return;
  }
  statusDeactivate();

  // List/hub-modus: oppdater stage som før
  commStage.className='comm-stage '+(view==='list'?'list-view':'hub-view');
  commNodes.forEach((el,i)=>{
    el.querySelector('.comm-node-name').textContent=view==='list'?el.dataset.fullName:el.dataset.shortName;
    if(view==='hub'){
      el.style.borderLeftColor=el.dataset.col;el.style.borderLeftWidth='3px';
    }else{
      el.style.borderLeftColor='';el.style.borderLeftWidth='';
    }
  });
  applyCommPos(view==='list'?getCommListPos:getCommHubPos);
  document.getElementById('commCaption').textContent=commCaptions[view];
  if(view==='hub'){genCommSvg();startCommDotAnim();}else{stopCommDotAnim();}
}

// Felles 4-tab-navigasjon for Samhandling-tracken (Oppsett/Kommunikasjonsflyt/Statuser/Kommentar).
// Tab 1-3 er visninger på side 1, tab 4 (Kommentar) er side 2. Tab-raden ligger på begge sider.
function commSyncTabs(){
  const active = commActivePage===2 ? 'comment' : commView;
  document.querySelectorAll('#boxTrackComm .comm-tab').forEach(t=>{
    t.classList.toggle('on', t.dataset.commtab===active);
  });
}
function commTab(target){
  if(target==='comment'){ showCommPage(2); }
  else { if(commActivePage!==1) showCommPage(1); setCommView(target); }
  commSyncTabs();
}

// Statuser-fanen: spotlight-stegvis visning (3 steg: sammenligning, eksempler, prinsipper)
let statusStep = 1;
const STATUS_TOTAL = 3;
function statusUpdate(scroll){
  document.querySelectorAll('#commInfoStatus .bg-step').forEach(el=>{
    const n = parseInt(el.dataset.statusstep, 10);
    el.classList.remove('bg-future','bg-done','bg-active');
    if(n < statusStep) el.classList.add('bg-done');
    else if(n === statusStep) el.classList.add('bg-active');
    else el.classList.add('bg-future');
  });
  const prog = document.getElementById('statusProgress');
  if(prog){
    prog.innerHTML='';
    for(let i=1;i<=STATUS_TOTAL;i++){
      const d=document.createElement('div');
      d.className='prog-dot'+(i<statusStep?' filled':(i===statusStep?' current':''));
      prog.appendChild(d);
    }
  }
  const prev=document.getElementById('statusPrev'), next=document.getElementById('statusNext');
  if(prev) prev.disabled = statusStep<=1;
  if(next) next.textContent = statusStep>=STATUS_TOTAL ? '↑ Til toppen' : 'Neste →';
  if(scroll){
    const active=document.querySelector('#commInfoStatus .bg-step.bg-active');
    if(active) active.scrollIntoView({behavior:'smooth', block:'center'});
  }
}
function statusNext(){ if(statusStep>=STATUS_TOTAL){ statusReset(); return; } statusStep++; statusUpdate(true); }
function statusPrev(){ if(statusStep>1){ statusStep--; statusUpdate(true); } }
function statusReset(){ statusStep=1; statusUpdate(false); window.scrollTo({top:0, behavior:'smooth'}); }
function statusActivate(){ statusStep=1; statusUpdate(false); const c=document.getElementById('statusControls'); if(c) c.classList.add('visible'); }
function statusDeactivate(){ const c=document.getElementById('statusControls'); if(c) c.classList.remove('visible'); }
statusUpdate(false);

// Single-comment bounce animation
let commDotAnimId=null;
const commHubPositions=[];
function cacheCommHubPos(){
  const L=getCommLayout();
  commHubPositions.length=0;
  const outerGroups=commGroups.filter(g=>!g.isCenter);
  outerGroups.forEach((_,i)=>{
    const n=outerGroups.length;
    const a=(i/n)*Math.PI*2-Math.PI/2;
    commHubPositions.push({x:L.cx+Math.cos(a)*L.rx, y:L.cy+Math.sin(a)*L.ry});
  });
  // Center position for Prosjekteringsleder
  commHubPositions.push({x:L.cx, y:L.cy});
}

// Journey: pick a start node, bounce 2-4 times between random nodes, then end at center
let commJourney=[];
let commJourneyIdx=0;
let commDotProgress=0;
let commDotSpeed=0.005;
let commPauseFrames=0;
const commDot=()=>commDots[0];

function buildCommJourney(){
  const outerN=commGroups.filter(g=>!g.isCenter).length;
  const centerIdx=outerN; // last position in commHubPositions
  const start=Math.floor(Math.random()*outerN);
  const bounces=2+Math.floor(Math.random()*3); // 2-4 bounces
  commJourney=[start];
  for(let b=0;b<bounces;b++){
    let next=Math.floor(Math.random()*(outerN-1));
    if(next>=commJourney[commJourney.length-1])next++;
    commJourney.push(next);
  }
  commJourney.push(centerIdx); // always end at Prosjekteringsleder
  commJourneyIdx=0;
  commDotProgress=0;
  commDotSpeed=0.004+Math.random()*0.003;
  const d=commDot();
  const outerGroups=commGroups.filter(g=>!g.isCenter);
  const g=outerGroups[start];
  d.style.background=g.col;
  d.style.boxShadow=`0 0 8px ${g.col}80`;
  d.style.width='12px';d.style.height='12px';
  d._active=true;
}

function animateCommDot(){
  if(commPauseFrames>0){
    commPauseFrames--;
    commDotAnimId=requestAnimationFrame(animateCommDot);
    return;
  }
  const d=commDot();
  if(!d._active){
    buildCommJourney();
  }

  const fromIdx=commJourney[commJourneyIdx];
  const toIdx=commJourney[commJourneyIdx+1];
  if(toIdx===undefined){
    // Journey complete - pause then restart
    d.style.opacity=0;
    d._active=false;
    commPauseFrames=120; // ~2 second pause
    commDotAnimId=requestAnimationFrame(animateCommDot);
    return;
  }

  commDotProgress+=commDotSpeed;
  const p=Math.min(commDotProgress,1);
  const ease=p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2;

  const from=commHubPositions[fromIdx];
  const to=commHubPositions[toIdx];
  const x=from.x+(to.x-from.x)*ease;
  const y=from.y+(to.y-from.y)*ease;

  // Fade in/out at segment boundaries
  let opacity=1;
  if(p<0.08)opacity=p/0.08;

  // If arriving at center (final stop), shrink and fade
  const isFinal=toIdx===commGroups.filter(g=>!g.isCenter).length;
  if(isFinal&&p>0.7){
    const shrink=1-((p-0.7)/0.3)*0.6;
    d.style.width=(12*shrink)+'px';d.style.height=(12*shrink)+'px';
    d.style.background=commCenterGroup.col;
    d.style.boxShadow=`0 0 8px ${commCenterGroup.col}80`;
    if(p>0.85)opacity=(1-p)/0.15;
  }

  d.style.left=(x-6)+'px';d.style.top=(y-6)+'px';d.style.opacity=opacity;

  if(commDotProgress>=1){
    // Move to next segment
    commJourneyIdx++;
    commDotProgress=0;
    // Brief pause at each node
    if(commJourneyIdx<commJourney.length-1){
      commPauseFrames=50; // ~0.8s pause at each stop
      // Change color to current node's color
      const currentIdx=commJourney[commJourneyIdx];
      const outerGroups=commGroups.filter(g=>!g.isCenter);
      if(currentIdx<outerGroups.length){
        const g=outerGroups[currentIdx];
        d.style.background=g.col;
        d.style.boxShadow=`0 0 8px ${g.col}80`;
      }
    }
  }

  commDotAnimId=requestAnimationFrame(animateCommDot);
}

function startCommDotAnim(){
  if(!commDotAnimId){
    cacheCommHubPos();
    buildCommJourney();
    animateCommDot();
  }
}
function stopCommDotAnim(){
  if(commDotAnimId){cancelAnimationFrame(commDotAnimId);commDotAnimId=null;}
  commDots.forEach(d=>{d._active=false;d.style.opacity=0;});
  commJourney=[];commJourneyIdx=0;commPauseFrames=0;
}

function positionCommCenter(){
  const L=getCommLayout();
  commCenterEl.style.left=(L.cx-L.centerW/2)+'px';
  commCenterEl.style.top=(L.cy-L.centerH/2)+'px';
  commCenterEl.style.width=L.centerW+'px';
}
function applyCommLayout(){
  positionCommCenter();
  cacheCommHubPos();
  applyCommPos(commView==='list' ? getCommListPos : getCommHubPos);
}
// Init list positions
applyCommLayout();

// Page nav for comm track
let commActivePage=1;
function showCommPage(n){
  if(n===commActivePage)return;
  [1,2].forEach(i=>{
    const pg=document.getElementById('commPage'+i);
    pg.style.display='none';pg.style.opacity='0';pg.classList.remove('visible');
  });
  const pg=document.getElementById('commPage'+n);
  pg.style.display='flex';
  requestAnimationFrame(()=>{pg.style.opacity='1';pg.classList.add('visible');});
  commActivePage=n;
  commSyncTabs();
  if(n===1&&commView==='hub')startCommDotAnim();
  else stopCommDotAnim();
  if(n===2){
    // Reset kommentar-livssyklus til steg 1, og pussi opp puck-posisjon etter at siden er synlig
    clCurrentStep=1;
    requestAnimationFrame(()=>{requestAnimationFrame(()=>clApplyStep());});
  }
}

// ===== Kommentar-livssyklus animasjon (Comm side 2) =====
const CL_STEPS = [
  {card:1, group:'rie', desc:'<strong>Opprett kommentar:</strong> Velg fil (tegning, PDF eller BIM-modell) og marker med sky, pil, tekst eller måling. Fyll ut kommentarskjema med type, kommunikasjonsflyt, tittel, tidsfrist og beskrivelse. Kommentaren knyttes permanent til filen og posisjonen.', status:'Ny', statusClass:'cl-st-ny', puckClosed:false},
  {card:2, group:'ark', desc:'<strong>Send til gruppe eller person:</strong> Du sender kommentaren til en gruppe eller en person i flyten. Mottakeren får varsel, og kommentaren dukker opp på tegningen med en fargekode som viser statusen.', status:'Under behandling', statusClass:'cl-st-behandling', puckClosed:false},
  {card:3, group:'ark', desc:'<strong>Dialog og statusoppdatering:</strong> Mottakeren svarer med meldinger og vedlegg i kommentartråden. Statusen oppdateres underveis, f.eks. fra «Under behandling» til «Besvart». Du kan sende kommentaren videre til andre grupper i flyten hvis det trengs.', status:'Besvart', statusClass:'cl-st-besvart', puckClosed:false},
  {card:4, group:'pl',  desc:'<strong>Lukking:</strong> Når saken er ferdigbehandlet, lukker en bruker med Lukk-rettighet kommentaren. Hvem dette er avhenger av flyten, og det kan være prosjekteringsleder, byggherre eller en annen rolle. All historikk bevares: statusendringer, meldinger, vedlegg og tidsstempler.', status:'Lukket', statusClass:'cl-st-lukket', puckClosed:true},
];

let clCurrentStep = 1;

function clStep(dir){
  const next = clCurrentStep + dir;
  if(next<1 || next>CL_STEPS.length) return;
  clCurrentStep = next;
  clApplyStep();
}
function clGoTo(n){
  if(n<1 || n>CL_STEPS.length) return;
  clCurrentStep = n;
  clApplyStep();
}
function clApplyStep(){
  const s = CL_STEPS[clCurrentStep-1];

  // Aktiv stepper-fane (og 'done' for tidligere)
  document.querySelectorAll('#commPage2 .cl-step-tab').forEach(t=>{
    const n = parseInt(t.dataset.step);
    t.classList.toggle('active', n===clCurrentStep);
    t.classList.toggle('done', n<clCurrentStep);
  });

  // Beskrivelse oppdateres
  document.getElementById('clStepDesc').innerHTML = s.desc;

  // Aktiv gruppe
  document.querySelectorAll('#commPage2 .cl-group').forEach(g=>{
    g.classList.toggle('active', g.dataset.group===s.group);
  });

  // Puck-posisjon (i prosent av .cl-flow)
  const flowEl = document.getElementById('clFlow');
  const targetGroup = flowEl.querySelector('.cl-group[data-group="'+s.group+'"]');
  if(flowEl && targetGroup){
    const flowRect = flowEl.getBoundingClientRect();
    const targetRect = targetGroup.getBoundingClientRect();
    const centerPx = targetRect.left + targetRect.width/2 - flowRect.left;
    document.getElementById('clPuck').style.left = centerPx + 'px';
  }
  // Puck-farge (grønn ved lukket)
  document.getElementById('clPuck').classList.toggle('closed', s.puckClosed);

  // Statusbadge
  const sb = document.getElementById('clStatusBadge');
  sb.className = 'cl-status-badge ' + s.statusClass;
  sb.textContent = s.status;

  // Progressiv aktivitetslogg
  document.querySelectorAll('#commPage2 .comm-log-entry[data-show-from]').forEach(e=>{
    const showFrom = parseInt(e.dataset.showFrom);
    e.classList.toggle('cl-hidden', showFrom > clCurrentStep);
  });

  // Knapper
  document.getElementById('clPrevBtn').disabled = clCurrentStep<=1;
  document.getElementById('clNextBtn').disabled = clCurrentStep>=CL_STEPS.length;
}

// Hook into openBoxTrack
const origOpenBoxTrack=openBoxTrack;
openBoxTrack=function(track){
  stopCommDotAnim();
  origOpenBoxTrack(track);
  if(track==='comm'){
    commView='list';
    commStage.className='comm-stage list-view';
    commStage.style.display='';
    commNodes.forEach(el=>{el.querySelector('.comm-node-name').textContent=el.dataset.fullName;el.style.borderLeftColor='';el.style.borderLeftWidth='';});
    const cap=document.getElementById('commCaption');
    cap.textContent=commCaptions.list;
    cap.style.display='';
    document.getElementById('commInfoList').style.display='block';
    document.getElementById('commInfoHub').style.display='none';
    document.getElementById('commInfoStatus').style.display='none';
    showCommPage(1);
    commSyncTabs();
    // Recompute layout - stage var display:none før dette
    requestAnimationFrame(()=>applyCommLayout());
  }
};

function showBoxPage(n){
  if(n===boxActivePage)return;
  [1,2,3].forEach(i=>{
    const el=document.getElementById('boxPage'+i);
    el.classList.toggle('visible',i===n);
    el.classList.remove('slide-in-left','slide-in-right');
  });
  document.querySelectorAll('#boxNav .page-btn').forEach((b,i)=>b.classList.toggle('active',i+1===n));
  boxActivePage=n;
  if(n===3)initDocFlow();
}

