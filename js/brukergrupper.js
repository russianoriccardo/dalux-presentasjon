// brukergrupper.js : modul i Dalux-presentasjonen. Lastes i rekkefolge fra index.html. Ingen byggesteg, rediger direkte.
// ======================
// SIDE 1 ANIMERT SCENE
// ======================
const BG_SCENE_W=1000, BG_SCENE_H=500;
const bgPersons=[
  {id:'p1', name:'Stein Bygg',     role:'Byggherre',     group:'g1', initials:'SB'},
  {id:'p2', name:'Lars Anlegg',    role:'Totalentr.',    group:'g2', initials:'LA'},
  {id:'p3', name:'Erik Montasje',  role:'TE-fagleder',   group:'g2', initials:'EM'},
  {id:'p4', name:'Tor Ampere',     role:'RiE',           group:'g3', initials:'TA'},
  {id:'p5', name:'Kjell Sikker',   role:'HMS',           group:'g4', initials:'KS'},
  {id:'p6', name:'Lars Anlegg',    role:'Totalentr.',    group:'g4', initials:'LA', isCross:true},
];
const bgGroups=[
  {id:'g1', num:'10', name:'Byggherre',       color:'#6366f1'},  // indigo
  {id:'g2', num:'30', name:'Lars Anlegg AS',  color:'#e67e22'},  // orange
  {id:'g3', num:'60', name:'Strøm & Lys AS',  color:'#d4a017'},  // gul
  {id:'g4', num:'80', name:'HMS-koordinator', color:'#e74c3c'},  // rød
];
const bgActions=[
  // Field-handlinger
  {id:'a1', name:'Opprette oppgaver',         icon:'📝', module:'field'},
  {id:'a2', name:'Utføre kontrollplaner',     icon:'🔍', module:'field'},
  {id:'a3', name:'Utføre sjekklister',         icon:'📋', module:'field'},
  {id:'a4', name:'Capture',                   icon:'📸', module:'field'},
  // Box-handlinger
  {id:'a5', name:'Skrive kommentar',          icon:'💬', module:'box'},
  {id:'a6', name:'Lukke kommentar',           icon:'🔒', module:'box'},
  {id:'a7', name:'Laste opp filer',           icon:'📂', module:'box'},
  {id:'a8', name:'Godkjenne filer',           icon:'✅', module:'box'},
];
const bgConnections=[
  // Byggherre (g1) - bredt syn, godkjenner filer
  {from:'g1', to:'a5'}, {from:'g1', to:'a8'},
  // Lars Anlegg AS (g2) - totalentreprenør, full Field-bruker
  {from:'g2', to:'a1'}, {from:'g2', to:'a3'}, {from:'g2', to:'a5'}, {from:'g2', to:'a7'},
  // Strøm & Lys AS (g3) - RiE, kontroll og dokumentasjon
  {from:'g3', to:'a2'}, {from:'g3', to:'a5'}, {from:'g3', to:'a7'},
  // HMS-koordinator (g4) - HMS-spesifikk
  {from:'g4', to:'a4'}, {from:'g4', to:'a5'},
];
const bgCaptions={
  1:'Et byggeprosjekt har mange personer. Hver med sin rolle og sitt firma.',
  2:'Vi samler personene i grupper. Da slipper vi å styre hver person for seg, og noen kan være med i flere grupper.',
  3:'Klikk på en person for å se hvilke moduler de får tilgang til via sine grupper.',
};

let bgCurrentStep=1;
let bgSelectedPerson=null;
const bgSceneStage=document.getElementById('bgSceneStage');
const bgPersonEls={}, bgGroupEls={}, bgActionEls={};

function bgClickPerson(personId){
  if(bgCurrentStep!==3) return;
  bgSelectedPerson = (bgSelectedPerson===personId) ? null : personId;
  // Hvis en av Lars sine kort klikkes, alle Lars-kort er "valgt": finn det første
  const p = bgPersons.find(x=>x.id===bgSelectedPerson);
  if(p){
    const firstWithName = bgPersons.find(x=>x.name===p.name);
    if(firstWithName) bgSelectedPerson = firstWithName.id;
  }
  applyBgLayout();
}

