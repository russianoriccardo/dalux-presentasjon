# Endringer oktober 2026: toppmeny, engelsk og HelpCenter-kilder

Testet av kolleger i en egen kopi før de ble tatt inn her. Innholdet i presentasjonen er det samme som før. Det nye ligger i tre nye filer, og `index.html` har bare fått tre små innsettinger (merket med kommentarer).

## Nye filer

| Fil | Hva den gjør |
|---|---|
| `css/toppmeny-og-kilder.css` | Utseende for toppmenyen, panelene, språkvalget og henvisningene i teksten. Overstyrer noen få regler fra de andre CSS-filene. |
| `js/toppmeny-og-kilder.js` | All oppførsel: lenker til hvert steg, toppmeny, Innhold, HelpCenter-panelet, språkbytte og tastatur. Lastes sist og pakker inn funksjonene i de andre JS-filene uten å endre dem. |
| `js/engelsk-ordbok.js` | Ordboken norsk → engelsk for all tekst på siden (ca. 820 tekster). |

## Hva er nytt for den som bruker siden

- **Toppmeny** på alle sider: «Du er her» til venstre, deretter Innhold, HelpCenter, Kopier lenke, Norsk | English og fullskjerm helt til høyre. På mobil blir Innhold en menyknapp.
- **Lenke til hvert steg.** Hver side, fane og scenario har sin egen adresse, for eksempel `#box-samhandling-statuser`. Engelske lenker starter med `#en-`, for eksempel `#en-box-samhandling-statuser`. Nettleserens tilbake-knapp fungerer.
- **Innhold**: oversikt over alle temaer, med «Neste» og merking av det som ikke er ferdig.
- **HelpCenter-kilder**: hver side viser de offisielle artiklene som hører til. «Åpne avsnittet markert» åpner artikkelen med riktig avsnitt markert (Chrome, Edge, Safari). Ord i teksten med stiplet understrek og et lite tall åpner kilden sin.
- **Engelsk versjon** med Norsk | English. På engelsk går alle HelpCenter-lenker til den engelske versjonen.
- **Tilgjengelighet**: alt kan brukes med tastatur og skjermleser, bedre kontrast, mindre animasjon når systemet ber om det.
- **Retting**: «Start på nytt» i Dokumentflyt går til toppen av siden. Entrepriser-siden og forsiden kan rulles når vinduet er lavt (før ble innhold kuttet utenfor fullskjerm).

## Slik endrer du ting

**En norsk tekst i `index.html` eller `js/`:** endre den som før. Hvis teksten også skal stå riktig på engelsk, endre den samme nøkkelen i `js/engelsk-ordbok.js`. Nøkkelen må være nøyaktig lik den norske teksten. En tekst som ikke finnes i ordboken, blir stående på norsk i engelsk visning.

**HelpCenter-kildene:** i `js/toppmeny-og-kilder.js`, under `2. HELPCENTER-KILDER`:
- `ART` er listen over artikler (tittel og adresse på norsk og engelsk).
- `SRC` sier hvilke artikler som hører til hver side. Hver kilde kan ha:
  - `quote` og `frag`: et sitat ordrett fra artikkelen, som markeres når den åpnes,
  - `at`: hvilken tekst på siden som får stiplet understrek,
  - `en`: det samme på engelsk.

**Ny side eller fane:** legg den til i `ROUTES` i `js/toppmeny-og-kilder.js`, og i `currentRoute()` og `applyRoute()` slik at den får sin egen lenke.

## Må sjekkes

- Den engelske teksten bør leses av en med engelsk som morsmål, særlig navnene på entreprisene og begrepene ledd (stage) og entreprise (work package). Forkortelsene er oversatt slik: TE → MC, UE → SC, BH → Client, RiE → ELE, RiB → STR, RiV → HVAC, ARK → ARC.
- HelpCenter sier at lukkede kommentarer **kan** slettes av prosjektadministrator eller prosjekteringsleder (de kan gjenopprettes). Teksten «Lukket betyr ikke slettet» under Kommunikasjonsflyt bør kanskje justeres.
- Lenkene til HelpCenter ble kontrollert 29.09 og 01.10.2026. Hvis en artikkel endres, åpnes den fortsatt, men markeringen kan forsvinne.
