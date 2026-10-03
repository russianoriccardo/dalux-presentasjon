# Ferdige prompter til chatten

Her er prompter du kan kopiere rett inn i Claude. De gir Claude konteksten den trenger,
så du slipper å forklare oppsettet på nytt hver gang.

**Slik bruker du dem:**
1. Start en ny samtale.
2. **Vedlegg** de aktuelle filene (binders-ikonet): alltid `SPRAAKSTIL.md`, og fila/filene
   du skal endre (oftest `index.html`, ev. en `css/`- eller `js/`-modul).
3. Lim inn **oppstartsprompten** under og send.
4. Når Claude har bekreftet at den har forstått, lim inn **mal per endring** og beskriv det du vil ha.

> **Har du Claude Pro?** Legg oppstartsprompten inn som «custom instructions» / prosjekt-instruksjon
> i et **Project**, og last opp filene som prosjektkunnskap én gang. Da slipper du å lime inn noe
> som helst i hver samtale – du bare beskriver endringen.

---

## 1. Oppstartsprompt (lim inn først i en ny chat)

```
Du hjelper meg å vedlikeholde en interaktiv nettside som viser hvordan Dalux Field og Box
fungerer, med eksempler fra et byggeprosjekt. Nettsiden er ren HTML/CSS/JS uten byggesteg
eller avhengigheter – bare filer som GitHub Pages serverer direkte, og som åpnes ved å
dobbeltklikke index.html.

Slik er filene organisert:
- index.html  – alt innhold og all tekst (det jeg endrer oftest)
- css/        – utseende, delt i moduler: base, box-samhandling, box-mappestruktur,
                brukergrupper, box-iso-og-nav, field, responsivt
- js/         – oppførsel og animasjoner, delt i moduler: field, field-scenarios,
                box-samhandling, box-mappestruktur, brukergrupper, box-iso, navigasjon
CSS- og JS-modulene lastes i en fast rekkefølge fra index.html. responsivt.css og
navigasjon.js lastes alltid sist – ikke endre den rekkefølgen.

Regler når du foreslår endringer:
1. Følg språkstilen i SPRAAKSTIL.md (vedlagt). Den gjelder all tekst i presentasjonen,
   blant annet at innholdet skal være på norsk og uten tankestrek.
2. Hold løsningen selvstendig: ingen nye verktøy, rammeverk, byggesteg eller eksterne
   avhengigheter.
3. Gjør minst mulig: endre bare det jeg ber om, og hold deg til eksisterende mønstre,
   klassenavn og struktur.

Slik vil jeg ha svaret:
- Gi meg den konkrete kodebiten som skal endres, og si tydelig HVILKEN fil den ligger i
  og HVOR den skal inn (hvilken tekst den erstatter, eller hva den skal limes rett etter).
- Er endringen stor, gi meg hele den oppdaterte fila i stedet.
- Forklar kort hva endringen gjør, men hold deg til saken.

Jeg legger ved de aktuelle filene. Si fra hvis du trenger en annen fil for å se
sammenhengen. Bekreft kort at du har forstått oppsettet, så beskriver jeg endringen.
```

---

## 2. Mal per endring (send etter at Claude har bekreftet)

```
Endring jeg vil ha:
- Hvor i presentasjonen: [f.eks. Box → Mappestruktur → fanen "Filtrering i praksis"]
- Hva som skal endres: [beskriv kort hva som er der i dag]
- Slik vil jeg ha det: [ønsket resultat / ny tekst]

Følg språkstilen. Gi meg kodebiten som skal endres, og si nøyaktig hvilken fil og hvor
den skal inn.
```

---

## 3. Nyttige tilleggsprompter

**Når du ikke vet hvilken fil noe ligger i:**
```
Jeg vil endre [beskriv det du ser på siden]. Hvilken fil ligger det i, og hva skal jeg
søke etter for å finne stedet? (index.html for tekst, css/ for utseende, js/ for oppførsel.)
```

**Når du vil dobbeltsjekke før du publiserer:**
```
Før jeg legger dette ut: ser denne endringen riktig ut, og er det noe den kan ha brutt
et annet sted på siden? Jeg har bare endret [fil] slik du foreslo.
```

**Når noe ble feil:**
```
Etter endringen skjer [beskriv hva som ser galt ut / hva som ikke virker]. Her er fila slik
den er nå (vedlagt). Hva gikk galt, og hvordan retter jeg det?
```

---

Husk uansett: **åpne index.html i nettleseren og se at det ble riktig før du publiserer til GitHub.**
Se [START-HER.md](START-HER.md) for hele arbeidsflyten.