function bgJoinNorwegian(items){
  if(items.length===0) return '';
  if(items.length===1) return items[0];
  return items.slice(0,-1).join(', ') + ' og ' + items[items.length-1];
}

function bgCreateScene(){
  // Personer
  bgPersons.forEach(p=>{
    const el=document.createElement('div');
    el.className='bg-person';
    el.dataset.id=p.id;
    el.innerHTML=`<div class="bg-person-avatar">${p.initials}</div>
                  <div class="bg-person-text"><span class="bg-person-name">${p.name}</span><span class="bg-person-role">${p.role}</span></div>`;
    el.addEventListener('click', ()=>bgClickPerson(p.id));
    bgSceneStage.appendChild(el);
    bgPersonEls[p.id]=el;
  });
  // Grupper (containere)
  bgGroups.forEach(g=>{
    const el=document.createElement('div');
    el.className='bg-group';
    el.dataset.id=g.id;
    el.style.setProperty('--group-color', g.color);
    el.innerHTML=`<div class="bg-group-header"><span class="bg-group-num">${g.num}</span><span class="bg-group-name">${g.name}</span></div>`;
    bgSceneStage.appendChild(el);
    bgGroupEls[g.id]=el;
  });
  // Handlinger (chips)
  bgActions.forEach(a=>{
    const el=document.createElement('div');
    el.className='bg-action mod-'+a.module;
    el.dataset.id=a.id;
    el.dataset.module=a.module;
    el.innerHTML=`<span class="bg-action-icon">${a.icon}</span><span class="bg-action-name">${a.name}</span>`;
    bgSceneStage.appendChild(el);
    bgActionEls[a.id]=el;
  });
  // Modul-section-headers ("I Field" / "I Box")
  ['field','box'].forEach(mod=>{
    const h=document.createElement('div');
    h.className='bg-action-header mod-'+mod;
    h.dataset.module=mod;
    h.textContent = mod==='field' ? 'I Field' : 'I Box';
    bgSceneStage.appendChild(h);
    bgActionEls['header-'+mod]=h;
  });
}

function getBgSceneLayout(){
  const w = bgSceneStage.offsetWidth || BG_SCENE_W;
  const h = bgSceneStage.offsetHeight || BG_SCENE_H;
  const scale = w / BG_SCENE_W;
  return {w, h, scale};
}

// Steg 1: personer spredt i et 3x2 grid på hele stagen
function bgPersonScatterPos(idx, L){
  const cols=3, rows=2;
  const col=idx%cols, row=Math.floor(idx/cols);
  const xUnit = L.w / (cols+1);
  const yUnit = L.h / (rows+1);
  return {x: xUnit*(col+1), y: yUnit*(row+1)};
}

// Steg 2/3: gruppene som bokser i 2x2 grid på venstre halvdel (når handlinger vises) eller bredere (steg 2 uten handlinger)
function bgGroupBox(idx, step, L){
  const cols=2, rows=2;
  const col=idx%cols, row=Math.floor(idx/cols);
  // Bredde for grupperingen: bruk hele stagen i steg 2, ca 60% i steg 3 (handlinger ligger fra 66%)
  const gridW = step===3 ? L.w * 0.60 : L.w * 0.92;
  const gridLeft = step===3 ? L.w * 0.02 : L.w * 0.04;
  const gridH = L.h * 0.88;
  const gridTop = L.h * 0.06;
  const gap = 14;
  const cellW = (gridW - gap*(cols-1)) / cols;
  const cellH = (gridH - gap*(rows-1)) / rows;
  return {
    x: gridLeft + col*(cellW+gap),
    y: gridTop + row*(cellH+gap),
    w: cellW, h: cellH,
  };
}

// Steg 2/3: personenes posisjon inne i sin gruppe
function bgPersonInGroupPos(person, step, L){
  const gIdx = bgGroups.findIndex(g=>g.id===person.group);
  const box = bgGroupBox(gIdx, step, L);
  // Stable medlemmer vertikalt i gruppa, med god klikkbar mellomrom
  const groupMembers = bgPersons.filter(p=>p.group===person.group);
  const memberIdx = groupMembers.findIndex(p=>p.id===person.id);
  const startY = box.y + 36; // plass til header + litt luft
  const rowH = 50; // person-kort er ca 42px høye, 50 gir 8px gap = ingen overlapp
  return {
    x: box.x + box.w/2 - 75, // 150px bred person-kort, sentrert
    y: startY + memberIdx*rowH,
  };
}

