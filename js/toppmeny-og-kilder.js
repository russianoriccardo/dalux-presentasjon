/* =====================================================================
   Toppmeny, språk, lenker til hvert steg, Innhold, HelpCenter-kilder og
   tilgjengelighet. Lagt til oktober 2026, se docs/ENDRINGER-2026-10.md.
   Lastes til slutt: pakker inn navigasjonsfunksjonene fra de andre
   filene (showPage, openBoxTrack osv.) uten å endre dem.
   ===================================================================== */
(function(){
'use strict';

/* ================================================================
   1. KART OVER SIDENE
   Hver side har en kort lenke-id (#box-samhandling-statuser).
   Bare bokstaver, tall og bindestrek, så lenkene fungerer overalt.
   ================================================================ */
const AREAS = {
  field:{ name:'Field', home:'field-entrepriser' },
  box:{ name:'Box', home:'box' },
  bg:{ name:'Felles begreper', home:'brukergrupper-hva' }
};
const TRACKS = {
  'field':{ area:'field', name:'Field' },
  'box':{ area:'box', name:'Box' },
  'box-samhandling':{ area:'box', name:'Samhandling i Box' },
  'box-mapper':{ area:'box', name:'Mappestruktur og filhåndtering' },
  'box-iso':{ area:'box', name:'ISO 19650' },
  'brukergrupper':{ area:'bg', name:'Brukergrupper' }
};
const ROUTES = [
  { id:'start', title:'Forside' },
  { id:'brukergrupper-hva', track:'brukergrupper', name:'Hva er en brukergruppe?', n:1 },
  { id:'brukergrupper-standard', track:'brukergrupper', name:'Standardgruppene', n:2 },
  { id:'brukergrupper-oppsett', track:'brukergrupper', name:'Slik bygger du gode grupper', n:3 },
  { id:'field-entrepriser', track:'field', name:'Entrepriser', n:1 },
  { id:'field-oppgaver', track:'field', name:'Oppgaver', n:2 },
  { id:'field-oppgaver-enkel', track:'field', parent:'field-oppgaver', name:'Enkel oppgave', sc:0 },
  { id:'field-oppgaver-kryssforlop', track:'field', parent:'field-oppgaver', name:'Kryssforløp', sc:1 },
  { id:'field-oppgaver-hms', track:'field', parent:'field-oppgaver', name:'HMS-forløp', sc:2 },
  { id:'field-oppgaver-godkjenning', track:'field', parent:'field-oppgaver', name:'Godkjenning', sc:3 },
  { id:'box', track:'box', name:'Velg tema' },
  { id:'box-samhandling-oppsett', track:'box-samhandling', name:'Oppsett', n:1, key:'list' },
  { id:'box-samhandling-flyt', track:'box-samhandling', name:'Kommunikasjonsflyt', n:2, key:'hub' },
  { id:'box-samhandling-statuser', track:'box-samhandling', name:'Statuser', n:3, key:'status' },
  { id:'box-samhandling-kommentar', track:'box-samhandling', name:'Kommentar: opprett, send, lukk', n:4, key:'comment' },
  { id:'box-mapper-struktur', track:'box-mapper', name:'Mappestruktur', n:1, key:'struktur' },
  { id:'box-mapper-navngiving', track:'box-mapper', name:'Navngiving og metadata', n:2, key:'navn' },
  { id:'box-mapper-filtrering', track:'box-mapper', name:'Filtrering i praksis', n:3, key:'praksis' },
  { id:'box-mapper-versjoner', track:'box-mapper', name:'Filer og versjonshåndtering', n:4, wip:true },
  { id:'box-iso-standard', track:'box-iso', name:'ISO 19650', n:1 },
  { id:'box-iso-praksis', track:'box-iso', name:'Box i praksis', n:2 },
  { id:'box-iso-dokumentflyt', track:'box-iso', name:'Dokumentflyt', n:3 }
];
const R = Object.fromEntries(ROUTES.map(r=>[r.id,r]));
/* Anbefalt rekkefølge for «Neste tema» (grupper først, fordi resten bygger på dem) */
const ORDER = ['brukergrupper-hva','brukergrupper-standard','brukergrupper-oppsett','field-entrepriser','field-oppgaver','box-samhandling-oppsett','box-samhandling-flyt','box-samhandling-statuser','box-samhandling-kommentar','box-mapper-struktur','box-mapper-navngiving','box-mapper-filtrering','box-iso-standard','box-iso-praksis','box-iso-dokumentflyt'];

/* ================================================================
   2. HELPCENTER-KILDER
   Én liste over artikler, og én liste over hvilke artikler som hører
   til hver side. «quote» er ordrett fra artikkelen (kontrollert 29.09.2026).
   ================================================================ */
const HC = 'https://support.dalux.com/hc/';
const ART = {
  startAdmin:{ t:'Kom i gang som administrator', c:'Kategori', te:'Get started as an admin', ce:'Category', no:'no/categories/26837982461340', en:'en-us/categories/26837982461340' },
  startUser:{ t:'Kom i gang som bruker', c:'Kategori', te:'Get started as a user', ce:'Category', no:'no/categories/26838072030492', en:'en-us/categories/26838072030492' },
  entrepriser:{ t:'Entrepriser og arbeidsforløp', c:'Field › Grunnleggende', te:'Work Packages and workflows', ce:'Field › Basics', no:'no/articles/360015729080-Entrepriser-og-arbeidsforl%C3%B8p', en:'en-us/articles/360015729080-Work-Packages-and-workflows' },
  oppgOppsett:{ t:'Hvordan sette opp oppgaver', c:'Field › Oppgaver og Godkjennelser', te:'How to set up Tasks', ce:'Field › Tasks and Approvals', no:'no/articles/5105781479580-Hvordan-sette-opp-oppgaver', en:'en-us/articles/5105781479580-How-to-set-up-Tasks' },
  oppgOpprett:{ t:'Hvordan opprette og vise Oppgaver', c:'Field › Oppgaver og Godkjennelser', te:'How to create and view Tasks', ce:'Field › Tasks and Approvals', no:'no/articles/4405950478354-Hvordan-opprette-og-vise-Oppgaver', en:'en-us/articles/4405950478354-How-to-create-and-view-Tasks' },
  oppgSvar:{ t:'Hvordan svare på oppgaver', c:'Field › Oppgaver og Godkjennelser', te:'How to answer Tasks', ce:'Field › Tasks and Approvals', no:'no/articles/360008955913-Hvordan-svare-p%C3%A5-oppgaver', en:'en-us/articles/360008955913-How-to-answer-Tasks' },
  oppgStatus:{ t:'Oppgavestatusser', c:'Field › Oppgaver og Godkjennelser', te:'Task statuses', ce:'Field › Tasks and Approvals', no:'no/articles/6476482335004-Oppgavestatusser', en:'en-us/articles/6476482335004-Task-statuses' },
  godkjenn:{ t:'Godkjennelser', c:'Field › Oppgaver og Godkjennelser', te:'Approvals', ce:'Field › Tasks and Approvals', no:'no/articles/360013199360-Godkjennelser', en:'en-us/articles/360013199360-Approvals' },
  hmsOppsett:{ t:'Hvordan sette opp HMS', c:'Field › HMS', te:'How to set up Safety', ce:'Field › Safety', no:'no/articles/360020667040-Hvordan-sette-opp-HMS', en:'en-us/articles/360020667040-How-to-set-up-Safety' },
  hmsBruk:{ t:'Hvordan bruke HMS', c:'Field › HMS', te:'How to use Safety', ce:'Field › Safety', no:'no/articles/12149758751644-Hvordan-bruke-HMS', en:'en-us/articles/12149758751644-How-to-use-Safety' },
  kommOppsett:{ t:'Hvordan sette opp kommentarer', c:'Box › Kommentarer og Granskingspakker', te:'How to set up Comments', ce:'Box › Comments and Review packages', no:'no/articles/360020417020-Hvordan-sette-opp-kommentarer', en:'en-us/articles/360020417020-How-to-set-up-Comments' },
  kommBruk:{ t:'Hvordan bruke Kommentarer', c:'Box › Kommentarer og Granskingspakker', te:'How to use Comments', ce:'Box › Comments and Review packages', no:'no/articles/12727090183708-Hvordan-bruke-Kommentarer', en:'en-us/articles/12727090183708-How-to-use-Comments' },
  mapper:{ t:'Mappestruktur og mapperettigheter', c:'Box › Grunnleggende', te:'Folder structure and folder permissions', ce:'Box › Basics', no:'no/articles/4406612640018-Mappestruktur-og-mapperettigheter', en:'en-us/articles/4406612640018-Folder-structure-and-folder-permissions' },
  metadata:{ t:'Hvordan sette opp Metadata', c:'Box › Metadata og Maler for navngivning', te:'How to set up Metadata', ce:'Box › Metadata and File naming templates', no:'no/articles/360019737653-Hvordan-sette-opp-Metadata', en:'en-us/articles/360019737653-How-to-set-up-Metadata' },
  navnemal:{ t:'Maler for navngivning', c:'Box › Metadata og Maler for navngivning', te:'File naming templates', ce:'Box › Metadata and File naming templates', no:'no/articles/11401889645340-Maler-for-navngivning', en:'en-us/articles/11401889645340-File-naming-templates' },
  hyperlenker:{ t:'Hyperlinker på PDF-tegninger og i dokumenter', c:'Box › Tilføy og tilknytt filer', te:'Hyperlinks on PDF drawings and in documents', ce:'Box › Add and link files', no:'no/articles/7492038354844-Hyperlinker-p%C3%A5-PDF-tegninger-og-i-dokumenter', en:'en-us/articles/7492038354844-Hyperlinks-on-PDF-drawings-and-in-documents' },
  sokFilter:{ t:'Søk og filtre i Box', c:'Box › Grunnleggende', te:'Search and filters in Box', ce:'Box › Basics', no:'no/articles/7948154702748-S%C3%B8k-og-filtre-i-Box', en:'en-us/articles/7948154702748-Search-and-filters-in-Box' },
  versjoner:{ t:'Oppdater versjoner av tegninger og dokumenter', c:'Box › Versjoner og sammenlign filer', te:'Update drawing and document versions', ce:'Box › Versions and Compare files', no:'no/articles/360018758033-Oppdater-versjoner-av-tegninger-og-dokumenter', en:'en-us/articles/360018758033-Update-drawing-and-document-versions' },
  versjonssett:{ t:'Versjonssett', c:'Box › Versjonssett og Fordelingslister', te:'Version sets', ce:'Box › Version sets and Distribution lists', no:'no/articles/360014590620-Versjonssett', en:'en-us/articles/360014590620-Version-sets' },
  sammenlign:{ t:'Sammenlign versjoner', c:'Box › Versjoner og sammenlign filer', te:'Compare versions', ce:'Box › Versions and Compare files', no:'no/articles/10022982079004-Sammenlign-versjoner', en:'en-us/articles/10022982079004-Compare-versions' },
  filomrader:{ t:'Filområder', c:'Box › Filområder og filforløp', te:'File areas', ce:'Box › File areas and File flows', no:'no/articles/8005707150364-Filomr%C3%A5der', en:'en-us/articles/8005707150364-File-areas' },
  statusMeta:{ t:'Status metadata for filer', c:'Box › Metadata og Maler for navngivning', te:'Status metadata for files', ce:'Box › Metadata and File naming templates', no:'no/articles/8130293824028-Status-metadata-for-filer', en:'en-us/articles/8130293824028-Status-metadata-for-files' },
  filforlopOppsett:{ t:'Hvordan sette opp filforløp', c:'Box › Filområder og filforløp', te:'How to set up File flows', ce:'Box › File areas and File flows', no:'no/articles/4633913437340-Hvordan-sette-opp-filforl%C3%B8p', en:'en-us/articles/4633913437340-How-to-set-up-File-flows' },
  filforlopBruk:{ t:'Hvordan bruke filforløp', c:'Box › Filområder og filforløp', te:'How to use File flows', ce:'Box › File areas and File flows', no:'no/articles/11773699520924-Hvordan-bruke-filforl%C3%B8p', en:'en-us/articles/11773699520924-How-to-use-File-flows' },
  boxSjekk:{ t:'Sjekkliste for Box-implementering', c:'Kom i gang som administrator › Box', te:'Dalux Box implementation checklist', ce:'Get started as an admin › Box', no:'no/articles/27068740846364-Sjekkliste-for-Box-implementering', en:'en-us/articles/27068740846364' },
  grupper:{ t:'Hvordan sette opp Brukergrupper', c:'Generelle innstillinger › Brukerstyring', te:'How to set up User groups', ce:'General settings › User management', no:'no/articles/9678265131164-Hvordan-sette-opp-Brukergrupper', en:'en-us/articles/9678265131164-How-to-set-up-User-groups' }
};

const SRC = {
  'start':[
    { a:'startAdmin', why:'For deg som setter opp et prosjekt: grupper, mapper, forløp og innstillinger.', en:{why:'For people setting up a project: groups, folders, workflows and settings.'} },
    { a:'startUser', why:'For deg som er invitert inn i et prosjekt og skal bruke Dalux i hverdagen.', en:{why:'For people invited into a project who will use Dalux day to day.'} }
  ],
  'brukergrupper':[
    { a:'grupper', why:'Den offisielle gjennomgangen av brukergrupper og rettigheter.', en:{why:'The official walkthrough of user groups and rights.',sect:'How to set up user groups',quote:'User groups are usually divided into roles and trades on the project. Within these groups, the different permissions in the project can be set.',mark:'Within these groups, the different permissions in the project can be set.',frag:'Within these groups, the different permissions',at:'give the groups rights'}, at:['#brukergrupperPage1 .bg-intro','gir gruppene rettigheter'], sect:'Hvordan sette opp brukergrupper',
      quote:'Brukergrupper er vanligvis delt inn i roller og bransjer i prosjektet. Du kan styre rettighetene i prosjektet gjennom brukergruppene.', mark:'Du kan styre rettighetene i prosjektet gjennom brukergruppene.',
      frag:'Du kan styre rettighetene i prosjektet gjennom brukergruppene' },
    { a:'entrepriser', why:'Gruppene brukes videre i entrepriser og arbeidsforløp. Det er derfor de kommer først.', en:{why:'Groups are used again in work packages and workflows. That is why they come first.',sect:'Introduction',quote:'Work packages and workflows are used together with user groups.',frag:'Work packages and workflows are used together with user groups',at:'depending on the module and workflow'}, at:['#brukergrupperPage1 .bg-intro','avhengig av modul og arbeidsforløp'], sect:'Innledning',
      quote:'Entrepriser og arbeidsforløp brukes sammen med brukergrupper.', frag:'Entrepriser og arbeidsforløp brukes sammen med brukergrupper' }
  ],
  'brukergrupper-standard':[
    { a:'grupper', why:'Hvilke grupper Dalux lager for deg, og hva de har tilgang til.', en:{why:'Which groups Dalux creates for you, and what they can access.',sect:'Predefined user groups in Dalux',at:'Has full access to all project settings'}, at:['#brukergrupperPage2','Har full tilgang til alle prosjektets innstillinger'], sect:'Forhåndsdefinerte brukergrupper i Dalux' },
    { a:'hmsOppsett', why:'HMS-leder-gruppen og hva den får automatisk.', en:{why:'The safety manager group and what it gets automatically.',sect:'How to set up Safety',at:'Receives all safety observations'}, sect:'Hvordan sette opp brukergruppen HMS-leder', at:['#brukergrupperPage2','Mottar alle HMS-observasjoner'] },
    { a:'grupper', why:'Når standardgruppene ikke holder, og du lager egne.', en:{why:'When the default groups are not enough and you create your own.',sect:'Custom user groups',at:'a custom group'}, at:['#brukergrupperPage2','egendefinert gruppe'], sect:'Brukerdefinerte brukergrupper' }
  ],
  'brukergrupper-oppsett':[
    { a:'grupper', why:'Slik gir du en egendefinert gruppe riktige rettigheter.', en:{why:'How to give a custom group the right permissions.',sect:'Permissions in a custom user group',at:'Several small groups give more control'}, at:['#brukergrupperPage3','Flere små grupper gir mer kontroll'], sect:'Rettigheter i en egendefinert brukergruppe' },
    { a:'mapper', why:'Mappetilgang gis også til grupper, ikke enkeltpersoner.', en:{why:'Folder access is also given to groups, not individuals.',sect:'Folder permissions'}, sect:'Mappe rettigheter' },
    { a:'boxSjekk', why:'Steg 2 i sjekklisten handler om akkurat dette.', en:{why:'Step 2 of the checklist is about exactly this.',sect:'2. User groups and permissions'}, sect:'2. Brukergrupper og tillatelser' }
  ],
  'field-entrepriser':[
    { a:'entrepriser', why:'Samme begreper som i visningen her: entrepriser, forløp og roller.', en:{why:'The same concepts as in this view: work packages, workflows and roles.',sect:'Work Packages and workflows',quote:'Work packages and workflows are used together with user groups.',frag:'Work packages and workflows are used together with user groups',at:'see its workflows'}, at:['#page1 header','se arbeidsforløpene'], sect:'Innledning',
      quote:'Entrepriser og arbeidsforløp brukes sammen med brukergrupper. De er grunnlaget for et Dalux-prosjekt, ettersom de kombineres for å kontrollere kommunikasjonsflyten og begrense rettigheter og synlighet i Dalux-prosjekter.',
      mark:'De er grunnlaget for et Dalux-prosjekt', frag:'Entrepriser og arbeidsforløp brukes sammen med brukergrupper' },
    { a:'entrepriser', why:'Hvordan et forløp er bygget opp av roller.', en:{why:'How a workflow is built from roles.',sect:'The anatomy of a workflow in Dalux',quote:'When creating workflows each step in the flow is defined by a ’role’.',frag:'When creating workflows each step in the flow is defined',at:'This is how the workflows'}, at:['#wfOverlay','Slik kan arbeidsforløpene se ut'], sect:'Anatomien til et arbeidsforløp i Dalux',
      quote:'Når du oppretter arbeidsforløp defineres hvert trinn i forløpet av en ’rolle’.', frag:'Når du oppretter arbeidsforløp defineres hvert trinn' },
    { a:'hmsOppsett', why:'HMS-forløpet og HMS-lederne du ser i «Lite» og «Stort prosjekt».', en:{why:'The safety workflow and the safety managers you see in “Small” and “Large project”.',sect:'Safety workflow',at:'Anyone on the project can create safety observations'}, at:['#wfModeHint','HMS-observasjoner kan alle på prosjektet opprette'], sect:'Hvordan sette opp HMS-forløp' }
  ],
  'field-oppgaver':[
    { a:'oppgOpprett', why:'Slik oppretter du en oppgave på mobil og desktop.', en:{why:'How to create a task on mobile and desktop.',sect:'Create a task',at:'creates a task for the Electrician'}, at:['#scBoxDesc','oppretter en oppgave til Elektriker'], sect:'Opprett en oppgave' },
    { a:'oppgSvar', why:'Det mottakeren gjør: svare, sende videre eller melde utbedret.', en:{why:'What the recipient does: reply, pass it on or report it fixed.',at:'The task is resolved directly in one workflow'}, at:['#scBoxDesc','Oppgaven løses direkte i ett forløp'] },
    { a:'oppgStatus', why:'Statusene du ser i stegene, og når de endres.', en:{why:'The statuses you see in the steps, and when they change.'} },
    { a:'oppgOppsett', why:'For administrator: oppgavemaler og felter.', en:{why:'For administrators: task templates and fields.'} }
  ],
  'field-oppgaver-kryssforlop':[
    { a:'oppgStatus', why:'Hva som skjer med statusen når oppgaven tildeles på nytt.', en:{why:'What happens to the status when the task is reassigned.',sect:'Reassign a task',at:'The main contractor sends it on in workflow 2 to Ventilation'}, at:['#scBoxDesc','TE sender den videre i forløp 2 til ventilasjon'], sect:'Tildel en oppgave på nytt' },
    { a:'entrepriser', why:'Eksempler på hvordan flere forløp henger sammen.', en:{why:'Examples of how several workflows fit together.',sect:'Examples of the flow of communication in Dalux',at:'The same task type must be enabled in both workflows'}, at:['#scBoxDesc','Samme oppgavetype må være aktivert i begge forløp'], sect:'Eksempler på kommunikasjonsflyten i Dalux' },
    { a:'oppgSvar', why:'Det mottakeren gjør når oppgaven kommer inn.', en:{why:'What the recipient does when the task comes in.'} }
  ],
  'field-oppgaver-hms':[
    { a:'hmsBruk', why:'Observasjonen i scenarioet: hvem kan opprette den, og hvor den går.', en:{why:'The observation in the scenario: who can create it, and where it goes.',sect:'How to use safety observations',quote:'Safety observations are available for everyone on the project. Safety observations are sent directly to the safety managers, who can decide on the appropriate actions.',mark:'Safety observations are sent directly to the safety managers',frag:'Safety observations are sent directly to the safety managers',at:'goes to the safety managers by default'}, at:['#scBoxDesc','går som standard til HMS-lederne'], sect:'Hvordan bruke HMS-observasjon',
      quote:'Oppretting av HMS-observasjon er tilgjengelige for alle i prosjektet. HMS-observasjoner sendes direkte til HMS-lederne, som kan beslutte hvilke tiltak som er passende.',
      mark:'HMS-observasjoner sendes direkte til HMS-lederne', frag:'HMS-observasjoner sendes direkte til HMS-lederne' },
    { a:'hmsOppsett', why:'For administrator: HMS-forløp og brukergruppen HMS-leder.', en:{why:'For administrators: the safety workflow and the safety manager user group.',sect:'How to set up Safety',at:'is sent in its own safety workflow'}, at:['#scBoxDesc','sendes i et eget HMS-forløp'], sect:'Hvordan sette opp brukergruppen HMS-leder' },
    { a:'oppgSvar', why:'Når observasjonen er blitt en HMS-oppgave, svares den som en vanlig oppgave.', en:{why:'Once the observation has become a safety issue, it is answered like a normal task.'} }
  ],
  'field-oppgaver-godkjenning':[
    { a:'godkjenn', why:'Endringsmeldingen i scenarioet er en godkjennelse med flere ledd.', en:{why:'The change notice in the scenario is an approval with several stages.',sect:'Approvals',quote:'Approvals are used in one-way workflows, where the request can only be approved in the last step of the approval flow.',mark:'can only be approved in the last step',frag:'Approvals are used in one-way workflows',at:'has to be handled in several stages'}, at:['#scBoxDesc','må behandles i flere ledd'], sect:'Innledning',
      quote:'Godkjennelser brukes vanligvis i arbeidsflyter der forespørselen bare kan godkjennes i det siste trinnet av godkjenningsflyten.',
      mark:'bare kan godkjennes i det siste trinnet', frag:'Godkjennelser brukes vanligvis i arbeidsflyter' },
    { a:'oppgStatus', why:'Avvisning og godkjenning: hvordan statusen endres.', en:{why:'Rejection and approval: how the status changes.',sect:'Rejecting a task'}, sect:'Avvisning av en oppgave' }
  ],
  'box':[
    { a:'boxSjekk', why:'Hele Box-oppsettet i seks steg: mapper, grupper, kommentarer og oppstart.', en:{why:'The whole Box setup in six steps: folders, groups, comments and go-live.'} },
    { a:'kommBruk', why:'Den viktigste daglige funksjonen i Samhandling i Box.', en:{why:'The most important everyday feature in Collaboration in Box.'} },
    { a:'mapper', why:'Grunnlaget for Mappestruktur og filhåndtering.', en:{why:'The basis for Folder structure and file management.'} }
  ],
  'box-samhandling-oppsett':[
    { a:'kommOppsett', sect:'Sett opp brukerrettigheter', why:'Rettighetene i listen styres per gruppe i hver kommunikasjonsflyt.', en:{why:'The rights in the list are set per group in each communication channel.',sect:'Set up user rights',quote:'For each user group, you can set rights for creating, editing, and closing comments.',frag:['For each user group, you can set rights','closing comments'],at:'user groups with their own rights'}, at:['#commInfoList','brukergrupper med egne rettigheter'],
      quote:'For hver brukergruppe kan du angi rettigheter for å opprette, redigere og avslutte kommentarer.', frag:['For hver brukergruppe kan du angi rettigheter','avslutte kommentarer'],
      note:'Begrep: det presentasjonen kaller Les og Lukk, heter Se og avslutte i HelpCenter.' },
    { a:'kommOppsett', sect:'Sett opp brukerrettigheter · Advarsel', why:'Tenk nøye gjennom hvem som får Se-rettighet.', en:{why:'Think carefully about who gets View rights.',sect:'Set up user rights · Warning',quote:'Keep in mind, that participants with ’View’ rights in a communication channel, can see all comments that are sent in this channel, even if they are not explicitly set as responsible or added to ’Notify’.',frag:['Keep in mind, that participants','explicitly set as responsible'],at:'Think carefully about who needs which rights'}, at:['#commInfoList','Tenk nøye gjennom hvem som trenger hvilke rettigheter'],
      quote:'Husk på at deltakere med ’Se’ rettigheter i en kommunikasjonsflyt, kan se alle kommentarene som sendes i denne flyten, selv om de ikke er eksplisitt satt som ansvarlige eller lagt til i ’Notifiser’.',
      frag:['Husk på at deltakere med','eksplisitt satt som ansvarlige'] },
    { a:'kommBruk', sect:'Hvordan svare på kommentarer', why:'Hvem som kan endre status i det daglige.', en:{why:'Who can change the status day to day.',sect:'How to reply to comments',quote:'You can change the status of the comment or close it if you have the right to do so.',frag:['You can change the status of the comment','the right to do so'],at:'Anyone with Edit rights can update the status'}, at:['#commInfoList','Alle med Rediger-rettighet kan oppdatere status'],
      quote:'Du kan skifte status på kommentaren eller lukke den hvis du har rettigheter til dette.', frag:['Du kan skifte status på kommentaren','rettigheter til dette'] },
    { a:'kommOppsett', sect:'Opprett en ny kommentartype', why:'Egne felter på kommentartypen.', en:{why:'Your own fields on the comment type.',sect:'Create a new comment type',quote:'You can set new data fields as ’required’ or ’not required’ and can choose out of the following options:',frag:['You can set new data fields','the following options'],note:'Box Pro: communication channels and comment types are only available in Box Pro. Box Standard has one predefined comment type.',at:'custom fields (text, drop-down lists, numbers)'}, at:['#commInfoList','egendefinerte felter (tekst, nedtrekklister, tallverdier)'],
      quote:'Du kan angi nye datafelt som ’påkrevd’ eller ’ikke påkrevd’ og kan velge blant følgende alternativer:', frag:['Du kan angi nye datafelt','følgende alternativer'],
      note:'Box Pro: kommunikasjonsflyter og kommentartyper finnes bare i Box Pro. Box Standard har én forhåndsdefinert kommentartype.' }
  ],
  'box-samhandling-flyt':[
    { a:'kommBruk', sect:'Slett en kommentar', why:'Lukket betyr ikke slettet, men HelpCenter nyanserer det.', en:{why:'Closed does not mean deleted, but HelpCenter adds a nuance.',sect:'Delete a comment',quote:'A comment can only be deleted if it has been closed.',frag:'A comment can only be deleted if it has been closed',note:'Clarification: closed comments can be deleted by a project administrator or project planning manager, but they can be recovered. The wording here may need adjusting.',at:'Closed does not mean deleted'}, at:['#commInfoHub','Lukket betyr ikke slettet'],
      quote:'En kommentar kan bare slettes hvis den er lukket.', frag:'En kommentar kan bare slettes hvis den er lukket',
      note:'Presisering: lukkede kommentarer kan slettes av prosjektadministrator eller prosjekteringsleder, men de kan gjenopprettes. Teksten her bør kanskje justeres.' },
    { a:'kommBruk', sect:'Hvordan svare på kommentarer', why:'Slik sender du en kommentar videre til en annen i flyten.', en:{why:'How to pass a comment on to someone else in the channel.',sect:'How to reply to comments',quote:'This allows you to change who the comment is assigned to.',frag:'This allows you to change who the comment is assigned to',at:'send comments to anyone in the channel'}, at:['#commInfoHub','sende kommentarer til hvem som helst i flyten'],
      quote:'Dette gjør at du kan endre hvem kommentaren er tildelt.', frag:'Dette gjør at du kan endre hvem kommentaren er tildelt' },
    { a:'kommOppsett', sect:'Sett opp brukerrettigheter', why:'Hvem som kan se, redigere og lukke, settes per gruppe i flyten.', en:{why:'Who can view, edit and close is set per group in the channel.',sect:'Set up user rights',quote:'For each user group, you can set rights for creating, editing, and closing comments.',frag:['For each user group, you can set rights','closing comments'],at:'The group with the Close right in the channel'}, at:['#commInfoHub','Den gruppen som har Lukk-rettighet i flyten'],
      quote:'For hver brukergruppe kan du angi rettigheter for å opprette, redigere og avslutte kommentarer.', frag:['For hver brukergruppe kan du angi rettigheter','avslutte kommentarer'] }
  ],
  'box-samhandling-statuser':[
    { a:'kommOppsett', sect:'Rediger statusverdier', why:'Statusene og fargene settes opp per kommentartype.', en:{why:'Statuses and colours are set up per comment type.',sect:'Edit status values',quote:'A comment status has a color code attached to it. These colors will be displayed in the list view for a quick overview and used as the color of 2D markups.',frag:['A comment status has a color code','color of 2D markups'],at:'Use the same status names and colour codes across comment types'}, at:['#commPage1','Bruk samme status-navn og fargekoder på tvers av kommentartyper'],
      quote:'En kommentarstatus har en fargekode knyttet til seg. Disse fargene vil bli vist i listen for et raskt overblikk og brukt som fargen på 2D-merkinger.',
      frag:['En kommentarstatus har en fargekode','fargen på 2D-merkinger'] },
    { a:'kommBruk', sect:'Hvordan svare på kommentarer', why:'Hvem som kan endre status i det daglige.', en:{why:'Who can change the status day to day.',sect:'How to reply to comments',quote:'You can change the status of the comment or close it if you have the right to do so.',frag:['You can change the status of the comment','the right to do so'],at:'Anyone with Edit rights can update the status'},
      quote:'Du kan skifte status på kommentaren eller lukke den hvis du har rettigheter til dette.', frag:['Du kan skifte status på kommentaren','rettigheter til dette'] }
  ],
  'box-samhandling-kommentar':[
    { step:1, a:'kommBruk', sect:'Legg til kommentar', why:'Markeringsverktøyene i steg 1.', en:{why:'The markup tools in step 1.',sect:'How to create a new comment',quote:'You have a variety of annotation tools that you can use to annotate the topic of your comment.',frag:'You have a variety of annotation tools',at:'mark it up with a cloud, arrow, text or measurement'}, at:['#clStepDesc','marker med sky, pil, tekst eller måling'],
      quote:'Du har en rekke annoteringsverktøy som du kan bruke til å annotere emnet for kommentaren din.', frag:'Du har en rekke annoteringsverktøy' },
    { step:1, a:'kommBruk', sect:'Fyll ut kommentarskjemaet', why:'Kommentartypen velges én gang.', en:{why:'The comment type is chosen once.',sect:'Fill out the comment form',quote:'The type is selected at creation and can not be changed afterward.',frag:'The type is selected at creation',at:'Fill in the comment form with type'}, at:['#clStepDesc','Fyll ut kommentarskjema med type'],
      quote:'Typen blir valgt ved opprettelsen og kan ikke endres etterpå.', frag:'Typen blir valgt ved opprettelsen' },
    { step:2, a:'kommBruk', sect:'Fyll ut kommentarskjemaet', why:'Hvem som får varsel når kommentaren sendes.', en:{why:'Who is notified when the comment is sent.',sect:'Fill out the comment form',quote:'Add participants additional to the responsible who should be informed about changes.',frag:'Add participants additional to the responsible',at:'The recipient is notified'}, at:['#clStepDesc','Mottakeren får varsel'],
      quote:'Tilføy deltakere i tillegg til den ansvarlige som bør informeres om endringer.', frag:'Tilføy deltakere i tillegg til den ansvarlige' },
    { step:3, a:'kommBruk', sect:'Hvordan svare på kommentarer', why:'Sende kommentaren videre til en annen gruppe i flyten.', en:{why:'Passing the comment on to another group in the channel.',sect:'How to reply to comments',quote:'This allows you to change who the comment is assigned to.',frag:'This allows you to change who the comment is assigned to',at:'send the comment on to other groups in the channel'}, at:['#clStepDesc','sende kommentaren videre til andre grupper i flyten'],
      quote:'Dette gjør at du kan endre hvem kommentaren er tildelt.', frag:'Dette gjør at du kan endre hvem kommentaren er tildelt' },
    { step:4, a:'kommBruk', sect:'Hvordan svare på kommentarer · Brukerrettigheter', why:'Å kunne redigere er ikke det samme som å kunne lukke.', en:{why:'Being able to edit is not the same as being able to close.',sect:'How to reply to comments · User rights',quote:'While you might have the ability to edit a comment, you may not have the option to close it.',frag:'While you might have the ability to edit',at:'a user with Close rights closes the comment'}, at:['#clStepDesc','lukker en bruker med Lukk-rettighet kommentaren'],
      quote:'Selv om du kanskje har muligheten til å redigere en kommentar, har du kanskje ikke alternativet til å lukke den.', frag:'Selv om du kanskje har muligheten til å redigere' },
    { step:4, a:'kommBruk', sect:'Slett en kommentar', why:'Lukket betyr ikke slettet, og historikken bevares.', en:{why:'Closed does not mean deleted, and the history is kept.',sect:'Delete a comment',quote:'A comment can only be deleted if it has been closed.',frag:'A comment can only be deleted if it has been closed',note:'Clarification: closed comments can be deleted by a project administrator or project planning manager, but they can be recovered.',at:'All history is kept'}, at:['#clStepDesc','All historikk bevares'],
      quote:'En kommentar kan bare slettes hvis den er lukket.', frag:'En kommentar kan bare slettes hvis den er lukket',
      note:'Presisering: lukkede kommentarer kan slettes av prosjektadministrator eller prosjekteringsleder, men de kan gjenopprettes.' }
  ],
  'box-mapper-struktur':[
    { a:'mapper', why:'Oppsett av mapper og mapperettigheter.', en:{why:'Setting up folders and folder permissions.',sect:'Set up a folder structure',quote:'A folder structure is needed for Dalux Box to function as a common data environment.',frag:'A folder structure is needed for Dalux Box',at:'as flat as possible'}, at:['#ftvStruktur','så flat som mulig'], sect:'Sette opp en mappestruktur',
      quote:'En mappestruktur er nødvendig for at Dalux Box skal fungere som et felles data-miljø.', frag:'En mappestruktur er nødvendig for at Dalux Box' },
    { a:'mapper', why:'Tilgang til mapper gis til brukergrupper.', en:{why:'Folder access is given to user groups.',sect:'Folder permissions',at:'Rights are managed through user groups'}, sect:'Mappe rettigheter', at:['#ftvStruktur','Rettigheter styres gjennom brukergruppene'] },
    { a:'navnemal', why:'Navnemal per mappe.', en:{why:'A naming template per folder.',sect:'Selecting folders for the naming templates',at:'Each folder can have its own naming template'}, sect:'Velge mapper for malene for navngivning', at:['#ftvStruktur','Hver mappe kan ha sin egen navnemal'] },
    { a:'boxSjekk', why:'Steg 1 i sjekklisten: mappestruktur og dokumenter.', en:{why:'Step 1 of the checklist: folder structure and documents.',sect:'1. Folder structure and documents'}, sect:'1. Mappestruktur og dokumenter' }
  ],
  'box-mapper-navngiving':[
    { a:'metadata', why:'Feltene som filnavnet splittes opp i.', en:{why:'The fields the file name is split into.',sect:'What is metadata?',at:'file-level metadata that you added yourself'}, at:['#ftvNavn','metadata på filnivå som du selv har lagt til'], sect:'Hva er metadata?' },
    { a:'navnemal', why:'Maler som fyller ut metadata automatisk fra filnavnet ved opplasting.', en:{why:'Templates that fill in metadata from the file name on upload.',at:'The naming template splits the file name into metadata on upload'}, at:['#ftvNavn','Navnemalen deler filnavnet i metadata ved opplasting'] },
    { a:'hyperlenker', why:'Hvorfor Nummer-feltet må være unikt: det styrer de automatiske koblingene.', en:{why:'Why the Number field must be unique: it drives the automatic links.',sect:'Basic requirements for hyperlinks',at:'It is the text string Dalux matches for automatic hyperlinks'}, at:['#ftvNavn','Det er tekststrengen Dalux matcher på for automatiske hyperlenker'], sect:'Grunnleggende krav for hyperlenker' }
  ],
  'box-mapper-filtrering':[
    { a:'sokFilter', why:'Filtrene i eksempelet, og hvordan du lagrer dem.', en:{why:'The filters in the example, and how to save them.',sect:'Using filters in Box',at:'you filter and search instead of hunting through folders'}, at:['#ftvPraksis','filtrerer og søker du i stedet for å lete i mapper'], sect:'Bruk av filtre i Box' },
    { a:'metadata', why:'Kolonnene du filtrerer på er metadata.', en:{why:'The columns you filter on are metadata.',sect:'Change how metadata is displayed'}, sect:'Endre hvordan metadata vises' }
  ],
  'box-mapper-versjoner':[
    { a:'versjoner', why:'Ny versjon lastes opp med samme filnavn.', en:{why:'A new version is uploaded with the same file name.'} },
    { a:'versjonssett', why:'Et fast bilde av filene på et gitt tidspunkt.', en:{why:'A fixed snapshot of the files at a given time.',sect:'Introduction',quote:'Version sets are used for making a still image of the status of your files at a given time.',frag:'Version sets are used for making a still image',at:'version sets instead of phase folders'}, at:['#filesPage2','versjonssett som erstatter fasemapper'], sect:'Innledning',
      quote:'Versjonssett brukes for å lage et fast bilde av statusen for filene dine på et gitt tidspunkt.', frag:'Versjonssett brukes for å lage et fast bilde' },
    { a:'sammenlign', why:'Se hva som er endret mellom to versjoner.', en:{why:'See what changed between two versions.',at:'comparison with earlier versions'}, at:['#filesPage2','sammenligning mot tidligere versjoner'] }
  ],
  'box-iso-standard':[
    { a:'filomrader', why:'Filområdene er Dalux sin versjon av statusområdene i ISO 19650.', en:{why:'The file areas are Dalux’s version of the ISO 19650 status areas.',sect:'What are file areas and why use them?',quote:'File areas are based on ISO 19650 and are used for managing access to files.',frag:'File areas are based on ISO 19650',at:'with clear status areas'}, at:['#boxPage1','med tydelige statusområder'], sect:'Hva er filområder og hvorfor bruke dem?',
      quote:'Filområder er basert på ISO 19650 og brukes til å håndtere tilgang til filer.', frag:'Filområder er basert på ISO 19650' },
    { a:'statusMeta', why:'Statusfeltet som følger filen gjennom områdene.', en:{why:'The status field that follows the file through the areas.',at:'Create statuses such as'}, at:['#boxPage1','Opprett statuser som'] }
  ],
  'box-iso-praksis':[
    { a:'boxSjekk', why:'Et nøkternt startpunkt, uansett nivå.', en:{why:'A sensible starting point, whatever the level.',at:'Adapt how you use Dalux Box to the project’s needs'}, at:['#boxPage2','Tilpass bruken av Dalux Box til prosjektets behov'] },
    { a:'filomrader', why:'For nivå 2 og 3: slik slår du på filområdene.', en:{why:'For levels 2 and 3: how to turn on file areas.',sect:'How to set up file areas',at:'Introduce file areas, metadata and naming conventions'}, at:['#boxPage2','Innfør filområder, metadata og navnekonvensjoner'], sect:'Hvordan sette opp filområder' },
    { a:'filforlopOppsett', why:'For nivå 3: godkjenningsflyt mellom områdene.', en:{why:'For level 3: an approval flow between the areas.',at:'a formal delivery and approval flow'}, at:['#boxPage2','formalisert leveranse- og godkjenningsflyt'] }
  ],
  'box-iso-dokumentflyt':[
    { a:'filforlopBruk', why:'Stegene i animasjonen, slik de gjøres i Dalux.', en:{why:'The steps in the animation, as they are done in Dalux.',sect:'Approving files',quote:'File flows are processes and workflows that determine how files move between the different stages of filesharing …',frag:'File flows are processes and workflows that determine how files move',at:'The document is moved to Shared files'}, at:['#boxPage3','Dokumentet flyttes til Delte filer'], sect:'Godkjennelse av filer',
      quote:'Filforløp er prosesser og arbeidsflyter som bestemmer hvordan filer beveger seg …', frag:'Filforløp er prosesser og arbeidsflyter som bestemmer hvordan filer beveger seg' },
    { a:'filforlopBruk', why:'Et dokument publiseres bare når alle stegene er godkjent.', en:{why:'A document is only published once every step is approved.',sect:'How to approve/authorize files in file flows',quote:'The file will only be approved/authorized if the file passes all the steps.',frag:'The file will only be approved',at:'the document is approved and moved to Published files'}, at:['#boxPage3','er dokumentet godkjent og flyttes til Utgitte filer'], sect:'Hvordan godkjenne/autorisere filer i filforløp',
      quote:'Filen vil bare bli godkjent/autorisert hvis filen passerer alle trinnene.', frag:'Filen vil bare bli godkjent' },
    { a:'filforlopOppsett', why:'For administrator: frister, statuser og hvem som godkjenner.', en:{why:'For administrators: deadlines, statuses and who approves.',at:'The document is sent back to Files to be updated'}, at:['#boxPage3','Dokumentet sendes tilbake til Filer for oppdatering'] }
  ]
};
function sourceKey(id){
  let k=id;
  while(k){ if(SRC[k]) return k; const i=k.lastIndexOf('-'); k = i>0 ? k.slice(0,i) : ''; }
  return null;
}
function sourcesFor(id){ const k=sourceKey(id); return k?SRC[k]:[]; }
function fragUrl(base, frag){
  if(!frag) return base;
  const enc = s=>encodeURIComponent(s).replace(/-/g,'%2D').replace(/,/g,'%2C');
  const f = Array.isArray(frag) ? enc(frag[0])+(frag[1]?','+enc(frag[1]):'') : enc(frag);
  return base+'#:~:text='+f;
}
const esc = s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ================================================================
   2b. SPRÅK
   ================================================================ */
let lang='no';
/* Ordboken (I18N_EN, I18N_RULES) ligger i js/engelsk-ordbok.js */
const LAB_EN = {
  'Forside':'Home', 'Tilbake':'Back', 'Velg tema':'Choose a topic',
  'Hva er en brukergruppe?':'What is a user group?', 'Standardgruppene':'The default groups', 'Slik bygger du gode grupper':'How to build good groups',
  'Kommunikasjonsflyt':'Communication channel', 'Filer og versjonshåndtering':'Files and versioning', 'ISO 19650':'ISO 19650', 'Box i praksis':'Box in practice',
  'Dalux - Interaktiv presentasjon':'Dalux - Interactive presentation', 'Innhold':'Contents', 'Kopier lenke til denne siden':'Copy a link to this page', 'HelpCenter':'HelpCenter', 'Kopier lenke':'Copy link', 'Fullskjerm':'Full screen', 'Avslutt fullskjerm':'Exit full screen',
  'Prototype':'Prototype', 'Prototype · ikke den offisielle versjonen':'Prototype · not the official version', 'Hopp til innholdet':'Skip to content',
  'Verktøy':'Tools', 'Du er her':'You are here', 'Språk':'Language',
  'Hopp direkte til et tema eller et steg.':'Jump straight to a topic or a step.', 'Lukk innhold':'Close contents',
  'Neste eller forrige steg på siden':'Next or previous step on the page', 'Bla gjennom hele temaet':'Move through the whole topic', 'Ett nivå opp':'One level up',
  'Les mer i Dalux HelpCenter':'Read more in Dalux HelpCenter', 'Offisiell dokumentasjon for det du ser på nå':'Official documentation for what you are looking at',
  'Lukk HelpCenter-panelet':'Close the HelpCenter panel', 'Lukk':'Close',
  'Presentasjonen forenkler. HelpCenter er den offisielle dokumentasjonen. «Åpne avsnittet» markerer teksten i Chrome, Edge og Safari. Lenkene ble kontrollert 29.09.2026.':'The presentation simplifies. HelpCenter is the official documentation. “Open the passage” highlights the text in Chrome, Edge and Safari. Links checked 29.09.2026.',
  'Om denne kopien':'About this copy',
  'Dette er en testkopi av':'This is a test copy of', 'den interaktive presentasjonen':'the interactive presentation',
  '. Originalen er ikke endret. Innholdet er det samme; det nye er navigasjonen og koblingen til HelpCenter.':'. The original has not been changed. The content is the same; what is new is the navigation, the link to HelpCenter and the English version.',
  'Nytt i denne versjonen':'New in this version',
  'Lenke til hvert steg.':'A link to every step.', 'Hver side, fane og scenario har sin egen lenke. Bruk «Kopier lenke» for å sende en kunde rett til riktig sted. Nettleserens tilbake-knapp fungerer.':'Every page, tab and scenario has its own link. Use “Copy link” to send a customer straight to the right place. The browser’s back button works.',
  'Innhold.':'Contents.', 'Oversikt over alle temaer, med «Neste tema» og merking av det som ikke er ferdig.':'An overview of every topic, with “Next” and a label on what isn’t finished.',
  '«Du er her».':'“You are here”.', 'Samme sti øverst til venstre på alle sider, i stedet for tre ulike tilbake-knapper.':'The same path at the top left of every page, instead of three different back buttons.',
  'Les mer i HelpCenter.':'Read more in HelpCenter.', 'For hver side vises de offisielle artiklene som hører til, og lenken markerer riktig avsnitt i artikkelen. I «Kommentar» følger kildene stegene i animasjonen.':'Each page lists the official articles that belong to it, and the link highlights the right passage in the article. Phrases in the text with a dotted underline open their source. In “Comment” the sources follow the steps of the animation.',
  'Tilgjengelighet.':'Accessibility.', 'Alt kan brukes med tastatur og skjermleser, fokus flyttes til riktig overskrift, bedre kontrast på tekst og aktive faner, og mindre animasjon når systemet ber om det.':'Everything works with a keyboard and screen reader, focus moves to the right heading, text and active tabs have better contrast, and there is less animation when the system asks for it.',
  'Mobil.':'Mobile.', 'Knappene overlapper ikke lenger tittelen i Box-menyen.':'The buttons no longer overlap the title in the Box menu.',
  'Norsk og engelsk.':'Norwegian and English.', 'Bytt språk med NO / EN øverst. På engelsk går alle HelpCenter-lenker til den engelske versjonen.':'Switch language with NO / EN at the top. In English, every HelpCenter link goes to the English version.',
  'Gi tilbakemelding':'Give feedback',
  'Send lenken til steget du vil kommentere sammen med det du ser. Alt her er forslag til vurdering før noe tas inn i originalen.':'Send the link to the step you want to comment on, together with what you notice. Everything here is a proposal to review before anything goes into the original.',
  'Felles begreper':'Shared concepts', 'Field · oppgaver og arbeidsforløp':'Field · tasks and workflows', 'Box · filer, kommentarer og ISO 19650':'Box · files, comments and ISO 19650',
  'Start her':'Start here', 'Ikke ferdig':'Not finished', 'Anbefalt start':'Recommended start', 'Neste':'Next',
  'Et godt sted å begynne':'A good place to start', 'For: ':'For: ', 'Avsnitt: ':'Section: ', 'Steg ':'Step ', ' · nå':' · now', 'Kilde ':'Source ',
  'Åpne avsnittet markert ↗':'Open the passage highlighted ↗', 'Åpne artikkelen ↗':'Open the article ↗', 'I teksten: ':'In the text: ',
  'Ingen artikler er koblet til denne siden ennå.':'No articles are linked to this page yet.', 'Kategori':'Category',
  'Kopier lenken:':'Copy the link:', 'Lenke til denne siden':'Link to this page', 'er kopiert':'copied', 'Lenke til':'Link to',
  'Fullskjerm er ikke tilgjengelig her':'Full screen isn’t available here',
  'Vis arbeidsforløp for ':'Show workflows for ', 'Vis tilganger for ':'Show access for ',
  'Sider i dette temaet':'Pages in this topic', 'Deler av Samhandling i Box':'Parts of Collaboration in Box', 'Velg scenario':'Choose a scenario',
  'Les mer i Dalux HelpCenter, ':'Read more in Dalux HelpCenter, ', 'artikkel':'article', 'artikler':'articles', ' for denne siden':' for this page',
  'Mappestruktur':'Folder structure', 'Navngiving og metadata':'Naming and metadata', 'Filtrering i praksis':'Filtering in practice',
  'Kommentar: opprett, send, lukk':'Comment: create, send, close', 'Dokumentflyt':'Document flow'
};
function N(s){ if(lang!=='en' || s==null) return s; return (LAB_EN[s]!=null ? LAB_EN[s] : (I18N_EN[s]!=null ? I18N_EN[s] : s)); }
function H(id){ return '#'+(lang==='en' ? (id==='start' ? 'en' : 'en-'+id) : id); }
function parseHash(h){
  h=decodeURIComponent((h||'').replace(/^#/,''));
  if(h==='en') return {lang:'en', id:'start'};
  if(h.indexOf('en-')===0) return {lang:'en', id:h.slice(3)};
  if(h==='no') return {lang:'no', id:'start'};
  return {lang:'no', id:h};
}

/* ---------- Oversetteren ----------
   Bytter tekst og etiketter i hele siden mellom norsk og engelsk.
   Originalkoden skriver fortsatt norsk; en MutationObserver oversetter
   det som dukker opp mens engelsk er valgt. */
const I18N_NO = {};
Object.keys(I18N_EN).forEach(k=>{ const v=I18N_EN[k]; if(v!==k && !(v in I18N_NO)) I18N_NO[v]=k; });
Object.keys(LAB_EN).forEach(k=>{ const v=LAB_EN[k]; if(v!==k && !(v in I18N_NO)) I18N_NO[v]=k; });
const LAB_DYNAMIC='#labCrumbList,#labTocBody,#labHcList,#labHcSub,#labToast,#labLive,#labHcCount,.lab-ref sup,script,style';
const I18N_ATTRS=['aria-label','title','placeholder','alt','data-full-name','data-short-name','value'];
function trMap(key, dir){
  const map = dir==='en' ? I18N_EN : I18N_NO;
  if(dir==='en' && LAB_EN[key]!=null) return LAB_EN[key];
  if(map[key]!=null) return map[key];
  for(const r of I18N_RULES){
    const re=new RegExp(dir==='en'?r[0]:r[2]);
    if(re.test(key)) return key.replace(re, (dir==='en'?r[1]:r[3]).replace(/\\(\d)/g,'$$$1'));
  }
  const m=key.match(/^([\d.]+) (.+)$/);            // «41.00 Internentr.»
  if(m && map[m[2]]!=null) return m[1]+' '+map[m[2]];
  return null;
}
function trString(v, dir){
  if(!v || !/[A-Za-zÆØÅæøå]/.test(v)) return null;
  const key=v.replace(/\s+/g,' ').trim();
  const out=trMap(key, dir);
  if(out==null || out===key) return null;
  return v.match(/^\s*/)[0] + out + v.match(/\s*$/)[0];
}
function trNode(n, dir){
  if(n.nodeType===3){
    const p=n.parentElement; if(!p || p.closest(LAB_DYNAMIC)) return;
    const o=trString(n.nodeValue, dir); if(o!=null) n.nodeValue=o;
    return;
  }
  if(n.nodeType!==1 || n.closest(LAB_DYNAMIC)) return;
  I18N_ATTRS.forEach(a=>{ if(n.hasAttribute(a)){ const o=trString(n.getAttribute(a), dir); if(o!=null) n.setAttribute(a,o); } });
  for(let c=n.firstChild; c; c=c.nextSibling) trNode(c, dir);
}
const trObserver = new MutationObserver(ms=>{
  if(lang!=='en') return;
  ms.forEach(m=>{
    if(m.type==='characterData') trNode(m.target,'en');
    else if(m.type==='attributes') trNode(m.target,'en');
    else m.addedNodes.forEach(n=>trNode(n,'en'));
  });
});
function unwrapRefs(){
  document.querySelectorAll('.lab-ref').forEach(r=>{
    const sup=r.querySelector('sup'); if(sup) sup.remove();
    const p=r.parentNode; while(r.firstChild) p.insertBefore(r.firstChild, r);
    p.removeChild(r); p.normalize();
  });
}
function setLang(l, opts){
  opts=opts||{};
  if(l!=='en') l='no';
  const changed = l!==lang;
  trObserver.disconnect();
  unwrapRefs();
  lang=l;
  trNode(document.body, l);
  document.documentElement.lang = l==='en' ? 'en' : 'no';
  if(l==='en') trObserver.observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:I18N_ATTRS});
  document.getElementById('labLangNo').setAttribute('aria-pressed', l==='no'?'true':'false');
  document.getElementById('labLangEn').setAttribute('aria-pressed', l==='en'?'true':'false');
  try{ localStorage.setItem('labLang', l); }catch(e){}
  enhanceClickables();
  if(opts.silent) return;
  if(lastRoute!==null){
    try{ history.replaceState(null,'',H(lastRoute)); }catch(e){}
    updateUi(lastRoute, false);
  }
  try{ annotate(); }catch(e){}
  if(changed) document.getElementById('labLive').textContent = l==='en' ? 'English' : 'Norsk';
}

/* ================================================================
   3. HVOR ER VI NÅ? (leser tilstanden til originalkoden)
   ================================================================ */
let fieldTarget=null, scenario=null, lastRoute=null, applying=false, focusNext=false;
const has = n => typeof window[n] !== 'undefined';

function currentRoute(){
  try{
    if(activeCommonTrack==='brukergrupper') return ['brukergrupper-hva','brukergrupper-standard','brukergrupper-oppsett'][brukergrupperActivePage-1];
    if(activeModule==='field'){
      const p = fieldTarget || activePage;
      if(p===1) return 'field-entrepriser';
      const intro = document.getElementById('page2').classList.contains('intro');
      const sc = (typeof activeScenario!=='undefined') ? activeScenario : scenario;
      if(!intro && sc!=null) return ['field-oppgaver-enkel','field-oppgaver-kryssforlop','field-oppgaver-hms','field-oppgaver-godkjenning'][sc];
      return 'field-oppgaver';
    }
    if(activeModule==='box'){
      if(!activeBoxTrack) return 'box';
      if(activeBoxTrack==='comm'){
        if(commActivePage===2) return 'box-samhandling-kommentar';
        return {list:'box-samhandling-oppsett',hub:'box-samhandling-flyt',status:'box-samhandling-statuser'}[commView]||'box-samhandling-oppsett';
      }
      if(activeBoxTrack==='files'){
        if(filesActivePage===2) return 'box-mapper-versjoner';
        return {struktur:'box-mapper-struktur',navn:'box-mapper-navngiving',praksis:'box-mapper-filtrering'}[filesTab]||'box-mapper-struktur';
      }
      if(activeBoxTrack==='iso') return ['box-iso-standard','box-iso-praksis','box-iso-dokumentflyt'][boxActivePage-1];
    }
  }catch(e){}
  return 'start';
}
function areaOf(id){ const r=R[id]; if(!r||!r.track) return null; return TRACKS[r.track].area; }

/* ================================================================
   4. GÅ TIL EN SIDE (brukes av lenker, Innhold og tilbake-knappen)
   ================================================================ */
function goHome(){
  try{ closeWf(); }catch(e){}
  if(activeModule==='box' && activeBoxTrack) backToBoxSelector();
  if(activeModule || activeCommonTrack) backToSplash();
}
function applyRoute(id, opts){
  opts = opts||{};
  if(!R[id]) id='start';
  const r=R[id];
  applying=true;
  try{
    const cur=currentRoute();
    if(areaOf(cur)!==areaOf(id) || id==='start') goHome();
    const t=r.track;
    if(t==='brukergrupper'){
      if(activeCommonTrack!=='brukergrupper') openCommonTrack('brukergrupper');
      showBrukergrupperPage(r.n);
    } else if(t==='field'){
      if(activeModule!=='field') openModule('field');
      const n = (r.n===1)?1:2;
      const doScenario=()=>{ if(r.sc!=null) setScenario(r.sc); };
      const cp = fieldTarget || activePage;
      if(cp!==n){
        const go=()=>{ if(pageTransitioning){ setTimeout(go,120); return; } showPage(n); if(r.sc!=null) setTimeout(()=>{ doScenario(); sync(); },850); };
        go();
      } else if(r.sc!=null){ doScenario(); }
      else if(n===2 && id==='field-oppgaver' && !document.getElementById('page2').classList.contains('intro')){
        /* fra et scenario tilbake til valget av scenario */
        const p2=document.getElementById('page2'); p2.classList.add('intro');
        document.querySelectorAll('.sc-btn').forEach(b=>b.classList.remove('active'));
        const lc=document.getElementById('lcControls'); if(lc) lc.classList.remove('visible');
        scenario=null;
      }
    } else if(t==='box' || (t && t.indexOf('box-')===0)){
      if(activeModule!=='box') openModule('box');
      const want = {'box':null,'box-samhandling':'comm','box-mapper':'files','box-iso':'iso'}[t];
      if(activeBoxTrack!==want){
        if(activeBoxTrack) backToBoxSelector();
        if(want) openBoxTrack(want);
      }
      if(want==='comm') commTab(r.key);
      if(want==='files'){
        if(r.wip) showFilesPage(2);
        else { showFilesPage(1); setFilesTab(r.key, true); }
      }
      if(want==='iso') showBoxPage(r.n);
    }
  }catch(e){ console.warn('[lab] route', id, e); }
  applying=false;
  focusNext = !!opts.focus;
  sync(true);
}

/* ================================================================
   5. FØLG MED PÅ NAVIGASJON I ORIGINALKODEN
   Hver navigasjonsfunksjon pakkes inn, så adressen og «Du er her»
   oppdateres uansett hvordan brukeren navigerer.
   ================================================================ */
function wrap(name, after, before){
  const orig = window[name];
  if(typeof orig!=='function') return;
  window[name] = function(){
    const ctx = before ? before.apply(this, arguments) : null;
    const res = orig.apply(this, arguments);
    if(after) after(arguments, ctx);
    queueSync();
    return res;
  };
}
wrap('showPage', (a,was)=>{
  if(!was && pageTransitioning){ fieldTarget=a[0]; setTimeout(()=>{ fieldTarget=null; queueSync(); },900); }
  if(a[0]===2) scenario=null;
}, ()=>pageTransitioning);
wrap('setScenario', a=>{ scenario=a[0]; });
['openModule','backToSplash','openCommonTrack','openBoxTrack','backToBoxSelector','showCommPage','commTab','setCommView',
 'showFilesPage','setFilesTab','showBoxPage','showBrukergrupperPage'].forEach(n=>wrap(n));
wrap('clApplyStep', ()=>{ if(!document.getElementById('labHc').hidden) renderHc(); });
wrap('openWf', ()=>openDialogFocus('wfOverlay'));
wrap('setWfMode'); wrap('setIsoView'); wrap('setCdeMode'); wrap('initDocFlow'); wrap('lcNext'); wrap('lcPrev');
/* Dokumentflyt: «Start på nytt» tar deg til toppen av siden */
wrap('docNext', (a, wasLast)=>{
  if(wasLast){
    const smooth = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    window.scrollTo({top:0, behavior: smooth?'smooth':'auto'});
    const h=document.querySelector('#boxPage3 h1'); if(h){ h.setAttribute('tabindex','-1'); h.setAttribute('data-lab-focus',''); try{ h.focus({preventScroll:true}); }catch(e){} }
  }
}, ()=> (typeof docCurrent!=='undefined' && typeof DOC_STEPS!=='undefined' && docCurrent>=DOC_STEPS.length-1));
wrap('closeWf', ()=>returnDialogFocus('wfOverlay'));

let syncQueued=false;
function queueSync(){ if(syncQueued) return; syncQueued=true; setTimeout(()=>{ syncQueued=false; sync(); },0); }

function sync(force){
  if(applying) return;
  try{ annotate(); }catch(e){ console.warn('[lab] annotate', e); }
  const id=currentRoute();
  const changed = id!==lastRoute;
  if(!changed && !force){ markTabs(); return; }
  const prev=lastRoute; lastRoute=id;
  const hash=H(id);
  try{
    if(location.hash!==hash){
      if(prev===null || force && !changed) history.replaceState(null,'',hash);
      else history.pushState(null,'',hash);
    }
  }catch(e){}
  try{ sessionStorage.setItem('labRoute', id); }catch(e){}
  updateUi(id, changed);
}

/* ================================================================
   6. OPPDATER GRENSESNITTET
   ================================================================ */
function chain(id){
  const r=R[id]; const out=[];
  if(!r || id==='start') return out;
  const tr=TRACKS[r.track];
  if(tr.area==='field') out.push({label:'Field', href:H('field-entrepriser')});
  if(tr.area==='box') out.push({label:'Box', href:H('box')});
  if(tr.area==='bg') out.push({label:N('Felles begreper'), href:null});
  if(r.track!=='field' && r.track!=='box') out.push({label:N(tr.name), href:H(firstOf(r.track))});
  if(r.parent){ out.push({label:N(R[r.parent].name), href:H(r.parent)}); }
  if(r.track!=='box' || id!=='box') out.push({label:N(r.name), href:null, current:true});
  return out;
}
function firstOf(track){ return ROUTES.find(x=>x.track===track && !x.parent).id; }
function parentId(id){
  const r=R[id]; if(!r) return 'start';
  if(r.parent) return r.parent;
  if(id==='box') return 'start';
  if(r.track==='field'||r.track==='brukergrupper') return 'start';
  return 'box';
}
function parentHref(id){ return H(parentId(id)); }
function parentLabel(id){
  const h=parentId(id);
  if(h==='start') return N('Forside'); if(h==='box') return 'Box';
  return R[h]?N(R[h].name):N('Tilbake');
}
const HOME_SVG='<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 7.5L8 3l5.5 4.5V13H9.8v-3H6.2v3H2.5z"/></svg>';
const BACK_SVG='<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>';

function updateUi(id, changed){
  const r=R[id]||R.start;
  // Du er her
  const crumbs=document.getElementById('labCrumbs');
  crumbs.hidden = false;
  const items = chain(id);
  const brand='<a class="lab-home" href="'+H('start')+'"'+(id==='start'?' aria-current="page"':'')+'><span class="lab-mark" aria-hidden="true">'+HOME_SVG+'</span><span><b>Dalux</b><span class="lab-brand-rest"> '+N('Interaktiv presentasjon')+'</span></span></a>';
  document.getElementById('labCrumbList').innerHTML = id==='start'
    ? '<li class="lab-keep">'+brand+'</li>'
    : '<li class="lab-up"><a href="'+parentHref(id)+'">'+BACK_SVG+'<span>'+esc(parentLabel(id))+'</span></a></li>'+
      '<li>'+brand+'</li>'+
      items.map(c=> c.current ? '<li><span aria-current="page">'+esc(c.label)+'</span></li>'
                 : c.href ? '<li><a href="'+c.href+'">'+esc(c.label)+'</a></li>' : '<li><span>'+esc(c.label)+'</span></li>').join('');
  // Sidetittel
  const names = items.map(c=>c.label).reverse();
  const site = N('Dalux - Interaktiv presentasjon');
  document.title = (id==='start' ? site : names.join(' · ')+' · '+site);
  // HelpCenter-teller
  const n=sourcesFor(id).length;
  const cnt=document.getElementById('labHcCount'); cnt.textContent=n; cnt.dataset.n=n;
  const hcBtn=document.getElementById('labHcBtn');
  hcBtn.setAttribute('aria-label',N('Les mer i Dalux HelpCenter, ')+n+' '+(n===1?N('artikkel'):N('artikler'))+N(' for denne siden'));
  if(changed && n){ hcBtn.classList.remove('lab-pulse'); void hcBtn.offsetWidth; hcBtn.classList.add('lab-pulse'); }
  if(!document.getElementById('labHc').hidden) renderHc();
  if(!document.getElementById('labToc').hidden) renderToc();
  markTabs();
  if(changed){
    document.getElementById('labLive').textContent = id==='start' ? N('Forside') : names.slice().reverse().join(', ');
  }
  if(focusNext){ focusNext=false; setTimeout(()=>focusView(id), (r.track==='field')?900:80); }
}

/* aria-current på aktive faner, aria-pressed på scenarioknapper */
function markTabs(){
  document.querySelectorAll('.page-btn, .comm-tab, #boxTrackFiles .hub-tab, #modField .hub-tab, .cl-step-tab').forEach(b=>{
    const on=b.classList.contains('active')||b.classList.contains('on');
    if(on) b.setAttribute('aria-current','step'); else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.sc-btn').forEach(b=>b.setAttribute('aria-pressed', b.classList.contains('active')?'true':'false'));
}

/* Flytt fokus til overskriften på siden vi kom til */
function viewEl(id){
  const r=R[id]||R.start;
  const m = {
    'start':'splash','box':'boxSelector',
    'field-entrepriser':'page1','field-oppgaver':'page2',
    'box-samhandling-kommentar':'commPage2','box-mapper-versjoner':'filesPage2'
  };
  if(m[id]) return document.getElementById(m[id]);
  if(r.parent) return document.getElementById('page2');
  if(r.track==='box-samhandling') return document.getElementById('commPage1');
  if(r.track==='box-mapper') return document.getElementById('filesPage1');
  if(r.track==='box-iso') return document.getElementById('boxPage'+r.n);
  if(r.track==='brukergrupper') return document.getElementById('brukergrupperPage'+r.n);
  return null;
}
function focusView(id){
  const v=viewEl(id); if(!v) return;
  const h = v.querySelector('h1') || [...document.querySelectorAll('#boxTrackComm.active .comm-tab.on')].find(x=>x.offsetParent) || v.querySelector('h2, h3') || v;
  if(!h.hasAttribute('tabindex') && !/^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(h.tagName)) h.setAttribute('tabindex','-1');
  h.setAttribute('data-lab-focus','');
  try{ h.focus({preventScroll:true}); }catch(e){ h.focus(); }
}

/* ================================================================
   7. INNHOLD (venstre panel)
   ================================================================ */
function tocLink(id, label, extra){
  const cur = lastRoute===id;
  return '<a href="'+H(id)+'"'+(cur?' aria-current="page"':'')+'>'+label+(extra||'')+'</a>';
}
function renderToc(){
  const cur=lastRoute;
  const idx=ORDER.indexOf(R[cur]&&R[cur].parent?R[cur].parent:cur);
  const nextId = idx<0 ? ORDER[0] : ORDER[idx+1];
  let h='';
  if(nextId){
    const nr=R[nextId], tr=TRACKS[nr.track];
    h+='<a class="lab-toc-next" href="'+H(nextId)+'"><span><small>'+N(idx<0?'Anbefalt start':'Neste')+'</small><b>'+esc(tr.name===nr.name?N(nr.name):N(tr.name)+' · '+N(nr.name))+'</b></span>'+
       '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg></a>';
  }
  const sub=(track)=>ROUTES.filter(x=>x.track===track && !x.parent).map(x=>
    '<li>'+tocLink(x.id,'<span class="lab-n">'+x.n+'</span><span>'+esc(N(x.name))+'</span>', x.wip?'<span class="lab-tag wip">'+N('Ikke ferdig')+'</span>':'')+'</li>').join('');
  h+='<div class="lab-toc-group"><h3>'+N('Felles begreper')+'</h3><ul>'+
       '<li class="lab-toc-topic">'+tocLink('brukergrupper-hva','<span>'+N('Brukergrupper')+'</span>','<span class="lab-tag base">'+N('Start her')+'</span>')+
       '<ul class="lab-sub">'+sub('brukergrupper')+'</ul></li></ul></div>';
  const sc=ROUTES.filter(x=>x.parent==='field-oppgaver').map(x=>'<li>'+tocLink(x.id,'<span>'+esc(N(x.name))+'</span>')+'</li>').join('');
  h+='<div class="lab-toc-group"><h3>'+N('Field · oppgaver og arbeidsforløp')+'</h3><ul>'+
       '<li class="lab-toc-topic">'+tocLink('field-entrepriser','<span class="lab-n">1</span><span>'+N('Entrepriser')+'</span>')+'</li>'+
       '<li class="lab-toc-topic">'+tocLink('field-oppgaver','<span class="lab-n">2</span><span>'+N('Oppgaver')+'</span>')+'<ul class="lab-sub">'+sc+'</ul></li></ul></div>';
  h+='<div class="lab-toc-group"><h3>'+N('Box · filer, kommentarer og ISO 19650')+'</h3><ul>'+
       ['box-samhandling','box-mapper','box-iso'].map(t=>'<li class="lab-toc-topic">'+tocLink(firstOf(t),'<span>'+esc(N(TRACKS[t].name))+'</span>')+'<ul class="lab-sub">'+sub(t)+'</ul></li>').join('')+
     '</ul></div>';
  h+='<div class="lab-toc-group"><ul><li>'+tocLink('start','<span>'+N('Forside')+'</span>')+'</li></ul></div>';
  document.getElementById('labTocBody').innerHTML=h;
}

/* ================================================================
   8. HELPCENTER (høyre panel)
   ================================================================ */
function renderHc(){
  const id=lastRoute||'start';
  const list=sourcesFor(id);
  const r=R[id]||R.start;
  const step = (id==='box-samhandling-kommentar' && typeof clCurrentStep!=='undefined') ? clCurrentStep : null;
  document.getElementById('labHcSub').textContent = id==='start' ? N('Et godt sted å begynne') : N('For: ')+(chain(id).map(c=>c.label).slice(-2).join(' › '));
  const key=sourceKey(id);
  let items=list.slice();
  if(step){ items.sort((a,b)=>((a.step===step)?0:1)-((b.step===step)?0:1)); }
  const EN = lang==='en';
  document.getElementById('labHcList').innerHTML = items.length ? items.map(s0=>{
    const s = EN && s0.en ? Object.assign({}, s0, {quote:null, mark:null, frag:null, note:null, sect:null}, s0.en) : s0;
    const A0=ART[s0.a];
    const A = EN ? {t:A0.te, c:A0.ce, no:A0.en, en:A0.no} : A0;
    const base=HC+A.no; const url=fragUrl(base, s.frag);
    const q = s.quote ? '<blockquote class="lab-hc-quote">'+(s.mark? esc(s.quote).replace(esc(s.mark),'<mark>'+esc(s.mark)+'</mark>') : '<mark>'+esc(s.quote)+'</mark>')+
      (s.sect?'<cite>'+N('Avsnitt: ')+esc(s.sect)+'</cite>':'')+'</blockquote>' : (s.sect?'<p class="lab-hc-why" style="margin-top:6px;color:var(--lab-muted)">'+N('Avsnitt: ')+esc(s.sect)+'</p>':'');
    const idx=list.indexOf(s0);
    return '<article class="lab-hc-card'+(step&&s.step===step?' is-now':'')+'" data-ref="'+key+':'+idx+'">'+
      '<div class="lab-hc-meta"><span class="lab-hc-num" aria-label="'+N('Kilde ')+(idx+1)+'">'+(idx+1)+'</span>'+(s.step?'<span class="lab-hc-step">'+N('Steg ')+s.step+(step===s.step?N(' · nå'):'')+'</span>':'')+'<span>'+esc(A.c==='Kategori'?N('Kategori'):A.c)+'</span></div>'+
      '<h3><a href="'+base+'" target="_blank" rel="noopener">'+esc(A.t)+' ↗</a></h3>'+
      '<p class="lab-hc-why">'+esc(s.why||'')+'</p>'+ q +
      (s.note?'<p class="lab-hc-note">'+esc(s.note)+'</p>':'')+
      (s0.at && document.querySelector('.lab-ref[data-ref="'+key+':'+idx+'"]') ? '<p class="lab-hc-intext">'+N('I teksten: ')+'<b>'+esc(refText(s0))+'</b></p>':'')+
      '<div class="lab-hc-actions">'+(s.frag?'<a href="'+url+'" target="_blank" rel="noopener">'+N('Åpne avsnittet markert ↗')+'</a>':'<a href="'+base+'" target="_blank" rel="noopener">'+N('Åpne artikkelen ↗')+'</a>')+
      (EN ? '<a class="lab-en" href="'+HC+A.en+'" target="_blank" rel="noopener" hreflang="nb" lang="nb">Norsk ↗</a>' : '<a class="lab-en" href="'+HC+A.en+'" target="_blank" rel="noopener" hreflang="en" lang="en">English ↗</a>')+'</div>'+
    '</article>';
  }).join('') : '<p class="lab-hc-why">'+N('Ingen artikler er koblet til denne siden ennå.')+'</p>';
}


/* ================================================================
   8b. HENVISNINGER I TEKSTEN
   Ordene i teksten som har en kilde får stiplet understrek og et
   nummer. Klikk åpner HelpCenter-panelet på riktig kort.
   ================================================================ */
function refIndex(key, entry){ return SRC[key].indexOf(entry)+1; }
function refText(entry){ return (lang==='en' && entry.en && entry.en.at) ? entry.en.at : entry.at[1]; }
function annotate(){
  if(window.__noRefs) return;
  Object.keys(SRC).forEach(key=>{
    SRC[key].forEach((entry, i)=>{
      if(!entry.at) return;
      const scope=document.querySelector(entry.at[0]); if(!scope) return;
      const text=refText(entry);
      if(scope.querySelector('.lab-ref[data-ref="'+key+':'+i+'"]')) return;
      const w=document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, { acceptNode:n=>
        (n.parentNode.closest('.lab-ref,script,style,button') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
      let n;
      while((n=w.nextNode())){
        const at=n.nodeValue.indexOf(text); if(at<0) continue;
        const mid=n.splitText(at); mid.splitText(text.length);
        const A0=ART[entry.a]; const A={t: lang==='en'?A0.te:A0.t};
        const ref=document.createElement('span');
        ref.className='lab-ref'; ref.dataset.ref=key+':'+i;
        ref.setAttribute('role','button'); ref.setAttribute('tabindex','0');
        ref.setAttribute('aria-label', text+'. '+N('Kilde ')+(i+1)+': '+A.t+', Dalux HelpCenter');
        ref.title='Dalux HelpCenter: '+A.t;
        mid.parentNode.replaceChild(ref, mid);
        ref.appendChild(mid);
        const sup=document.createElement('sup'); sup.textContent=(i+1); sup.setAttribute('aria-hidden','true');
        ref.appendChild(sup);
        break;
      }
    });
  });
}
document.addEventListener('click', e=>{
  const ref=e.target.closest && e.target.closest('.lab-ref'); if(!ref) return;
  e.preventDefault(); e.stopPropagation();
  showPanel('labHc', document.getElementById('labHcBtn'));
  const card=document.querySelector('.lab-hc-card[data-ref="'+ref.dataset.ref+'"]');
  if(card){
    card.scrollIntoView({block:'center'});
    card.classList.remove('lab-flash'); void card.offsetWidth; card.classList.add('lab-flash');
    const link=card.querySelector('h3 a'); if(link) link.focus({preventScroll:true});
  }
  returnTo=ref;
}, true);
document.addEventListener('mouseover', e=>{
  const card=e.target.closest && e.target.closest('.lab-hc-card[data-ref]');
  document.querySelectorAll('.lab-ref.lab-hot').forEach(r=>r.classList.remove('lab-hot'));
  if(card){ const r=document.querySelector('.lab-ref[data-ref="'+card.dataset.ref+'"]'); if(r) r.classList.add('lab-hot'); }
});

/* ================================================================
   9. PANELER, FOKUS OG TASTATUR
   ================================================================ */
let openPanel=null, returnTo=null;
const scrim=document.getElementById('labScrim');
function focusables(el){ return [...el.querySelectorAll('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null||x===document.activeElement); }
function showPanel(id, trigger){
  if(openPanel) hidePanel(true);
  const el=document.getElementById(id);
  if(id==='labToc') renderToc();
  if(id==='labHc') renderHc();
  returnTo = trigger||document.activeElement;
  el.hidden=false; scrim.hidden=false; openPanel=el;
  if(trigger) trigger.setAttribute('aria-expanded','true');
  const target = el.querySelector('[aria-current="page"]') || focusables(el)[0];
  if(target) target.focus();
}
function hidePanel(silent){
  if(!openPanel) return;
  openPanel.hidden=true; scrim.hidden=true;
  document.querySelectorAll('#labBar [aria-expanded]').forEach(b=>b.setAttribute('aria-expanded','false'));
  openPanel=null;
  if(!silent && returnTo && document.contains(returnTo)) returnTo.focus();
}
document.getElementById('labTocBtn').addEventListener('click',e=>{ openPanel&&openPanel.id==='labToc'?hidePanel():showPanel('labToc',e.currentTarget); });
document.getElementById('labHcBtn').addEventListener('click',e=>{ openPanel&&openPanel.id==='labHc'?hidePanel():showPanel('labHc',e.currentTarget); });
scrim.addEventListener('click',()=>hidePanel());
document.querySelectorAll('[data-lab-close]').forEach(b=>b.addEventListener('click',()=>hidePanel()));
document.getElementById('labToc').addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]'); if(!a) return;
  const id=parseHash(a.getAttribute('href')).id;
  hidePanel(true);
  if(id===lastRoute){ e.preventDefault(); focusView(id); }
  else { e.preventDefault(); navigate(id); }
});
document.getElementById('labCrumbs').addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]'); if(!a) return;
  e.preventDefault(); navigate(parseHash(a.getAttribute('href')).id);
});
document.getElementById('labSkip').addEventListener('click',e=>{ e.preventDefault(); focusView(lastRoute||'start'); });

function navigate(id){
  applyRoute(id,{focus:true});
}

/* Dialogen i Entrepriser (arbeidsforløp): fokus inn og tilbake */
let wfReturn=null;
function openDialogFocus(id){
  const el=document.getElementById(id); if(!el) return;
  wfReturn=document.activeElement;
  const box=el.firstElementChild;
  if(box){ box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true'); const t=box.querySelector('.wf-title'); if(t){ t.id=t.id||'labWfTitle'; box.setAttribute('aria-labelledby',t.id);} }
  setTimeout(()=>{ const f=el.querySelector('button, [tabindex="0"]'); if(f) f.focus(); },60);
}
function returnDialogFocus(){ if(wfReturn && document.contains(wfReturn)){ try{ wfReturn.focus(); }catch(e){} } wfReturn=null; }

/* Tastatur. Kjører før originalens tastaturstyring. */
window.addEventListener('keydown',e=>{
  const t=e.target;
  // Panelene: Esc lukker, Tab holdes inne i panelet, piltaster blar ikke sidene
  if(openPanel){
    if(e.key==='Escape'){ e.preventDefault(); e.stopPropagation(); hidePanel(); return; }
    if(e.key==='Tab'){
      const f=focusables(openPanel); if(!f.length) return;
      const i=f.indexOf(document.activeElement);
      if(e.shiftKey && i<=0){ e.preventDefault(); f[f.length-1].focus(); }
      else if(!e.shiftKey && i===f.length-1){ e.preventDefault(); f[0].focus(); }
    }
    e.stopPropagation(); return;
  }
  // Esc i arbeidsforløp-dialogen lukker bare dialogen (originalen gikk også tilbake til forsiden)
  if(e.key==='Escape'){ const wo=document.getElementById('wfOverlay'); if(wo && wo.classList.contains('show')){ e.preventDefault(); e.stopPropagation(); closeWf(); return; } }
  // Egne klikkbare elementer (role=button): Enter og mellomrom aktiverer
  if((e.key==='Enter'||e.key===' ') && t && t.getAttribute && t.getAttribute('role')==='button' && !/^(BUTTON|A)$/.test(t.tagName)){
    e.preventDefault(); e.stopPropagation(); t.click(); return;
  }
  // Mellomrom og Enter på en knapp eller lenke skal trykke på den, ikke bla videre i presentasjonen
  if((e.key===' '||e.key==='Enter') && t && t.closest && t.closest('button,a,input,select,textarea,summary')){ e.stopPropagation(); return; }
  // Verktøyraden: ikke bla sider med piltaster
  if(t && t.closest && t.closest('#labBar') && /^Arrow/.test(e.key)){ e.stopPropagation(); return; }
},true);

/* Klikkbare kort i diagrammene (entrepriser, personer) får tastaturstøtte */
function enhanceClickables(){
  if(typeof hubNodes!=='undefined') hubNodes.forEach(el=>{
    el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    el.setAttribute('aria-label', N('Vis arbeidsforløp for ')+(el.dataset.fullName||el.textContent.trim()));
  });
  document.querySelectorAll('.bg-person').forEach(el=>{
    el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    const nm=el.querySelector('.bg-person-name'), rl=el.querySelector('.bg-person-role');
    el.setAttribute('aria-label', N('Vis tilganger for ')+(nm?nm.textContent:'')+(rl?', '+rl.textContent:''));
  });
  // Dekorative ikoner og emoji skjules for skjermlesere
  document.querySelectorAll('.splash-notice-icon,.splash-mod-icon,.splash-common-icon,.box-track-icon,.sc-icon,.scenario-icon,.comm-info-icon,.cde-feat-icon,.files-soon-icon,.fl-ic,.bg-action-icon,.cl-group-icon,.comm-log-icon,.cl-puck').forEach(el=>el.setAttribute('aria-hidden','true'));
  // Knapperader får navn
  document.querySelectorAll('.page-nav').forEach(n=>{ n.setAttribute('role','navigation'); n.setAttribute('aria-label',N('Sider i dette temaet')); });
  const cmt=document.querySelector('#boxTrackComm .comm-tabs'); if(cmt){ cmt.setAttribute('role','navigation'); cmt.setAttribute('aria-label',N('Deler av Samhandling i Box')); }
  const sp=document.getElementById('scenarioPicker'); if(sp){ sp.setAttribute('role','group'); sp.setAttribute('aria-label',N('Velg scenario')); }
  // Hovedinnhold
  document.querySelectorAll('.module, .common-track').forEach(m=>m.setAttribute('role','main'));
  const wo=document.getElementById('wfOverlay'); const wx=wo&&wo.querySelector('.wf-close, [onclick*="closeWf"]'); if(wx && !wx.getAttribute('aria-label')) wx.setAttribute('aria-label','Lukk');
}

/* ================================================================
   10. DEL LENKE OG FULLSKJERM
   ================================================================ */
const ARTIFACT_URL = ''; /* tom: «Kopier lenke» bruker sidens egen adresse */
function shareUrl(){
  const id=lastRoute||'start';
  const onPages=/github\.io$/.test(location.hostname);
  const base = (ARTIFACT_URL && !onPages) ? ARTIFACT_URL : location.href.split('#')[0];
  return (id==='start' && lang==='no') ? base : base+H(id);
}
let toastT=null;
function toast(html, keep){
  const t=document.getElementById('labToast'); t.innerHTML=html; t.hidden=false;
  clearTimeout(toastT); toastT=setTimeout(()=>{ t.hidden=true; }, keep?9000:2600);
}
function shareClick(){
  const url=shareUrl();
  const fallback=()=>{
    toast('<span>'+N('Kopier lenken:')+'</span><input id="labShareInput" readonly value="'+esc(url)+'" aria-label="'+N('Lenke til denne siden')+'">', true);
    const i=document.getElementById('labShareInput'); i.focus(); i.select();
  };
  try{
    navigator.clipboard.writeText(url).then(()=>toast(N('Lenke til')+' «'+esc(N((R[lastRoute]||R.start).name||'Forside'))+'» '+N('er kopiert')), fallback);
  }catch(e){ fallback(); }
}
document.getElementById('labShareBtn').addEventListener('click',shareClick);
document.getElementById('labShareBtn2').addEventListener('click',()=>{ hidePanel(); shareClick(); });
document.getElementById('labFsBtn').addEventListener('click',()=>{
  try{
    if(!document.fullscreenElement){ const p=document.documentElement.requestFullscreen(); if(p&&p.catch) p.catch(()=>toast(N('Fullskjerm er ikke tilgjengelig her'))); }
    else document.exitFullscreen();
  }catch(e){ toast(N('Fullskjerm er ikke tilgjengelig her')); }
});
document.addEventListener('fullscreenchange',()=>{ const t=N(document.fullscreenElement?'Avslutt fullskjerm':'Fullskjerm'); document.getElementById('labFsLbl').textContent=t; document.getElementById('labFsBtn').title=t; });

/* ================================================================
   11. START
   ================================================================ */
window.addEventListener('hashchange',()=>{
  const ph=parseHash(location.hash);
  if(ph.lang!==lang) setLang(ph.lang);
  if(R[ph.id] && ph.id!==lastRoute){ if(openPanel) hidePanel(true); applyRoute(ph.id,{focus:true}); }
});
document.getElementById('labLangNo').addEventListener('click',()=>setLang('no'));
document.getElementById('labLangEn').addEventListener('click',()=>setLang('en'));
function boot(){
  enhanceClickables();
  const ph=parseHash(location.hash);
  let id=ph.id;
  let l=ph.lang;
  if(!location.hash){ try{ if(localStorage.getItem('labLang')==='en') l='en'; }catch(e){} }
  if(l==='en') setLang('en',{silent:true});
  if(!R[id]){ try{ const s=sessionStorage.getItem('labRoute'); if(s && R[s]) id=s; }catch(e){} }
  if(R[id] && id!=='start') applyRoute(id,{focus:false});
  else { lastRoute=null; sync(); }
}
if(document.readyState==='complete') setTimeout(boot,0); else window.addEventListener('load',()=>setTimeout(boot,0));
})();
