# Brukergrupper-track Implementasjonsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Legg til "Felles begreper"-seksjon på splash med en ny Brukergrupper-track (3 sider: konsept, standardgrupper, god praksis), per spec `specs/2026-05-21-brukergrupper-track-design.md`.

**Architecture:** Single HTML-fil (utvider v118 til v119). Ny `trackBrukergrupper`-container på toppnivå (ikke inni modField/modBox). Ny routing-funksjon `openCommonTrack(track)`. Gjenbruker eksisterende CSS-mønstre (`.page-nav`, `.page-btn`, `.hub-tab`) og det responsive layout-systemet fra v118.

**Tech Stack:** Vanilla HTML/CSS/JS, én HTML-fil. Ingen tests (presentasjons-prosjekt). Verifisering skjer ved manuell sjekk i nettleser etter hver task.

**Konvensjoner som ALLTID gjelder:**
- Norsk språk
- Ingen em-dashes (`--`)
- ARK (ikke RiA), ingen "Avvik" i Box-kontekst
- Bruk eksisterende CSS-variabler (`--topbar-h`, `--sticky-top`, `--purple` osv.)
- Knapper er `<button>` (ikke `<div onclick>`), ikon-knapper får aria-label
- Etter hver Task: Syver åpner v119 i nettleseren og verifiserer

---

## Task 1: Forberedelse - kopier v118 til v119

**Files:**
- Create: `dalux-field-presentasjon-v119.html` (kopi av v118)

- [ ] **Steg 1: Kopier filen**

```bash
cp "D:/Programmer/Interaktiv presentasjon/dalux-field-presentasjon-v118.html" \
   "D:/Programmer/Interaktiv presentasjon/dalux-field-presentasjon-v119.html"
```

- [ ] **Steg 2: Verifiser at filen er kopiert**

```bash
ls -la "D:/Programmer/Interaktiv presentasjon/"*.html
```

Forventet: Både v118 og v119 finnes, lik størrelse.

---

## Task 2: Legg til "Felles begreper"-seksjon på splash

**Files:**
- Modify: `dalux-field-presentasjon-v119.html` (CSS-blokken + splash HTML)

- [ ] **Steg 1: Legg til CSS for "Felles begreper"-seksjonen**

Etter `.box-track-card`-stilene (ved siden av `.coming-soon-badge`-blokken), legg til:

```css
  /* Felles begreper - seksjon under modul-kortene på splash */
  .splash-common-section {
    margin-top: 32px;
    text-align: center;
  }
  .splash-common-label {
    font-family: 'Space Mono', monospace; font-size: .7rem;
    text-transform: uppercase; letter-spacing: .1em;
    color: var(--muted); margin-bottom: 12px;
  }
  .splash-common-cards {
    display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
  }
  .splash-common-card {
    background: var(--surface); border: 2px solid var(--border); border-radius: 10px;
    padding: 14px 22px; cursor: pointer; transition: all .25s;
    display: flex; align-items: center; gap: 10px;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }
  .splash-common-card:hover {
    border-color: var(--purple);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(142,106,191,.15);
  }
  .splash-common-icon { font-size: 1.4rem; line-height: 1; }
  .splash-common-name { font-weight: 700; font-size: .92rem; color: var(--text); }
```

- [ ] **Steg 2: Legg til HTML for seksjonen i splash**

I splash-content (innenfor `<div class="splash-content">`), rett etter `</div>` som lukker `.splash-modules`, legg til:

```html
    <div class="splash-common-section">
      <p class="splash-common-label">Felles begreper</p>
      <div class="splash-common-cards">
        <button class="splash-common-card" onclick="openCommonTrack('brukergrupper')">
          <span class="splash-common-icon">👥</span>
          <span class="splash-common-name">Brukergrupper</span>
        </button>
      </div>
    </div>
```

- [ ] **Steg 3: Verifiser visuelt**

Åpne v119 i nettleseren. Splash skal vise:
- Field- og Box-kort (uendret)
- En linje "FELLES BEGREPER" under (Space Mono, uppercase, muted)
- Et lilla "👥 Brukergrupper"-kort under labelen

Klikk på kortet skal i denne fasen gi en JS-feil i konsollet (`openCommonTrack is not defined`). Det er forventet og fikses i Task 4.

---

## Task 3: Lag tomt scaffold for Brukergrupper-tracket

**Files:**
- Modify: `dalux-field-presentasjon-v119.html` (legg til ny `<div class="track">` etter modBox-blokken)

- [ ] **Steg 1: Finn riktig sted i HTML**

Etter `</div> <!-- end modBox -->`-kommentaren (omtrent linje 1900 i v118), men FØR `<div class="side-arrow left ...">`-elementene, skal det nye tracket inn.

- [ ] **Steg 2: Legg til track-container med toppbar og tomme sider**