// Steg 3: handlingene plassert vertikalt på høyre side, gruppert under "I Field"/"I Box"
// Layout: 8 handlinger + 2 headers = 10 rader. Field-handlinger først, Box-handlinger etterpå.
function bgActionPos(action, L){
  const rightX = L.w * 0.66;       // venstre kant av handlings-kolonnen
  const colW   = L.w * 0.30;       // bredde for hver chip
  const topY   = L.h * 0.04;
  const headerH = 22;
  const rowH    = 32;
  const sectionGap = 8;

  const fieldActions = bgActions.filter(a=>a.module==='field');
  const boxActions   = bgActions.filter(a=>a.module==='box');

  // Beregn y-posisjon basert på handling-id eller header-flagg
  if(action._isHeader){
    if(action.module==='field') return {x:rightX, y:topY, w:colW, h:headerH};
    // Box-header: under alle Field-handlinger + gap
    return {x:rightX, y: topY + headerH + fieldActions.length*rowH + sectionGap, w:colW, h:headerH};
  }
  if(action.module==='field'){
    const i = fieldActions.findIndex(a=>a.id===action.id);
    return {x:rightX, y: topY + headerH + i*rowH, w:colW, h: rowH-4};
  } else {
    const i = boxActions.findIndex(a=>a.id===action.id);
    const boxHeaderY = topY + headerH + fieldActions.length*rowH + sectionGap;
    return {x:rightX, y: boxHeaderY + headerH + i*rowH, w:colW, h: rowH-4};
  }
}

// Anker for SVG-linjer (midten av handlings-chip i design-koords)
function bgActionAnchor(action){
  const designL = {w:BG_SCENE_W, h:BG_SCENE_H};
  const p = bgActionPos(action, designL);
  return {x: p.x, y: p.y + p.h/2};
}

