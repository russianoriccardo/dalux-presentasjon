> **Til deg som overtar:** Dette dokumentet ble skrevet mens hele nettsiden lå i **én fil**
> (`dalux-interaktiv-presentasjon.html`). Nå er den **delt opp i moduler** (`index.html` +
> `css/` + `js/`) – se «Filstruktur» i [START-HER.md](START-HER.md) kapittel 3.
>
> Arkitekturen, navigasjonen, modulene, innholdet og historikken under **gjelder fortsatt**.
> Men merk:
> - Henvisninger til «én fil» og eventuelle linjenumre er **historiske**.
> - Backup-strategien med `-v1.html … -v10.html` er erstattet av **GitHub sin commit-historikk**.
> - Den lokale preview-serveren (`launch.json`, python http.server) var et Claude Code-oppsett.
>   Jobber du i nettleser-chat, **dobbeltklikker du bare `index.html`** for å se siden i stedet.

---
# Dalux Interaktiv Presentasjon - Handoff til Claude Code

## Prosjektoversikt

Én selvstendelig HTML-fil (`dalux-field-presentasjon.html`) som fungerer som en interaktiv presentasjon av Dalux sine moduler. Filen er publisert på GitHub Pages: **https://syver-h.github.io/dalux-presentasjon** (repo: `syver-h/dalux-presentasjon`, filen heter `index.html` der).

Arbeidsfilen heter `dalux-interaktiv-presentasjon.html` (omdøpt fra `dalux-field-presentasjon-vNNN` 2026-05-21 siden presentasjonen dekker mer enn Field). Endringer skjer direkte på denne filen. Changelog under sporer hva som er gjort.

**Backup-strategi:** Før en ny runde med endringer (typisk ved start av økt eller før større feature) lages en backup: `dalux-interaktiv-presentasjon-v1.html`, `-v2.html` osv. Etter 10 backups overskrives den eldste (v11 erstatter v1, v12 erstatter v2 osv. — rullende vindu av 10). Gir oss alltid 10 fall-back-punkter uten å fylle opp mappa.

**Gammelt:** `dalux-field-presentasjon-v117.html` ligger igjen som deep-history fra før omdøpingen (pre-cleanup, pre-responsivitet, pre-Brukergrupper). Kan slettes når Syver bekrefter.

Ved publisering: kopier `dalux-interaktiv-presentasjon.html` til `index.html` og last opp til GitHub.

Filen er nå **~4706 linjer** - oppdeling i separate filer (CSS, JS per modul) bør seriøst vurderes nå. Si ifra til Syver når dette begynner å butte.

## Arkitektur

### Navigasjonsstruktur
```
Splash (modul-velger + Felles begreper)
├── Modul-kort
│   ├── Field
│   │   ├── Side 1: Entrepriser (list → hub animasjon)
│   │   └── Side 2: Oppgavens livssyklus (3 scenarioer med steg-for-steg)
│   └── Box
│       ├── Box sub-selector (3 kort)
│       ├── Samhandling i Box-track (én 4-tab-nav på begge sider)
│       │   ├── side 1: Oppsett / Kommunikasjonsflyt (hub) / Statuser (spotlight, 3 steg)
│       │   └── side 2: Kommentar: opprett, send, lukk (4 steg + aktivitetslogg)
│       ├── Mappestruktur-track
│       │   ├── Side 1: Mappestruktur og metadata (3 faner: Mappestruktur / Navngiving og metadata / Filtrering i praksis)
│       │   └── Side 2: Filer og versjonshåndtering (🚧 placeholder)
│       └── ISO 19650-track
│           ├── Side 1: ISO 19650 (statusområder ↔ CDE i Dalux)
│           ├── Side 2: Box i praksis (3 nivåer)
│           └── Side 3: Dokumentflyt (6-stegs animasjon)
└── Felles begreper
    └── Brukergrupper-track (NY i v119)
        ├── Side 1: Hva er en brukergruppe? (konsept + 4 prinsippkort)
        ├── Side 2: Standardgruppene (én side, tre seksjoner: Generelt/Field/Box)
        └── Side 3: Slik bygger du gode grupper (spotlight, 3 steg)
```