```html
<!-- ============ TRACK: BRUKERGRUPPER (Felles begreper) ============ -->
<div class="common-track" id="trackBrukergrupper">
  <button class="back-btn" onclick="backToSplash()">← Forside</button>

  <div class="page-nav" id="brukergrupperNav">
    <button class="page-btn active" onclick="showBrukergrupperPage(1)" id="bgpb1"><span class="pnum">1</span> Hva er en brukergruppe?</button>
    <button class="page-btn" onclick="showBrukergrupperPage(2)" id="bgpb2"><span class="pnum">2</span> Standardgruppene</button>
    <button class="page-btn" onclick="showBrukergrupperPage(3)" id="bgpb3"><span class="pnum">3</span> Bygg egne grupper smart</button>
  </div>

  <button class="fs-btn" onclick="toggleFS()" id="fsBtnBrukergrupper" style="opacity:0;pointer-events:none">⛶ Fullskjerm</button>

  <!-- SIDE 1: Konsept (fylles i Task 5) -->
  <div class="page visible" id="brukergrupperPage1">
    <header>
      <h1>Hva er en brukergruppe?</h1>
      <p>Plassholder - innhold kommer</p>
    </header>
  </div>

  <!-- SIDE 2: Standardgruppene (fylles i Task 6) -->
  <div class="page" id="brukergrupperPage2">
    <header>
      <h1>Standardgruppene i Dalux</h1>
      <p>Plassholder - innhold kommer</p>
    </header>
  </div>

  <!-- SIDE 3: God praksis (fylles i Task 7) -->
  <div class="page" id="brukergrupperPage3">
    <header>
      <h1>Bygg egne grupper smart</h1>
      <p>Plassholder - innhold kommer</p>
    </header>
  </div>
</div>
```

- [ ] **Steg 3: Legg til CSS for common-track**

Etter `.box-track`-relaterte stiler (rundt linje 420 i v118), legg til:

```css
  /* Felles begreper-track (toppnivå, ikke i modBox/modField) */
  .common-track { display: none; }
  .common-track.active { display: block; }
  #brukergrupperPage1, #brukergrupperPage2, #brukergrupperPage3 {
    flex-direction: column; align-items: center;
    padding: 70px 24px 40px; overflow-y: auto; min-height: 100vh;
  }
  #brukergrupperPage1 header, #brukergrupperPage2 header, #brukergrupperPage3 header {
    text-align: center; margin-bottom: 24px;
  }
  #brukergrupperPage1 header h1, #brukergrupperPage2 header h1, #brukergrupperPage3 header h1 {
    font-size: 1.6rem; font-weight: 700; letter-spacing: -.02em;
  }
  #brukergrupperPage1 header p, #brukergrupperPage2 header p, #brukergrupperPage3 header p {
    color: var(--muted); font-size: .88rem; margin-top: 4px;
  }
```

- [ ] **Steg 4: Verifiser**

Åpne v119. Klikk Brukergrupper-kortet — fortsatt JS-feil, men nå skal scaffold være på plass i DOM (kan sjekkes i DevTools). Task 4 gjør at klikk faktisk åpner tracket.

---

## Task 4: Routing - openCommonTrack, backToSplash, sidepiler

**Files:**
- Modify: `dalux-field-presentasjon-v119.html` (JS-blokken)

- [ ] **Steg 1: Legg til `openCommonTrack`-funksjonen**

Finn funksjonen `openBoxTrack` i JS (rundt linje 2182 i v118). Rett under den, legg til:

```javascript
function openCommonTrack(track){
  // Skjul splash og alle moduler/tracks
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
```

- [ ] **Steg 2: Deklarer `activeCommonTrack` global**

Finn `let activeBoxTrack=null;`-linjen (rundt linje 2159 i v118). Legg til på neste linje:

```javascript
let activeCommonTrack=null;
```

- [ ] **Steg 3: Oppdater `backToSplash` slik at den håndterer common-track**

Erstatt eksisterende `backToSplash`:

```javascript
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
```

- [ ] **Steg 4: Legg til `showBrukergrupperPage`-funksjonen**

Finn `showBoxPage`-funksjonen (rundt linje 2868 i v118). Etter den (eller etter `showCommPage` hvor det passer i strukturen), legg til:

```javascript
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
```

- [ ] **Steg 5: Oppdater `updateArrows()` for trackBrukergrupper**

Finn `updateArrows`-funksjonen (rundt linje 2994 i v118). Inni, like før `return {current:0, max:0, fn:null}` (eller etter de eksisterende `if`-grenene for commTrack og boxTrack), legg til:

```javascript
    const brukergrupperTrack=document.getElementById('trackBrukergrupper');
    if(brukergrupperTrack&&brukergrupperTrack.classList.contains('active')) return {current:brukergrupperActivePage, max:3, fn:showBrukergrupperPage};
```

- [ ] **Steg 6: Wrap `openCommonTrack` for sidepil-oppdatering**

Helt nederst i scriptet (sammen med de andre wrappers som `_origOpenModule`), legg til:

