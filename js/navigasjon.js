// navigasjon.js : modul i Dalux-presentasjonen. Lastes i rekkefolge fra index.html. Ingen byggesteg, rediger direkte.
// ============================
// KEYBOARD
// ============================
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeWf();if(activeModule)backToSplash();}
  if(e.key==='PageDown'){e.preventDefault();presAdvance(1);}
  if(e.key==='PageUp'){e.preventDefault();presAdvance(-1);}
  if(activeModule==='field'){
    if(activePage===1&&!document.querySelector('.wf-overlay.show')){const vs=['list','hub'];const ci=vs.indexOf(currentView);if(e.key==='ArrowRight'&&ci<1){e.preventDefault();setView(vs[ci+1]);}if(e.key==='ArrowLeft'&&ci>0){e.preventDefault();setView(vs[ci-1]);}}
    if(activePage===2){if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();lcNext();}if(e.key==='ArrowLeft'){e.preventDefault();lcPrev();}if(e.key==='r')lcReset();}
  }
  if(activeModule==='box'&&boxActivePage===3){
    if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();docNext();}
    if(e.key==='ArrowLeft'){e.preventDefault();docPrev();}
  }
});

// Mus: tommelknapper (browser back/forward) navigerer som en peker/klikker.
// e.button 3 = tilbake, 4 = framover. preventDefault på mousedown demper nettleserens historikk-navigasjon.
window.addEventListener('mousedown', e=>{ if(e.button===3||e.button===4) e.preventDefault(); });
window.addEventListener('mouseup', e=>{
  if(e.button===3){ e.preventDefault(); presAdvance(-1); }
  else if(e.button===4){ e.preventDefault(); presAdvance(1); }
});

// Side arrow navigation
function getNavContext(){
  if(activeModule==='field') return {current:activePage, max:2, fn:showPage};
  if(activeModule==='box'){
    const commTrack=document.getElementById('boxTrackComm');
    const isoTrack=document.getElementById('boxTrackIso');
    const filesTrack=document.getElementById('boxTrackFiles');
    if(commTrack&&commTrack.classList.contains('active')) return {current:commActivePage, max:2, fn:showCommPage};
    if(isoTrack&&isoTrack.classList.contains('active')) return {current:boxActivePage, max:3, fn:showBoxPage};
    if(filesTrack&&filesTrack.classList.contains('active')) return {current:filesActivePage, max:2, fn:showFilesPage};
  }
  if(activeCommonTrack==='brukergrupper'){
    return {current:brukergrupperActivePage, max:3, fn:showBrukergrupperPage};
  }
  return null;
}

function navArrow(dir){
  const ctx=getNavContext();
  if(!ctx)return;
  const next=ctx.current+dir;
  if(next>=1&&next<=ctx.max) ctx.fn(next);
}

// Demo-navigasjon (Page Up/Down + mus-tommelknapper): stegg innholdet hvis siden
// har en stepper, ellers bla mellom sider. dir: 1 = framover, -1 = tilbake.
function presAdvance(dir){
  if(activeModule==='field' && activePage===2){ if(dir>0)lcNext(); else lcPrev(); return; }
  if(activeModule==='box'){
    const commTrack=document.getElementById('boxTrackComm');
    const isoTrack=document.getElementById('boxTrackIso');
    // Samhandling: stegg gjennom de fire fanene (Oppsett/Kommunikasjonsflyt/Statuser/Kommentar)
    if(commTrack && commTrack.classList.contains('active')){
      const order=['list','hub','status','comment'];
      const cur = commActivePage===2 ? 'comment' : commView;
      if(cur==='status'){
        if(dir>0 && statusStep < STATUS_TOTAL){ statusNext(); return; }
        if(dir<0 && statusStep > 1){ statusPrev(); return; }
      }
      let i = order.indexOf(cur) + dir;
      i = Math.max(0, Math.min(order.length-1, i));
      commTab(order[i]);
      return;
    }
    // ISO dokumentflyt (side 3): stegg dokumentet
    if(isoTrack && isoTrack.classList.contains('active') && boxActivePage===3){ if(dir>0)docNext(); else docPrev(); return; }
  }
  if(activeCommonTrack==='brukergrupper' && brukergrupperActivePage===3){ if(dir>0)bg3Next(); else bg3Prev(); return; }
  navArrow(dir);
}

function updateArrows(){
  const ctx=getNavContext();
  const aL=document.getElementById('arrowLeft');
  const aR=document.getElementById('arrowRight');
  if(!ctx){
    aL.classList.add('hidden');
    aR.classList.add('hidden');
    return;
  }
  aL.classList.toggle('hidden',ctx.current<=1);
  aR.classList.toggle('hidden',ctx.current>=ctx.max);
}

