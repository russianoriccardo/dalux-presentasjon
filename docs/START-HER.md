# Teknisk overlevering – Dalux-presentasjonen

Du kjenner presentasjonen fra før. Dette dokumentet er **det tekniske**: hva som er bygget, hvordan vi har jobbet, og en steg-for-steg på hvordan du tar over og fortsetter. Du trenger **ingen forkunnskaper i koding**.

---

## 1. Det tekniske: hva som er bygget

- Nettsiden er **rene tekstfiler** (HTML, CSS og JavaScript). Ingen database, ingen server, ingen rammeverk og **ingen byggesteg** – nettleseren setter delene sammen selv når siden åpnes.
- **Åpne den lokalt:** dobbeltklikk `index.html`, så vises den i nettleseren slik den ser ut for publikum.
- **Publisering:** den ligger på **GitHub Pages**, en gratis tjeneste som serverer filene som en nettside.
- Tidligere lå alt i én stor fil. Nå er den **delt opp i moduler**, så hver del er liten og lett å jobbe med (særlig i chat).

```
dalux-presentasjon/
├── index.html        ← selve innholdet og all tekst (det du endrer oftest)
├── css/              ← utseende: farger, layout, størrelser (delt i moduler)
├── js/               ← oppførsel: animasjoner, knapper, navigasjon (delt i moduler)
└── docs/             ← dokumentene (inkl. denne guiden)
```

**Hvor du endrer hva:**

| Vil du endre … | … så er det i |
|---|---|
| Tekst, ord, innhold | `index.html` |
| Farge, størrelse, plassering | riktig fil i `css/` |
| Hvordan noe oppfører seg / animeres | riktig fil i `js/` |

> **Om rekkefølge:** CSS- og JS-modulene lastes i en fast rekkefølge (se lenke- og script-listene nederst i `index.html`). `responsivt.css` og `navigasjon.js` må lastes sist – ikke endre den rekkefølgen uten grunn.

---

## 2. Slik har vi jobbet (fremgangsmåten)

Endringene er gjort i **dialog med Claude** (AI-en): du beskriver hva du vil ha, får en konkret kodebit tilbake, og limer den inn i riktig fil. Disse vanene har holdt det ryddig og trygt:

1. **Små, fokuserte endringer om gangen.** Én ting, sjekk at den ble bra, så neste. Da er det lett å se hva som eventuelt gikk galt.
2. **Verifiser alltid før du publiserer.** Etter en endring: åpne `index.html` i nettleseren og se at det ble riktig, *før* du laster opp.
3. **Følg språkstilen.** All tekst i presentasjonen følger en egen stilguide ([SPRAAKSTIL.md](SPRAAKSTIL.md)). Be alltid Claude følge den ved tekstendringer.
4. **Hold det selvstendig.** Styrken er at siden bare er filer uten byggesteg. Ikke innfør verktøy, rammeverk eller noe som må «bygges» – da mister du den enkelheten.
5. **Hold notatene oppdatert.** Skriv en linje i [STATUS-OG-GJENSTAENDE.md](STATUS-OG-GJENSTAENDE.md) når du endrer noe, så vet «neste person» (eller du selv senere) hvor ting står.

---

## 3. Slik tar du over (steg for steg)

### Steg 1 – Skaff deg Claude
Du fortsetter å bruke Claude til endringene. Velg nivå:

| Nivå | Hva | Koster | Passer når |
|---|---|---|---|
| **Gratis** | Claude i nettleser (claude.ai) | 0 kr | Lettere endringer. Du vedlegger fila i hver samtale. Har bruksgrenser. |
| **Claude Pro** *(anbefalt)* | claude.ai med Projects + høyere grenser + beste modeller | ca. 20 USD/mnd | Jevnlig arbeid. Du laster opp filene som fast «kunnskap» én gang. |
| **Claude Code** | Eget verktøy som jobber rett i filene | Krever Pro/Max **og** en privat PC å installere på | Mest smidig for store endringer, men krever installasjon. |

Claude Code er ikke gratis og krever installasjon – uaktuelt på en låst jobb-PC. **Claude i nettleser holder lenge**, særlig nå som filene er små. Gratis fungerer; Pro gjør det merkbart enklere. *(Priser endrer seg – sjekk dagens nivå på claude.ai.)*