```javascript
const _origOpenCommonTrack=openCommonTrack;
openCommonTrack=function(t){_origOpenCommonTrack(t);setTimeout(updateArrows,50);};
```

- [ ] **Steg 7: Wrap `showBrukergrupperPage` for sidepil-oppdatering**

```javascript
const _origShowBrukergrupperPage=showBrukergrupperPage;
showBrukergrupperPage=function(n){_origShowBrukergrupperPage(n);updateArrows();};
```

- [ ] **Steg 8: Verifiser navigasjonsflyten**

Åpne v119. Test:
1. Klikk "👥 Brukergrupper" på splash → tracket åpnes, side 1 vises
2. Klikk "← Forside" → tilbake til splash
3. Klikk Brukergrupper igjen, så side 2-knappen i toppbaren → side 2 vises
4. Klikk side 3-knappen → side 3 vises
5. Sidepilene (◀ ▶) skal nå vises og navigere mellom sidene
6. Piltastene skal også navigere

Hvis noe ikke virker: sjekk konsollet for feil, og verifiser at de seks endringene over er korrekt plassert i koden.

---

## Task 5: Side 1 - Hva er en brukergruppe?

**Files:**
- Modify: `dalux-field-presentasjon-v119.html` (innhold i `#brukergrupperPage1`)

- [ ] **Steg 1: Legg til CSS for side 1**

I CSS-blokken (gjerne sammen med common-track stilene fra Task 3), legg til:

```css
  /* Brukergrupper side 1 - konsept */
  .bg-intro {
    max-width: 720px; margin: 0 auto 28px; text-align: center;
  }
  .bg-intro-quote {
    font-size: 1.15rem; font-weight: 600; color: var(--text);
    margin-bottom: 16px; line-height: 1.4;
  }
  .bg-intro-quote::before { content: '"'; color: var(--purple); margin-right: 4px; }
  .bg-intro-quote::after { content: '"'; color: var(--purple); margin-left: 4px; }
  .bg-intro p { font-size: .9rem; color: var(--muted); line-height: 1.7; margin-bottom: 10px; }
  .bg-points {
    max-width: 900px; margin: 0 auto;
    display: flex; gap: 14px; flex-wrap: wrap;
  }
  .bg-point {
    flex: 1; min-width: 200px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 18px 20px; box-shadow: 0 1px 3px rgba(0,0,0,.04);
  }
  .bg-point-icon { font-size: 1.4rem; margin-bottom: 6px; }
  .bg-point-title { font-weight: 700; font-size: .9rem; margin-bottom: 6px; color: var(--text); }
  .bg-point-text { font-size: .8rem; color: var(--muted); line-height: 1.6; }
```

- [ ] **Steg 2: Erstatt placeholder med side 1-innhold**

Erstatt:

```html
  <!-- SIDE 1: Konsept (fylles i Task 5) -->
  <div class="page visible" id="brukergrupperPage1">
    <header>
      <h1>Hva er en brukergruppe?</h1>
      <p>Plassholder - innhold kommer</p>
    </header>
  </div>
```

Med:

```html
  <!-- SIDE 1: Konsept -->
  <div class="page visible" id="brukergrupperPage1">
    <header>
      <h1>Hva er en brukergruppe?</h1>
      <p>Grunnstrukturen for rettigheter, samarbeid og sporbarhet i Dalux</p>
    </header>

    <div class="bg-intro">
      <p class="bg-intro-quote">Brukergrupper er hjørnesteinen i Dalux</p>
      <p>Du gir ikke rettigheter til personer direkte. Du oppretter grupper, gir gruppene rettigheter, og legger personer inn i de gruppene de tilhører. En person kan være med i flere grupper, og kan dermed ha ulike roller og rettigheter avhengig av modul og arbeidsforløp.</p>
    </div>

    <div class="bg-points">
      <div class="bg-point">
        <div class="bg-point-icon">🔑</div>
        <div class="bg-point-title">Rettigheter til gruppen</div>
        <div class="bg-point-text">Rettigheter knyttes til brukergruppen, ikke til hver enkelt person. Det gjør det enklere å holde oversikt og endre rettigheter senere.</div>
      </div>
      <div class="bg-point">
        <div class="bg-point-icon">👥</div>
        <div class="bg-point-title">Flere gruppe-medlemskap</div>
        <div class="bg-point-text">En person kan være medlem av flere grupper samtidig. Eksempel: en prosjekteringsleder kan også være med i en byggherre-gruppe.</div>
      </div>
      <div class="bg-point">
        <div class="bg-point-icon">⚙️</div>
        <div class="bg-point-title">Koples til arbeidsforløp</div>
        <div class="bg-point-text">Gruppene brukes i workflows i Field og i kommunikasjonsflyter i Box. Du legger ikke personer, men grupper, til de rollene som finnes.</div>
      </div>
      <div class="bg-point">
        <div class="bg-point-icon">🔄</div>
        <div class="bg-point-title">Personell-endringer enkelt</div>
        <div class="bg-point-text">Når noen slutter eller bytter rolle: oppdater gruppen, ikke alle workflows. Endringen forplanter seg automatisk overalt gruppen brukes.</div>
      </div>
    </div>
  </div>
```