### Navigasjonssystemer
- **Toppbar** (`page-nav`, fixed): Sidenummererte knapper per modul/track
- **Sidepiler** (`side-arrow`, fixed): ◀ ▶ på midten av skjermen, vises/skjules dynamisk
- **Tilbake-knapper**: "← Moduler" (til splash), "← Box" (til Box sub-selector)
- **Fullskjerm-knapper**: Én per modul/track, top-right
- **Piltaster**: Fungerer i Field og Box dokumentflyt
- **Demo-navigasjon** (`presAdvance`): Page Up/Down + mus-tommelknapper (knapp 3/4). Stegger innhold på stepper-sider (Field-scenario, dokumentflyt, Side 3-spotlight, Statuser-spotlight, Samhandling-faner), ellers blar mellom sider

### Viktige JS-funksjoner
- `openModule('field'|'box')` - Åpner modul
- `openBoxTrack('comm'|'files'|'iso')` - Åpner Box-track
- `backToSplash()` / `backToBoxSelector()` - Navigasjon tilbake
- `showPage(n)` - Field sidebytte (animert, 800ms)
- `showBoxPage(n)` - ISO track sidebytte
- `showCommPage(n)` - Comm track sidebytte
- `setView('list'|'hub')` - Field list/hub-toggle
- `setCommView('list'|'hub')` - Comm list/hub-toggle
- `setIsoView('iso'|'cde')` - ISO statusområder/CDE-toggle
- `navArrow(dir)` / `updateArrows()` - Sidepil-logikk
- `presAdvance(dir)` - Page Up/Down + tommelknapp-navigasjon (stegger stepper, ellers navArrow)
- `commTab(target)` / `commSyncTabs()` - Samhandling-tracken: 4-tab-nav synket på begge sider (`data-commtab`: list/hub/status/comment)
- `bg3Next/Prev/Update()` - Brukergrupper Side 3 spotlight-stepper (`data-bgstep`)
- `statusNext/Prev/Update()` - Statuser-fane spotlight-stepper (`data-statusstep`)

### Kjente mønstre
- **List-til-hub-animasjon**: Brukes i Field (entrepriser) og Comm (kommunikasjonsflyt). Noder har absolutt posisjonering, JS beregner posisjoner, CSS transitions animerer. Ikke bruk CSS Grid for dette - animerer ikke.
- **Funksjonsoverrides**: Flere funksjoner (openBoxTrack, showPage, etc.) er wrappet via `const orig=fn; fn=function(){orig();ekstraLogikk();}` for å legge til sidepil-oppdatering og dot-animasjonskontroll. Vær obs på rekkefølge.
- **Field sidebytte**: Har 800ms animasjon (300ms slide-out + 500ms slide-in). Sidepiler skjules under animasjonen og oppdateres etter 850ms.
- **Dot-animasjon** (Comm hub): Én prikk som bouncer mellom grupper og alltid ender i senteret (Prosjekteringsleder). requestAnimationFrame-loop.

## Design

### Farger
- Dalux-grønn: `#8DC63F` (var(--dalux)), mørk: `#6fa032`
- Bakgrunn: `#fafaf8`, overflate: `#ffffff`, tekst: `#1a1a1a`
- Border: `#e8e6e1`, muted tekst: `#6b7280`
- Prosjekteringsleder (comm hub): `#ec4899` (rosa)

### Typografi
- Base: `html { font-size: 19px; }` (økt for storskjermbruk)
- Font: DM Sans (brødtekst), Space Mono (kode/labels)
- Alt er i `rem` - skalerer fra html font-size