### Steg 2 – Legg filene på din egen GitHub
Dette gjør du **én gang**, alt i nettleseren, uten å installere noe:
1. Lag en **GitHub-konto** på **github.com** (gratis, *Sign up*).
2. Lag et nytt **repository**: trykk **New**, gi det navn (f.eks. `dalux-presentasjon`), velg **Public**, trykk **Create repository**.
3. **Last opp filene:** **Add file → Upload files**, dra inn alt innholdet i mappa (`index.html`, `css/`, `js/`, `docs/`, `README.md`, `START-HER.pdf`), trykk **Commit changes**.
4. **Slå på nettsiden:** **Settings → Pages**. Under *Source*: **Deploy from a branch**, **Branch: main**, mappe **/ (root)**, trykk **Save**.
5. Vent ca. 1 minutt. Siden ligger nå på `https://<ditt-brukernavn>.github.io/dalux-presentasjon/` (adressen vises også på Settings → Pages).

> **Backup er innebygd:** Hver gang du laster opp en endring («commit»), lagres et gjenopprettingspunkt i historikken (fanen **Commits**). Blir noe feil, kan du gå tilbake. Du trenger ikke ta manuelle kopier.

### Steg 3 – Start din første chat (gjør dette i rekkefølge)
Slik kommer du raskest og best i gang. Rekkefølgen betyr noe:

1. Gå til **claude.ai**, logg inn, og start en **ny samtale**.
2. **Vedlegg filene først** (binders-ikonet nederst i skrivefeltet):
   - `SPRAAKSTIL.md` (språkreglene), og
   - **fila du vil endre** – vet du ikke hvilken? Ta `index.html` (der bor teksten).
3. **Lim inn oppstartsprompten** (finnes i [PROMPT-TIL-CHAT.md](PROMPT-TIL-CHAT.md), og som tillegg bakerst i denne guiden) som din **aller første melding**, og send.
4. Claude svarer kort at den har forstått oppsettet.
5. **Lim inn «mal per endring»**, fyll inn den konkrete endringen du vil ha, og send.
6. Claude gir deg kodebiten + nøyaktig hvor den skal inn. Gå videre til Steg 4.

> **Med Claude Pro:** legg oppstartsprompten og filene inn i et **Project** én gang (som instruksjon + prosjektkunnskap). Da hopper du rett til punkt 5 i hver nye samtale, uten å vedlegge eller lime inn noe på nytt.

### Steg 4 – Gjør en endring (den daglige loopen)
1. **Be Claude** om endringen (bruk promptene; oppgi hvor i presentasjonen, og be den følge språkstilen).
2. **Åpne riktig fil** (se tabellen i del 1) i en enkel teksteditor – Notisblokk funker, Notepad++ eller VS Code er hyggeligere.
3. **Lim inn** kodebiten der Claude peker (bruk Ctrl+F for å finne stedet), og **lagre**.
4. **Verifiser:** dobbeltklikk `index.html` og sjekk at det ble riktig (F5 for å laste på nytt).
5. **Publiser:** last fila opp til GitHub (rediger direkte med blyant-ikonet for små tekstendringer, eller **Add file → Upload files** for å erstatte en hel fil). Siden oppdaterer seg selv på ca. 1 minutt.
6. **Noter** i [STATUS-OG-GJENSTAENDE.md](STATUS-OG-GJENSTAENDE.md) hva du gjorde.

---

## De andre dokumentene

- **[PROMPT-TIL-CHAT.md](PROMPT-TIL-CHAT.md)** – ferdige prompter å lime inn i chatten. Den vil du bruke ofte.
- **[STATUS-OG-GJENSTAENDE.md](STATUS-OG-GJENSTAENDE.md)** – hva som er gjort, og hva som står igjen. Start her for å vite hva du kan ta fatt på.
- **[ARKITEKTUR-OG-HISTORIKK.md](ARKITEKTUR-OG-HISTORIKK.md)** – hvordan presentasjonen er bygget opp (navigasjon, moduler, funksjoner). Oppslagsverk når du vil forstå hvordan noe henger sammen.
- **[SPRAAKSTIL.md](SPRAAKSTIL.md)** – språk- og tekstreglene. Følg den ved alle tekstendringer.
- **[referanse/](referanse/)** – designnotater for Brukergrupper-delen.
