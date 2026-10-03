# Brukergrupper-track i Dalux Interaktiv Presentasjon

**Dato:** 2026-05-21
**Filer berørt:** `dalux-field-presentasjon-v118.html` (blir v119 ved implementering)
**Status:** Design godkjent, klar for implementasjonsplan

## Sammendrag

Vi legger til en ny seksjon på forsiden kalt "Felles begreper" under modul-kortene Field og Box. Det første temaet i denne seksjonen er **Brukergrupper**, som blir en ny track med tre sider. Tracket forklarer hva brukergrupper er, hvilke standardgrupper som finnes i Dalux ut av boksen, og god praksis for å bygge egne grupper.

## Bakgrunn og formål

Presentasjonen brukes som referanseverktøy i kundemøter for å forklare funksjoner og begreper Syver ofte får spørsmål om. Brukergrupper er en sentral funksjon i Dalux som brukes på tvers av Field og Box, og er ikke en naturlig del av noen av modul-trackene. Dagens struktur (Splash → Field/Box → moduler) gir ingen naturlig plass for cross-cutting temaer.

Brukergrupper er det første cross-cutting temaet vi løfter fram. Flere kan komme senere (f.eks. roller, tilgangsstyring, prosjektoppsett), og strukturen vi velger skal kunne romme dem uten ny restrukturering.

## Strukturendring på splash

Splash-skjermen får en ny seksjon under modul-kortene:

```
Splash
├── Modul-kort (uendret oppsett)
│   ├── Field
│   └── Box
└── Felles begreper (NY seksjon)
    └── 👥 Brukergrupper (eneste tema i første omgang)
```

Visuelt skiller "Felles begreper"-seksjonen seg fra modul-kortene ved:

- Mindre, mer kompakte kort enn modul-kortene (det er underordnet hovedinngangene)
- Liten label "Felles begreper" som overskrift (Space Mono, uppercase, muted) likt det som brukes ellers i presentasjonen
- Eget akselment: lilla (`#8e6abf`, samme som purple-variabel som allerede finnes i `:root`) for å skille fra Field-grønn og Box-blå

På samme måte som Mappestruktur-kortet har en "Kommer snart"-badge, kan vi legge til en stipla "+ kommer flere temaer"-placeholder hvis det føles tomt med bare ett tema. Vurderes under implementering.

## Brukergrupper-track

### Navigasjon

Ny track-container med id `trackBrukergrupper`. Den ligger ikke under modField eller modBox, men direkte på toppnivå (siden den er en "Felles begreper"-track, ikke en modul-track). Strukturen følger samme mønster som `boxTrackComm` og `boxTrackIso`:

- Tilbake-knapp øverst venstre med teksten "← Forside" (skiller seg fra eksisterende "← Moduler" på Field/Box. Forsiden er det samme stedet, men ordet "Forside" passer bedre siden Brukergrupper ikke er en modul.)
- Toppbar med 3 sider-knapper (gjenbruker eksisterende `.page-nav` og `.page-btn`-styling)
- Fullskjerm-knapp øverst høyre (gjenbruker `.fs-btn`)
- Sidepiler ◀ ▶ for navigasjon mellom sider
- Piltast-støtte (left/right)
- Tracket må aktiveres via en ny "Felles begreper"-routing-funksjon, eller utvidelse av eksisterende `openBoxTrack`-navnemønster til mer generisk `openCommonTrack`. Detaljer avgjøres i implementasjonsplanen.

### Side 1 — Hva er en brukergruppe?

**Mål:** Forklare konseptet på en måte som setter scenen før de mer detaljerte sidene.

**Innhold:**

- Innledende sitat: "Brukergrupper er hjørnesteinen i Dalux" (fra hjelpesidene)
- Kort tekst-block med kjernepunktene:
  - Rettigheter knyttes til gruppen, ikke personen
  - En person kan være medlem av flere grupper
  - Gruppene koples til workflows (Field) og kommunikasjonsflyter (Box) for å gi konkrete handlinger
  - Hvis personell endres, oppdaterer du gruppen, ikke alle workflows