### Visuell stil
- Lyst tema (ble konvertert fra mørkt tidlig i prosjektet)
- Avrundede kort med subtile skygger
- Dashed linjer i hub-visualiseringer (stroke-dasharray: 6 4)
- Grønne pulserende senter-noder i hub-visninger

## Domenekunskap (viktig kontekst)

### Dalux-plattformen
- **Build-plattformen** inneholder: Field, Box og Handover
- **FM** er en egen, separat plattform
- **Field**: Produksjon/utførelse. Lineær pipeline (Tildeler → Utfører → Kontrollør)
- **Box**: Prosjektering/dokumenthåndtering. Åpen kommunikasjon mellom grupper
- **Handover**: Overlevering til drift (del av Build)
- Inspeksjonsplaner = Kontrollplaner (norsk), Testplaner = Testplaner

### Kommunikasjonsflyt (Box)
- Kommentarer opprettes direkte på tegninger, PDF-er, BIM-modeller
- Kommunikasjonsflyt styrer hvem som ser/redigerer/lukker kommentarer
- Kommentarer kan IKKE bytte flyt (ulikt Field hvor oppgaver kan bytte arbeidsforløp)
- Rettigheter: Les, Rediger, Lukk - varierer per gruppe per flyt
- Lukk-rettighet er fleksibel: kan være prosj.leder, byggherre, eller andre avhengig av flyten
- Kommentartyper: Prosjektering, RFI, Byggherreavklaring (IKKE "Avvik" - det tilhører Field)

### ISO 19650
- ISO krever CDE med statusområder, men dikterer ikke spesifikk feltstruktur for navnekonvensjon
- Dalux Box mapper S0→Filer, S1-S2→Delte filer, S3→Utgitte filer
- S4 (Arkivering) håndteres utenfor Box, via Dalux Handover / Dalux FM

### Falske navn i presentasjonen
Alle personnavn er oppdiktet men rolle-passende:
- RiB: Per Betong, Lise Stålsen
- ARK (ikke "RiA"): Kari Fasade (ARK er bransjestandard-forkortelse, Arkitekt er IKKE ingeniør)
- RiE: Tor Ampere
- RiV: Ole Ventansen, Anna Rørvik
- Totalentreprise: Lars Anlegg, Erik Montasje, Nina Fremdrift
- Prosjekteringsleder: Ingrid Plansson, Jonas Koordinsen, Frida Ledersen
- Byggherre: Stein Bygg
- Byggeledelse: Marit Leder
- HMS-koordinator: Kjell Sikker

## Status og gjenstående arbeid

### Ferdig
- ✅ Field modul (komplett med 3 scenarioer på side 2)
- ✅ Box Kommunikasjonsflyt (2 sider med innhold, hub-animasjon, aktivitetslogg)
- ✅ Box ISO 19650 (3 sider: statusområder, nivåer, dokumentflyt)
- ✅ Navigasjonspiler
- ✅ GitHub Pages-publisering
- ✅ Meta-tags for deling (Open Graph)

### Gjenstående
- 🚧 **Mappestruktur-track Side 2** (Box) - "Filer og versjonshåndtering", fortsatt placeholder. Side 1 er ferdig (se sesjon 2026-05-31 del 2).
- 🔄 **Review Packages** - Syver nevnte artikler om review packages men har ikke levert innhold ennå. Kan bli eget innhold i kommunikasjonsflyt eller ISO-tracket.
- 💡 **Filoppdeling** - Bør vurderes snart (2989 linjer). Naturlig splitting: felles CSS, Field JS, Box comm JS, Box ISO JS, felles nav JS.

### Kjente quirks
- `box-p1-top` har `min-height:280px` (var `height:280px` fram til v118) for å holde ISO-faner stabile ved tab-bytte. Med min-height kan tekst legges til uten å clippes.
- Comm-hub bruker `isCenter`-flagg på Prosjekteringsleder for å ekskludere fra ellipse og vise i senteret istedet.
- `#boxTrackComm .page` har `padding-top:84px` for å unngå overlapp med toppbar.
- Topbar-offset (`52px`) og sticky-offset (`56px`) er CSS-variabler: `--topbar-h` og `--sticky-top` (i :root).
- `.comm-tab` og `.hub-tab` deler styling i én CSS-blokk (linje ~233). Endringer i den ene må gjelde begge.

