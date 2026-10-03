// box-iso.js : modul i Dalux-presentasjonen. Lastes i rekkefolge fra index.html. Ingen byggesteg, rediger direkte.
function setIsoView(view){
  if(view===isoView)return;
  isoView=view;
  document.getElementById('tIso').classList.toggle('on',view==='iso');
  document.getElementById('tCde').classList.toggle('on',view==='cde');
  document.getElementById('isoViewList').style.display=view==='iso'?'':'none';
  document.getElementById('isoViewCde').style.display=view==='cde'?'':'none';
  const captions={iso:'Slik mapper ISO 19650 statusområdene til Dalux Box sine filområder',cde:'ISO 19650 stiller disse kravene til informasjonshåndtering'};
  document.getElementById('isoCaption').textContent=captions[view];
  // Update header and intro
  const subtitle=document.getElementById('boxP1Subtitle');
  const intro=document.getElementById('boxP1Intro');
  if(view==='iso'){
    subtitle.textContent='Internasjonal standard for informasjonshåndtering i bygge- og anleggsprosjekter';
    intro.innerHTML='<p>ISO 19650 handler om å sørge for at riktig informasjon er tilgjengelig for riktige personer til rett tid. Standarden setter rammene for hvordan dokumenter og modeller skal organiseres, navngis, deles og godkjennes gjennom hele prosjektets levetid.</p><p>Kjernen i standarden er et <strong>Common Data Environment (CDE)</strong>, ett felles sted der all prosjektinformasjon lever, med tydelige statusområder som viser hvor hvert dokument befinner seg i prosessen.</p>';
  } else {
    subtitle.textContent='Dalux Box Pro er bygget for å støtte ISO 19650 i praksis';
    intro.innerHTML='<p>For å oppfylle ISO 19650 må en rekke krav til informasjonshåndtering være på plass. Dalux Box Pro dekker disse kravene med konkrete funksjoner som kan konfigureres og tilpasses hvert prosjekt.</p><p>Under ser du kravene fra standarden. Trykk <strong>Vis i Dalux</strong> for å se hvilke funksjoner i Box som dekker hvert krav.</p>';
  }
  if(view==='cde'){cdeMode='reqs';layoutCdeCards('reqs',false);}
}

let cdeMode='reqs';
const CDE_CARD_COUNT=8;
const CDE_ITEM_H_REQS=40;
const CDE_ITEM_GAP=8;

function layoutCdeCards(mode,animate){
  const stage=document.getElementById('cdeStage');
  stage.className='cde-stage '+mode+'-mode';
  document.getElementById('tReqs').classList.toggle('on',mode==='reqs');
  document.getElementById('tDalux').classList.toggle('on',mode==='dalux');

  const cards=[];
  for(let i=0;i<CDE_CARD_COUNT;i++)cards.push(document.getElementById('cdeCard'+i));

  if(mode==='reqs'){
    let y=0;
    cards.forEach(c=>{
      c.style.left='0';
      c.style.top=y+'px';
      c.style.width='100%';
      c.style.minHeight='';
      y+=CDE_ITEM_H_REQS+CDE_ITEM_GAP;
    });
    stage.style.height=y+'px';
  } else {
    // Calculate 2x4 grid positions with absolute positioning
    const stageW=stage.offsetWidth;
    const gap=14;
    const colW=(stageW-gap)/2;
    const cols=2, rows=4;

    // First pass: position cards and let them render to get heights
    cards.forEach((c,i)=>{
      const col=i%cols;
      c.style.width=colW+'px';
      c.style.left=(col*(colW+gap))+'px';
      c.style.top='0px';
    });

    // After transition starts, measure actual heights and align rows
    const doLayout=()=>{
      const rowH=[];
      for(let r=0;r<rows;r++){
        const c0=cards[r*cols], c1=cards[r*cols+1];
        const h=Math.max(c0.offsetHeight,c1.offsetHeight);
        rowH.push(h);
      }
      let y=0;
      for(let r=0;r<rows;r++){
        for(let col=0;col<cols;col++){
          const c=cards[r*cols+col];
          c.style.left=(col*(colW+gap))+'px';
          c.style.top=y+'px';
          c.style.width=colW+'px';
          // Set min-height so both cards in row match
          c.style.minHeight=rowH[r]+'px';
        }
        y+=rowH[r]+gap;
      }
      stage.style.height=y+'px';
    };

    // Measure after dalux content expands
    setTimeout(doLayout,50);
    setTimeout(doLayout,700);
  }
}

