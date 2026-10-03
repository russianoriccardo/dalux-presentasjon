// box-mappestruktur.js : modul i Dalux-presentasjonen. Lastes i rekkefolge fra index.html. Ingen byggesteg, rediger direkte.
// ==========================================================
// MAPPESTRUKTUR-TRACK (Side 1): filnavn-splitt + fil-liste
// ==========================================================
let filesActivePage=1;
function showFilesPage(n){
  if(n===filesActivePage)return;
  [1,2].forEach(i=>document.getElementById('filesPage'+i).classList.toggle('visible',i===n));
  document.querySelectorAll('#filesNav .page-btn').forEach((b,i)=>b.classList.toggle('active',i+1===n));
  filesActivePage=n;
}

// --- Animasjon 1: filnavn-splitt (port av _proto_split) ---
const FLS_EX={
  enkel:{ note:'<b>Nummer</b> er standard-feltet Dalux bruker til automatiske koblinger. Hold det unikt, så lenker tegninger og dokumenter seg selv.', parts:[
    {label:'Fag', val:'RIB'},
    {label:'Nummer', val:'1042'},
    {label:'Beskrivelse', val:'Fundamentplan', besk:true},
  ]},
  detaljert:{ note:'Flere avgrensere = flere metadatafelt å filtrere og sortere på. For hyperlenking holder det med ett unikt <b>Nummer</b>, som i Enkel.', parts:[
    {label:'Bygg', val:'128'},
    {label:'Etasje', val:'02', hl:['flsTEtasje','02']},
    {label:'Fag', val:'B', hl:['flsTFag','B']},
    {label:'Type', val:'20', hl:['flsTType','20']},
    {label:'Systemkode', val:'220', hl:['flsTSys','220']},
    {label:'Løpenr', val:'001'},
    {label:'Beskrivelse', val:'Plantegning 2. etasje', besk:true},
  ]},
};
let flsCurrent='enkel', flsSplit=true;
function flsClearHl(){ document.querySelectorAll('#flsTables tr').forEach(r=>r.classList.remove('hl')); }
function flsBuild(){
  const ex=FLS_EX[flsCurrent];
  const pill=document.getElementById('flsPill'); pill.innerHTML='';
  const cols=document.getElementById('flsCols'); cols.innerHTML='';
  ex.parts.forEach((p,i)=>{
    if(i>0){ const d=document.createElement('span'); d.className='fls-delim'; d.textContent='-'; pill.appendChild(d); }
    const s=document.createElement('span'); s.className='fls-seg fls-c'+(i%7); s.id='flsSeg'+i; s.textContent=p.val; pill.appendChild(s);
    const col=document.createElement('div'); col.className='fls-col'+(p.besk?' besk':'');
    col.innerHTML='<div class="fls-collabel" id="flsLbl'+i+'">'+p.label+'</div><div class="fls-cell fls-c'+(i%7)+'" id="flsCell'+i+'"></div>';
    cols.appendChild(col);
  });
}
function flsApplySplit(){
  const ex=FLS_EX[flsCurrent];
  document.getElementById('flsStName').classList.toggle('on', !flsSplit);
  document.getElementById('flsStSplit').classList.toggle('on', flsSplit);
  document.querySelectorAll('#flsPill .fls-delim').forEach(d=>d.style.opacity = flsSplit ? '.2' : '1');
  const uq=document.getElementById('flsUnique'); uq.innerHTML=ex.note; uq.classList.toggle('show', flsSplit);
  const hasTables = ex.parts.some(p=>p.hl);
  document.getElementById('flsTables').classList.toggle('show', flsSplit && hasTables);
  flsClearHl();
  ex.parts.forEach((p,i)=>{
    const seg=document.getElementById('flsSeg'+i), cell=document.getElementById('flsCell'+i), lbl=document.getElementById('flsLbl'+i);
    if(flsSplit){
      const sr=seg.getBoundingClientRect(), cr=cell.getBoundingClientRect();
      const dx=(cr.left+cr.width/2)-(sr.left+sr.width/2);
      const dy=(cr.top+cr.height/2)-(sr.top+sr.height/2);
      seg.style.transitionDelay=(i*0.07)+'s';
      seg.style.transform='translate('+dx+'px,'+dy+'px)';
      setTimeout(()=>{ cell.classList.add('filled'); lbl.classList.add('show');
        if(p.hl){ const r=document.querySelector('#'+p.hl[0]+' tr[data-k="'+p.hl[1]+'"]'); if(r) r.classList.add('hl'); }
      }, 520 + i*70);
    } else {
      seg.style.transitionDelay='0s';
      seg.style.transform='none';
      cell.classList.remove('filled'); lbl.classList.remove('show');
    }
  });
}
function flsSetSplit(on){ flsSplit=on; flsApplySplit(); }
function flsSetExample(key){
  flsCurrent=key; flsSplit=true;
  document.getElementById('flsTgEnkel').classList.toggle('on', key==='enkel');
  document.getElementById('flsTgDet').classList.toggle('on', key==='detaljert');
  flsBuild();
  flsSetSplit(false);
  setTimeout(()=>flsSetSplit(true), 450);
}