- Interaktiv visualisering (detaljeres under implementering):
  - 5-6 personer med navn (fra felles personer-register, se eget kapittel) plasseres til venstre
  - 2-3 grupper i midten (f.eks. "30 - Lars Anlegg AS", "60 - Strøm & Lys AS", "80 - HMS-koordinator")
  - Rettigheter/moduler til høyre (Field, Box, Lokasjoner osv.)
  - Linjer eller piler viser hvilken person som er i hvilken gruppe, og hvilke rettigheter gruppene gir
  - Hover/klikk på en gruppe markerer dens medlemmer og rettigheter

**Layout:** Vertikalt sentrert som Field side 1. Header på toppen, visualisering i midten, kort caption nederst.

### Side 2 — Standardgruppene

**Mål:** Vise hvilke grupper som finnes når et prosjekt opprettes, og hva de gjør. Et viktig poeng folk misforstår er at noen admin-grupper overstyrer andre roller (særlig Task and checklist coordinator).

**Innhold:**

Tab-velger på toppen: `General | Field | Box`. Samme visuelle mønster som `hub-tab` og ISO-tabs vi allerede har. Innholdet bytter når brukeren klikker en tab.

**Tab "General":**

- **Project administrators** — kort med navn, ikon, hva de kan (full prosjekttilgang, opprette grupper, invitere brukere)

**Tab "Field":**

- **Field administrators** — manage Field-modulen, ikke invitere prosjekt-brukere men kan flytte folk mellom Field-grupper
- **Task and checklist coordinator** — får ⚠ advarsel-stil. Tydelig boks som forklarer at gruppen automatisk plasserer brukeren i creator-rollen i ALLE arbeidsforløp, og overstyrer andre svarer-roller. Anbefaling: ikke vær med her hvis du har andre ansvarsområder i prosjektet.
- **Field observers** — visning, kan ikke se kladder eller motta varsler
- **Safety managers** — HMS-arbeidsforløp, mottar alle HMS-observasjoner automatisk

**Tab "Box":**

- **Project planning manager** — Box og Lokasjoner. Mappestruktur, versjonsett, review packages, fil-godkjenning

**Layout:** Tabs på toppen, deretter en flex-rad (med wrap) av kort der hvert kort har lik fleksibel bredde. Antall kort varierer per tab: 1 (General), 4 (Field), 1 (Box). For tabs med 1 kort sentreres det med passende maksbredde. Hvert kort har: navn, ett-linje undertittel som oppsummerer rollen, kort beskrivelse, ev. ikon. Task and checklist coordinator skiller seg ut med advarsel-stil (oransje accent, ⚠-ikon, "Viktig!"-label) for å løfte fram det viktige poenget om at gruppen overstyrer andre roller.

### Side 3 — Bygg egne grupper smart

**Mål:** Forklare hvorfor man lager flere små grupper istedenfor én stor, og vise praktiske prinsipper for hvordan man strukturerer dem.

**Innhold:**

1. **Hvorfor flere grupper > én stor?** (kort innledning)
   - Granular rettighetsstyring: gir presisjon på hva folk kan opprette, redigere og se
   - Fleksibilitet på tvers av moduler: en person kan ha andre rettigheter i Field enn i Box
   - Lettere å målrette varsler og oppgaver

2. **Tre prinsipper** (vises som kort med ikoner og kort tekst)
   - **Nummereringssystem** — gir samme rekkefølge på alle prosjekter siden sortering er alfabetisk på gruppenavn
   - **Én gruppe per firma/kontrakt** — gjør det enkelt å målrette alle brukere fra samme firma
   - **Splitting per fag** — når et firma dekker flere fag, lag undergrupper med samme rot-nummer (40, 41, 42 osv.)

3. **Eksempelprosjekt** (visualisering)
   - Mappestruktur-lignende liste som viser et realistisk gruppe-oppsett:

```
10 - Byggherre
20 - Byggeledelse
30 - Lars Anlegg AS (totalentreprenør)
40 - Betongmiljø AS (RiB)
41 - Betongmiljø AS - Konstruksjon
42 - Betongmiljø AS - Geoteknikk
50 - Fasade & Form AS (ARK)
60 - Strøm & Lys AS (RiE)
70 - Klima AS (RiV)
80 - HMS-koordinator
```