function setCdeMode(mode){
  if(mode===cdeMode)return;
  cdeMode=mode;
  const cap=document.getElementById('isoCaption');
  cap.textContent=mode==='reqs'?'ISO 19650 stiller disse kravene til informasjonshåndtering':'Slik dekker Dalux Box Pro hvert ISO 19650-krav';
  layoutCdeCards(mode,true);
}

// Document workflow steps
const DOC_STEPS=[
  {zone:'wip',num:'1',numBg:'var(--box-blue-g)',numColor:'var(--box-blue)',
   title:'Prosjekterende laster opp utkast',
   body:'Arkitekt laster opp første versjon av plantegning 2. etasje i Filer-området. Dokumentet er kun synlig for arkitektens team og er under utvikling.',
   doc:{name:'A-201-Plan-2etg.pdf',rev:'P01.1',status:'Filer (under arbeid)',statusBg:'var(--box-blue-g)',statusColor:'var(--box-blue)'}},
  {zone:'wip',num:'2',numBg:'var(--box-blue-g)',numColor:'var(--box-blue)',
   title:'Intern kontroll og oppdatering',
   body:'Fagansvarlig gjennomgår tegningen internt og legger inn kommentarer. Arkitekt oppdaterer og laster opp ny revisjon. Dokumentet er fortsatt i Filer.',
   doc:{name:'A-201-Plan-2etg.pdf',rev:'P01.2',status:'Under revisjon',statusBg:'var(--box-blue-g)',statusColor:'var(--box-blue)'}},
  {zone:'shared',num:'3',numBg:'var(--box-amber-g)',numColor:'var(--box-amber)',
   title:'Delt for tverrfaglig koordinering',
   body:'Dokumentet flyttes til Delte filer og blir tilgjengelig for alle prosjekterende. RiB og RiV kan nå se tegningen og koordinere sine fag mot den.',
   doc:{name:'A-201-Plan-2etg.pdf',rev:'S01',status:'Delt for koordinering',statusBg:'var(--box-amber-g)',statusColor:'var(--box-amber)'}},
  {zone:'shared',num:'4',numBg:'var(--box-amber-g)',numColor:'var(--box-amber)',
   title:'Kommentarer og tilbakemelding',
   body:'RiB melder om kollisjon med bæresystem. Dokumentet sendes tilbake til Filer for oppdatering. Etter revidering deles ny versjon på nytt i Delte filer.',
   doc:{name:'A-201-Plan-2etg.pdf',rev:'S02',status:'Revidert etter kommentarer',statusBg:'var(--box-amber-g)',statusColor:'var(--box-amber)'}},
  {zone:'published',num:'5',numBg:'var(--green-g)',numColor:'var(--green)',
   title:'Godkjent og publisert',
   body:'Etter gjennomgang er dokumentet godkjent og flyttes til Utgitte filer. Dette er nå gjeldende versjon som entreprenører og byggherren forholder seg til.',
   doc:{name:'A-201-Plan-2etg.pdf',rev:'C01',status:'Godkjent · Gjeldende',statusBg:'var(--green-g)',statusColor:'var(--green)'}},
  {zone:'done',num:'✓',numBg:'var(--green-g)',numColor:'var(--green)',
   title:'Full sporbarhet',
   body:'Alle revisjoner, kommentarer og statusendringer er logget. Historikken viser hele løpet fra første utkast til godkjent versjon. Videre arkivering (ISO S4) håndteres utenfor Box, f.eks. gjennom Dalux Handover for overlevering til drift, eller Dalux FM for forvaltning og vedlikehold.',
   doc:{name:'A-201-Plan-2etg.pdf',rev:'C01',status:'Dokumentert ✓',statusBg:'var(--green-g)',statusColor:'var(--green)'}},
];

