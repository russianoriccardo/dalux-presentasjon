> **Til deg som overtar:** Dette er arbeidsnotatet vårt med **status og gjenstående oppgaver**.
> Det ble ført under byggeøktene (med verktøyet Claude Code), så noen prosess-detaljer er
> ikke relevante for deg som jobber i nettleser-chat:
> - Hopp over det som handler om backups (`-vNN.html`), preview-server og «neste sesjon»-oppsett.
>   Hvordan **du** jobber står i [START-HER.md](START-HER.md).
> - De faktiske **oppgavene** (det som gjenstår å bygge/forbedre) gjelder fortsatt – det er
>   her du finner hva du kan ta fatt på.
> - Husk: nettsiden er nå **delt i moduler**, ikke én fil.

---
# Neste sesjon - Åpne oppgaver

**Sist oppdatert:** 2026-05-31

**Arbeidsfil:** `dalux-interaktiv-presentasjon.html`
**Siste stabile backup:** `dalux-interaktiv-presentasjon-v16.html` (rullerende vindu: v7-v16)

## Start her (neste økt)

1. Les i rekkefølge: denne fila → `ARKITEKTUR-OG-HISTORIKK.md` → `SPRAAKSTIL.md` (språkstil).
2. Ta v17-backup av `dalux-interaktiv-presentasjon.html` før endringer (v17 erstatter v7 i det rullerende vinduet).
3. Hovedoppgave: **design + bygg Side 2 (Filer og versjonshåndtering)** i `boxTrackFiles`, se punkt 5 under. Deretter #9 copy-pass på Brukergrupper Side 3.
4. Live-preview for selv-verifisering: start serveren (se nederst), åpne `http://localhost:8765/dalux-interaktiv-presentasjon.html` → Box → Mappestruktur.

Merk: Side 1 (Mappestruktur og metadata) er nå ferdig integrert med tre faner. Side 2 er en lett «kommer snart»-placeholder med ferdig 2-sides-nav.

## Gjort i sesjon 2026-05-31 (del 2): Side 1 Mappestruktur integrert

- ✅ **Mappestruktur-track Side 1 ferdig**: erstattet placeholderen i `boxTrackFiles` med ekte 2-sides-track (`showFilesPage`), av-gatet Box-velgerkortet (fjernet "Kommer snart").
- ✅ **Tre faner på Side 1** (`setFilesTab`): Mappestruktur / Navngiving og metadata / Filtrering i praksis. Bruker `hub-tab`-stil som iso-fanene. Innhold + begge animasjonene fra prototypene integrert (CSS scoped under `#boxTrackFiles`, prefiks `fl-`/`fls-`/`fll-`).
- ✅ **Splitt-animasjon scroll-utløst** (IntersectionObserver, 1s delay): hviler usplittet til seksjonen er i visning, re-armes når fane 2 åpnes (lå i skjult fane).
- ✅ **Fil-liste fast reservert høyde** (`fllReserveHeight`, målt i JS): filtrering endrer ikke sidehøyden lenger → scroll-posisjonen "hopper" ikke. Måles når fane 3 vises.
- ✅ **Innholdsnyanser** (fra Syver): rettigheter styres via brukergrupper (ikke mapper); avgrenser er konfigurerbar (ikke bare bindestrek); standardfelter vs. egne felter (låsesymbol); "Slik bygger du malen"; Filtrering-fanen frikoblet fra navnemal ("så lenge metadataen er der").
- ✅ Backup: rullerende vindu nå **v7-v16** (v16 = sesjonsslutt). Live-preview brukt til selv-verifisering hele veien.

Wiring-detaljer (for neste økt): `openBoxTrack('files')` → `flInitFiles()` (direkte kall, ikke rAF — struper i headless). `getNavContext` har files-gren. Resize-hook re-måler/replay-er kun synlig fane. Faner klikkes (ikke del av sidepil/demo-nav, som iso-fanene).

## Gjort i sesjon 2026-05-31 (del 1)

Alle de seks punktene fra kollega-gjennomgangen er ferdige, pluss en del mer.