// Hook into existing navigation functions to update arrows
const _origShowPage=showPage;
showPage=function(n){
  document.getElementById('arrowLeft').classList.add('hidden');
  document.getElementById('arrowRight').classList.add('hidden');
  _origShowPage(n);
  setTimeout(updateArrows,850);
};
const _origShowBoxPage=showBoxPage;
showBoxPage=function(n){_origShowBoxPage(n);updateArrows();};
const _origShowCommPage=showCommPage;
showCommPage=function(n){_origShowCommPage(n);updateArrows();};
const _origShowFilesPage=showFilesPage;
showFilesPage=function(n){_origShowFilesPage(n);updateArrows();};
const _origOpenModule=openModule;
openModule=function(m){_origOpenModule(m);setTimeout(updateArrows,50);};
const _prevOpenBoxTrack=openBoxTrack;
openBoxTrack=function(t){_prevOpenBoxTrack(t);setTimeout(updateArrows,50);};
const _origOpenCommonTrack=openCommonTrack;
openCommonTrack=function(t){
  _origOpenCommonTrack(t);
  setTimeout(updateArrows,50);
  if(t==='brukergrupper'){
    // Reset til steg 1 hver gang tracket åpnes, og recompute layout
    bgCurrentStep=1;
    requestAnimationFrame(()=>applyBgLayout());
  }
};
const _origShowBrukergrupperPage=showBrukergrupperPage;
showBrukergrupperPage=function(n){_origShowBrukergrupperPage(n);updateArrows();};
const _origBackToSplash=backToSplash;
backToSplash=function(){_origBackToSplash();updateArrows();};
const _origBackToBoxSelector=backToBoxSelector;
backToBoxSelector=function(){_origBackToBoxSelector();updateArrows();};

// Responsivitet: recompute layout for synlige stager når vinduet endrer størrelse
let _resizeTimer=null;
window.addEventListener('resize', ()=>{
  clearTimeout(_resizeTimer);
  _resizeTimer=setTimeout(()=>{
    if(document.getElementById('modField').classList.contains('active')){
      applyHubLayout();
    }
    if(document.getElementById('boxTrackComm').classList.contains('active')){
      applyCommLayout();
      if(typeof commActivePage!=='undefined' && commActivePage===2){
        clApplyStep();
      }
    }
    if(document.getElementById('trackBrukergrupper').classList.contains('active')){
      applyBgLayout();
    }
    if(document.getElementById('boxTrackFiles').classList.contains('active') && filesActivePage===1){
      if(document.getElementById('ftvPraksis').classList.contains('on')){
        fllReserveHeight();
      }
      if(document.getElementById('ftvNavn').classList.contains('on') && flsSplit){
        flsSetSplit(false);
        requestAnimationFrame(()=>requestAnimationFrame(()=>flsSetSplit(true)));
      }
    }
  }, 120);
});

// ======================
// SIDE 3: Spotlight-stegvis visning ("Slik bygger du gode grupper")
// ======================
let bg3Step = 1;
const BG3_TOTAL = 3;
function bg3Update(scroll){
  document.querySelectorAll('#brukergrupperPage3 .bg-step').forEach(el=>{
    const n = parseInt(el.dataset.bgstep, 10);
    el.classList.remove('bg-future','bg-done','bg-active');
    if(n < bg3Step) el.classList.add('bg-done');
    else if(n === bg3Step) el.classList.add('bg-active');
    else el.classList.add('bg-future');
  });
  const prog = document.getElementById('bg3Progress');
  if(prog){
    prog.innerHTML='';
    for(let i=1;i<=BG3_TOTAL;i++){
      const d=document.createElement('div');
      d.className='prog-dot'+(i<bg3Step?' filled':(i===bg3Step?' current':''));
      prog.appendChild(d);
    }
  }
  const prev=document.getElementById('bg3Prev'), next=document.getElementById('bg3Next');
  if(prev) prev.disabled = bg3Step<=1;
  if(next) next.textContent = bg3Step>=BG3_TOTAL ? '↑ Til toppen' : 'Neste →';
  if(scroll){
    const active=document.querySelector('#brukergrupperPage3 .bg-step.bg-active');
    if(active) active.scrollIntoView({behavior:'smooth', block:'center'});
  }
}
function bg3Next(){ if(bg3Step>=BG3_TOTAL){ bg3Reset(); return; } bg3Step++; bg3Update(true); }
function bg3Prev(){ if(bg3Step>1){ bg3Step--; bg3Update(true); } }
function bg3Reset(){ bg3Step=1; bg3Update(false); window.scrollTo({top:0,behavior:'smooth'}); }
function bg3Activate(){ bg3Step=1; bg3Update(false); const c=document.getElementById('bg3Controls'); if(c) c.classList.add('visible'); }
function bg3Deactivate(){ const c=document.getElementById('bg3Controls'); if(c) c.classList.remove('visible'); }
const _bg3OrigShowPage = showBrukergrupperPage;
showBrukergrupperPage = function(n){ _bg3OrigShowPage(n); if(n===3) bg3Activate(); else bg3Deactivate(); };
const _bg3OrigOpenCommon = openCommonTrack;
openCommonTrack = function(t){ _bg3OrigOpenCommon(t); bg3Deactivate(); };
bg3Update(false);