4. **Før/etter-illustrasjon** (visualisering, detaljeres under implementering)
   - Bryter eller side-ved-side-visning: "Én stor gruppe" vs "Flere små grupper"
   - "Én stor gruppe" viser at alle har samme rettigheter, ingen presisjon
   - "Flere små grupper" viser at man kan gi RiB Konstruksjon ulike rettigheter enn RiB Geoteknikk

**Layout:** Header øverst, så de tre prinsipp-kortene horisontalt, så eksempelprosjektet sentralt, så før/etter-illustrasjonen nederst.

## Personer-register (kontinuitet)

For å gi presentasjonen sammenheng bruker vi samme falske navn på tvers av sider. Eksisterende navn (fra Box Comm og Field) videreføres:

| Rolle | Navn |
|---|---|
| RiB | Per Betong, Lise Stålsen |
| ARK | Kari Fasade |
| RiE | Tor Ampere |
| RiV | Ole Ventansen, Anna Rørvik |
| Totalentreprise | Lars Anlegg, Erik Montasje, Nina Fremdrift |
| Prosjekteringsleder | Ingrid Plansson, Jonas Koordinsen, Frida Ledersen |

**Nye navn for Brukergrupper-tracket:**

| Rolle | Navn |
|---|---|
| Byggherre | Stein Bygg |
| Byggeledelse | Marit Leder |
| HMS-koordinator | Kjell Sikker |

Nye navn kan refines under implementering hvis Syver foretrekker andre.

## Tekniske notater

Når implementeringen skjer (i `writing-plans` og deretter `executing-plans`), skal disse mønstrene følges:

- **CSS-arkitektur:** Bruk de eksisterende CSS-variablene (`--topbar-h`, `--sticky-top`, fargevariabler). Lilla finnes allerede som `--purple` på `:root`.
- **Tab-mønster på side 2:** Gjenbruk `.hub-tab`-klassen som allerede er delt mellom `.comm-tab`, `.hub-tab` etc.
- **Responsivitet:** Følg samme mønster som hub-stage og comm-stage. Eventuelle koordinatbaserte visualiseringer (side 1) skal bruke `getXxxLayout()`-funksjoner og oppdateres via debounced window.resize.
- **Tilgjengelighet:** Knapper er `<button>`, ikon-knapper får aria-label, focus-visible-styling arves fra global regel.
- **Override-mønsteret:** Den nye tracket må håndteres i:
  - `openCommonTrack(track)` eller `openBoxTrack(track)` (avhengig av om vi gjenbruker eller lager ny)
  - `updateArrows()` (sidepilene må skjønne hvor den nye tracket er)
  - `backToSplash()` (slik at tilbake-knappen fungerer)

## Out of scope

Følgende dekkes ikke i denne track-en, men kan legges til senere:

- **Tender, Handover og Apartments** sine egne admin-grupper (mindre relevant for målgruppen)
- **Custom permissions per gruppe i detalj** (rettighetsmatrise er for stor for én side, og varierer per prosjekt)
- **Workflows og kommunikasjonsflyt i detalj** (de er allerede dekket av eksisterende Field- og Box-tracks; vi linker tematisk istedenfor å gjenta)
- **Brukere vs grupper på et metanivå** (selve definisjonen av en bruker holder vi utenfor — fokus er gruppen)

## Åpne spørsmål som avklares under implementering

- Skal "Felles begreper"-seksjonen ha en kort intro-tekst, eller bare label + kort? (vurderes når vi ser hvordan layout føles)
- Visualiseringen på side 1 (personer → grupper → rettigheter): SVG-basert som hub-visningene, eller mer kort-basert med piler?
- Før/etter-illustrasjonen på side 3: bryter mellom to visninger, eller statisk side-ved-side?
- Trenger vi piltast-navigasjon mellom Felles begreper-kort på splash, eller holder det med klikk?

Disse avgjøres når vi ser implementeringen i nettleseren.