Fra forrige liste:
- ✅ #1 Standardgrupper på én side (3 tabs fjernet, tre seksjoner under hverandre)
- ✅ #2 "Slik bygger du gode grupper" (Side 3): spotlight-stegvis visning, 3 steg
- ✅ #3 HMS "Privat"-disclaimer (myknet til "standard + unntak", disclaimer nederst)
- ✅ #4 Box i praksis: M365 lagt til Nivå 1, sammenligning flyttet til Nivå 2
- ✅ #6 ISO S4: "kan også håndteres utenfor Box"
- ✅ Capture: byttet "HMS-observasjoner" på Brukergrupper Side 1 (Capture er en Field-funksjon, ikke en gruppe-rettighet)

Større ting i tillegg:
- ✅ **Konsolideringsrunde** (multi-agent audit, 45 funn): fjernet 9 døde CSS-klasser, 0 em-dash igjen i hele filen, "review" → "gjennomgang" (beholdt produktnavnet "Review Packages"), RiB/RiV-casing, tankestrek-som-komma ryddet, HMS-selvmotsigelse løst, faktafiks (kommentartype knyttes til flyter, ikke omvendt).
- ✅ **Samhandling i Box**: selector-kortet "Kommunikasjonsflyt" omdøpt. Tracken har nå én samlet 4-tab-nav (Oppsett / Kommunikasjonsflyt / Statuser / Kommentar: opprett, send, lukk) på begge sider. Topp-page-nav fjernet, dobbel h1 fjernet.
- ✅ **Statuser-fane**: spotlight-stegvis visning, 3 steg (sammenligning / eksempler / prinsipper).
- ✅ **Demo-navigasjon**: Page Up/Down + mus-tommelknapper stegger innholdet på stepper-sider, ellers blar mellom sider/faner (`presAdvance`).

## Gjenstående oppgaver

### 5. Mappestruktur-track Side 2 (Side 1 FERDIG ✅)
**Sted:** Box → Mappestruktur (`id=boxTrackFiles`)
**Struktur:** Side 1 "Mappestruktur og metadata" (ferdig), Side 2 "Filer og versjonshåndtering" (gjenstår).

**Rolle (avklart):** Mappestruktur-tracken er de praktiske "få mer ut av Box"-tipsene, lav terskel, for de fleste. ISO-tracken forblir det formelle standard-blikket. Litt overlapp er greit (ulik dybde/vinkling). Forankret i PDF-en "Dalux innspill til BIM-manual" (i Downloads).

**Side 1 — FERDIG (integrert 2026-05-31):** Tre faner (`setFilesTab`): Mappestruktur / Navngiving og metadata / Filtrering i praksis.
- Fane 1 Mappestruktur: flat vs. tung struktur (før/etter-kort), mapper du trenger (rettigheter via brukergrupper + navnemaler), unngå fasemapper.
- Fane 2 Navngiving og metadata: splitt-animasjon (Enkel/Detaljert, port av `_proto_split`), standardfelter vs. egne felter (låsesymbol-skillet), "Slik bygger du malen" (felt+avgrensere, test filnavn), "Nummer" (unikt → hyperlenker).
- Fane 3 Filtrering i praksis: filtrerbar fil-liste (port av `_proto_dalux`), 20 tegninger, Fag+Etasje-chips.
- Prototypene `_proto_split.html` + `_proto_dalux.html` er nå integrert (kan arkiveres/slettes når Syver bekrefter).

**Side 2-innhold (skal designes + bygges):** versjonssett som erstatter fasemapper, sammenligning mot tidligere versjoner, Microsoft 365, publisering (byggegjerde-metaforen Filer→Utgitte filer). Vurder også en egen hyperlink-animasjon (klikk et nummer → hopp til tegning). Side 2 er i dag en lett "kommer snart"-placeholder; 2-sides-navet er ferdig.

### 9. Side 3 copy-pass: skjerp eksemplet + rydd dash
**Sted:** Brukergrupper Side 3 (før/etter + eksempel-lista)
**Bakgrunn:** En kollega skjønte *hvorfor* man splitter grupper, men syntes eksemplene traff litt feil. Skjerp ordlyden så kundene forstår.
**Pluss:** rydd " - " på Side 3 ("40 - Betongmiljø", "Betongmiljø AS - Konstruksjon/Geoteknikk").