### v118-endringer (2026-05-21)
- Tilgjengelighet: sidepiler konvertert til `<button>`, aria-labels på ikon-knapper (sidepiler, wf-close), global `:focus-visible`-styling med dalux-grønn outline.
- Mappestruktur-kortet på Box-velgeren har `coming-soon`-klasse: redusert opacity, ingen hover-løft, "Kommer snart"-badge. Placeholder-siden er forbedret til et innholdsrikt "kommer snart"-kort med liste over hva som skal dekkes.
- `.comm-tab` + `.hub-tab` (identisk CSS) konsolidert til én delt regelblokk.
- `box-p1-top` byttet fra `height` til `min-height`.
- Topbar/sticky-offset ekstrahert til CSS-variabler `--topbar-h` og `--sticky-top`.
- **Responsivitet**: hub-stage og comm-stage er nå fleksible (aspect-ratio bevarer forholdet). Alle JS-koordinater regnes dynamisk fra container-størrelse via `getHubLayout()` og `getCommLayout()`. Node-bredder skalerer mellom min/max. SVG-elementer bruker design-koordinater (1100×620 / 1100×600) som viewBox skalerer automatisk. Debounced window.resize-handler oppdaterer alt. Media queries stabler splash-modules, box-track-cards, comm-info-cards og cde-pipeline vertikalt under 740px.

### Sesjon 2026-05-26 (omfattende)
Stor sesjon med flere features og en full språkgjennomgang. Hovedendringer:

- **Field Side 1 workflow-popup omarbeidet**: ny toggle "Lite prosjekt / Stort prosjekt".
  - Lite: 3 toveis-arbeidsforløp (Oppgave Fag↔TE × 2 retninger + HMS-ledere↔Fag)
  - Stort: 5 toveis-arbeidsforløp (Kvalitet × 2, HMS, Miljø × 2)
  - Hver forløp har sin egen identitetsfarge (Oppgave=gul/TE, Kvalitet=blå, HMS=oransje, Miljø=indigo)
  - Stagger-fade animasjon ved tab-bytte
  - Hint-tekst forklarer HMS-observasjon-mekanikken (kommer "utenfra" arbeidsforløpene)
  - Godkjenningsforløp fjernet fra entreprise-popupen (TE→BH er ikke entreprise-spesifikt)
- **Brukergrupper Side 1 visualisering bygd**: 3-stegs interaktiv scene
  - Steg 1: Personer spredt i grid med fagroller
  - Steg 2: Personer i fargede gruppe-containere (lilla/oransje/gul/rød per gruppe)
  - Steg 3: Klikk-en-person interaksjon. Linjer farges grønt (Field) eller blått (Box) basert på modul.
  - Layout: stage-koordinater regnes responsivt fra container, design-koords 1000x500
- **Comm Side 2 fullstendig rebygd**: "Kommentar - opprett, send, lukk"
  - 4 klikkbare faner som stepper (Opprett/Send/Dialog/Lukk)
  - Animert "puck" som beveger seg mellom RiE/ARK/Prosjekteringsleder
  - Statusbadge oppdateres med steg (Ny→Under behandling→Besvart→Lukket)
  - Progressiv aktivitetslogg (entries fader inn én etter én)
  - Forrige/Neste-kontroller
- **Comm Side 1 utvidet med 3. sub-fane "Statuser"**:
  - Før/etter-sammenligning (kun Aktivert/Lukket vs egendefinerte)
  - 3 eksempel-flyter (Standardflyt, RFI, Byggherreavklaring)
  - 3 prinsipper (standardiser, hold håndterbart, dekk hele løpet)
  - Status-badges deler styling med Comm Side 2