- [ ] **Steg 3: Verifiser side 1**

Åpne v119, klikk Brukergrupper, og se på side 1. Du skal se:
- Header med tittel og undertittel
- Sentrert sitat "Brukergrupper er hjørnesteinen i Dalux" (med lilla anførselstegn)
- Forklarende paragraf
- 4 kort i en rad (eller stablet på smal skjerm) med ikon, tittel og kort tekst

NOTAT om interaktiv visualisering (person → gruppe → modul): den er flagget i spec som "detaljeres under implementering". Vi venter med den til Syver har sett dette grunnoppsettet og kan si om vi skal legge til mer interaktivitet eller om denne tekstforklaringen er nok.

---

## Task 6: Side 2 - Standardgruppene (tabs og innhold)

**Files:**
- Modify: `dalux-field-presentasjon-v119.html` (CSS for kort, JS for tabs, HTML for side 2)

- [ ] **Steg 1: Legg til CSS for standardgruppe-kort og advarsel-styling**

```css
  /* Brukergrupper side 2 - standardgrupper */
  .bg-tabs { display: flex; gap: 4px; margin-bottom: 20px; justify-content: center; }
  .bg-tab-panel { display: none; max-width: 1000px; width: 100%; margin: 0 auto; }
  .bg-tab-panel.active { display: block; }
  .bg-cards {
    display: flex; gap: 14px; flex-wrap: wrap; justify-content: center;
  }
  .bg-card {
    flex: 1; min-width: 220px; max-width: 320px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 20px 22px; box-shadow: 0 1px 3px rgba(0,0,0,.04);
    display: flex; flex-direction: column; gap: 8px;
  }
  .bg-card-header { display: flex; align-items: center; gap: 10px; }
  .bg-card-icon { font-size: 1.4rem; }
  .bg-card-title { font-weight: 700; font-size: .92rem; color: var(--text); }
  .bg-card-sub {
    font-family: 'Space Mono', monospace; font-size: .62rem;
    text-transform: uppercase; letter-spacing: .06em; color: var(--muted);
  }
  .bg-card-desc { font-size: .82rem; color: var(--muted); line-height: 1.6; }
  .bg-card.warning {
    border-color: var(--orange); border-width: 2px;
    background: var(--orange-g);
  }
  .bg-card.warning .bg-card-title { color: var(--orange); }
  .bg-warning-label {
    display: inline-block; font-family: 'Space Mono', monospace;
    font-size: .58rem; text-transform: uppercase; letter-spacing: .08em;
    padding: 3px 8px; border-radius: 5px;
    background: var(--orange); color: #fff; font-weight: 700;
    margin-bottom: 4px;
  }
```

- [ ] **Steg 2: Erstatt side 2-placeholder med tabs og innhold**

Erstatt hele `#brukergrupperPage2`-blokken med:

```html
  <!-- SIDE 2: Standardgruppene -->
  <div class="page" id="brukergrupperPage2">
    <header>
      <h1>Standardgruppene i Dalux</h1>
      <p>Forhåndsdefinerte grupper som finnes når et nytt prosjekt opprettes</p>
    </header>

    <div class="bg-tabs">
      <button class="hub-tab on" id="bgtGeneral" onclick="setBgTab('general')"><span class="num">1</span>General</button>
      <button class="hub-tab" id="bgtField" onclick="setBgTab('field')"><span class="num">2</span>Field</button>
      <button class="hub-tab" id="bgtBox" onclick="setBgTab('box')"><span class="num">3</span>Box</button>
    </div>

    <div class="bg-tab-panel active" id="bgPanelGeneral">
      <div class="bg-cards">
        <div class="bg-card" style="max-width:480px">
          <div class="bg-card-header">
            <span class="bg-card-icon">🛠️</span>
            <div>
              <div class="bg-card-sub">Generell admin</div>
              <div class="bg-card-title">Project administrators</div>
            </div>
          </div>
          <div class="bg-card-desc">Har full tilgang til alle prosjektets innstillinger. Administrerer Dalux-prosjektet inkludert Field, Box og brukere. De kan opprette nye brukergrupper, sette rettigheter, og invitere brukere til prosjektet. Tender og Apartments krever egen tilgang.</div>
        </div>
      </div>
    </div>

    <div class="bg-tab-panel" id="bgPanelField">
      <div class="bg-cards">
        <div class="bg-card">
          <div class="bg-card-header">
            <span class="bg-card-icon">⚙️</span>
            <div>
              <div class="bg-card-sub">Field admin</div>
              <div class="bg-card-title">Field administrators</div>
            </div>
          </div>
          <div class="bg-card-desc">Administrerer Field-modulen. Setter opp arbeidspakker, workflows og maler for oppgaver, sjekklister, testplaner osv. Kan flytte personer mellom Field-grupper, men kan ikke invitere nye til prosjektet.</div>
        </div>
        <div class="bg-card warning">
          <span class="bg-warning-label">⚠ Viktig!</span>
          <div class="bg-card-header">
            <span class="bg-card-icon">📝</span>
            <div>
              <div class="bg-card-sub">Auto-rolle i alle workflows</div>
              <div class="bg-card-title">Task and checklist coordinator</div>
            </div>
          </div>
          <div class="bg-card-desc">Plasseres automatisk som creator i ALLE arbeidsforløp på prosjektet. Dette overstyrer andre svarer-roller du måtte ha. Anbefales bare for personer som faktisk skal koordinere alt - hvis du har andre roller i prosjektet, ikke vær med her.</div>
        </div>
        <div class="bg-card">
          <div class="bg-card-header">
            <span class="bg-card-icon">👁️</span>
            <div>
              <div class="bg-card-sub">Lesetilgang</div>
              <div class="bg-card-title">Field observers</div>
            </div>
          </div>
          <div class="bg-card-desc">Kan se det meste i Field, men ikke møter og mengder (med mindre de får eksplisitt tilgang via egendefinert gruppe). Kan ikke se kladder eller motta varsler ved endringer.</div>
        </div>
        <div class="bg-card">
          <div class="bg-card-header">
            <span class="bg-card-icon">🦺</span>
            <div>
              <div class="bg-card-sub">HMS-ansvarlig</div>
              <div class="bg-card-title">Safety managers</div>
            </div>
          </div>
          <div class="bg-card-desc">Ansvarlig for HMS-funksjonene. Tildeles automatisk HMS-arbeidsforløp i alle arbeidspakker der HMS er aktivert. Mottar alle HMS-observasjoner. Kan ikke redigere HMS-malene selv.</div>
        </div>
      </div>
    </div>

    <div class="bg-tab-panel" id="bgPanelBox">
      <div class="bg-cards">
        <div class="bg-card" style="max-width:480px">
          <div class="bg-card-header">
            <span class="bg-card-icon">📂</span>
            <div>
              <div class="bg-card-sub">Box og Lokasjoner</div>
              <div class="bg-card-title">Project planning manager</div>
            </div>
          </div>
          <div class="bg-card-desc">Administrerer Box og Lokasjoner. Oppretter og styrer lokasjoner, bygninger og mappestruktur. Lager versjonsett, distribusjonslister, review packages og kommentarer. Kan håndtere filområder og fil-flyt, inkludert tvungen publisering og godkjenning.</div>
        </div>
      </div>
    </div>
  </div>
```

- [ ] **Steg 3: Legg til JS-funksjon for tab-bytte**

Etter `showBrukergrupperPage`-funksjonen (lagt til i Task 4 Steg 4), legg til:

```javascript
function setBgTab(tab){
  document.querySelectorAll('#brukergrupperPage2 .hub-tab').forEach(t=>t.classList.remove('on'));
  document.querySelectorAll('#brukergrupperPage2 .bg-tab-panel').forEach(p=>p.classList.remove('active'));
  const tabId={general:'bgtGeneral',field:'bgtField',box:'bgtBox'}[tab];
  const panelId={general:'bgPanelGeneral',field:'bgPanelField',box:'bgPanelBox'}[tab];
  document.getElementById(tabId).classList.add('on');
  document.getElementById(panelId).classList.add('active');
}
```

- [ ] **Steg 4: Verifiser side 2**

Åpne v119 → Brukergrupper → side 2. Du skal se:
- Tre tab-knapper: General | Field | Box
- General er aktiv ved start, viser ett kort (Project administrators)
- Klikk Field: viser 4 kort. Task and checklist coordinator skal ha oransje accent og "⚠ Viktig!"-label
- Klikk Box: viser ett kort (Project planning manager)
- Tilbake til General fungerer

---

## Task 7: Side 3 - Bygg egne grupper smart

**Files:**
- Modify: `dalux-field-presentasjon-v119.html` (CSS + HTML for side 3)

- [ ] **Steg 1: Legg til CSS for side 3**