### 10. Mappestruktur Side 1: bruk funksjonsnavnet «Maler for navngivning» (rask runde)
**Bakgrunn (Syver):** Teksten sier «Navnemalen deler filnavnet i metadata ved opplasting». Bedre å bruke det faktiske funksjonsnavnet i Dalux, «Maler for navngivning», så kundene gjenkjenner og finner funksjonen. Samtidig presiser at den deler filnavnet OPP i felter.
**Forslag til ny ledetekst:** «Maler for navngivning deler filnavnet opp i metadata-felter ved opplasting. [...] Velg så enkelt eller detaljert du vil.» (behold resten av setningen om avgrenser/bindestrek/understrek/mellomrom).
**Gjør:** Gå gjennom ALLE «navnemal»-referanser på Side 1 (splitt-ledeteksten, «Det er disse navnemalen fyller ut automatisk», «i malen drar du inn feltene», «før du tar malen i bruk», Filtrering-ledeteksten «kom fra en navnemal»). Bytt til funksjonsnavnet der det navngir funksjonen; behold «malen» generisk der det flyter bedre.
**NB stavemåte:** Dalux-UI bruker «navngivning» (jf. «Filnavngivningsmal», «Elementer for navngivning» i skjermbildet), mens presentasjonen i dag bruker «navngiving» (f.eks. fane 2 «Navngiving og metadata», kortet «Maler for navngiving»). Avklar med Syver hvilken som skal gjelde, og gjør den konsekvent samtidig.

### Liten rest
- Aktivitetslogg-footnoten på Kommentar-fanen kan ha andre " - " som audit-en ikke fanget (lå i JS-strenger). Verdt en ny tegn-sjekk ved anledning.

## Anbefalt rekkefølge
1. #10 «Maler for navngivning»-navnefiks på Side 1 (rask, gjør det først).
2. Design + bygg Side 2 (Filer og versjonshåndtering).
3. #9 copy-pass på Brukergrupper Side 3 (egen liten runde).

## Parkerte idéer
- **Lokasjoner som egen "Felles begreper"-track** (parallelt til Brukergrupper, ikke inni Box): bygnings- og etasjestruktur, splitting av bygg, og gotcha-en mot Field-kontrollplaner (en etasje avgrenses av etasjen over → objekter kan havne i feil etasje). Kryssgående tema (Field + Box), så det passer dårlig inni Box-mappesidene. Seedes av PDF-en "Dalux innspill til BIM-manual" (etasje-/bygningsinndeling-delen). Egen brainstorm/bygg når det blir aktuelt.

## Viktige referansedokumenter
- `ARKITEKTUR-OG-HISTORIKK.md` — full historikk og arkitektur
- `SPRAAKSTIL.md` — språkstilguide (følg ved alle tekstendringer!)
- `referanse/2026-05-21-brukergrupper-track-design.md`
- `referanse/2026-05-21-brukergrupper-track-plan.md`
- `_proto_split.html` + `_proto_dalux.html` — Side 1-animasjoner, NÅ INTEGRERT i `boxTrackFiles` (scratch kan arkiveres/slettes når Syver bekrefter)
- "Dalux innspill til BIM-manual" (PDF, lå i Syver sin Downloads) — kilde for tegningsnummerering, metadata og publisering. Be Syver om den igjen ved behov (særlig for Side 2: versjonssett, byggegjerde-publisering).

## Live-preview for verifisering
`.claude/launch.json` ligger i `D:\Programmer\CSM verktøy` og kjører `python -m http.server 8765 --directory "...Interaktiv presentasjon"`. Start serveren med preview-verktøyet, åpne `http://localhost:8765/dalux-interaktiv-presentasjon.html`. Lar Claude verifisere visuelt selv.

## Publisering
Kopier `dalux-interaktiv-presentasjon.html` til `index.html` og last opp til GitHub (repo: `syver-h/dalux-presentasjon`).