// --- Animasjon 2: Dalux fil-liste (port av _proto_dalux) ---
const FLL_FILES=[
  {nr:'128-01-A-20-200-001',  fag:'ARK', type:'Plantegning', et:'01',  besk:'Plan 1. etasje'},
  {nr:'128-02-A-20-200-002',  fag:'ARK', type:'Plantegning', et:'02',  besk:'Plan 2. etasje'},
  {nr:'128-T01-A-20-200-003', fag:'ARK', type:'Plantegning', et:'T01', besk:'Takplan'},
  {nr:'128-01-A-40-200-010',  fag:'ARK', type:'Fasade',      et:'01',  besk:'Fasade sør'},
  {nr:'128-02-A-40-200-011',  fag:'ARK', type:'Snitt',       et:'02',  besk:'Snitt B-B'},
  {nr:'128-01-A-50-200-020',  fag:'ARK', type:'Detalj',      et:'01',  besk:'Detalj inngangsparti'},
  {nr:'128-01-A-60-200-030',  fag:'ARK', type:'Skjema',      et:'01',  besk:'Dørskjema'},
  {nr:'128-U00-B-20-220-001', fag:'RIB', type:'Plantegning', et:'U00', besk:'Fundament underetasje'},
  {nr:'128-01-B-20-220-002',  fag:'RIB', type:'Plantegning', et:'01',  besk:'Dekkeplan 1. etasje'},
  {nr:'128-02-B-20-220-003',  fag:'RIB', type:'Plantegning', et:'02',  besk:'Fundamentplan 2. etasje'},
  {nr:'128-02-B-40-220-010',  fag:'RIB', type:'Snitt',       et:'02',  besk:'Snitt A-A'},
  {nr:'128-01-B-50-220-020',  fag:'RIB', type:'Detalj',      et:'01',  besk:'Armeringsdetalj'},
  {nr:'128-U00-C-20-300-001', fag:'RIV', type:'Plantegning', et:'U00', besk:'Ventilasjon underetasje'},
  {nr:'128-02-C-20-360-002',  fag:'RIV', type:'Plantegning', et:'02',  besk:'Ventilasjon 2. etasje'},
  {nr:'128-01-C-70-300-010',  fag:'RIV', type:'Prinsipp',    et:'01',  besk:'Prinsipp røropplegg'},
  {nr:'128-02-C-60-360-020',  fag:'RIV', type:'Skjema',      et:'02',  besk:'Ventilasjonsskjema'},
  {nr:'128-01-D-20-400-001',  fag:'RIE', type:'Plantegning', et:'01',  besk:'Kursopplegg 1. etasje'},
  {nr:'128-02-D-20-400-002',  fag:'RIE', type:'Plantegning', et:'02',  besk:'Belysning 2. etasje'},
  {nr:'128-01-D-60-400-010',  fag:'RIE', type:'Skjema',      et:'01',  besk:'Strømskjema'},
  {nr:'128-02-D-70-400-020',  fag:'RIE', type:'Prinsipp',    et:'02',  besk:'Prinsipp nødlys'},
];
const FLL_FAG=['Alle','ARK','RIB','RIE','RIV'];
const FLL_ET =['Alle','U00','01','02','T01'];
let fllFag='Alle', fllEt='Alle';
function fllChipHtml(val,active,group){
  return '<button class="fll-chip'+(val===active?' on':'')+'" onclick="fllSetFilter(\''+group+'\',\''+val+'\')">'+val+'</button>';
}
function fllRenderChips(){
  document.getElementById('fllFagChips').innerHTML=FLL_FAG.map(v=>fllChipHtml(v,fllFag,'fag')).join('');
  document.getElementById('fllEtChips').innerHTML =FLL_ET.map(v=>fllChipHtml(v,fllEt,'et')).join('');
}
function fllSetFilter(group,val){ if(group==='fag') fllFag=val; else fllEt=val; fllRender(); }
function fllRender(){
  fllRenderChips();
  const shown=FLL_FILES.filter(f=>(fllFag==='Alle'||f.fag===fllFag)&&(fllEt==='Alle'||f.et===fllEt));
  const tb=document.getElementById('fllRows');
  if(shown.length){
    tb.innerHTML=shown.map(f=>
      '<tr><td class="nr">'+f.nr+'</td>'+
      '<td><span class="fll-tag '+f.fag.toLowerCase()+'">'+f.fag+'</span></td>'+
      '<td>'+f.type+'</td><td>'+f.et+'</td><td>'+f.besk+'</td></tr>'
    ).join('');
  } else {
    tb.innerHTML='<tr><td colspan="5" class="fll-empty">Ingen treff</td></tr>';
  }
  document.getElementById('fllCount').innerHTML='Viser <b>'+shown.length+'</b> av '+FLL_FILES.length+' tegninger';
}
// Reserver fast høyde lik full liste, så filtrering ikke endrer sidehøyden
// (ellers «hopper» scroll-posisjonen når antall treff endrer seg).
function fllReserveHeight(){
  const wrap=document.querySelector('.fll-scroll'); if(!wrap) return;
  const f=fllFag, e=fllEt;
  fllFag='Alle'; fllEt='Alle';
  wrap.style.minHeight='0px';
  fllRender();
  wrap.style.minHeight=wrap.offsetHeight+'px';
  fllFag=f; fllEt=e;
  fllRender();
}