```css
  /* Brukergrupper side 3 - god praksis */
  .bg-why {
    max-width: 720px; margin: 0 auto 28px; text-align: center;
  }
  .bg-why p { font-size: .9rem; color: var(--muted); line-height: 1.7; }
  .bg-principles {
    max-width: 900px; margin: 0 auto 32px;
    display: flex; gap: 14px; flex-wrap: wrap;
  }
  .bg-principle {
    flex: 1; min-width: 220px;
    background: var(--surface); border: 2px solid var(--border); border-radius: 14px;
    padding: 20px 22px; box-shadow: 0 1px 3px rgba(0,0,0,.04);
    border-top: 4px solid var(--purple);
  }
  .bg-principle-num {
    font-family: 'Space Mono', monospace; font-size: .62rem;
    text-transform: uppercase; letter-spacing: .08em; color: var(--purple); font-weight: 700;
    margin-bottom: 4px;
  }
  .bg-principle-title { font-weight: 700; font-size: .92rem; margin-bottom: 8px; color: var(--text); }
  .bg-principle-text { font-size: .82rem; color: var(--muted); line-height: 1.6; }

  .bg-example {
    max-width: 560px; margin: 0 auto 32px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.06);
  }
  .bg-example-header {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    background: rgba(142,106,191,.04);
    display: flex; align-items: center; gap: 10px;
  }
  .bg-example-icon { font-size: 1.2rem; }
  .bg-example-title { font-weight: 700; font-size: .88rem; }
  .bg-example-list {
    padding: 14px 0; font-family: 'Space Mono', monospace; font-size: .82rem;
  }
  .bg-example-row {
    padding: 6px 22px; display: flex; gap: 14px; align-items: center;
    color: var(--text);
  }
  .bg-example-row.sub { padding-left: 42px; color: var(--muted); font-size: .78rem; }
  .bg-example-num {
    color: var(--purple); font-weight: 700; min-width: 28px;
  }

  .bg-split { max-width: 900px; margin: 0 auto; }
  .bg-split-header { text-align: center; margin-bottom: 16px; }
  .bg-split-header h3 { font-size: 1.05rem; font-weight: 700; margin-bottom: 4px; }
  .bg-split-header p { font-size: .85rem; color: var(--muted); }
  .bg-split-cols { display: flex; gap: 16px; }
  .bg-split-col {
    flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,.04);
  }
  .bg-split-col.bad { border-color: rgba(231,76,60,.3); }
  .bg-split-col.good { border-color: rgba(141,198,63,.4); }
  .bg-split-label {
    display: inline-block; font-family: 'Space Mono', monospace;
    font-size: .58rem; text-transform: uppercase; letter-spacing: .08em;
    padding: 3px 8px; border-radius: 5px; font-weight: 700; margin-bottom: 10px;
  }
  .bg-split-col.bad .bg-split-label { background: var(--red-g); color: var(--red); }
  .bg-split-col.good .bg-split-label { background: var(--green-g); color: var(--green); }
  .bg-split-title { font-weight: 700; font-size: .92rem; margin-bottom: 8px; }
  .bg-split-text { font-size: .8rem; color: var(--muted); line-height: 1.6; }
```

- [ ] **Steg 2: Erstatt side 3-placeholder med innhold**

```html
  <!-- SIDE 3: God praksis -->
  <div class="page" id="brukergrupperPage3">
    <header>
      <h1>Bygg egne grupper smart</h1>
      <p>Hvorfor flere små grupper gir bedre kontroll enn én stor</p>
    </header>

    <div class="bg-why">
      <p>Det er fristende å lage få og store brukergrupper for å holde det enkelt. I praksis gjør dette det vanskelig å gi presise rettigheter og målrette informasjon. Flere små grupper gir granularitet på hva folk kan opprette, redigere og se - i hver modul.</p>
    </div>

    <div class="bg-principles">
      <div class="bg-principle">
        <div class="bg-principle-num">Prinsipp 1</div>
        <div class="bg-principle-title">Nummereringssystem</div>
        <div class="bg-principle-text">Hver gruppe starter med et nummer. Det gir samme rekkefølge på alle prosjekter siden Dalux sorterer alfabetisk på gruppenavn.</div>
      </div>
      <div class="bg-principle">
        <div class="bg-principle-num">Prinsipp 2</div>
        <div class="bg-principle-title">Én gruppe per firma/kontrakt</div>
        <div class="bg-principle-text">Brukerne i én gruppe bør komme fra samme firma eller kontrakt. Dette gjør det enkelt å målrette alle fra samme aktør i workflows.</div>
      </div>
      <div class="bg-principle">
        <div class="bg-principle-num">Prinsipp 3</div>
        <div class="bg-principle-title">Splitt per fag når relevant</div>
        <div class="bg-principle-text">Hvis ett firma dekker flere fag, lag undergrupper med samme rot-nummer (40, 41, 42 osv.). Du kan da gi ulike rettigheter til hvert fag.</div>
      </div>
    </div>

    <div class="bg-example">
      <div class="bg-example-header">
        <span class="bg-example-icon">📋</span>
        <span class="bg-example-title">Eksempel: Brukergrupper i et byggeprosjekt</span>
      </div>
      <div class="bg-example-list">
        <div class="bg-example-row"><span class="bg-example-num">10</span><span>Byggherre</span></div>
        <div class="bg-example-row"><span class="bg-example-num">20</span><span>Byggeledelse</span></div>
        <div class="bg-example-row"><span class="bg-example-num">30</span><span>Lars Anlegg AS (totalentreprenør)</span></div>
        <div class="bg-example-row"><span class="bg-example-num">40</span><span>Betongmiljø AS (RiB)</span></div>
        <div class="bg-example-row sub"><span class="bg-example-num">41</span><span>Betongmiljø AS - Konstruksjon</span></div>
        <div class="bg-example-row sub"><span class="bg-example-num">42</span><span>Betongmiljø AS - Geoteknikk</span></div>
        <div class="bg-example-row"><span class="bg-example-num">50</span><span>Fasade &amp; Form AS (ARK)</span></div>
        <div class="bg-example-row"><span class="bg-example-num">60</span><span>Strøm &amp; Lys AS (RiE)</span></div>
        <div class="bg-example-row"><span class="bg-example-num">70</span><span>Klima AS (RiV)</span></div>
        <div class="bg-example-row"><span class="bg-example-num">80</span><span>HMS-koordinator</span></div>
      </div>
    </div>

    <div class="bg-split">
      <div class="bg-split-header">
        <h3>Hva får du med å splitte?</h3>
        <p>Sammenlign én bred gruppe vs. fagsplittede grupper</p>
      </div>
      <div class="bg-split-cols">
        <div class="bg-split-col bad">
          <span class="bg-split-label">Mindre fleksibelt</span>
          <div class="bg-split-title">40 - Betongmiljø AS (én stor)</div>
          <div class="bg-split-text">Alle fagene i Betongmiljø får samme rettigheter. Geoteknikere får tilgang til konstruksjonsmodeller selv om de ikke trenger det. Varsler om konstruksjons-revisjoner går til geoteknikere som heller ikke trenger dem.</div>
        </div>
        <div class="bg-split-col good">
          <span class="bg-split-label">Mer presis</span>
          <div class="bg-split-title">41 + 42 (fagsplittet)</div>
          <div class="bg-split-text">Konstruksjon (41) og Geoteknikk (42) får ulike rettigheter og varsler. Du kan målrette en kommentar til kun riktig fag, og hver gruppe ser bare det som er relevant for dem. Begge er fortsatt under "40 Betongmiljø" for sortering.</div>
        </div>
      </div>
    </div>
  </div>
```