- **Tittelendringer**:
  - "Oppgavens livssyklus" → "Oppgaver - Fra opprettet til lukket" (Field side 2)
  - "Kommentarens livssyklus" → "Kommentar - opprett, send, lukk" (Comm side 2)
  - "Bygg egne grupper smart" → "Slik bygger du gode grupper" (Brukergrupper side 3)
- **Omfattende språkgjennomgang** basert på `SPRAAKSTIL.md`-stilguiden i prosjektroten. Fjernet bannlyste ord (sentral, smart, hjørnestein, reise-metafor, beriker, granularitet, implementering+implementere). Aktiv form gjennom hele presentasjonen. Em-dash og " - " som komma-erstatning fjernet.

### SPRAAKSTIL.md (stilguide)
Brukeren har lagt til en `SPRAAKSTIL.md`-fil i prosjektroten med stilregler for tekstinnhold. Følg disse ved alle tekstendringer:
- Ingen em-dashes (—) eller " - " som komma-erstatning
- Bannlyste honnørord (skreddersydd, helhetlig, smart, hjørnestein, reise i overført betydning, beriker etc.)
- Aktiv form > passiv
- Hverdagsspråk > formelle ord
- Anglisismer skal byttes ("implementere" → "innføre", osv.)

### Backup-status ved sesjonsslutt 2026-05-26
v1-v9 backups eksisterer (innen 10-vinduet). Neste backup blir v10. Den må vurderes overskrevet etter dette (v11 erstatter v1 osv.).

### Språkgjennomgang (2026-05-26)
Omfattende språkrunde basert på `SPRAAKSTIL.md` (bannlyste ord, mønstre og stil-regler). Hovedendringer:
- **Splash:** Beskrivelse og info-boks omskrevet til konkret, ikke-nedlatende språk
- **Modul-undertitler:** "Oppgaveforløp og arbeidsflyt" → "Oppgaver, sjekklister og arbeidsflyt"; "Kommunikasjon, filhåndtering og ISO 19650" → "Filer, kommentarer og ISO 19650"
- **Brukergrupper Side 1:** "Hjørnesteinen i Dalux" omskrevet til "styrer hvem som kan hva i Dalux"
- **Brukergrupper Side 2:** Tittel "Bygg egne grupper smart" → "Slik bygger du gode grupper"; "workflows" → "arbeidsforløp"; "creator" → "oppretter"; em-dash i tekst fjernet; passiv form (`tildeles`) → aktiv (`får`)
- **Box ISO 19650:** "implementering" → "oppsett"; "Dokumentets reise" → "Slik flyter et dokument gjennom CDE"; "sikre" → "sørge for"
- **Box Comm:** Passiv "man oppretter / sendes" → aktiv "du oppretter"; "sikrer" → "sørger for"; flyt forbedret i intro
- **Field side 2-scenarier:** "beriker" (bannlyst) → "fyller ut"; flere dash-mønstre fjernet
- **Bannlyste ord ryddet:** sentral, smart, beriker, granularitet, hjørnestein, reise (metafor)
- **Stil-prinsipper anvendt:** aktiv form, "du" framfor "man", konkrete eksempler, ingen "lett å forstå"-formuleringer som beskriver leseren
- Eksisterende `SPRAAKSTIL.md` er lagt til prosjektet som referansedokument for fremtidige tekstoppdateringer