let docCurrent=-1;
const zoneMap={wip:'dfWip',shared:'dfShared',published:'dfPublished'};
const zoneColors={wip:'var(--box-blue)',shared:'var(--box-amber)',published:'var(--green)'};

function initDocFlow(){
  docCurrent=-1;
  const tl=document.getElementById('docTimeline');
  tl.innerHTML='';
  DOC_STEPS.forEach((s,i)=>{
    const div=document.createElement('div');
    div.className='step'; div.id='docStep'+i;
    const docHtml=s.doc?`<div class="task-preview"><div class="task-status" style="background:${s.doc.statusBg};color:${s.doc.statusColor};">${s.doc.status}</div><div class="task-info"><div class="ti-title">${s.doc.name}</div><div class="ti-meta">Rev ${s.doc.rev}</div></div></div>`:'';
    div.innerHTML=`<div class="step-num" style="background:${s.numBg};color:${s.numColor};">${s.num}</div><div class="step-content"><h4>${s.title}</h4><p>${s.body}</p>${docHtml}</div>`;
    tl.appendChild(div);
  });
  const progEl=document.getElementById('docProgress');
  progEl.innerHTML=DOC_STEPS.map((_,i)=>`<div class="prog-dot" data-i="${i}"></div>`).join('');
  document.getElementById('docBtnNext').textContent='Start ▶';
  document.getElementById('docBtnPrev').disabled=true;
}

function docUpdate(){
  const steps=document.querySelectorAll('#docTimeline .step');
  steps.forEach((s,i)=>{s.classList.remove('active','done');if(i<docCurrent)s.classList.add('done');else if(i===docCurrent)s.classList.add('active');});
  document.querySelectorAll('#docProgress .prog-dot').forEach((d,i)=>{d.classList.remove('filled','current');if(i<docCurrent)d.classList.add('filled');else if(i===docCurrent)d.classList.add('current');});
  // Pipeline highlighting
  Object.values(zoneMap).forEach(id=>{const el=document.getElementById(id);el.classList.remove('active','done');el.style.borderColor='';});
  if(docCurrent>=0){
    const step=DOC_STEPS[docCurrent];
    // Mark previous zones done
    const zoneOrder=['wip','shared','published'];
    const curIdx=zoneOrder.indexOf(step.zone);
    zoneOrder.forEach((z,i)=>{
      const el=document.getElementById(zoneMap[z]);
      if(!el)return;
      if(i<curIdx){el.classList.add('done');el.style.borderColor=zoneColors[z];}
      else if(z===step.zone){el.classList.add('active');el.style.borderColor=zoneColors[z];}
    });
    if(step.zone==='done'){
      Object.entries(zoneMap).forEach(([z,id])=>{const el=document.getElementById(id);el.classList.add('done');el.style.borderColor='var(--green)';});
    }
  }
  document.getElementById('docBtnPrev').disabled=docCurrent<=0;
  document.getElementById('docBtnNext').textContent=docCurrent>=DOC_STEPS.length-1?'⟳ Start på nytt':docCurrent<0?'Start ▶':'Neste →';
  if(docCurrent>=0){const el=document.getElementById('docStep'+docCurrent);if(el)el.scrollIntoView({behavior:'smooth',block:'center'});}
}

function docNext(){
  if(docCurrent>=DOC_STEPS.length-1){docCurrent=-1;initDocFlow();return;}
  docCurrent++;docUpdate();
}
function docPrev(){if(docCurrent>0){docCurrent--;docUpdate();}}