function applyBgLayout(){
  const L = getBgSceneLayout();
  const step = bgCurrentStep;

  // Personer
  bgPersons.forEach((p,i)=>{
    const el = bgPersonEls[p.id];
    let pos;
    if(step===1){
      pos = bgPersonScatterPos(i, L);
      el.style.left = (pos.x - 75) + 'px';
      el.style.top = (pos.y - 18) + 'px';
      el.style.opacity = p.isCross ? '0' : '1';
    } else {
      pos = bgPersonInGroupPos(p, step, L);
      el.style.left = pos.x + 'px';
      el.style.top = pos.y + 'px';
      el.style.opacity = '1';
    }
  });

  // Grupper
  bgGroups.forEach((g,i)=>{
    const el = bgGroupEls[g.id];
    const box = bgGroupBox(i, step, L);
    el.style.left = box.x + 'px';
    el.style.top = box.y + 'px';
    el.style.width = box.w + 'px';
    el.style.height = box.h + 'px';
  });

  // Handlinger (chips) og section-headers
  bgActions.forEach(a=>{
    const el = bgActionEls[a.id];
    const pos = bgActionPos(a, L);
    el.style.left = pos.x + 'px';
    el.style.top = pos.y + 'px';
    el.style.width = pos.w + 'px';
    el.style.height = pos.h + 'px';
  });
  ['field','box'].forEach(mod=>{
    const el = bgActionEls['header-'+mod];
    const pos = bgActionPos({_isHeader:true, module:mod}, L);
    el.style.left = pos.x + 'px';
    el.style.top = pos.y + 'px';
    el.style.width = pos.w + 'px';
    el.style.height = pos.h + 'px';
  });

  // Steg 3: klikk-basert visning (Option C)
  bgSceneStage.classList.toggle('step-3', step===3);

  // Rydd alle highlight-klasser først
  Object.values(bgPersonEls).forEach(el=>el.classList.remove('selected','dimmed'));
  Object.values(bgGroupEls).forEach(el=>el.classList.remove('active','dimmed'));
  Object.values(bgActionEls).forEach(el=>el.classList.remove('active','dimmed'));

  if(step===3 && bgSelectedPerson){
    const selectedPerson = bgPersons.find(p=>p.id===bgSelectedPerson);
    // Finn alle gruppene personen er medlem i (matchet på navn for cross-membership)
    const personGroupIds = new Set(
      bgPersons.filter(p=>p.name===selectedPerson.name).map(p=>p.group)
    );
    const personActionIds = new Set();
    bgConnections.forEach(c=>{
      if(personGroupIds.has(c.from)) personActionIds.add(c.to);
    });

    // Apply highlight/dim-klasser
    bgPersons.forEach(p=>{
      const el = bgPersonEls[p.id];
      if(p.name===selectedPerson.name) el.classList.add('selected');
      else el.classList.add('dimmed');
    });
    bgGroups.forEach(g=>{
      const el = bgGroupEls[g.id];
      if(personGroupIds.has(g.id)) el.classList.add('active');
      else el.classList.add('dimmed');
    });
    bgActions.forEach(a=>{
      const el = bgActionEls[a.id];
      if(personActionIds.has(a.id)) el.classList.add('active');
      else el.classList.add('dimmed');
    });

    // SVG-linjer kun for valgt person sine grupper → handlinger
    // Linje-farge basert på modulen handlingen tilhører (grønn for Field, blå for Box)
    let svg='';
    const designL = {w: BG_SCENE_W, h: BG_SCENE_H};
    bgConnections.forEach(c=>{
      if(!personGroupIds.has(c.from)) return;
      const gIdx = bgGroups.findIndex(g=>g.id===c.from);
      const action = bgActions.find(a=>a.id===c.to);
      if(!action) return;
      const gBox = bgGroupBox(gIdx, step, designL);
      const aAnchor = bgActionAnchor(action);
      const gx = gBox.x + gBox.w;
      const gy = gBox.y + gBox.h/2;
      const lineColor = action.module==='field' ? 'var(--dalux)' : 'var(--box-blue)';
      svg += `<line x1="${gx}" y1="${gy}" x2="${aAnchor.x}" y2="${aAnchor.y}" stroke="${lineColor}" stroke-width="2.5" />`;
    });
    document.getElementById('bgSceneSvg').innerHTML = svg;

    // Dynamisk caption basert på valgt person
    const groupCount = personGroupIds.size;
    const groupText = groupCount===1 ? '1 gruppe' : `${groupCount} grupper`;
    const actionCount = personActionIds.size;
    const actionText = actionCount===1 ? '1 handling' : `${actionCount} handlinger`;
    // Hvilke moduler dekker handlingene?
    const modulesUsed = new Set(bgActions.filter(a=>personActionIds.has(a.id)).map(a=>a.module));
    const modLabels = [];
    if(modulesUsed.has('field')) modLabels.push('Field');
    if(modulesUsed.has('box')) modLabels.push('Box');
    const modText = bgJoinNorwegian(modLabels);
    document.getElementById('bgSceneCaption').innerHTML =
      `<strong>${selectedPerson.name}</strong> er medlem av <strong>${groupText}</strong> og kan utføre <strong>${actionText}</strong> i ${modText}.`;
  } else {
    document.getElementById('bgSceneSvg').innerHTML = '';
    document.getElementById('bgSceneCaption').textContent = bgCaptions[step];
  }

  // Klasser for å vise/skjule
  bgSceneStage.classList.toggle('show-groups', step>=2);
  bgSceneStage.classList.toggle('show-modules', step>=3);
  document.getElementById('bgSceneSvg').classList.toggle('show', step>=3);

  // Progress-prikker
  document.querySelectorAll('.bg-scene-dot').forEach((d,i)=>{
    const s = i+1;
    d.classList.toggle('active', s===step);
    d.classList.toggle('done', s<step);
  });

  // Knapper
  document.getElementById('bgPrevBtn').disabled = step<=1;
  document.getElementById('bgNextBtn').disabled = step>=3;
}

function bgStep(dir){
  const next = bgCurrentStep + dir;
  if(next<1 || next>3) return;
  bgCurrentStep = next;
  bgSelectedPerson = null;
  applyBgLayout();
}

// Init når scriptet kjører
bgCreateScene();
applyBgLayout();