// Init + replay når tracket åpnes (rects krever synlig layout)
// Splitten spilles av først når stagen scrolles inn i visningen, slik at
// brukeren rekker å se den uansett skjermstørrelse (ikke ferdig før de scroller).
let flsObserver=null, flsPlayed=false;
function flSetupObserver(){
  const stage=document.querySelector('.fls-stage');
  if(!stage || !('IntersectionObserver' in window)){ flsSetSplit(true); return; }
  if(flsObserver) flsObserver.disconnect();
  flsObserver=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !flsPlayed){
        flsPlayed=true;
        setTimeout(()=>flsSetSplit(true), 1000);
      }
    });
  }, { threshold:0.35 });
  flsObserver.observe(stage);
}
// Tre faner på Side 1: Mappestruktur / Navngiving og metadata / Filtrering i praksis.
// Splitten og fil-lista lever i skjulte faner ved åpning, så de initialiseres
// (måles/spilles av) først når fanen vises.
const FILES_TABS={ struktur:{view:'ftvStruktur', btn:'ftStruktur'}, navn:{view:'ftvNavn', btn:'ftNavn'}, praksis:{view:'ftvPraksis', btn:'ftPraksis'} };
let filesTab='struktur';
function setFilesTab(tab, noScroll){
  filesTab=tab;
  Object.keys(FILES_TABS).forEach(k=>{
    document.getElementById(FILES_TABS[k].view).classList.toggle('on', k===tab);
    document.getElementById(FILES_TABS[k].btn).classList.toggle('on', k===tab);
  });
  if(tab==='navn'){
    // Re-arm splitten (scroll-utløst) hver gang fanen åpnes
    flsSetSplit(false);
    flsPlayed=false;
    flSetupObserver();
  }
  if(tab==='praksis'){
    fllFag='Alle'; fllEt='Alle';
    fllRender();
    fllReserveHeight();   // måling krever synlig liste
  }
  if(!noScroll) window.scrollTo(0,0);
}
function flInitFiles(){
  flsCurrent='enkel';
  document.getElementById('flsTgEnkel').classList.add('on');
  document.getElementById('flsTgDet').classList.remove('on');
  flsBuild();
  flsSetSplit(false);   // hviletilstand: helt filnavn (Tegningsnavn)
  fllFag='Alle'; fllEt='Alle';
  fllRender();
  flsPlayed=false;
  setFilesTab('struktur', true);   // start på første fane, uten scroll
}

let brukergrupperActivePage=1;
function showBrukergrupperPage(n){
  if(n===brukergrupperActivePage)return;
  [1,2,3].forEach(i=>{
    const pg=document.getElementById('brukergrupperPage'+i);
    pg.style.display='none';pg.style.opacity='0';pg.classList.remove('visible');
  });
  const pg=document.getElementById('brukergrupperPage'+n);
  pg.style.display='flex';
  requestAnimationFrame(()=>{pg.style.opacity='1';pg.classList.add('visible');});
  document.querySelectorAll('#brukergrupperNav .page-btn').forEach((b,i)=>b.classList.toggle('active',i+1===n));
  brukergrupperActivePage=n;
}