### v119-endringer (2026-05-21)
- Ny "Felles begreper"-seksjon på splash (under modul-kortene) med Brukergrupper som første tema
- Ny `trackBrukergrupper`-container på toppnivå (parallell til modField/modBox, ikke inni Box)
- Ny CSS-klasse `.common-track` (parallell til `.box-track`)
- Ny routing-funksjon `openCommonTrack(track)` og global `activeCommonTrack`
- `backToSplash` utvidet til å håndtere common-tracks
- `getNavContext` (brukt av sidepiler/piltaster) utvidet for trackBrukergrupper
- Tre nye sider med innhold:
  - Side 1: Konsept + 4 prinsippkort (rettigheter til gruppen, flere medlemskap, koples til workflow, personell-endring)
  - Side 2: Tabs General/Field/Box med kort for hver standardgruppe. Task and checklist coordinator har ⚠ Viktig!-advarsel-stil
  - Side 3: 3 prinsippkort + nummerert eksempelprosjekt + før/etter-sammenligning for fagsplitting
- Nye personer i registeret: Stein Bygg (byggherre), Marit Leder (byggeledelse), Kjell Sikker (HMS-koordinator)
- Out of scope: Tender, Handover, Apartments-admin-grupper, Side 1-interaktiv visualisering (avklares med Syver etter v119-gjennomgang)

### Responsiv arkitektur (viktig for fremtidig arbeid)
- **Hub-stage** og **comm-stage** har CSS `aspect-ratio` (1100/620 og 1100/600) — bredde skaler, høyde følger automatisk.
- **JS-layout**: `getHubLayout()` / `getCommLayout()` returnerer objekt med `cx, cy, rx, ry, nodeW, nodeH` etc. basert på `stage.offsetWidth/Height`. Alle posisjonering-funksjoner tar `L` (layout) som argument.
- **SVG-koordinater** (lines i `genHubSvg`/`genCommSvg`) bruker design-koordinater. SVG viewBox skalerer dem til container automatisk — så de matcher DOM-posisjoner som er regnet fra faktiske dimensjoner.
- **Recompute-triggers**: `applyHubLayout()` / `applyCommLayout()` orkestrerer alt. Kalles ved init, `openModule('field')`, `openBoxTrack('comm')` (begge i requestAnimationFrame siden offsetWidth=0 mens display:none), og fra debounced window.resize.
- **Dot-animasjoner**: `updateDotPositions()` (Field) og `cacheCommHubPos()` (Comm) oppdaterer cachede koordinater — neste animasjonsframe plukker dem opp.
- Når du legger til nye stager/visualiseringer: følg samme mønster. Aldri hardkod pixel-bredder i hub/comm-stagene.