- [ ] **Steg 3: Verifiser side 3**

Åpne v119 → Brukergrupper → side 3. Du skal se:
- Header med tittel og undertittel
- Kort tekstavsnitt om "hvorfor flere grupper"
- 3 prinsipp-kort horisontalt (med lilla topplinje)
- Eksempel-prosjekt-boks med nummerert liste (Space Mono-font, 41/42 indentert)
- "Hva får du med å splitte?"-seksjon med to kolonner side-ved-side (rød "Mindre fleksibelt" og grønn "Mer presis")

---

## Task 8: Responsivitet og polish

**Files:**
- Modify: `dalux-field-presentasjon-v119.html` (CSS - eksisterende media queries-blokk)

- [ ] **Steg 1: Sjekk om media queries dekker det nye innholdet**

I CSS-blokken med media queries (slutten av style-blokken), legg til regler for de nye seksjonene som ikke allerede er dekket:

```css
  /* Responsivitet for Brukergrupper-track */
  @media (max-width: 740px) {
    .splash-common-cards { flex-direction: column; }
    .splash-common-card { width: 100%; justify-content: center; }
    .bg-points { flex-direction: column; }
    .bg-cards { flex-direction: column; }
    .bg-card { max-width: none; }
    .bg-principles { flex-direction: column; }
    .bg-split-cols { flex-direction: column; }
  }
  @media (max-width: 600px) {
    .bg-intro-quote { font-size: 1rem; }
  }
```

- [ ] **Steg 2: Verifiser responsivt oppførsel**

Åpne v119 og test på flere bredder ved hjelp av DevTools (Ctrl+Shift+M):
1. 1366px - alt skal være som default
2. 1024px - skal fortsatt fungere greit
3. 740px - splash-common-card, bg-points, bg-cards osv. skal stable seg vertikalt
4. 600px - sitatet på side 1 skal bli litt mindre, alt skal være lesbart

- [ ] **Steg 3: Sjekk tilgjengelighet**

I DevTools, bruk Tab-tasten til å navigere fra splash. Du skal:
- Se grønne focus-rammer rundt knappene mens du tab'er
- Kunne åpne Brukergrupper-kortet med Enter
- Tab fra side 1 til 2 til 3 via toppbar-knappene
- Bytte tabs på side 2 med Tab + Enter

---

## Task 9: Oppdater HANDOFF-dokumentet

**Files:**
- Modify: `HANDOFF-dalux-presentasjon.md`

- [ ] **Steg 1: Oppdater versjonsnummer og linjeantall**

Erstatt `v118` med `v119` i headeren, og oppdater linjeantall basert på `wc -l`-output.

- [ ] **Steg 2: Oppdater navigasjonsstrukturen**

Erstatt diagrammet under "Navigasjonsstruktur" med:

```
Modul-velger (Field | Box) + Felles begreper (Brukergrupper)
├── Field
│   ├── Side 1: Entrepriser (list → hub animasjon)
│   └── Side 2: Oppgavens livssyklus (3 scenarioer med steg-for-steg)
├── Box
│   ├── Box sub-selector (3 kort)
│   ├── Kommunikasjonsflyt-track (2 sider)
│   ├── Mappestruktur-track (🚧 placeholder)
│   └── ISO 19650-track (3 sider)
└── Felles begreper
    └── Brukergrupper-track
        ├── Side 1: Hva er en brukergruppe? (konsept + 4 prinsippkort)
        ├── Side 2: Standardgruppene (tabs: General | Field | Box)
        └── Side 3: Bygg egne grupper smart (3 prinsipper + eksempel + før/etter)
```

- [ ] **Steg 3: Legg til v119 i changelog-seksjonen**

Legg til:

```markdown
### v119-endringer (2026-05-21)
- Ny "Felles begreper"-seksjon på splash (under modul-kortene) med Brukergrupper som første tema
- Ny `trackBrukergrupper` på toppnivå (utenfor modField/modBox) med 3 sider: konsept, standardgrupper, god praksis
- Ny routing-funksjon `openCommonTrack(track)` (parallell til `openBoxTrack`)
- Ny global `activeCommonTrack` (parallell til `activeModule` og `activeBoxTrack`)
- `backToSplash` oppdatert til å håndtere common-tracks
- `updateArrows` utvidet for trackBrukergrupper (3 sider)
- Tab-mønster på side 2 bruker eksisterende `.hub-tab`-stiler
- Personer-register utvidet: Stein Bygg (byggherre), Marit Leder (byggeledelse), Kjell Sikker (HMS)
- Out of scope: Tender, Handover, Apartments-admin-grupper (kan legges til senere)
```

- [ ] **Steg 4: Oppdater personer-listen i HANDOFF**

Under "Falske navn i presentasjonen", legg til:

```markdown
- Byggherre: Stein Bygg
- Byggeledelse: Marit Leder
- HMS-koordinator: Kjell Sikker
```

---

## Task 10: Sluttverifisering

**Files:**
- Read: `dalux-field-presentasjon-v119.html` (visuell sjekk i nettleser)

- [ ] **Steg 1: Test alle navigasjonsstier**

1. Splash → Field → side 1 → side 2 → Tilbake til Moduler → OK
2. Splash → Box → Kommunikasjonsflyt → Tilbake til Box → Tilbake til Moduler → OK
3. Splash → Box → ISO 19650 → Tilbake til Box → OK
4. Splash → Brukergrupper → side 1 → side 2 → side 3 → Tilbake til Forside → OK
5. Sidepiltaster i alle tracks → OK
6. Sidepiler ◀ ▶ i alle tracks → OK
7. Fullskjerm-knapp i Brukergrupper-tracket → OK

- [ ] **Steg 2: Sjekk konsoll for feil**

Åpne DevTools-konsoll. Skal være tomt etter all navigasjon. Ingen "undefined function"-feil, ingen 404-er.

- [ ] **Steg 3: Sjekk linjeantall og oppdater HANDOFF om nødvendig**

```bash
wc -l "D:/Programmer/Interaktiv presentasjon/dalux-field-presentasjon-v119.html"
```

Oppdater HANDOFF.md med korrekt antall hvis det avviker fra estimatet.

- [ ] **Steg 4: Si fra til Syver**

Implementeringen er ferdig. Be Syver gå gjennom v119 i nettleseren og gi tilbakemelding på:
- Innhold (er det riktig forklart?)
- Visuell stil (passer det med resten?)
- Side 1-visualisering (skal vi legge til interaktiv personer-til-grupper-visning, eller holder tekstforklaringen?)
- Side 3-eksempelprosjekt (passer firmanavnene, eller skal noe endres?)

---

## Self-review-sjekkliste (kjøres ved planavslutning)

Når alle tasks er ferdige:

- [ ] Alle 10 tasks er fullført
- [ ] v119 åpnes uten konsoll-feil
- [ ] All eksisterende funksjonalitet (Field, Box, ISO) fungerer fortsatt
- [ ] Ny Brukergrupper-track fungerer ende-til-ende
- [ ] HANDOFF er oppdatert
- [ ] Linjeantall i HANDOFF stemmer med faktisk filstørrelse

## Etter implementering

Spec'en flagger noen punkter som "avklares under implementering". Disse tas opp med Syver etter at han har sett v119:

- Side 1 interaktiv visualisering: skal vi bygge den, eller er prinsippkortene tilstrekkelig?
- Side 3 før/etter: er to side-ved-side-kolonner nok, eller skal vi ha en bryter/tab?
- Trenger Felles begreper-seksjonen en stipla "+ kommer flere temaer"-placeholder?
- Skal piltastnavigasjon mellom Felles begreper-kort på splash legges til (eller venter vi til vi har flere kort)?