### Sesjon 2026-05-31 (stor)
Alle seks punktene fra kollega-gjennomgangen (NESTE-SESJON #1-#6) ble ferdige, pluss mer.

- **Konsolideringsrunde** (multi-agent audit, 45 funn): 9 døde CSS-klasser fjernet (lc-info-*, bg-module, wf-flows, col-avatar.glow, bg-points), 0 em-dash igjen i hele filen, "review" → "gjennomgang" (produktnavnet "Review Packages" beholdt), RiB/RiV-casing rettet, tankestrek-som-komma ryddet (titler → kolon, task-meta → komma), HMS-selvmotsigelse løst, faktafiks (kommentartype knyttes til flyter, ikke omvendt).
- **Samhandling i Box**: "Kommunikasjonsflyt"-selectorkortet omdøpt. Comm-tracken har ikke lenger topp-page-nav. I stedet én 4-tab-rad (Oppsett / Kommunikasjonsflyt / Statuser / Kommentar: opprett, send, lukk) som ligger på BEGGE sider og synkes via `commTab()`/`commSyncTabs()`. Dobbel h1 på Kommentar-siden fjernet. NB: comm er fortsatt to `.page`-er internt (commPage1 med list/hub/status-visninger, commPage2 med kommentar-livssyklus), men navigeres nå som fire faner.
- **Spotlight-mekanikk** (delt CSS: `.bg-step` + `.bg-future`/`.bg-done`/`.bg-active`): aktivt element skarpt, ferdige dempet (opacity .5), fremtidige blurret (opacity .22 + blur). Per-side steppere med Forrige/Neste + progress + "↑ Til toppen", scroll-til-fokus.
  - Brukergrupper Side 3 (`bg3*`, `data-bgstep`): 3 steg (prinsipper samlet / eksempel / før+etter samtidig).
  - Statuser-fane (`status*`, `data-statusstep`): 3 steg (sammenligning / eksempler / prinsipper).
- **Demo-navigasjon** (`presAdvance`): Page Up/Down + mus-tommelknapper (button 3/4).
- **Box i praksis**: M365 lagt til Nivå 1, sammenligning flyttet til Nivå 2.
- **Live-preview**: `.claude/launch.json` i `D:\Programmer\CSM verktøy` (python http.server :8765, --directory peker på presentasjonsmappa). Brukes til selv-verifisering via preview-verktøyet.
- **Backups**: rullerende vindu nå v5-v14 (v14 = sesjonsslutt 2026-05-31 del 1).
- **Gjenstår**: #5 Mappestruktur-track, #9 Side 3 copy-pass. Se STATUS-OG-GJENSTAENDE.md.

### Sesjon 2026-05-31 (del 2): Mappestruktur Side 1 integrert
`boxTrackFiles` gikk fra placeholder til ferdig Side 1. Hovedpunkter:

- **Track-struktur**: ekte 2-sides-track (`showFilesPage`, sidepiler/demo-nav via `getNavContext`-gren). Box-velgerkortet av-gatet (ikke lenger `coming-soon`). Side 2 = lett "kommer snart"-placeholder.
- **Tre faner på Side 1** (`setFilesTab`, `hub-tab`-stil): Mappestruktur / Navngiving og metadata / Filtrering i praksis. Hver fane har én interaktiv "helt".
- **Animasjon 1 (splitt)**: port av `_proto_split` (filnavn → metadata-felt, Enkel/Detaljert, referansetabeller). Scroll-utløst via IntersectionObserver med 1s delay; hviler usplittet til seksjonen er i visning. Re-armes når fane 2 åpnes (lå i skjult fane).
- **Animasjon 2 (fil-liste)**: port av `_proto_dalux` (20 tegninger, Fag+Etasje-chips). Fast reservert høyde (`fllReserveHeight`, målt i JS) så filtrering ikke endrer sidehøyden → scroll-posisjon "hopper" ikke. Måles når fane 3 vises.
- **CSS scoped** under `#boxTrackFiles` (prefiks `fl-`/`fls-`/`fll-`) for å unngå kollisjon med generiske klasser (`.col`, `.chip`, `.tag` osv.).
- **Innholdsnyanser fra Syver**: rettigheter styres via brukergrupper (ikke mapper); avgrenser konfigurerbar (ikke bare bindestrek); standardfelter (låsesymbol) vs. egne felter; "Slik bygger du malen"; Filtrering-fanen frikoblet fra navnemal.
- **Wiring-gotchas**: `openBoxTrack('files')` kaller `flInitFiles()` DIREKTE (ikke rAF — rAF struper i headless preview). Skjulte faner har `offsetWidth/Height=0`, så split og fil-liste initialiseres (måles/spilles) først når fanen vises. Resize-hook re-måler/replay-er kun synlig fane.
- **Prototypene** `_proto_split.html` + `_proto_dalux.html` er nå integrert (scratch, kan arkiveres).
- **Backups**: rullerende vindu nå v7-v16 (v16 = sesjonsslutt 2026-05-31 del 2).

## Formatregler fra Syver
- Alltid inkluder filnavn når filer sendes
- **Filnavn:** Arbeidsfilen heter `dalux-interaktiv-presentasjon.html`. Endringer skjer direkte i denne. Backups (`-v1`, `-v2`, ..., `-v10`) lages før hver nye runde med endringer; eldste overskrives etter 10.
- Unngå em-dashes (--)
- Svar på norsk som default
- Ikke bruk "Avvik" i Box-kontekst (tilhører Field/produksjon)
- ARK er forkortelsen for arkitekt (bransjestandard)
