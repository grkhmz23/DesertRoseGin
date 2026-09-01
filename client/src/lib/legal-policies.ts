export type LegalPolicyKey = "terms" | "privacy" | "returns" | "delivery" | "cookie";

export type LegalLanguage = "en" | "it" | "de" | "fr" | "es" | "ar";

export interface LegalPolicySection {
  title: string;
  paragraphs: string[];
}

export interface LegalPolicyContent {
  title: string;
  shortLabel: string;
  sections: LegalPolicySection[];
  updated?: string;
}

export const legalPolicyKeys: LegalPolicyKey[] = ["terms", "privacy", "returns", "delivery", "cookie"];

const COMPANY = "THE DESERT ROSE GIN CO. SAGL, Piazzetta S. Carlo 2, 6900 Lugano, P.IVA CH-382.909.266, info@thedesertrosegin.com";

const policies: Record<LegalLanguage, Record<LegalPolicyKey, LegalPolicyContent>> = {
  it: {
    terms: {
      title: "Condizioni Generali di Vendita (CGV)",
      shortLabel: "Termini",
      updated: "Versione: 1 settembre 2026",
      sections: [
        { title: "Ambito di applicazione", paragraphs: [
          `Le presenti Condizioni Generali di Vendita (CGV) disciplinano l'uso di questo sito web e il rapporto commerciale tra thedesertrosegin.com (Piazzetta San Carlo 2, 6900 Lugano, Svizzera) e i propri clienti, nella versione applicabile al momento dell'accesso al sito o dell'invio di un ordine. L'offerta di questo sito è rivolta esclusivamente a clienti residenti in Svizzera e nel Liechtenstein.`,
          "È considerato cliente qualsiasi persona fisica o giuridica che intrattenga un rapporto commerciale con thedesertrosegin.com. Le CGV, le condizioni di consegna e di pagamento nonché le disposizioni sulla protezione dei dati possono essere aggiornate di volta in volta.",
          "Le presenti CGV si applicano in via esclusiva. Utilizzando questo sito o effettuando un ordine, il cliente conferma di accettare integralmente le presenti CGV, incluse le condizioni di consegna e di pagamento. Qualora singole disposizioni risultassero invalide, la validità delle restanti disposizioni non ne è pregiudicata.",
        ] },
        { title: "Informazioni, prezzi e disponibilità", paragraphs: [
          "Questo sito contiene informazioni su prodotti e servizi. Sono fatte salve modifiche di prezzo, di assortimento e tecniche. Tutti i dati sono valori indicativi e non costituiscono garanzia di caratteristiche, salvo diversa indicazione espressa. Tutte le offerte sono da intendersi senza impegno.",
          "I prezzi indicati, salvo diversa indicazione, si intendono comprensivi dell'IVA di legge e degli eventuali contributi di riciclaggio anticipati, netti in franchi svizzeri (CHF). Le spese di spedizione sono addebitate separatamente e indicate distintamente nel processo d'ordine.",
          "Sono fatte salve modifiche tecniche, errori e refusi di stampa. thedesertrosegin.com può modificare i prezzi in qualsiasi momento senza preavviso e non garantisce la disponibilità dei prodotti al momento dell'ordine.",
        ] },
        { title: "Conclusione del contratto", paragraphs: [
          "Le offerte su questo sito costituiscono un invito non vincolante rivolto al cliente a ordinare prodotti. Con l'ordine, comprensivo dell'accettazione delle presenti CGV, il cliente formula un'offerta giuridicamente vincolante. thedesertrosegin.com invia quindi una conferma d'ordine automatica via e-mail. Gli ordini effettuati sono vincolanti per il cliente.",
          "Il contratto si perfeziona quando thedesertrosegin.com invia una dichiarazione di accettazione via e-mail che conferma la spedizione dei prodotti ordinati. Gli ordini vengono evasi solo dopo il ricevimento completo del pagamento (salvo consegna con fattura) e a condizione che la merce sia disponibile. Se la merce ordinata non può essere consegnata in tutto o in parte, thedesertrosegin.com ha il diritto di recedere dal contratto in tutto o in parte; eventuali pagamenti già effettuati vengono rimborsati.",
        ] },
        { title: "Pagamento e riserva di proprietà", paragraphs: [
          "Al cliente sono messe a disposizione le modalità di pagamento indicate nel processo d'ordine. thedesertrosegin.com si riserva il diritto di escludere singole modalità di pagamento senza indicazione di motivi o di richiedere il pagamento anticipato.",
          "Alla scadenza del termine di pagamento, la mora decorre automaticamente senza necessità di diffida. In caso di ritardato pagamento possono essere applicati interessi di mora del 14,9% annuo e una tassa di sollecito massima di CHF 20.– per sollecito; in caso di incarico a una società di recupero crediti possono essere addebitati ulteriori costi secondo la tariffa dell'Associazione Svizzera degli Istituti Fiduciari di Incasso (VSI).",
          "I prodotti consegnati restano di proprietà di thedesertrosegin.com fino al pagamento integrale.",
        ] },
        { title: "Consegna, obbligo di verifica e restituzione", paragraphs: [
          "Le consegne avvengono per posta o corriere all'indirizzo indicato dal cliente. Con la spedizione, l'uso e il rischio passano al cliente, nella misura consentita dalla legge. Imballaggio e spedizione in Svizzera e Liechtenstein costano forfettariamente CHF 9.50; i costi per consegne speciali sono comunicati preventivamente al cliente.",
          "Se una consegna non può essere effettuata per motivi imputabili al cliente, quest'ultimo sostiene i costi aggiuntivi; una nuova consegna viene fatturata almeno CHF 50.– o l'importo effettivo superiore.",
          "Il cliente è tenuto a verificare la merce ricevuta immediatamente dopo la consegna e a segnalare senza indugio eventuali difetti per lettera o e-mail. Le restituzioni avvengono a spese e rischio del cliente, nell'imballaggio originale, complete di accessori e documento di consegna, all'indirizzo: The Desert Rose Gin Co. Sagl, Via Campagna 32, Casella 48–49, 6934 Bioggio, Svizzera. In assenza di difetti accertabili, i costi di gestione, restituzione o smaltimento possono essere addebitati al cliente. I rimborsi avvengono entro 5-10 giorni lavorativi dall'elaborazione del pagamento.",
        ] },
        { title: "Diritto di recesso", paragraphs: [
          "Al cliente è concesso un diritto di recesso entro 14 giorni di calendario dal ricevimento della merce, senza obbligo di motivazione. Il recesso scritto va inviato entro il termine via e-mail (orders@thedesertrosegin.com) o lettera a The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Svizzera.",
          "Il cliente deve restituire la merce entro 14 giorni di calendario, nell'imballaggio originale, completa di accessori e documento di consegna, a proprie spese e rischio. Un pagamento già effettuato viene rimborsato entro 20 giorni di calendario, a condizione che la merce sia stata ricevuta o venga fornita prova della spedizione. thedesertrosegin.com può richiedere un adeguato indennizzo per danni, usura eccessiva o perdita di valore.",
          "Il diritto di recesso non è concesso in particolare per contratti soggetti a oscillazioni di prezzo indipendenti dal fornitore, per beni non idonei alla restituzione o rapidamente deperibili, per beni confezionati su richiesta del cliente, per contenuti digitali non forniti su supporto fisico e per servizi già interamente eseguiti con il previo consenso espresso del cliente.",
        ] },
        { title: "Divieto di vendita ai minori", paragraphs: [
          "Le bevande alcoliche non possono essere vendute in Svizzera, secondo le disposizioni di legge, a persone di età inferiore a 16 anni, e i superalcolici a minori di 18 anni. Con l'ordine il cliente conferma di essere autorizzato all'acquisto; thedesertrosegin.com declina ogni responsabilità in caso di violazione.",
        ] },
        { title: "Garanzia e responsabilità", paragraphs: [
          "In caso di difetti tempestivamente contestati, thedesertrosegin.com presta garanzia per l'assenza di difetti durante il periodo legale di garanzia, di regola due anni dalla data di consegna, a propria discrezione mediante riparazione gratuita, sostituzione equivalente o rimborso del prezzo d'acquisto. Sono esclusi la normale usura e i danni derivanti da uso improprio.",
          "thedesertrosegin.com esclude ogni ulteriore responsabilità, in particolare per danni indiretti, danni consequenziali o mancato guadagno, nella misura consentita dalla legge; resta salva la responsabilità legale imperativa, ad esempio per colpa grave o dolo.",
        ] },
        { title: "Protezione dei dati, diritto applicabile e foro competente", paragraphs: [
          "Il trattamento dei dati personali è descritto nell'Informativa sulla Privacy. Per domande relative alle presenti CGV contattare info@thedesertrosegin.com.",
          "Si applica esclusivamente il diritto materiale svizzero, con esclusione della Convenzione di Vienna sulla vendita internazionale di merci (CISG). Il foro competente è Lugano, salvo che la legge preveda un foro imperativo diverso. Tutti i diritti sulle presenti CGV appartengono a The Desert Rose Gin Co. Sagl; ogni riproduzione o diffusione richiede il consenso scritto esplicito.",
          "thedesertrosegin.com si riserva il diritto di modificare in qualsiasi momento le presenti CGV e di renderle efficaci senza preavviso. In caso di sospetto o violazione delle disposizioni di legge applicabili, il contratto può essere risolto unilateralmente e con effetto immediato.",
        ] },
      ],
    },
    privacy: {
      title: "Informativa sulla Privacy",
      shortLabel: "Privacy",
      updated: "Versione: 1 settembre 2026",
      sections: [
        { title: "Titolare del trattamento", paragraphs: [
          "Il Titolare del trattamento dei dati su questo sito, ai sensi della Legge federale svizzera sulla protezione dei dati (LPD), è The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Svizzera, Tel. +41 91 605 52 63, e-mail info@thedesertrosegin.com.",
        ] },
        { title: "Raccolta dati durante la visita del sito", paragraphs: [
          "In caso di uso puramente informativo del sito raccogliamo solo i dati tecnicamente necessari trasmessi dal browser (log di sistema): pagina visitata, data e ora di accesso, quantità di dati trasmessi, pagina di provenienza, browser e sistema operativo utilizzati e indirizzo IP (se del caso in forma anonimizzata). Tali dati non vengono ceduti a terzi; ci riserviamo di verificarli a posteriori in presenza di concreti indizi di uso illecito del sito.",
          "Per motivi di sicurezza questo sito utilizza una connessione criptata SSL/TLS, riconoscibile dal prefisso «https://» e dal simbolo del lucchetto nella barra del browser.",
        ] },
        { title: "Cookie", paragraphs: [
          "Utilizziamo cookie su diverse pagine, in parte cookie di sessione e in parte cookie persistenti, anche per semplificare il processo d'ordine (ad es. memorizzando il contenuto del carrello). In alcuni casi vengono impostati anche cookie di partner pubblicitari. Il browser può essere configurato per richiedere conferma prima di installare i cookie o per rifiutarli in generale; ciò può limitare la funzionalità del sito. Informazioni dettagliate sono disponibili nella Cookie Policy.",
        ] },
        { title: "Contatto e account cliente", paragraphs: [
          "In caso di contatto (ad es. tramite modulo o e-mail) raccogliamo i dati necessari e li utilizziamo esclusivamente per rispondere alla richiesta; tali dati vengono cancellati al termine della gestione, salvo obblighi legali di conservazione.",
          "I dati personali vengono inoltre raccolti e trattati quando vengono forniti per l'esecuzione di un contratto o per l'apertura di un account cliente. La cancellazione dell'account è possibile in qualsiasi momento su richiesta; successivamente i dati vengono bloccati nel rispetto dei termini di conservazione fiscali e commerciali e in seguito cancellati.",
        ] },
        { title: "Newsletter e Mailchimp", paragraphs: [
          "Con l'iscrizione alla newsletter l'Utente acconsente all'uso dei propri dati per l'invio di newsletter; a tal fine memorizziamo l'indirizzo IP nonché data e ora dell'iscrizione. La newsletter può essere disdetta in qualsiasi momento tramite l'apposito link o con un messaggio a noi indirizzato.",
          "L'invio avviene tramite The Rocket Science Group, LLC d/b/a Mailchimp (Atlanta, USA). Con il consenso esplicito dell'Utente, Mailchimp analizza statisticamente i tassi di apertura e le interazioni mediante pixel di tracciamento. Per il trasferimento dei dati verso gli Stati Uniti, Mailchimp si basa sulle clausole contrattuali standard dell'Incaricato federale della protezione dei dati (IFPDT).",
        ] },
        { title: "Fornitori di servizi di spedizione", paragraphs: [
          "Se la consegna avviene tramite la Posta Svizzera SA, trasmettiamo l'indirizzo e-mail dell'Utente ai fini del coordinamento della consegna solo previo consenso esplicito; in caso contrario trasmettiamo unicamente nome e indirizzo di consegna, nella misura necessaria alla spedizione. Il consenso può essere revocato in qualsiasi momento.",
        ] },
        { title: "Fornitori di servizi di pagamento", paragraphs: [
          "Per i pagamenti online collaboriamo, a seconda del metodo scelto, con i seguenti fornitori: Adyen (Amsterdam), Stripe Payments Europe (Dublino), PayPal (Europe) S.à r.l. et Cie (Lussemburgo), Apple (Apple Pay), Google Ireland Limited (Google Pay), PostFinance SA (Berna) e TWINT SA (Zurigo). Scegliendo un metodo di pagamento anticipato (ad es. carta di credito), i dati di pagamento comunicati nel processo d'ordine (tra cui nome, indirizzo, dati di pagamento, importo, numero di transazione) vengono trasmessi al relativo fornitore esclusivamente ai fini dell'elaborazione del pagamento.",
          "PayPal si riserva, per determinati metodi di pagamento, di effettuare una verifica della solvibilità basata su procedimenti matematico-statistici riconosciuti. Ulteriori informazioni sono disponibili nelle rispettive informative sulla privacy dei fornitori indicati.",
        ] },
        { title: "Verifica della solvibilità", paragraphs: [
          "Qualora anticipiamo la fornitura (ad es. consegna con fattura), ci riserviamo di effettuare, a tutela del nostro legittimo interesse alla solvibilità dei clienti, una verifica della solvibilità tramite CRIF SA (Svizzera), Hagenholzstrasse 81, 8050 Zurigo. La verifica può basarsi su valori statistici (score). L'Utente può opporsi a tale trattamento in qualsiasi momento; resta impregiudicato il nostro diritto di trattamento nell'ambito dell'elaborazione del pagamento.",
        ] },
        { title: "Marketing online", paragraphs: [
          "Utilizziamo il tracciamento delle conversioni di Google Ads di Google Ireland Limited per misurare l'efficacia delle nostre iniziative pubblicitarie. Vengono utilizzati cookie che di norma scadono dopo 30 giorni e non consentono l'identificazione personale. Il tracciamento può essere disattivato tramite le impostazioni del browser o il plug-in del browser di Google. L'utilizzo può comportare il trasferimento di dati ai server di Google negli Stati Uniti, garantito da clausole contrattuali standard dell'IFPDT.",
        ] },
        { title: "reCAPTCHA e Recensioni dei clienti di Google", paragraphs: [
          "Utilizziamo Google reCAPTCHA (Google Ireland Limited) per rilevare usi automatizzati e abusivi; a tal fine vengono trasmessi l'indirizzo IP e altri dati eventualmente richiesti da Google. Partecipiamo inoltre al programma «Recensioni dei clienti di Google»: con il consenso dell'Utente, dopo un acquisto viene inviato un sondaggio via e-mail da parte di Google, per il quale il relativo indirizzo e-mail viene trasmesso a Google. Entrambi i servizi possono comportare il trasferimento di dati ai server di Google negli Stati Uniti, garantito da clausole contrattuali standard dell'IFPDT.",
        ] },
        { title: "Diritti dell'Utente e periodo di conservazione", paragraphs: [
          "In base al diritto applicabile in materia di protezione dei dati, l'Utente dispone in particolare del diritto di accesso (art. 25 LPD), del diritto alla consegna o trasmissione dei dati (art. 28 LPD) e del diritto di rettifica (art. 32 cpv. 1 LPD). Le richieste possono essere inviate a info@thedesertrosegin.com.",
          "I dati personali vengono conservati solo per il tempo necessario alla finalità del trattamento ed entro gli eventuali termini di conservazione previsti dalla legge (ad es. di diritto delle obbligazioni); in caso di trattamento basato sul consenso, fino alla revoca dello stesso.",
        ] },
      ],
    },
    returns: {
      title: "Politica di Reso e Rimborso",
      shortLabel: "Resi",
      sections: [
        { title: "Reso della merce", paragraphs: [
          "È possibile restituirci la merce entro 14 giorni dal ricevimento dell'ordine. Vi preghiamo di comunicarci in anticipo via e-mail (orders@thedesertrosegin.com) se desiderate restituire uno o più articoli. La merce deve essere non aperta e nella confezione originale.",
          "Le spese di restituzione sono di norma a carico del cliente, salvo nei casi in cui sia stato ricevuto l'articolo sbagliato o l'articolo sia difettoso o incompleto.",
          "Indirizzo per la restituzione: The Desert Rose Gin Co. Sagl, Via Campagna 32, Casella 48–49, 6934 Bioggio, Svizzera.",
        ] },
      ],
    },
    delivery: {
      title: "Consegna e Ritiro",
      shortLabel: "Consegna",
      sections: [
        { title: "Consegna", paragraphs: [
          "thedesertrosegin.com consegna in Svizzera e nel Liechtenstein. Gli ordini effettuati entro le 17:00 (clienti business entro le 15:00) vengono lavorati e spediti lo stesso giorno, così che la consegna avvenga di norma il giorno lavorativo successivo (esclusi festivi e fine settimana).",
          "La spedizione avviene tramite la Posta Svizzera come consegna Priority o, per quantitativi maggiori, tramite spedizioniere. Consigliamo di effettuare l'ordine con anticipo, in modo che la merce arrivi possibilmente 1-2 giorni prima della data desiderata.",
        ] },
        { title: "Ritiro", paragraphs: [
          "Il ritiro può avvenire solo dopo la ricezione di una conferma di ritiro, che viene inviata via e-mail di norma entro due o tre ore durante l'orario d'ufficio. I ritiri sono possibili dal lunedì al venerdì, dalle 9:00 alle 12:00 e dalle 13:30 alle 17:30, presso The Desert Rose Gin Co. Sagl, Via Campagna 32, 6934 Bioggio, Svizzera. Solo gli ordini effettuati prima delle 15:00 possono essere ritirati lo stesso giorno.",
        ] },
        { title: "Consegna del sabato", paragraphs: [
          "Scegliendo la consegna del sabato, l'ordine viene consegnato di sabato indipendentemente dal giorno in cui è stato effettuato. Per la consegna del sabato successivo l'ordine deve essere effettuato entro venerdì alle 17:00 (clienti business entro le 15:00); gli ordini successivi vengono consegnati il sabato seguente.",
        ] },
      ],
    },
    cookie: {
      title: "Cookie Policy",
      shortLabel: "Cookie",
      sections: [
        {
          title: "Cosa sono i cookie",
          paragraphs: [
            "I Cookie sono porzioni di codice o dati installati nel browser o nel dispositivo dell'Utente che aiutano il Titolare a erogare il servizio e a perseguire le finalità descritte.",
            "Alcuni strumenti di tracciamento possono essere utilizzati per sicurezza, conformità e prevenzione di usi impropri del sito in relazione alla vendita di prodotti soggetti a restrizioni di età.",
            "Quando l'installazione avviene sulla base del consenso, l'Utente può revocarlo in qualsiasi momento.",
          ],
        },
        {
          title: "Cookie tecnici e preferenze",
          paragraphs: [
            "Il sito utilizza Cookie necessari per salvare la sessione, distribuire il traffico, garantire sicurezza e consentire il funzionamento del sito, del carrello, del checkout e delle funzionalità essenziali.",
            "Possono essere utilizzati Cookie per salvare preferenze di navigazione, lingua, valuta e impostazioni utili a ottimizzare l'esperienza.",
          ],
        },
        {
          title: "Statistiche, marketing e strumenti terzi",
          paragraphs: [
            "Il sito può utilizzare strumenti di statistica e marketing, inclusi Shopify, Google Analytics 4, Google Tag Manager, Google Ads, Meta Pixel, Meta Events Manager e statistiche raccolte direttamente.",
            "Questi strumenti possono trattare Dati di utilizzo, strumenti di tracciamento, informazioni tecniche del dispositivo, statistiche delle sessioni e interazioni con il sito, secondo le rispettive privacy policy.",
            "Alcuni servizi terzi possono trasferire dati verso Paesi diversi da quello dell'Utente, inclusi Paesi fuori dalla Svizzera, dall'Unione Europea o dallo Spazio Economico Europeo, nel rispetto delle garanzie applicabili.",
          ],
        },
        {
          title: "Interazioni social, contenuti esterni e sicurezza",
          paragraphs: [
            "Il sito può integrare interazioni con social network e piattaforme esterne, come Facebook, X, LinkedIn, Instagram, Google Maps, Google Calendar o YouTube. Tali servizi possono raccogliere dati anche se l'Utente non interagisce direttamente con essi.",
            "Servizi anti-spam e sicurezza, come Google reCAPTCHA ove utilizzato, possono analizzare il traffico per filtrare messaggi, contenuti o utilizzi riconosciuti come spam o abuso.",
          ],
        },
        {
          title: "Newsletter e comunicazioni",
          paragraphs: [
            "Con la registrazione alla newsletter o dopo un acquisto, l'indirizzo email dell'Utente può essere inserito in liste di contatto per comunicazioni informative, commerciali o promozionali, nei limiti del consenso e della normativa applicabile.",
          ],
        },
        {
          title: "Gestione del consenso",
          paragraphs: [
            "L'Utente può gestire le preferenze sui Cookie tramite il banner del sito, ove disponibile, e direttamente dalle impostazioni del browser, anche eliminando Cookie già installati.",
            "Per Cookie di terze parti, l'Utente può usare gli strumenti di opt-out offerti dai fornitori o consultare le relative privacy policy. Può inoltre utilizzare risorse come EDAA, Network Advertising Initiative, Digital Advertising Alliance, DAAC o DDAI.",
          ],
        },
        {
          title: "Titolare e riferimenti legali",
          paragraphs: [
            `Il Titolare del trattamento è ${COMPANY}.`,
            "La Cookie Policy è redatta in conformità alla normativa applicabile in materia di protezione dei dati personali, incluse, ove applicabili, la Legge federale svizzera sulla protezione dei dati, l'art. 45c lett. b LTC e il Regolamento (UE) 2016/679.",
          ],
        },
      ],
    },
  },
  en: {
    terms: {
      title: "General Terms and Conditions of Sale",
      shortLabel: "Terms",
      updated: "Version: 1 September 2026",
      sections: [
        { title: "Scope", paragraphs: [
          "These General Terms and Conditions (GTC) govern the use of this website and the business relationship between thedesertrosegin.com (Piazzetta San Carlo 2, 6900 Lugano, Switzerland) and its customers, in the version applicable at the time the website is accessed or an order is placed. The offer on this website is directed exclusively at customers resident in Switzerland and in Liechtenstein.",
          "A customer is any natural or legal person who maintains a business relationship with thedesertrosegin.com. The GTC, delivery and payment terms, and data protection provisions may be amended from time to time.",
          "These GTC apply exclusively. By using this website or placing an order, the customer confirms full acceptance of these GTC, including the delivery and payment terms. Should individual provisions prove invalid, the validity of the remaining provisions is not affected.",
        ] },
        { title: "Information, prices and availability", paragraphs: [
          "This website contains information about products and services. Changes to prices, range and technical specifications are reserved. All information is approximate and does not constitute a guarantee of characteristics unless expressly stated otherwise. All offers are non-binding.",
          "Unless stated otherwise, prices include applicable Swiss VAT and any advance recycling fees, and are net in Swiss francs (CHF). Shipping costs are charged separately and shown at checkout.",
          "Technical changes, errors and printing mistakes are reserved. thedesertrosegin.com may change prices at any time without notice and does not guarantee that listed products are available at the time of order.",
        ] },
        { title: "Formation of the contract", paragraphs: [
          "Offers on this website are a non-binding invitation to the customer to order products. By placing an order, including acceptance of these GTC, the customer submits a legally binding offer. thedesertrosegin.com then sends an automatic order confirmation by email. Orders placed are binding on the customer.",
          "The contract is concluded once thedesertrosegin.com sends an email acceptance confirming shipment of the ordered products. Orders are fulfilled only after full receipt of payment (except for invoiced delivery) and provided the goods are available. If ordered goods cannot be delivered in full or in part, thedesertrosegin.com is entitled to withdraw from the contract in whole or in part; any payment already made will be refunded.",
        ] },
        { title: "Payment and retention of title", paragraphs: [
          "The customer may use the payment methods offered during checkout. thedesertrosegin.com reserves the right to exclude individual payment methods without giving reasons or to require payment in advance.",
          "Once the payment period expires, default occurs automatically without a reminder. In the event of late payment, default interest of 14.9% per year and a reminder fee of up to CHF 20.– per reminder may be charged; if a debt collection agency is instructed, further fees may apply under the tariff of the Swiss Association of Certified Collection Agencies (VSI).",
          "Delivered products remain the property of thedesertrosegin.com until paid in full.",
        ] },
        { title: "Delivery, inspection duty and returns", paragraphs: [
          "Deliveries are made by post or courier to the address provided by the customer. Risk and benefit pass to the customer on dispatch, to the extent legally permitted. Packaging and shipping within Switzerland and Liechtenstein cost a flat CHF 9.50; costs for special deliveries are communicated to the customer in advance.",
          "If a delivery cannot be made for reasons attributable to the customer, the customer bears the additional costs; a repeat delivery is charged at a minimum of CHF 50.– or the actual higher cost.",
          "The customer must inspect the delivered goods immediately upon receipt and report any defects without delay by letter or email. Returns are made at the customer's expense and risk, in original packaging, complete with accessories and delivery note, to: The Desert Rose Gin Co. Sagl, Via Campagna 32, Box 48–49, 6934 Bioggio, Switzerland. If no identifiable defects are found, handling, return or disposal costs may be charged to the customer. Refunds are made within 5 to 10 business days of payment processing.",
        ] },
        { title: "Right of withdrawal", paragraphs: [
          "The customer has a right of withdrawal within 14 calendar days of receiving the goods, without giving reasons. Written withdrawal must be sent within the deadline by email (orders@thedesertrosegin.com) or letter to The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Switzerland.",
          "The customer must return the goods within 14 calendar days, in original packaging, complete with accessories and delivery note, at their own expense and risk. Any payment already made will be refunded within 20 calendar days, provided the goods have been received back or proof of shipment is provided. thedesertrosegin.com may claim appropriate compensation for damage, excessive wear or loss of value.",
          "No right of withdrawal applies in particular to contracts subject to price fluctuations beyond the provider's control, to goods that are not suitable for return or may deteriorate quickly, to goods made to the customer's specifications, to digital content not supplied on a physical medium, and to services already fully performed with the customer's prior express consent.",
        ] },
        { title: "No sale to minors", paragraphs: [
          "Under Swiss law, alcoholic beverages may not be sold to persons under 16, and spirits may not be sold to persons under 18. By placing an order, the customer confirms they are entitled to purchase; thedesertrosegin.com disclaims all liability in the event of a breach.",
        ] },
        { title: "Warranty and liability", paragraphs: [
          "For defects reported in time, thedesertrosegin.com provides warranty cover during the statutory warranty period, generally two years from the delivery date, at its discretion by free repair, equivalent replacement or refund of the purchase price. Normal wear and damage from improper handling are excluded.",
          "thedesertrosegin.com excludes any further liability, in particular for indirect damage, consequential loss or lost profit, to the extent permitted by law; mandatory statutory liability, for example for gross negligence or wilful misconduct, remains reserved.",
        ] },
        { title: "Data protection, governing law and jurisdiction", paragraphs: [
          "Processing of personal data is described in the Privacy Policy. For questions about these GTC, contact info@thedesertrosegin.com.",
          "These GTC are governed exclusively by substantive Swiss law, excluding the UN Convention on Contracts for the International Sale of Goods (CISG). The place of jurisdiction is Lugano, unless mandatory law provides otherwise. All rights to these GTC belong to The Desert Rose Gin Co. Sagl; any reproduction or distribution requires express written consent.",
          "thedesertrosegin.com reserves the right to amend these GTC at any time and to put changes into effect without notice. In cases of suspected or actual breach of applicable legal requirements, the contract may be terminated unilaterally with immediate effect.",
        ] },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      shortLabel: "Privacy",
      updated: "Version: 1 September 2026",
      sections: [
        { title: "Data controller", paragraphs: [
          "The controller for data processing on this website within the meaning of the Swiss Federal Act on Data Protection (FADP) is The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Switzerland, tel. +41 91 605 52 63, email info@thedesertrosegin.com.",
        ] },
        { title: "Data collected when visiting the website", paragraphs: [
          "For purely informational use of the site, we only collect the technically necessary server log files: page visited, date and time of access, amount of data transmitted, referring page, browser and operating system used, and IP address (anonymised where applicable). This data is not passed on; we reserve the right to review the log files retrospectively if there are concrete indications of unlawful use.",
          "For security reasons, this website uses SSL/TLS encryption, recognisable by \"https://\" and the padlock symbol in the browser bar.",
        ] },
        { title: "Cookies", paragraphs: [
          "We use cookies on various pages, some session-based and some persistent, including to simplify the ordering process (e.g. remembering the cart contents). Cookies from advertising partners may also be set in some cases. The browser can be configured to confirm cookies individually or to reject them generally, which may limit the website's functionality. Full details are set out in the Cookie Policy.",
        ] },
        { title: "Contact and customer accounts", paragraphs: [
          "When you contact us (e.g. via a form or email), we collect the data necessary to handle your request and use it exclusively for that purpose; the data is deleted once your request has been dealt with, unless statutory retention obligations require otherwise.",
          "Personal data is also collected and processed when you provide it to perform a contract or open a customer account. The account can be deleted at any time on request; the data is then blocked in line with statutory tax and commercial retention periods and subsequently deleted.",
        ] },
        { title: "Newsletter and Mailchimp", paragraphs: [
          "By signing up for the newsletter you consent to your data being used to send newsletters; we store the IP address and the date and time of registration for this purpose. You can unsubscribe at any time via the link in the newsletter or by contacting us.",
          "The newsletter is sent via The Rocket Science Group, LLC d/b/a Mailchimp (Atlanta, USA). With your express consent, Mailchimp statistically evaluates open rates and interactions using tracking pixels. For transfers to the United States, Mailchimp relies on the Swiss Federal Data Protection and Information Commissioner's (FDPIC) standard contractual clauses.",
        ] },
        { title: "Shipping service providers", paragraphs: [
          "If delivery is carried out by Swiss Post, we pass on your email address for delivery coordination only with your express consent; otherwise we transmit only your name and delivery address, to the extent necessary for delivery. Consent can be withdrawn at any time.",
        ] },
        { title: "Payment service providers", paragraphs: [
          "For online payments we work with the following providers, depending on the method chosen: Adyen (Amsterdam), Stripe Payments Europe (Dublin), PayPal (Europe) S.à r.l. et Cie (Luxembourg), Apple (Apple Pay), Google Ireland Limited (Google Pay), PostFinance Ltd (Bern) and TWINT Ltd (Zurich). If you choose a prepayment method (e.g. credit card), the payment data provided during checkout (including name, address, payment details, amount and transaction number) is transmitted to the relevant provider solely for the purpose of processing the payment.",
          "For certain payment methods, PayPal reserves the right to carry out a creditworthiness check based on recognised mathematical-statistical procedures. Further information is available in the respective privacy policies of the providers listed.",
        ] },
        { title: "Creditworthiness checks", paragraphs: [
          "Where we advance delivery (e.g. invoiced delivery), we reserve the right, to safeguard our legitimate interest in our customers' solvency, to carry out a creditworthiness check through CRIF Ltd (Switzerland), Hagenholzstrasse 81, 8050 Zurich. The check may be based on statistical score values. You may object to this processing at any time; this does not affect our right to process data as part of payment handling.",
        ] },
        { title: "Online marketing", paragraphs: [
          "We use Google Ads conversion tracking provided by Google Ireland Limited to measure the effectiveness of our advertising. This uses cookies that generally expire after 30 days and do not allow personal identification. Tracking can be disabled via your browser settings or Google's browser plug-in. Use of this service may involve data transfers to Google's servers in the United States, safeguarded by the FDPIC's standard contractual clauses.",
        ] },
        { title: "reCAPTCHA and Google Customer Reviews", paragraphs: [
          "We use Google reCAPTCHA (Google Ireland Limited) to detect automated misuse; this involves transmitting your IP address and any other data required by Google. We also participate in the \"Google Customer Reviews\" programme: with your consent, you receive a Google email survey after a purchase, for which your email address is transmitted to Google. Both services may involve data transfers to Google's servers in the United States, safeguarded by the FDPIC's standard contractual clauses.",
        ] },
        { title: "Your rights and retention period", paragraphs: [
          "Under applicable data protection law you have, in particular, a right of access (Art. 25 FADP), a right to receive or transfer your data (Art. 28 FADP) and a right to rectification (Art. 32 para. 1 FADP). Requests can be sent to info@thedesertrosegin.com.",
          "Personal data is retained only for as long as necessary for the purpose of processing and any statutory retention periods (e.g. under the Swiss Code of Obligations); where processing is based on consent, until that consent is withdrawn.",
        ] },
      ],
    },
    returns: {
      title: "Returns and Refund Policy",
      shortLabel: "Returns",
      sections: [
        { title: "Returning goods", paragraphs: [
          "You may return goods to us within 14 days of receiving your order. Please let us know in advance by email (orders@thedesertrosegin.com) if you wish to return one or more items. Goods must be unopened and in their original packaging.",
          "Return shipping costs are generally borne by the customer, except where you received the wrong item or the item is defective or incomplete.",
          "Return address: The Desert Rose Gin Co. Sagl, Via Campagna 32, Box 48–49, 6934 Bioggio, Switzerland.",
        ] },
      ],
    },
    delivery: {
      title: "Delivery and Collection",
      shortLabel: "Delivery",
      sections: [
        { title: "Delivery", paragraphs: [
          "thedesertrosegin.com delivers within Switzerland and Liechtenstein. Orders placed before 5pm (business customers before 3pm) are processed and shipped the same day, so delivery generally arrives the following business day (excluding public holidays and weekends).",
          "Shipping is carried out by Swiss Post as a priority delivery or, for larger order volumes, by a freight forwarder. We recommend placing your order early so that goods arrive ideally 1–2 days before the date you need them.",
        ] },
        { title: "Collection", paragraphs: [
          "Collection is only possible after receiving a collection confirmation, which is generally sent by email within two to three hours during business hours. Collection is available Monday to Friday, 9am–12pm and 1:30pm–5:30pm, at The Desert Rose Gin Co. Sagl, Via Campagna 32, 6934 Bioggio, Switzerland. Only orders placed before 3pm can be collected the same day.",
        ] },
        { title: "Saturday delivery", paragraphs: [
          "If you choose Saturday delivery, your order will be delivered on Saturday regardless of the day you placed it. To receive delivery on the coming Saturday, the order must be placed by 5pm on Friday (business customers by 3pm); later orders will be delivered on the following Saturday.",
        ] },
      ],
    },
    cookie: {
      title: "Cookie Policy",
      shortLabel: "Cookie",
      sections: [
        { title: "What cookies are", paragraphs: ["Cookies are pieces of code or data installed in the User's browser or device that help the Controller provide the service and pursue the purposes described.", "Tracking tools may support security, compliance and prevention of misuse connected with age-restricted products.", "Where installation is based on consent, Users may withdraw consent at any time."] },
        { title: "Technical cookies and preferences", paragraphs: ["The website uses cookies necessary to save sessions, distribute traffic, maintain security and enable essential website, cart and checkout functionality.", "Cookies may also save browsing preferences, language, currency and settings that improve the experience."] },
        { title: "Analytics, marketing and third-party tools", paragraphs: ["The website may use analytics and marketing tools including Shopify, Google Analytics 4, Google Tag Manager, Google Ads, Meta Pixel, Meta Events Manager and directly collected statistics.", "These tools may process usage data, tracking tools, device technical information, session statistics and website interactions according to their own privacy policies.", "Some third-party services may transfer data to countries outside the User's country, Switzerland, the EU or the EEA, under applicable safeguards."] },
        { title: "Social interactions, external content and security", paragraphs: ["The website may integrate social network interactions and external platforms such as Facebook, X, LinkedIn, Instagram, Google Maps, Google Calendar or YouTube. These services may collect data even if the User does not interact with them directly.", "Anti-spam and security services such as Google reCAPTCHA, where used, may analyse traffic to filter spam, abusive messages or misuse."] },
        { title: "Newsletter and communications", paragraphs: ["When registering for a newsletter or after a purchase, the User's email may be added to contact lists for informative, commercial or promotional communications within the limits of consent and applicable law."] },
        { title: "Managing consent", paragraphs: ["Users may manage cookie preferences through the website banner, where available, and through browser settings, including deleting cookies already installed.", "For third-party cookies, Users may use provider opt-out tools or consult their privacy policies. Resources such as EDAA, Network Advertising Initiative, Digital Advertising Alliance, DAAC or DDAI may also be used."] },
        { title: "Controller and legal references", paragraphs: [`The Data Controller is ${COMPANY}.`, "This Cookie Policy is drafted in accordance with applicable personal-data protection laws, including where applicable the Swiss Federal Act on Data Protection, Article 45c let. b TCA and Regulation (EU) 2016/679."] },
      ],
    },
  },
  de: {} as Record<LegalPolicyKey, LegalPolicyContent>,
  fr: {} as Record<LegalPolicyKey, LegalPolicyContent>,
  es: {} as Record<LegalPolicyKey, LegalPolicyContent>,
  ar: {} as Record<LegalPolicyKey, LegalPolicyContent>,
};

policies.de = {
  terms: {
    title: "Verkaufsbedingungen (AGB)",
    shortLabel: "AGB",
    updated: "Version: 1. September 2026",
    sections: [
      { title: "Geltungsbereich", paragraphs: [
        "Für die Nutzung dieser Webseite sowie die Geschäftsbeziehungen zwischen thedesertrosegin.com (Piazzetta San Carlo 2, 6900 Lugano, Schweiz) und ihren Kunden gelten die nachfolgenden Allgemeinen Geschäftsbedingungen (AGB) in der bei Aufruf der Webseite bzw. bei Warenbestellung aktuell abrufbaren und gültigen Fassung. Das Angebot richtet sich ausschliesslich an Kunden mit Schweizer Wohnsitz und an Kunden in Liechtenstein.",
        "Als Kunde gilt jede natürliche und juristische Person, welche mit thedesertrosegin.com geschäftliche Beziehungen pflegt. Die AGB, die Liefer- und Zahlungsbedingungen sowie die Datenschutzbestimmungen können von Zeit zu Zeit angepasst werden.",
        "Diese AGB gelten ausschliesslich. Der Kunde bestätigt bei der Nutzung dieser Webseite bzw. bei einer Warenbestellung, diese AGB einschliesslich Liefer- und Zahlungsbedingungen umfassend anzuerkennen. Sollten sich einzelne Bestimmungen als unwirksam erweisen, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.",
      ] },
      { title: "Informationen, Preise und Verfügbarkeit", paragraphs: [
        "Diese Webseite enthält Informationen über Produkte und Dienstleistungen. Preis- und Sortimentsänderungen sowie technische Änderungen bleiben vorbehalten. Alle Angaben sind Näherungswerte und stellen keine Zusicherung von Eigenschaften dar, sofern nicht ausdrücklich anders vermerkt. Sämtliche Angebote gelten als freibleibend.",
        "Die Preisangaben verstehen sich, wenn nicht anders vermerkt, inklusive der gesetzlichen Mehrwertsteuer und allfälliger vorgezogener Recyclinggebühren, netto in Schweizer Franken (CHF). Versandkosten werden zusätzlich verrechnet und im Bestellprozess separat ausgewiesen.",
        "Technische Änderungen, Irrtümer und Druckfehler bleiben vorbehalten. thedesertrosegin.com kann Preisänderungen jederzeit ohne Vorankündigung vornehmen und übernimmt keine Garantie, dass die aufgeführten Produkte zum Zeitpunkt der Bestellung verfügbar sind.",
      ] },
      { title: "Vertragsabschluss", paragraphs: [
        "Die Angebote auf dieser Webseite stellen eine unverbindliche Aufforderung an den Kunden dar, Produkte zu bestellen. Mit der Bestellung inklusive der Annahme dieser AGB gibt der Kunde ein rechtlich verbindliches Angebot ab. thedesertrosegin.com versendet daraufhin eine automatische Bestellbestätigung per E-Mail. Getätigte Bestellungen sind für den Kunden verbindlich.",
        "Der Vertrag kommt zustande, sobald thedesertrosegin.com eine Annahmeerklärung per E-Mail versendet, welche den Versand der bestellten Produkte bestätigt. Bestellungen werden erst nach vollständigem Zahlungseingang (ausser bei Lieferung gegen Rechnung) und sofern die Waren verfügbar sind, ausgeliefert. Können bestellte Waren nicht oder nicht vollständig geliefert werden, ist thedesertrosegin.com berechtigt, vom Vertrag ganz oder teilweise zurückzutreten; bereits geleistete Zahlungen werden zurückerstattet.",
      ] },
      { title: "Zahlung und Eigentumsvorbehalt", paragraphs: [
        "Dem Kunden stehen die im Bestellvorgang angegebenen Zahlungsmöglichkeiten zur Verfügung. thedesertrosegin.com behält sich vor, Kunden ohne Angabe von Gründen von einzelnen Zahlungsmöglichkeiten auszuschliessen oder auf Vorauskasse zu bestehen.",
        "Nach Ablauf der Zahlungsfrist tritt ohne Mahnung automatisch der Verzug ein. Bei Zahlungsverzug können Verzugszinsen von 14.9% pro Jahr sowie eine Mahngebühr von maximal CHF 20.– pro Mahnung erhoben werden; bei Beauftragung eines Inkassounternehmens können weitere Gebühren gemäss der Tarifordnung des Verbands Schweizerischer Inkassotreuhandinstitute (VSI) anfallen.",
        "Die gelieferten Produkte bleiben bis zur vollständigen Bezahlung im Eigentum von thedesertrosegin.com.",
      ] },
      { title: "Lieferung, Prüfpflicht und Rücksendung", paragraphs: [
        "Lieferungen erfolgen per Post oder Kurierdienst an die vom Kunden angegebene Adresse. Mit dem Versand gehen Nutzen und Gefahr auf den Kunden über, soweit gesetzlich zulässig. Verpackung und Versand innerhalb der Schweiz und Liechtenstein kosten pauschal CHF 9.50; Kosten für Sonderzustellungen werden dem Kunden vorgängig mitgeteilt.",
        "Kann eine Lieferung aus vom Kunden zu vertretenden Gründen nicht zugestellt werden, trägt der Kunde die Zusatzkosten; eine erneute Zustellung wird mit mindestens CHF 50.– oder den tatsächlich höheren Kosten verrechnet.",
        "Der Kunde ist verpflichtet, die gelieferten Waren sofort nach Erhalt zu prüfen und Mängel unverzüglich per Brief oder E-Mail anzuzeigen. Rücksendungen erfolgen auf Rechnung und Gefahr des Kunden, originalverpackt und komplett mit Zubehör und Lieferschein, an: The Desert Rose Gin Co. Sagl, Via Campagna 32, Box 48–49, 6934 Bioggio, Schweiz. Werden keine feststellbaren Mängel festgestellt, können Umtriebe, Rücksendung oder Entsorgung dem Kunden in Rechnung gestellt werden. Rückerstattungen erfolgen innert 5 bis 10 Arbeitstagen ab Zahlungsabwicklung.",
      ] },
      { title: "Widerrufsrecht", paragraphs: [
        "Dem Kunden wird während 14 Kalendertagen nach Erhalt der Ware ein Widerrufsrecht gewährt, ohne Begründungspflicht. Der schriftliche Widerruf ist per E-Mail (orders@thedesertrosegin.com) oder Brief an The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Schweiz, fristgerecht abzuschicken.",
        "Der Kunde muss die Waren innert 14 Kalendertagen originalverpackt und komplett mit Zubehör sowie Lieferschein auf eigene Rechnung und Gefahr zurücksenden. Eine bereits geleistete Zahlung wird innerhalb von 20 Kalendertagen zurückerstattet, sofern die Ware zurückerhalten wurde oder ein Versandnachweis vorliegt. thedesertrosegin.com kann für Beschädigung, übermässige Abnutzung oder Wertverlust eine angemessene Entschädigung verlangen.",
        "Kein Widerrufsrecht besteht namentlich bei Verträgen mit Preisschwankungen ausserhalb der Kontrolle des Anbieters, bei Waren, die schnell verderben können oder sich nicht für eine Rücksendung eignen, bei nach Kundenwunsch angefertigten Waren, bei nicht auf einem Datenträger bereitgestellten digitalen Inhalten sowie bei bereits vollständig erbrachten Dienstleistungen mit vorgängiger ausdrücklicher Zustimmung des Kunden.",
      ] },
      { title: "Kein Verkauf an Minderjährige", paragraphs: [
        "Alkoholische Getränke dürfen in der Schweiz gemäss den gesetzlichen Bestimmungen nicht an Jugendliche unter 16 Jahren, Spirituosen nicht an Minderjährige unter 18 Jahren verkauft werden. Mit einer Bestellung bestätigt der Kunde, zum Einkauf berechtigt zu sein; thedesertrosegin.com lehnt jede Haftung bei Zuwiderhandlung ab.",
      ] },
      { title: "Gewährleistung und Haftung", paragraphs: [
        "thedesertrosegin.com übernimmt bei rechtzeitig gerügten Mängeln während der gesetzlichen Gewährleistungsfrist von in der Regel zwei Jahren seit Lieferdatum die Gewährleistung für Mängelfreiheit; nach ihrem Ermessen durch kostenlose Reparatur, gleichwertigen Ersatz oder Rückerstattung des Kaufpreises. Normale Abnützung sowie Schäden durch unsachgemässe Behandlung sind ausgenommen.",
        "thedesertrosegin.com schliesst jede weitergehende Haftung, insbesondere für indirekte Schäden, Mangelfolgeschäden oder entgangenen Gewinn, aus, soweit gesetzlich zulässig; vorbehalten bleibt eine zwingende gesetzliche Haftung, etwa für grobe Fahrlässigkeit oder rechtswidrige Absicht.",
      ] },
      { title: "Datenschutz, anwendbares Recht und Gerichtsstand", paragraphs: [
        "Die Verarbeitung personenbezogener Daten ist in der Datenschutzerklärung beschrieben. Bei Fragen zu diesen AGB wenden Sie sich an info@thedesertrosegin.com.",
        "Es gilt ausschliesslich materielles Schweizer Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand ist Lugano, soweit das Gesetz keinen zwingenden Gerichtsstand vorsieht. Sämtliche Rechte an diesen AGB liegen bei The Desert Rose Gin Co. Sagl; jede Vervielfältigung oder Verbreitung bedarf der ausdrücklichen schriftlichen Zustimmung.",
        "thedesertrosegin.com behält sich vor, diese AGB jederzeit zu ändern und ohne Ankündigung in Kraft zu setzen. Bei Verdachtsfällen oder Verstössen gegen geltende gesetzliche Vorgaben kann der Vertrag einseitig und mit sofortiger Wirkung aufgelöst werden.",
      ] },
    ],
  },
  privacy: {
    title: "Datenschutzerklärung",
    shortLabel: "Datenschutz",
    updated: "Version: 1. September 2026",
    sections: [
      { title: "Verantwortlicher", paragraphs: [
        "Verantwortlicher für die Datenverarbeitung auf dieser Website im Sinne des Schweizer Datenschutzgesetzes (DSG) ist The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Schweiz, Tel. +41 91 605 52 63, E-Mail info@thedesertrosegin.com.",
      ] },
      { title: "Datenerfassung beim Besuch der Website", paragraphs: [
        "Bei rein informatorischer Nutzung erheben wir nur die technisch erforderlichen Server-Logfiles: besuchte Seite, Datum und Uhrzeit, übertragene Datenmenge, Herkunftsseite, verwendeter Browser und Betriebssystem sowie die IP-Adresse (ggf. anonymisiert). Eine Weitergabe findet nicht statt; wir behalten uns vor, die Logfiles bei konkreten Anhaltspunkten für eine rechtswidrige Nutzung nachträglich zu prüfen.",
        "Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung, erkennbar an «https://» und dem Schloss-Symbol in der Browserzeile.",
      ] },
      { title: "Cookies", paragraphs: [
        "Wir verwenden auf verschiedenen Seiten Cookies, teils als Sitzungs-Cookies, teils als persistente Cookies, unter anderem um den Bestellprozess zu vereinfachen (z.B. Merken des Warenkorbs). Teilweise werden auch Cookies von Werbepartnern gesetzt. Der Browser kann so eingestellt werden, dass Cookies einzeln bestätigt oder generell abgelehnt werden; dies kann die Funktionalität der Website einschränken. Details finden Sie in der Cookie-Richtlinie.",
      ] },
      { title: "Kontaktaufnahme und Kundenkonto", paragraphs: [
        "Bei Kontaktaufnahme (z.B. per Formular oder E-Mail) erheben wir die dafür notwendigen Daten und verwenden sie ausschliesslich zur Beantwortung des Anliegens; sie werden nach abschliessender Bearbeitung gelöscht, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.",
        "Personenbezogene Daten werden ausserdem erhoben und bearbeitet, wenn Sie diese zur Durchführung eines Vertrages oder bei Eröffnung eines Kundenkontos mitteilen. Eine Löschung des Kundenkontos ist jederzeit auf Anfrage möglich; danach werden die Daten unter Berücksichtigung steuer- und handelsrechtlicher Aufbewahrungsfristen gesperrt und anschliessend gelöscht.",
      ] },
      { title: "Newsletter und Mailchimp", paragraphs: [
        "Mit der Anmeldung zum Newsletter willigen Sie in die Verwendung Ihrer Daten zur Übersendung von Newslettern ein; wir speichern hierzu IP-Adresse sowie Datum und Uhrzeit der Anmeldung. Der Newsletter kann jederzeit über den Abmeldelink oder eine Nachricht an uns abbestellt werden.",
        "Der Versand erfolgt über The Rocket Science Group, LLC d/b/a Mailchimp (Atlanta, USA). Mit Ihrer ausdrücklichen Einwilligung wertet Mailchimp Öffnungsraten und Interaktionen mittels Zählpixel statistisch aus. Für die Datenübermittlung in die USA stützt sich Mailchimp auf Standardvertragsklauseln des EDÖB.",
      ] },
      { title: "Versanddienstleister", paragraphs: [
        "Erfolgt die Zustellung durch die Schweizerische Post AG, geben wir Ihre E-Mail-Adresse zur Abstimmung des Liefertermins nur mit Ihrer ausdrücklichen Einwilligung weiter; andernfalls übermitteln wir nur Namen und Lieferadresse, soweit dies für die Zustellung erforderlich ist. Die Einwilligung kann jederzeit widerrufen werden.",
      ] },
      { title: "Zahlungsdienstleister", paragraphs: [
        "Für Online-Zahlungen arbeiten wir je nach gewählter Zahlungsart mit folgenden Anbietern zusammen: Adyen (Amsterdam), Stripe Payments Europe (Dublin), PayPal (Europe) S.à r.l. et Cie (Luxemburg), Apple (Apple Pay), Google Ireland Limited (Google Pay), PostFinance AG (Bern) und TWINT AG (Zürich). Bei Auswahl einer Vorleistungs-Zahlungsart (z.B. Kreditkarte) werden die im Bestellprozess mitgeteilten Zahlungsdaten (u.a. Name, Anschrift, Zahlungsinformationen, Betrag, Transaktionsnummer) ausschliesslich zum Zweck der Zahlungsabwicklung an den jeweiligen Anbieter übermittelt.",
        "PayPal behält sich für bestimmte Zahlungsarten die Durchführung einer Bonitätsauskunft vor, die auf Basis anerkannter mathematisch-statistischer Verfahren erfolgt. Weitere Informationen finden Sie in den jeweiligen Datenschutzerklärungen der genannten Anbieter.",
      ] },
      { title: "Bonitätsprüfung", paragraphs: [
        "Treten wir in Vorleistung (z.B. Lieferung auf Rechnung), behalten wir uns vor, zur Wahrung unseres berechtigten Interesses an der Zahlungsfähigkeit unserer Kunden eine Bonitätsprüfung durch die CRIF AG (Schweiz), Hagenholzstrasse 81, 8050 Zürich, durchzuführen. Der Bonitätsauskunft können statistische Score-Werte zugrunde liegen. Sie können dieser Verarbeitung jederzeit widersprechen; unser Recht zur Verarbeitung im Rahmen der Zahlungsabwicklung bleibt davon unberührt.",
      ] },
      { title: "Online-Marketing", paragraphs: [
        "Wir nutzen Google Ads Conversion-Tracking der Google Ireland Limited, um die Wirksamkeit unserer Werbemassnahmen zu messen. Dabei kommen Cookies zum Einsatz, die in der Regel nach 30 Tagen ablaufen und keine persönliche Identifizierung ermöglichen. Sie können das Tracking über Ihre Browsereinstellungen oder das Google-Browser-Plug-in deaktivieren. Im Rahmen der Nutzung kann es zu einer Datenübermittlung an Google-Server in den USA kommen, abgesichert durch Standardvertragsklauseln des EDÖB.",
      ] },
      { title: "reCAPTCHA und Google Kundenrezensionen", paragraphs: [
        "Wir setzen Google reCAPTCHA (Google Ireland Limited) ein, um automatisierten Missbrauch zu erkennen; dabei wird Ihre IP-Adresse sowie ggf. weitere von Google benötigte Daten übermittelt. Ausserdem nehmen wir am Programm «Google Kundenrezensionen» teil: Mit Ihrer Einwilligung erhalten Sie nach einem Einkauf eine E-Mail-Umfrage von Google; Ihre E-Mail-Adresse wird hierfür an Google übermittelt. Beide Dienste können zu einer Datenübermittlung an Google-Server in den USA führen, abgesichert durch Standardvertragsklauseln des EDÖB.",
      ] },
      { title: "Ihre Rechte und Aufbewahrungsdauer", paragraphs: [
        "Sie haben nach geltendem Datenschutzrecht insbesondere ein Auskunftsrecht (Art. 25 DSG), ein Recht auf Datenherausgabe bzw. -übertragung (Art. 28 DSG) und ein Recht auf Berichtigung (Art. 32 Abs. 1 DSG). Anfragen richten Sie bitte an info@thedesertrosegin.com.",
        "Personenbezogene Daten werden nur so lange aufbewahrt, wie es der jeweilige Verarbeitungszweck und allfällige gesetzliche Aufbewahrungsfristen (z.B. obligationenrechtlich) erfordern; bei einwilligungsbasierter Verarbeitung bis zum Widerruf der Einwilligung.",
      ] },
    ],
  },
  returns: {
    title: "Rückgabe- und Rückerstattungsrichtlinie",
    shortLabel: "Rückgabe",
    sections: [
      { title: "Warenrückgabe", paragraphs: [
        "Sie können Ware innerhalb von 14 Tagen nach Erhalt der Bestellung an uns retournieren. Bitte teilen Sie uns per E-Mail (orders@thedesertrosegin.com) im Voraus mit, wenn Sie einen oder mehrere Artikel zurücksenden möchten. Die Ware muss ungeöffnet und originalverpackt sein.",
        "Die Rücksendekosten trägt grundsätzlich der Kunde, ausser Sie haben den falschen Artikel erhalten oder der Artikel ist defekt oder unvollständig.",
        "Adresse für die Rücksendung: The Desert Rose Gin Co. Sagl, Via Campagna 32, Box 48–49, 6934 Bioggio, Schweiz.",
      ] },
    ],
  },
  delivery: {
    title: "Lieferung und Abholung",
    shortLabel: "Lieferung",
    sections: [
      { title: "Lieferung", paragraphs: [
        "thedesertrosegin.com liefert in die Schweiz und nach Liechtenstein. Bestellungen bis 17 Uhr (Geschäftskunden bis 15 Uhr) werden noch am gleichen Tag bearbeitet und verschickt, sodass die Lieferung in der Regel am nächsten Werktag eintrifft (ausgenommen Feiertage und Wochenenden).",
        "Der Versand erfolgt mit der Schweizerischen Post als Priority-Lieferung oder, bei grösseren Bestellmengen, durch einen Spediteur. Wir empfehlen, die Bestellung frühzeitig aufzugeben, sodass die Ware möglichst 1–2 Tage vor dem benötigten Termin eintrifft.",
      ] },
      { title: "Abholung", paragraphs: [
        "Eine Abholung kann erst nach Erhalt einer Abholbestätigung erfolgen, die in der Regel innerhalb von zwei bis drei Stunden während der Geschäftszeiten per E-Mail zugestellt wird. Abholungen sind von Montag bis Freitag, 9–12 Uhr und 13:30–17:30 Uhr, bei The Desert Rose Gin Co. Sagl, Via Campagna 32, 6934 Bioggio, Schweiz, möglich. Nur Bestellungen vor 15 Uhr können am selben Tag abgeholt werden.",
      ] },
      { title: "Samstagszustellung", paragraphs: [
        "Bei Wahl der Samstagszustellung wird Ihre Bestellung am Samstag geliefert, unabhängig vom Bestelltag. Für eine Zustellung am kommenden Samstag muss die Bestellung bis Freitag 17 Uhr (Geschäftskunden 15 Uhr) aufgegeben werden; spätere Bestellungen werden erst am darauffolgenden Samstag geliefert.",
      ] },
    ],
  },
  cookie: {
    title: "Cookie-Richtlinie",
    shortLabel: "Cookie",
    sections: [
      { title: "Was Cookies sind", paragraphs: ["Cookies sind Code- oder Datenelemente, die im Browser oder auf dem Gerät des Nutzers gespeichert werden und die Bereitstellung des Dienstes unterstützen.", "Tracking-Tools können zur Sicherheit, Compliance und Verhinderung missbräuchlicher Nutzung im Zusammenhang mit altersbeschränkten Produkten eingesetzt werden."] },
      { title: "Technische Cookies und Präferenzen", paragraphs: ["Die Website verwendet notwendige Cookies für Sitzungen, Traffic-Verteilung, Sicherheit, Warenkorb, Checkout und wesentliche Funktionen.", "Weitere Cookies können Sprache, Währung und Navigationseinstellungen speichern."] },
      { title: "Analyse, Marketing und Drittanbieter", paragraphs: ["Die Website kann Shopify, Google Analytics 4, Google Tag Manager, Google Ads, Meta Pixel, Meta Events Manager und direkt erhobene Statistiken nutzen.", "Diese Tools können Nutzungsdaten, Tracking-Informationen, technische Gerätedaten, Sitzungsstatistiken und Interaktionen nach ihren jeweiligen Datenschutzrichtlinien verarbeiten."] },
      { title: "Einwilligung und Verwaltung", paragraphs: ["Nutzer können Cookie-Präferenzen über das Banner der Website, soweit vorhanden, und über Browsereinstellungen verwalten oder bereits installierte Cookies löschen.", "Für Drittanbieter-Cookies können Opt-out-Tools der Anbieter oder Ressourcen wie EDAA, Network Advertising Initiative, Digital Advertising Alliance, DAAC oder DDAI verwendet werden."] },
      { title: "Verantwortlicher und Rechtsgrundlagen", paragraphs: [`Verantwortlicher ist ${COMPANY}.`, "Diese Cookie-Richtlinie richtet sich nach den anwendbaren Datenschutzvorschriften, einschließlich, soweit anwendbar, des schweizerischen Datenschutzgesetzes, Art. 45c lit. b FMG und der Verordnung (EU) 2016/679."] },
    ],
  },
};

policies.fr = {
  terms: {
    title: "Conditions Générales de Vente (CGV)",
    shortLabel: "Conditions",
    updated: "Version : 1er septembre 2026",
    sections: [
      { title: "Champ d'application", paragraphs: [
        "Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation de ce site web ainsi que la relation commerciale entre thedesertrosegin.com (Piazzetta San Carlo 2, 6900 Lugano, Suisse) et ses clients, dans la version applicable au moment de la consultation du site ou de la passation d'une commande. L'offre de ce site s'adresse exclusivement aux clients domiciliés en Suisse et au Liechtenstein.",
        "Est considérée comme cliente toute personne physique ou morale entretenant une relation commerciale avec thedesertrosegin.com. Les CGV, les conditions de livraison et de paiement ainsi que les dispositions relatives à la protection des données peuvent être adaptées de temps à autre.",
        "Les présentes CGV s'appliquent exclusivement. En utilisant ce site ou en passant une commande, le client confirme accepter intégralement les présentes CGV, y compris les conditions de livraison et de paiement. Si certaines dispositions s'avéraient invalides, la validité des autres dispositions n'en serait pas affectée.",
      ] },
      { title: "Informations, prix et disponibilité", paragraphs: [
        "Ce site contient des informations sur des produits et services. Les modifications de prix, d'assortiment et techniques sont réservées. Toutes les indications sont approximatives et ne constituent pas une garantie de caractéristiques, sauf mention expresse contraire. Toutes les offres s'entendent sans engagement.",
        "Sauf indication contraire, les prix s'entendent TVA suisse comprise et taxes anticipées de recyclage éventuelles incluses, nets en francs suisses (CHF). Les frais de port sont facturés séparément et indiqués distinctement lors de la commande.",
        "Les modifications techniques, erreurs et fautes d'impression sont réservées. thedesertrosegin.com peut modifier les prix à tout moment sans préavis et ne garantit pas la disponibilité des produits au moment de la commande.",
      ] },
      { title: "Conclusion du contrat", paragraphs: [
        "Les offres de ce site constituent une invitation non contraignante adressée au client à commander des produits. En passant commande, y compris en acceptant les présentes CGV, le client formule une offre juridiquement contraignante. thedesertrosegin.com envoie alors une confirmation de commande automatique par e-mail. Les commandes passées engagent le client.",
        "Le contrat est conclu lorsque thedesertrosegin.com envoie une déclaration d'acceptation par e-mail confirmant l'expédition des produits commandés. Les commandes ne sont exécutées qu'après réception complète du paiement (sauf livraison sur facture) et sous réserve de disponibilité de la marchandise. Si la marchandise commandée ne peut être livrée en tout ou partie, thedesertrosegin.com a le droit de résilier le contrat en tout ou partie ; tout paiement déjà effectué est remboursé.",
      ] },
      { title: "Paiement et réserve de propriété", paragraphs: [
        "Le client dispose des moyens de paiement proposés lors de la commande. thedesertrosegin.com se réserve le droit d'exclure certains moyens de paiement sans indication de motif ou d'exiger un paiement anticipé.",
        "À l'échéance du délai de paiement, la demeure intervient automatiquement sans mise en demeure préalable. En cas de retard de paiement, des intérêts moratoires de 14,9 % par an ainsi que des frais de rappel de CHF 20.– maximum par rappel peuvent être perçus ; en cas de recours à une société de recouvrement, des frais supplémentaires peuvent s'appliquer selon le tarif de l'Association Suisse des Sociétés Fiduciaires de Recouvrement (VSI).",
        "Les produits livrés restent la propriété de thedesertrosegin.com jusqu'au paiement intégral.",
      ] },
      { title: "Livraison, obligation de vérification et retours", paragraphs: [
        "Les livraisons sont effectuées par la poste ou par transporteur à l'adresse indiquée par le client. L'usage et le risque sont transférés au client dès l'expédition, dans la mesure permise par la loi. L'emballage et l'expédition en Suisse et au Liechtenstein coûtent un forfait de CHF 9.50 ; les coûts pour les livraisons spéciales sont communiqués au client au préalable.",
        "Si une livraison ne peut être effectuée pour des raisons imputables au client, celui-ci supporte les frais supplémentaires ; une nouvelle livraison est facturée au minimum CHF 50.– ou au coût réel supérieur.",
        "Le client est tenu de vérifier la marchandise livrée immédiatement après réception et de signaler sans délai tout défaut par lettre ou e-mail. Les retours s'effectuent aux frais et risques du client, dans l'emballage d'origine, complets avec accessoires et bon de livraison, à l'adresse : The Desert Rose Gin Co. Sagl, Via Campagna 32, Case postale 48–49, 6934 Bioggio, Suisse. En l'absence de défauts constatables, les frais de gestion, de retour ou d'élimination peuvent être facturés au client. Les remboursements interviennent dans un délai de 5 à 10 jours ouvrables après le traitement du paiement.",
      ] },
      { title: "Droit de rétractation", paragraphs: [
        "Le client dispose d'un droit de rétractation dans les 14 jours calendaires suivant la réception de la marchandise, sans obligation de motiver sa décision. La rétractation écrite doit être envoyée dans ce délai par e-mail (orders@thedesertrosegin.com) ou par courrier à The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Suisse.",
        "Le client doit retourner la marchandise dans les 14 jours calendaires, dans son emballage d'origine, complète avec accessoires et bon de livraison, à ses propres frais et risques. Un paiement déjà effectué est remboursé dans les 20 jours calendaires, à condition que la marchandise ait été reçue en retour ou qu'une preuve d'expédition soit fournie. thedesertrosegin.com peut exiger une indemnisation appropriée en cas de dommage, d'usure excessive ou de perte de valeur.",
        "Le droit de rétractation ne s'applique notamment pas aux contrats soumis à des fluctuations de prix indépendantes du fournisseur, aux biens ne se prêtant pas au retour ou pouvant se détériorer rapidement, aux biens confectionnés selon les spécifications du client, aux contenus numériques non fournis sur support matériel, ainsi qu'aux prestations de services déjà intégralement exécutées avec l'accord exprès préalable du client.",
      ] },
      { title: "Interdiction de vente aux mineurs", paragraphs: [
        "En vertu des dispositions légales suisses, les boissons alcoolisées ne peuvent être vendues à des personnes de moins de 16 ans, et les spiritueux à des mineurs de moins de 18 ans. En passant commande, le client confirme être autorisé à effectuer cet achat ; thedesertrosegin.com décline toute responsabilité en cas d'infraction.",
      ] },
      { title: "Garantie et responsabilité", paragraphs: [
        "Pour les défauts signalés en temps utile, thedesertrosegin.com assume la garantie pendant le délai légal de garantie, généralement deux ans à compter de la date de livraison, à sa discrétion par réparation gratuite, remplacement équivalent ou remboursement du prix d'achat. L'usure normale et les dommages résultant d'une utilisation inappropriée sont exclus.",
        "thedesertrosegin.com exclut toute responsabilité supplémentaire, notamment pour les dommages indirects, les dommages consécutifs ou le manque à gagner, dans la mesure permise par la loi ; la responsabilité légale impérative, par exemple en cas de faute grave ou de dol, demeure réservée.",
      ] },
      { title: "Protection des données, droit applicable et for", paragraphs: [
        "Le traitement des données personnelles est décrit dans la Politique de Confidentialité. Pour toute question relative aux présentes CGV, contactez info@thedesertrosegin.com.",
        "Les présentes CGV sont régies exclusivement par le droit matériel suisse, à l'exclusion de la Convention de Vienne sur la vente internationale de marchandises (CVIM). Le for exclusif est Lugano, sauf disposition légale impérative contraire. Tous les droits sur les présentes CGV appartiennent à The Desert Rose Gin Co. Sagl ; toute reproduction ou diffusion requiert l'accord écrit exprès.",
        "thedesertrosegin.com se réserve le droit de modifier à tout moment les présentes CGV et de les mettre en vigueur sans préavis. En cas de suspicion ou de violation des dispositions légales applicables, le contrat peut être résilié unilatéralement avec effet immédiat.",
      ] },
    ],
  },
  privacy: {
    title: "Politique de Confidentialité",
    shortLabel: "Confidentialité",
    updated: "Version : 1er septembre 2026",
    sections: [
      { title: "Responsable du traitement", paragraphs: [
        "Le responsable du traitement des données sur ce site, au sens de la loi fédérale suisse sur la protection des données (LPD), est The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Suisse, tél. +41 91 605 52 63, e-mail info@thedesertrosegin.com.",
      ] },
      { title: "Collecte de données lors de la visite du site", paragraphs: [
        "En cas d'utilisation purement informative du site, nous ne collectons que les fichiers journaux techniquement nécessaires : page consultée, date et heure d'accès, volume de données transmis, page de provenance, navigateur et système d'exploitation utilisés, ainsi que l'adresse IP (le cas échéant anonymisée). Ces données ne sont pas transmises à des tiers ; nous nous réservons le droit de les examiner a posteriori en cas d'indices concrets d'utilisation illicite.",
        "Pour des raisons de sécurité, ce site utilise un chiffrement SSL/TLS, reconnaissable au préfixe « https:// » et au symbole du cadenas dans la barre du navigateur.",
      ] },
      { title: "Cookies", paragraphs: [
        "Nous utilisons des cookies sur différentes pages, certains de session et d'autres persistants, notamment pour simplifier le processus de commande (par ex. mémoriser le contenu du panier). Des cookies de partenaires publicitaires peuvent également être déposés dans certains cas. Le navigateur peut être configuré pour demander confirmation avant l'installation des cookies ou pour les refuser de manière générale ; cela peut limiter la fonctionnalité du site. Pour plus de détails, consultez la Politique relative aux Cookies.",
      ] },
      { title: "Contact et compte client", paragraphs: [
        "Lors d'une prise de contact (par ex. via un formulaire ou par e-mail), nous collectons les données nécessaires et les utilisons exclusivement pour répondre à votre demande ; elles sont supprimées une fois le traitement achevé, sauf obligations légales de conservation.",
        "Des données personnelles sont également collectées et traitées lorsque vous les communiquez pour l'exécution d'un contrat ou l'ouverture d'un compte client. La suppression du compte client est possible à tout moment sur demande ; les données sont alors bloquées dans le respect des délais légaux de conservation fiscale et commerciale, puis supprimées.",
      ] },
      { title: "Newsletter et Mailchimp", paragraphs: [
        "En vous inscrivant à la newsletter, vous consentez à l'utilisation de vos données pour l'envoi de newsletters ; nous conservons à cette fin l'adresse IP ainsi que la date et l'heure de l'inscription. Vous pouvez vous désabonner à tout moment via le lien prévu à cet effet dans la newsletter ou en nous contactant.",
        "L'envoi est assuré par The Rocket Science Group, LLC d/b/a Mailchimp (Atlanta, États-Unis). Avec votre consentement exprès, Mailchimp analyse statistiquement les taux d'ouverture et les interactions au moyen de pixels de suivi. Pour le transfert de données vers les États-Unis, Mailchimp s'appuie sur les clauses contractuelles types du Préposé fédéral à la protection des données (PFPDT).",
      ] },
      { title: "Prestataires de services de livraison", paragraphs: [
        "Si la livraison est assurée par la Poste Suisse, nous ne transmettons votre adresse e-mail aux fins de coordination de la livraison qu'avec votre consentement exprès ; à défaut, nous ne transmettons que le nom et l'adresse de livraison, dans la mesure nécessaire à la livraison. Le consentement peut être révoqué à tout moment.",
      ] },
      { title: "Prestataires de services de paiement", paragraphs: [
        "Pour les paiements en ligne, nous collaborons, selon le mode de paiement choisi, avec les prestataires suivants : Adyen (Amsterdam), Stripe Payments Europe (Dublin), PayPal (Europe) S.à r.l. et Cie (Luxembourg), Apple (Apple Pay), Google Ireland Limited (Google Pay), PostFinance SA (Berne) et TWINT SA (Zurich). En choisissant un mode de paiement anticipé (par ex. carte de crédit), les données de paiement communiquées lors de la commande (notamment nom, adresse, informations de paiement, montant, numéro de transaction) sont transmises au prestataire concerné exclusivement aux fins du traitement du paiement.",
        "PayPal se réserve, pour certains modes de paiement, le droit d'effectuer une vérification de solvabilité fondée sur des procédés mathématico-statistiques reconnus. De plus amples informations figurent dans les politiques de confidentialité respectives des prestataires mentionnés.",
      ] },
      { title: "Vérification de solvabilité", paragraphs: [
        "Lorsque nous livrons par anticipation (par ex. livraison sur facture), nous nous réservons le droit, afin de préserver notre intérêt légitime quant à la solvabilité de nos clients, de procéder à une vérification de solvabilité auprès de CRIF SA (Suisse), Hagenholzstrasse 81, 8050 Zurich. Cette vérification peut se fonder sur des valeurs statistiques (scores). Vous pouvez vous opposer à ce traitement à tout moment ; notre droit de traitement dans le cadre de l'exécution du paiement n'en est pas affecté.",
      ] },
      { title: "Marketing en ligne", paragraphs: [
        "Nous utilisons le suivi des conversions Google Ads de Google Ireland Limited afin de mesurer l'efficacité de nos actions publicitaires. Des cookies sont utilisés, expirant généralement après 30 jours et ne permettant pas d'identification personnelle. Vous pouvez désactiver ce suivi via les paramètres de votre navigateur ou le module complémentaire de navigateur de Google. Cette utilisation peut entraîner un transfert de données vers les serveurs de Google aux États-Unis, garanti par les clauses contractuelles types du PFPDT.",
      ] },
      { title: "reCAPTCHA et Avis clients Google", paragraphs: [
        "Nous utilisons Google reCAPTCHA (Google Ireland Limited) afin de détecter les utilisations automatisées abusives ; cela implique la transmission de votre adresse IP ainsi que d'autres données requises par Google. Nous participons également au programme « Avis clients Google » : avec votre consentement, vous recevez après un achat une enquête par e-mail de Google, pour laquelle votre adresse e-mail est transmise à Google. Ces deux services peuvent entraîner un transfert de données vers les serveurs de Google aux États-Unis, garanti par les clauses contractuelles types du PFPDT.",
      ] },
      { title: "Vos droits et durée de conservation", paragraphs: [
        "En vertu du droit applicable en matière de protection des données, vous disposez notamment d'un droit d'accès (art. 25 LPD), d'un droit à la remise ou à la transmission de vos données (art. 28 LPD) et d'un droit de rectification (art. 32 al. 1 LPD). Les demandes peuvent être adressées à info@thedesertrosegin.com.",
        "Les données personnelles ne sont conservées que le temps nécessaire à la finalité du traitement et dans le respect des éventuels délais légaux de conservation (par ex. en droit des obligations) ; en cas de traitement fondé sur le consentement, jusqu'à son retrait.",
      ] },
    ],
  },
  returns: {
    title: "Politique de Retour et de Remboursement",
    shortLabel: "Retours",
    sections: [
      { title: "Retour de marchandise", paragraphs: [
        "Vous pouvez nous retourner la marchandise dans les 14 jours suivant la réception de votre commande. Merci de nous informer au préalable par e-mail (orders@thedesertrosegin.com) si vous souhaitez retourner un ou plusieurs articles. La marchandise doit être non ouverte et dans son emballage d'origine.",
        "Les frais de retour sont en principe à la charge du client, sauf si vous avez reçu le mauvais article ou si l'article est défectueux ou incomplet.",
        "Adresse de retour : The Desert Rose Gin Co. Sagl, Via Campagna 32, Case postale 48–49, 6934 Bioggio, Suisse.",
      ] },
    ],
  },
  delivery: {
    title: "Livraison et Retrait",
    shortLabel: "Livraison",
    sections: [
      { title: "Livraison", paragraphs: [
        "thedesertrosegin.com livre en Suisse et au Liechtenstein. Les commandes passées avant 17h (clients professionnels avant 15h) sont traitées et expédiées le jour même, de sorte que la livraison intervient généralement le jour ouvrable suivant (hors jours fériés et week-ends).",
        "L'expédition est assurée par la Poste Suisse en livraison Priority ou, pour des quantités plus importantes, par un transporteur. Nous recommandons de passer commande suffisamment tôt afin que la marchandise arrive idéalement 1 à 2 jours avant la date souhaitée.",
      ] },
      { title: "Retrait", paragraphs: [
        "Le retrait n'est possible qu'après réception d'une confirmation de retrait, envoyée par e-mail généralement dans un délai de deux à trois heures pendant les heures d'ouverture. Les retraits sont possibles du lundi au vendredi, de 9h à 12h et de 13h30 à 17h30, auprès de The Desert Rose Gin Co. Sagl, Via Campagna 32, 6934 Bioggio, Suisse. Seules les commandes passées avant 15h peuvent être retirées le jour même.",
      ] },
      { title: "Livraison du samedi", paragraphs: [
        "En choisissant la livraison du samedi, votre commande est livrée le samedi, quel que soit le jour où elle a été passée. Pour une livraison le samedi suivant, la commande doit être passée avant vendredi 17h (clients professionnels 15h) ; les commandes passées après ce délai seront livrées le samedi d'après.",
      ] },
    ],
  },
  cookie: {
    title: "Politique relative aux Cookies",
    shortLabel: "Cookies",
    sections: [
      { title: "Définition des cookies", paragraphs: ["Les cookies sont des éléments de code ou de données installés dans le navigateur ou l'appareil de l'Utilisateur afin de fournir le service et poursuivre les finalités décrites.", "Des outils de suivi peuvent être utilisés pour la sécurité, la conformité et la prévention des usages abusifs liés aux produits soumis à restriction d'âge."] },
      { title: "Cookies techniques et préférences", paragraphs: ["Le site utilise des cookies nécessaires aux sessions, à la répartition du trafic, à la sécurité, au panier, au checkout et aux fonctionnalités essentielles.", "D'autres cookies peuvent enregistrer la langue, la devise et les préférences de navigation."] },
      { title: "Statistiques, marketing et tiers", paragraphs: ["Le site peut utiliser Shopify, Google Analytics 4, Google Tag Manager, Google Ads, Meta Pixel, Meta Events Manager et des statistiques internes.", "Ces outils peuvent traiter données d'utilisation, traceurs, données techniques, statistiques de session et interactions selon leurs propres politiques."] },
      { title: "Gestion du consentement", paragraphs: ["L'Utilisateur peut gérer ses préférences via le bandeau cookies, lorsqu'il est disponible, et via les paramètres du navigateur, y compris en supprimant les cookies déjà installés.", "Pour les cookies tiers, l'Utilisateur peut utiliser les outils d'opt-out des fournisseurs ou des ressources telles que EDAA, NAI, DAA, DAAC ou DDAI."] },
      { title: "Responsable et références légales", paragraphs: [`Le Responsable du traitement est ${COMPANY}.`, "Cette politique est rédigée conformément aux règles applicables de protection des données, y compris, le cas échéant, la loi suisse sur la protection des données, l'art. 45c let. b LTC et le Règlement (UE) 2016/679."] },
    ],
  },
};

policies.es = {
  terms: {
    title: "Condiciones Generales de Venta (CGV)",
    shortLabel: "Términos",
    updated: "Versión: 1 de septiembre de 2026",
    sections: [
      { title: "Ámbito de aplicación", paragraphs: [
        "Las presentes Condiciones Generales de Venta (CGV) regulan el uso de este sitio web y la relación comercial entre thedesertrosegin.com (Piazzetta San Carlo 2, 6900 Lugano, Suiza) y sus clientes, en la versión aplicable en el momento de acceder al sitio o de realizar un pedido. La oferta de este sitio se dirige exclusivamente a clientes residentes en Suiza y en Liechtenstein.",
        "Se considera cliente cualquier persona física o jurídica que mantenga una relación comercial con thedesertrosegin.com. Las CGV, las condiciones de entrega y pago, así como las disposiciones de protección de datos, pueden actualizarse de forma periódica.",
        "Las presentes CGV se aplican con carácter exclusivo. Al utilizar este sitio o realizar un pedido, el cliente confirma aceptar íntegramente las presentes CGV, incluidas las condiciones de entrega y pago. Si alguna disposición resultara inválida, la validez de las restantes disposiciones no se verá afectada.",
      ] },
      { title: "Información, precios y disponibilidad", paragraphs: [
        "Este sitio contiene información sobre productos y servicios. Se reservan los cambios de precio, surtido y técnicos. Todos los datos son valores aproximados y no constituyen garantía de características, salvo indicación expresa en contrario. Todas las ofertas se entienden sin compromiso.",
        "Salvo indicación contraria, los precios incluyen el IVA suizo aplicable y los eventuales anticipos de tasas de reciclaje, y se entienden netos en francos suizos (CHF). Los gastos de envío se facturan por separado y se indican de forma diferenciada durante el proceso de pedido.",
        "Se reservan cambios técnicos, errores y erratas de imprenta. thedesertrosegin.com puede modificar los precios en cualquier momento sin previo aviso y no garantiza la disponibilidad de los productos en el momento del pedido.",
      ] },
      { title: "Formalización del contrato", paragraphs: [
        "Las ofertas de este sitio constituyen una invitación no vinculante dirigida al cliente para realizar pedidos de productos. Al realizar un pedido, incluida la aceptación de las presentes CGV, el cliente formula una oferta jurídicamente vinculante. thedesertrosegin.com envía entonces una confirmación de pedido automática por correo electrónico. Los pedidos realizados son vinculantes para el cliente.",
        "El contrato se perfecciona cuando thedesertrosegin.com envía una declaración de aceptación por correo electrónico que confirma el envío de los productos pedidos. Los pedidos se ejecutan únicamente tras la recepción íntegra del pago (salvo entrega contra factura) y siempre que la mercancía esté disponible. Si la mercancía pedida no puede entregarse total o parcialmente, thedesertrosegin.com tiene derecho a rescindir el contrato total o parcialmente; cualquier pago ya realizado será reembolsado.",
      ] },
      { title: "Pago y reserva de dominio", paragraphs: [
        "El cliente dispone de los métodos de pago indicados durante el proceso de pedido. thedesertrosegin.com se reserva el derecho de excluir determinados métodos de pago sin indicar motivos o de exigir el pago por adelantado.",
        "Una vez transcurrido el plazo de pago, la mora se produce automáticamente sin necesidad de requerimiento. En caso de demora en el pago, podrán aplicarse intereses de demora del 14,9 % anual y una tasa de recordatorio de hasta CHF 20.– por aviso; en caso de recurrir a una agencia de cobro, podrán aplicarse tasas adicionales conforme a la tarifa de la Asociación Suiza de Sociedades Fiduciarias de Cobro (VSI).",
        "Los productos entregados permanecen en propiedad de thedesertrosegin.com hasta el pago íntegro.",
      ] },
      { title: "Entrega, obligación de inspección y devoluciones", paragraphs: [
        "Las entregas se realizan por correo postal o mensajería a la dirección indicada por el cliente. El uso y el riesgo se transmiten al cliente en el momento del envío, en la medida permitida por la ley. El embalaje y el envío dentro de Suiza y Liechtenstein tienen un coste fijo de CHF 9.50; los costes de entregas especiales se comunican al cliente con antelación.",
        "Si una entrega no puede realizarse por motivos imputables al cliente, este asumirá los costes adicionales; una nueva entrega se facturará como mínimo a CHF 50.– o al coste real superior.",
        "El cliente está obligado a inspeccionar la mercancía recibida inmediatamente tras su recepción y a notificar sin demora cualquier defecto por carta o correo electrónico. Las devoluciones se realizan por cuenta y riesgo del cliente, en el embalaje original, completas con accesorios y albarán de entrega, a la siguiente dirección: The Desert Rose Gin Co. Sagl, Via Campagna 32, Apartado 48–49, 6934 Bioggio, Suiza. Si no se constatan defectos identificables, los costes de gestión, devolución o eliminación podrán facturarse al cliente. Los reembolsos se efectúan en un plazo de 5 a 10 días laborables desde el procesamiento del pago.",
      ] },
      { title: "Derecho de desistimiento", paragraphs: [
        "El cliente dispone de un derecho de desistimiento durante 14 días naturales desde la recepción de la mercancía, sin necesidad de justificación. El desistimiento por escrito debe enviarse dentro de dicho plazo por correo electrónico (orders@thedesertrosegin.com) o por carta a The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Suiza.",
        "El cliente debe devolver la mercancía dentro de los 14 días naturales, en su embalaje original, completa con accesorios y albarán de entrega, por cuenta y riesgo propios. Un pago ya realizado se reembolsará en un plazo de 20 días naturales, siempre que se haya recibido la mercancía o se aporte prueba del envío. thedesertrosegin.com podrá reclamar una compensación adecuada por daños, desgaste excesivo o pérdida de valor.",
        "No existe derecho de desistimiento, en particular, en contratos sujetos a fluctuaciones de precio ajenas al proveedor, en bienes no aptos para devolución o que puedan deteriorarse rápidamente, en bienes confeccionados según las especificaciones del cliente, en contenidos digitales no suministrados en un soporte físico, así como en servicios ya ejecutados en su totalidad con el consentimiento expreso previo del cliente.",
      ] },
      { title: "Prohibición de venta a menores", paragraphs: [
        "Conforme a las disposiciones legales suizas, las bebidas alcohólicas no pueden venderse a personas menores de 16 años, y los licores no pueden venderse a menores de 18 años. Al realizar un pedido, el cliente confirma estar autorizado a efectuar la compra; thedesertrosegin.com declina toda responsabilidad en caso de incumplimiento.",
      ] },
      { title: "Garantía y responsabilidad", paragraphs: [
        "En caso de defectos notificados a tiempo, thedesertrosegin.com asume la garantía durante el plazo legal de garantía, por regla general dos años desde la fecha de entrega, a su discreción mediante reparación gratuita, sustitución equivalente o reembolso del precio de compra. Se excluyen el desgaste normal y los daños derivados de un uso inadecuado.",
        "thedesertrosegin.com excluye cualquier responsabilidad adicional, en particular por daños indirectos, daños consecuenciales o lucro cesante, en la medida permitida por la ley; se reserva la responsabilidad legal imperativa, por ejemplo por negligencia grave o dolo.",
      ] },
      { title: "Protección de datos, derecho aplicable y fuero", paragraphs: [
        "El tratamiento de los datos personales se describe en la Política de Privacidad. Para consultas sobre las presentes CGV, contacte con info@thedesertrosegin.com.",
        "Las presentes CGV se rigen exclusivamente por el derecho material suizo, con exclusión de la Convención de Viena sobre la Compraventa Internacional de Mercaderías (CISG). El fuero exclusivo es Lugano, salvo que la ley prevea un fuero imperativo distinto. Todos los derechos sobre las presentes CGV pertenecen a The Desert Rose Gin Co. Sagl; cualquier reproducción o difusión requiere el consentimiento escrito expreso.",
        "thedesertrosegin.com se reserva el derecho de modificar en cualquier momento las presentes CGV y de ponerlas en vigor sin previo aviso. En casos de sospecha o incumplimiento de las disposiciones legales aplicables, el contrato podrá resolverse unilateralmente y con efecto inmediato.",
      ] },
    ],
  },
  privacy: {
    title: "Política de Privacidad",
    shortLabel: "Privacidad",
    updated: "Versión: 1 de septiembre de 2026",
    sections: [
      { title: "Responsable del tratamiento", paragraphs: [
        "El Responsable del tratamiento de datos en este sitio, en el sentido de la Ley Federal Suiza de Protección de Datos (LPD), es The Desert Rose Gin Co. Sagl, Piazzetta San Carlo 2, 6900 Lugano, Suiza, tel. +41 91 605 52 63, correo electrónico info@thedesertrosegin.com.",
      ] },
      { title: "Recogida de datos al visitar el sitio", paragraphs: [
        "En caso de un uso meramente informativo del sitio, solo recogemos los archivos de registro técnicamente necesarios: página visitada, fecha y hora de acceso, volumen de datos transmitidos, página de origen, navegador y sistema operativo utilizados, y dirección IP (anonimizada cuando proceda). Estos datos no se ceden a terceros; nos reservamos el derecho de revisar dichos registros a posteriori si existen indicios concretos de uso ilícito.",
        "Por motivos de seguridad, este sitio utiliza cifrado SSL/TLS, reconocible por el prefijo «https://» y el símbolo del candado en la barra del navegador.",
      ] },
      { title: "Cookies", paragraphs: [
        "Utilizamos cookies en distintas páginas, algunas de sesión y otras persistentes, entre otros fines para simplificar el proceso de pedido (por ejemplo, recordando el contenido del carrito). En algunos casos también se instalan cookies de socios publicitarios. El navegador puede configurarse para confirmar los cookies individualmente o rechazarlos con carácter general; esto puede limitar la funcionalidad del sitio. Encontrará información detallada en la Política de Cookies.",
      ] },
      { title: "Contacto y cuenta de cliente", paragraphs: [
        "Al ponerse en contacto con nosotros (por ejemplo, mediante formulario o correo electrónico), recogemos los datos necesarios y los utilizamos exclusivamente para responder a su consulta; dichos datos se eliminan una vez tramitada la solicitud, salvo obligaciones legales de conservación.",
        "También se recogen y tratan datos personales cuando los facilita para la ejecución de un contrato o la apertura de una cuenta de cliente. La cuenta puede eliminarse en cualquier momento a petición; posteriormente los datos se bloquean conforme a los plazos legales de conservación fiscal y mercantil, y a continuación se eliminan.",
      ] },
      { title: "Newsletter y Mailchimp", paragraphs: [
        "Al suscribirse a la newsletter, consiente el uso de sus datos para el envío de boletines; a tal efecto, almacenamos la dirección IP y la fecha y hora del registro. Puede darse de baja en cualquier momento a través del enlace incluido en la newsletter o contactando con nosotros.",
        "El envío se realiza a través de The Rocket Science Group, LLC d/b/a Mailchimp (Atlanta, EE. UU.). Con su consentimiento expreso, Mailchimp analiza estadísticamente las tasas de apertura e interacciones mediante píxeles de seguimiento. Para la transferencia de datos a Estados Unidos, Mailchimp se basa en las cláusulas contractuales tipo del Comisionado Federal Suizo de Protección de Datos (IFPDT).",
      ] },
      { title: "Proveedores de servicios de envío", paragraphs: [
        "Si la entrega se realiza a través de Correos Suizos (Swiss Post), solo transmitimos su dirección de correo electrónico para la coordinación de la entrega con su consentimiento expreso; de lo contrario, únicamente transmitimos el nombre y la dirección de entrega, en la medida necesaria para la entrega. El consentimiento puede revocarse en cualquier momento.",
      ] },
      { title: "Proveedores de servicios de pago", paragraphs: [
        "Para los pagos en línea colaboramos, según el método elegido, con los siguientes proveedores: Adyen (Ámsterdam), Stripe Payments Europe (Dublín), PayPal (Europe) S.à r.l. et Cie (Luxemburgo), Apple (Apple Pay), Google Ireland Limited (Google Pay), PostFinance SA (Berna) y TWINT SA (Zúrich). Al elegir un método de pago anticipado (por ejemplo, tarjeta de crédito), los datos de pago facilitados durante el pedido (entre otros, nombre, dirección, información de pago, importe, número de transacción) se transmiten al proveedor correspondiente exclusivamente con el fin de procesar el pago.",
        "PayPal se reserva, para determinados métodos de pago, el derecho de realizar una verificación de solvencia basada en procedimientos matemático-estadísticos reconocidos. Encontrará más información en las respectivas políticas de privacidad de los proveedores mencionados.",
      ] },
      { title: "Verificación de solvencia", paragraphs: [
        "Cuando anticipamos la entrega (por ejemplo, entrega contra factura), nos reservamos el derecho, para salvaguardar nuestro interés legítimo en la solvencia de nuestros clientes, de realizar una verificación de solvencia a través de CRIF SA (Suiza), Hagenholzstrasse 81, 8050 Zúrich. Dicha verificación puede basarse en valores estadísticos (scoring). Puede oponerse a este tratamiento en cualquier momento; esto no afecta a nuestro derecho a tratar los datos en el marco de la tramitación del pago.",
      ] },
      { title: "Marketing en línea", paragraphs: [
        "Utilizamos el seguimiento de conversiones de Google Ads de Google Ireland Limited para medir la eficacia de nuestras acciones publicitarias. Se emplean cookies que por lo general caducan a los 30 días y no permiten la identificación personal. Puede desactivar este seguimiento a través de la configuración de su navegador o del complemento de navegador de Google. El uso de este servicio puede implicar la transferencia de datos a servidores de Google en Estados Unidos, protegida mediante las cláusulas contractuales tipo del IFPDT.",
      ] },
      { title: "reCAPTCHA y Reseñas de clientes de Google", paragraphs: [
        "Utilizamos Google reCAPTCHA (Google Ireland Limited) para detectar usos automatizados abusivos; esto implica la transmisión de su dirección IP y de otros datos que Google pueda requerir. Además, participamos en el programa «Reseñas de clientes de Google»: con su consentimiento, tras una compra recibirá una encuesta por correo electrónico de Google, para lo cual se transmitirá su dirección de correo electrónico a Google. Ambos servicios pueden implicar la transferencia de datos a servidores de Google en Estados Unidos, protegida mediante las cláusulas contractuales tipo del IFPDT.",
      ] },
      { title: "Sus derechos y plazo de conservación", paragraphs: [
        "Conforme a la normativa de protección de datos aplicable, dispone en particular de un derecho de acceso (art. 25 LPD), un derecho a la entrega o transmisión de sus datos (art. 28 LPD) y un derecho de rectificación (art. 32 párr. 1 LPD). Las solicitudes pueden enviarse a info@thedesertrosegin.com.",
        "Los datos personales se conservan únicamente durante el tiempo necesario para la finalidad del tratamiento y los eventuales plazos legales de conservación (por ejemplo, en materia de derecho de obligaciones); en caso de tratamiento basado en el consentimiento, hasta su revocación.",
      ] },
    ],
  },
  returns: {
    title: "Política de Devolución y Reembolso",
    shortLabel: "Devoluciones",
    sections: [
      { title: "Devolución de mercancía", paragraphs: [
        "Puede devolvernos la mercancía dentro de los 14 días siguientes a la recepción de su pedido. Le rogamos nos informe previamente por correo electrónico (orders@thedesertrosegin.com) si desea devolver uno o varios artículos. La mercancía debe estar sin abrir y en su embalaje original.",
        "Los gastos de devolución corren, por norma general, a cargo del cliente, salvo que haya recibido el artículo equivocado o el artículo esté defectuoso o incompleto.",
        "Dirección de devolución: The Desert Rose Gin Co. Sagl, Via Campagna 32, Apartado 48–49, 6934 Bioggio, Suiza.",
      ] },
    ],
  },
  delivery: {
    title: "Entrega y Recogida",
    shortLabel: "Entrega",
    sections: [
      { title: "Entrega", paragraphs: [
        "thedesertrosegin.com realiza entregas en Suiza y Liechtenstein. Los pedidos realizados antes de las 17:00 (clientes empresariales antes de las 15:00) se procesan y envían el mismo día, por lo que la entrega suele llegar al siguiente día laborable (excepto festivos y fines de semana).",
        "El envío se realiza a través de Correos Suizos como entrega Priority o, para volúmenes de pedido mayores, mediante un transportista. Recomendamos realizar el pedido con antelación, de modo que la mercancía llegue idealmente entre 1 y 2 días antes de la fecha necesaria.",
      ] },
      { title: "Recogida", paragraphs: [
        "La recogida solo es posible tras recibir una confirmación de recogida, que se envía por correo electrónico normalmente en un plazo de dos a tres horas durante el horario comercial. Las recogidas son posibles de lunes a viernes, de 9:00 a 12:00 y de 13:30 a 17:30, en The Desert Rose Gin Co. Sagl, Via Campagna 32, 6934 Bioggio, Suiza. Solo los pedidos realizados antes de las 15:00 pueden recogerse el mismo día.",
      ] },
      { title: "Entrega en sábado", paragraphs: [
        "Si elige la entrega en sábado, su pedido se entregará el sábado, independientemente del día en que lo haya realizado. Para recibir la entrega el próximo sábado, el pedido debe realizarse antes del viernes a las 17:00 (clientes empresariales a las 15:00); los pedidos posteriores se entregarán el sábado siguiente.",
      ] },
    ],
  },
  cookie: {
    title: "Política de Cookies",
    shortLabel: "Cookies",
    sections: [
      { title: "Qué son las cookies", paragraphs: ["Las cookies son elementos de código o datos instalados en el navegador o dispositivo del Usuario que ayudan a prestar el servicio y cumplir las finalidades descritas.", "Las herramientas de seguimiento pueden utilizarse para seguridad, cumplimiento y prevención de usos indebidos relacionados con productos sujetos a restricción de edad."] },
      { title: "Cookies técnicas y preferencias", paragraphs: ["El sitio utiliza cookies necesarias para sesiones, distribución de tráfico, seguridad, carrito, checkout y funciones esenciales.", "Otras cookies pueden guardar idioma, moneda y preferencias de navegación."] },
      { title: "Estadística, marketing y terceros", paragraphs: ["El sitio puede utilizar Shopify, Google Analytics 4, Google Tag Manager, Google Ads, Meta Pixel, Meta Events Manager y estadísticas internas.", "Estas herramientas pueden tratar datos de uso, rastreadores, datos técnicos, estadísticas de sesión e interacciones según sus propias políticas."] },
      { title: "Gestión del consentimiento", paragraphs: ["El Usuario puede gestionar preferencias mediante el banner de cookies, cuando exista, y mediante la configuración del navegador, incluso eliminando cookies instaladas.", "Para cookies de terceros, puede usar herramientas de opt-out de los proveedores o recursos como EDAA, NAI, DAA, DAAC o DDAI."] },
      { title: "Responsable y referencias legales", paragraphs: [`El Responsable del tratamiento es ${COMPANY}.`, "Esta política se redacta conforme a la normativa aplicable de protección de datos, incluida, cuando proceda, la Ley Federal Suiza de Protección de Datos, el art. 45c let. b LTC y el Reglamento (UE) 2016/679."] },
    ],
  },
};

policies.ar = {
  terms: {
    title: "الشروط والأحكام العامة للبيع",
    shortLabel: "الشروط",
    updated: "الإصدار: 1 سبتمبر 2026",
    sections: [
      { title: "نطاق التطبيق", paragraphs: [
        "تنظم هذه الشروط والأحكام العامة (الشروط) استخدام هذا الموقع والعلاقة التجارية بين thedesertrosegin.com (Piazzetta San Carlo 2، 6900 Lugano، سويسرا) وعملائها، بالنسخة السارية عند زيارة الموقع أو تقديم الطلب. يوجَّه العرض المتاح على هذا الموقع حصرياً إلى العملاء المقيمين في سويسرا وليختنشتاين.",
        "يُعتبر عميلاً كل شخص طبيعي أو اعتباري تربطه علاقة تجارية بـ thedesertrosegin.com. يجوز تحديث هذه الشروط وشروط التسليم والدفع وأحكام حماية البيانات من وقت لآخر.",
        "تسري هذه الشروط حصرياً. يقر العميل، باستخدامه هذا الموقع أو بتقديمه طلباً، بقبوله الكامل لهذه الشروط بما في ذلك شروط التسليم والدفع. وإذا تبين بطلان أحد الأحكام الفردية، تظل صلاحية باقي الأحكام قائمة دون تأثر.",
      ] },
      { title: "المعلومات والأسعار والتوافر", paragraphs: [
        "يحتوي هذا الموقع على معلومات حول المنتجات والخدمات. تُحفظ حقوق تغيير الأسعار والتشكيلة والمواصفات التقنية. جميع البيانات تقريبية ولا تشكل ضماناً للخصائص ما لم يُذكر خلاف ذلك صراحة. تُعتبر جميع العروض غير ملزمة.",
        "ما لم يُذكر خلاف ذلك، تشمل الأسعار ضريبة القيمة المضافة السويسرية السارية وأي رسوم إعادة تدوير مسبقة، وتُحتسب صافية بالفرنك السويسري (CHF). تُحتسب تكاليف الشحن بشكل منفصل وتُعرض بوضوح أثناء إتمام الطلب.",
        "تُحفظ حقوق إجراء تغييرات تقنية وتصحيح الأخطاء وأخطاء الطباعة. يجوز لـ thedesertrosegin.com تغيير الأسعار في أي وقت دون إشعار مسبق، ولا تضمن توافر المنتجات المدرجة وقت تقديم الطلب.",
      ] },
      { title: "إبرام العقد", paragraphs: [
        "تُعد العروض على هذا الموقع دعوة غير ملزمة للعميل لطلب المنتجات. بتقديم الطلب، بما في ذلك قبول هذه الشروط، يقدم العميل عرضاً ملزماً قانونياً. ترسل thedesertrosegin.com بعد ذلك تأكيداً تلقائياً للطلب عبر البريد الإلكتروني. تكون الطلبات المقدمة ملزمة للعميل.",
        "ينعقد العقد عندما ترسل thedesertrosegin.com إشعار قبول عبر البريد الإلكتروني يؤكد شحن المنتجات المطلوبة. لا تُنفذ الطلبات إلا بعد استلام كامل قيمة الدفع (باستثناء التسليم مقابل فاتورة) وبشرط توافر البضاعة. وإذا تعذر تسليم البضاعة المطلوبة كلياً أو جزئياً، يحق لـ thedesertrosegin.com فسخ العقد كلياً أو جزئياً؛ وتُرد أي مبالغ سبق دفعها.",
      ] },
      { title: "الدفع وحفظ الملكية", paragraphs: [
        "تتاح للعميل طرق الدفع المحددة أثناء عملية الطلب. تحتفظ thedesertrosegin.com بحق استبعاد طرق دفع معينة دون إبداء أسباب أو اشتراط الدفع المسبق.",
        "عند انتهاء مهلة الدفع، يبدأ التأخير تلقائياً دون الحاجة إلى إشعار. في حال التأخر عن السداد، يجوز فرض فائدة تأخير بنسبة 14.9% سنوياً ورسوم تذكير تصل إلى 20 فرنكاً سويسرياً كحد أقصى لكل تذكير؛ وفي حال تكليف شركة تحصيل ديون، قد تُفرض رسوم إضافية وفق تعرفة الجمعية السويسرية لمؤسسات التحصيل الائتمانية (VSI).",
        "تظل المنتجات المُسلَّمة ملكاً لـ thedesertrosegin.com حتى السداد الكامل لثمنها.",
      ] },
      { title: "التسليم وواجب الفحص والإرجاع", paragraphs: [
        "تتم عمليات التسليم عبر البريد أو خدمة التوصيل إلى العنوان الذي يحدده العميل. تنتقل المنفعة والمخاطرة إلى العميل عند الشحن، بالقدر الذي يسمح به القانون. تبلغ تكلفة التغليف والشحن داخل سويسرا وليختنشتاين مبلغاً مقطوعاً قدره 9.50 فرنك سويسري؛ وتُبلَّغ تكاليف عمليات التسليم الخاصة للعميل مسبقاً.",
        "إذا تعذر التسليم لأسباب يتحمل العميل مسؤوليتها، يتحمل العميل التكاليف الإضافية؛ وتُحتسب إعادة التسليم بحد أدنى 50 فرنكاً سويسرياً أو التكلفة الفعلية إن كانت أعلى.",
        "يلتزم العميل بفحص البضاعة المستلمة فور استلامها والإبلاغ دون تأخير عن أي عيوب عبر خطاب أو بريد إلكتروني. تتم عمليات الإرجاع على نفقة العميل ومسؤوليته، في العبوة الأصلية وكاملة مع الملحقات ومستند التسليم، إلى العنوان التالي: The Desert Rose Gin Co. Sagl، Via Campagna 32، صندوق بريد 48–49، 6934 Bioggio، سويسرا. وفي حال عدم وجود عيوب يمكن إثباتها، يجوز تحميل العميل تكاليف المعالجة أو الإرجاع أو التخلص من البضاعة. تتم عمليات رد الأموال خلال 5 إلى 10 أيام عمل من معالجة الدفع.",
      ] },
      { title: "حق الانسحاب", paragraphs: [
        "يُمنح العميل حق الانسحاب خلال 14 يوماً تقويمياً من استلام البضاعة، دون الحاجة لتقديم مبرر. يجب إرسال إشعار الانسحاب الكتابي خلال هذه المهلة عبر البريد الإلكتروني (orders@thedesertrosegin.com) أو بخطاب إلى The Desert Rose Gin Co. Sagl، Piazzetta San Carlo 2، 6900 Lugano، سويسرا.",
        "يجب على العميل إعادة البضاعة خلال 14 يوماً تقويمياً في عبوتها الأصلية وكاملة مع الملحقات ومستند التسليم، على نفقته ومسؤوليته. يُرد أي مبلغ سبق دفعه خلال 20 يوماً تقويمياً، بشرط استلام البضاعة أو تقديم إثبات الشحن. يجوز لـ thedesertrosegin.com المطالبة بتعويض مناسب عن الأضرار أو التآكل المفرط أو فقدان القيمة.",
        "لا يُمنح حق الانسحاب على وجه الخصوص في العقود الخاضعة لتقلبات الأسعار خارج سيطرة المورّد، والبضائع غير المناسبة للإرجاع أو سريعة التلف، والبضائع المصنَّعة حسب مواصفات العميل، والمحتوى الرقمي غير المقدَّم على وسيط مادي، والخدمات المنفَّذة بالكامل بموافقة صريحة مسبقة من العميل.",
      ] },
      { title: "حظر البيع للقاصرين", paragraphs: [
        "وفقاً للأحكام القانونية السويسرية، لا يجوز بيع المشروبات الكحولية لمن تقل أعمارهم عن 16 عاماً، ولا يجوز بيع المشروبات الروحية لمن تقل أعمارهم عن 18 عاماً. بتقديم الطلب، يقر العميل بأنه مخوَّل بإجراء عملية الشراء؛ وتخلي thedesertrosegin.com مسؤوليتها عن أي مخالفة.",
      ] },
      { title: "الضمان والمسؤولية", paragraphs: [
        "بالنسبة للعيوب المُبلَّغ عنها في الوقت المناسب، تقدم thedesertrosegin.com تغطية الضمان خلال فترة الضمان القانونية، وهي عادةً سنتان من تاريخ التسليم، وذلك وفق تقديرها عبر الإصلاح المجاني أو الاستبدال المكافئ أو رد ثمن الشراء. يُستثنى من ذلك التآكل الطبيعي والأضرار الناتجة عن سوء الاستخدام.",
        "تستبعد thedesertrosegin.com أي مسؤولية إضافية، وعلى وجه الخصوص عن الأضرار غير المباشرة أو الأضرار التبعية أو خسارة الأرباح، بالقدر الذي يسمح به القانون؛ مع بقاء المسؤولية القانونية الإلزامية سارية، كما في حالات الإهمال الجسيم أو سوء النية.",
      ] },
      { title: "حماية البيانات والقانون المعمول به والاختصاص القضائي", paragraphs: [
        "يرد وصف معالجة البيانات الشخصية في سياسة الخصوصية. للاستفسار عن هذه الشروط، يُرجى التواصل عبر info@thedesertrosegin.com.",
        "تخضع هذه الشروط حصرياً للقانون السويسري الموضوعي، مع استبعاد اتفاقية الأمم المتحدة بشأن عقود البيع الدولي للبضائع (CISG). يكون الاختصاص القضائي الحصري للوجانو، ما لم ينص القانون على اختصاص إلزامي مغاير. تعود جميع الحقوق المتعلقة بهذه الشروط إلى The Desert Rose Gin Co. Sagl؛ ويتطلب أي استنساخ أو توزيع موافقة كتابية صريحة.",
        "تحتفظ thedesertrosegin.com بحق تعديل هذه الشروط في أي وقت وتطبيقها دون إشعار مسبق. وفي حالات الاشتباه بمخالفة الأحكام القانونية السارية أو ثبوتها، يجوز فسخ العقد من جانب واحد وبأثر فوري.",
      ] },
    ],
  },
  privacy: {
    title: "سياسة الخصوصية",
    shortLabel: "الخصوصية",
    updated: "الإصدار: 1 سبتمبر 2026",
    sections: [
      { title: "المتحكم في البيانات", paragraphs: [
        "المتحكم في معالجة البيانات على هذا الموقع، بالمعنى المقصود في القانون الاتحادي السويسري لحماية البيانات (DSG)، هو The Desert Rose Gin Co. Sagl، Piazzetta San Carlo 2، 6900 Lugano، سويسرا، هاتف ‎+41 91 605 52 63‎، البريد الإلكتروني info@thedesertrosegin.com.",
      ] },
      { title: "جمع البيانات عند زيارة الموقع", paragraphs: [
        "في حال الاستخدام المعلوماتي البحت للموقع، لا نجمع سوى سجلات الخادم الضرورية تقنياً: الصفحة التي تمت زيارتها، تاريخ ووقت الوصول، حجم البيانات المرسلة، صفحة المصدر، المتصفح ونظام التشغيل المستخدمَين، وعنوان IP (بصيغة مجهولة عند الاقتضاء). لا تُنقل هذه البيانات إلى أطراف ثالثة؛ ونحتفظ بحق مراجعة هذه السجلات لاحقاً في حال وجود مؤشرات ملموسة على استخدام غير مشروع للموقع.",
        "لأسباب أمنية، يستخدم هذا الموقع تشفير SSL/TLS، ويمكن التعرف عليه من خلال البادئة «https://» ورمز القفل في شريط المتصفح.",
      ] },
      { title: "ملفات تعريف الارتباط (الكوكيز)", paragraphs: [
        "نستخدم ملفات تعريف الارتباط في صفحات مختلفة، بعضها ملفات جلسة وبعضها الآخر دائم، لأغراض من بينها تبسيط عملية الطلب (مثل حفظ محتوى سلة التسوق). وقد تُثبَّت أيضاً في بعض الحالات ملفات تعريف ارتباط تابعة لشركاء إعلانيين. يمكن ضبط المتصفح لطلب تأكيد قبل تثبيت الكوكيز أو لرفضها بشكل عام؛ وقد يحد ذلك من وظائف الموقع. للاطلاع على التفاصيل الكاملة، يرجى مراجعة سياسة ملفات تعريف الارتباط.",
      ] },
      { title: "التواصل وحساب العميل", paragraphs: [
        "عند التواصل معنا (مثلاً عبر نموذج أو بريد إلكتروني)، نجمع البيانات اللازمة ونستخدمها حصرياً للرد على طلبكم؛ وتُحذف هذه البيانات فور الانتهاء من معالجة الطلب، ما لم تحل التزامات قانونية بالاحتفاظ بها دون ذلك.",
        "تُجمع البيانات الشخصية وتُعالج أيضاً عند تقديمها لتنفيذ عقد أو فتح حساب عميل. يمكن حذف حساب العميل في أي وقت بناءً على طلب؛ وبعد ذلك تُحجب البيانات مع مراعاة مهل الاحتفاظ الضريبية والتجارية القانونية، ثم تُحذف لاحقاً.",
      ] },
      { title: "النشرة الإخبارية وMailchimp", paragraphs: [
        "بالتسجيل في النشرة الإخبارية، يوافق المستخدم على استخدام بياناته لإرسال النشرات الإخبارية؛ ونقوم لهذا الغرض بتخزين عنوان IP وتاريخ ووقت التسجيل. يمكن إلغاء الاشتراك في أي وقت عبر الرابط المخصص لذلك في النشرة أو برسالة موجهة إلينا.",
        "يتم الإرسال عبر The Rocket Science Group، LLC d/b/a Mailchimp (أتلانتا، الولايات المتحدة). وبموافقة صريحة من المستخدم، تقوم Mailchimp بتحليل معدلات الفتح والتفاعلات إحصائياً باستخدام بكسلات تتبع. وفيما يخص نقل البيانات إلى الولايات المتحدة، تعتمد Mailchimp على البنود التعاقدية القياسية الصادرة عن المفوض الفيدرالي السويسري لحماية البيانات والشفافية (EDÖB).",
      ] },
      { title: "مزودو خدمات الشحن", paragraphs: [
        "إذا تم التسليم عبر البريد السويسري (Swiss Post)، فإننا لا ننقل عنوان البريد الإلكتروني للمستخدم بغرض تنسيق موعد التسليم إلا بموافقته الصريحة؛ وفي غير ذلك، لا ننقل سوى الاسم وعنوان التسليم، بالقدر اللازم للتسليم. يمكن سحب الموافقة في أي وقت.",
      ] },
      { title: "مزودو خدمات الدفع", paragraphs: [
        "بالنسبة للمدفوعات عبر الإنترنت، نتعاون حسب طريقة الدفع المختارة مع مزودي الخدمة التاليين: Adyen (أمستردام)، Stripe Payments Europe (دبلن)، PayPal (Europe) S.à r.l. et Cie (لوكسمبورغ)، Apple (Apple Pay)، Google Ireland Limited (Google Pay)، PostFinance SA (برن)، وTWINT SA (زيورخ). عند اختيار طريقة دفع مسبق (مثل بطاقة الائتمان)، تُنقل بيانات الدفع المقدَّمة أثناء الطلب (بما في ذلك الاسم والعنوان ومعلومات الدفع والمبلغ ورقم المعاملة) إلى مزود الخدمة المعني حصرياً لغرض معالجة الدفع.",
        "تحتفظ PayPal، بالنسبة لبعض طرق الدفع، بحق إجراء فحص للجدارة الائتمانية يستند إلى أساليب رياضية وإحصائية معترف بها. لمزيد من المعلومات، يرجى مراجعة سياسات الخصوصية الخاصة بمزودي الخدمة المذكورين.",
      ] },
      { title: "فحص الجدارة الائتمانية", paragraphs: [
        "عندما نقوم بالتسليم المسبق (مثل التسليم مقابل فاتورة)، نحتفظ بحق إجراء فحص للجدارة الائتمانية عبر CRIF SA (سويسرا)، Hagenholzstrasse 81، 8050 زيورخ، حفاظاً على مصلحتنا المشروعة في التحقق من الملاءة المالية لعملائنا. وقد يستند هذا الفحص إلى قيم إحصائية (Score). يمكن للمستخدم الاعتراض على هذه المعالجة في أي وقت؛ ولا يؤثر ذلك على حقنا في المعالجة في إطار تنفيذ الدفع.",
      ] },
      { title: "التسويق عبر الإنترنت", paragraphs: [
        "نستخدم تتبع التحويلات في Google Ads التابع لشركة Google Ireland Limited لقياس فعالية أنشطتنا الإعلانية. ويُستخدم لهذا الغرض ملفات تعريف ارتباط تنتهي صلاحيتها عادةً بعد 30 يوماً ولا تتيح التعرف الشخصي. يمكن تعطيل هذا التتبع عبر إعدادات المتصفح أو إضافة المتصفح الخاصة بغوغل. وقد يترتب على استخدام هذه الخدمة نقل بيانات إلى خوادم Google في الولايات المتحدة، بضمانات البنود التعاقدية القياسية الصادرة عن EDÖB.",
      ] },
      { title: "reCAPTCHA وتقييمات عملاء Google", paragraphs: [
        "نستخدم خدمة Google reCAPTCHA (Google Ireland Limited) للكشف عن الاستخدام الآلي المسيء؛ ويشمل ذلك نقل عنوان IP الخاص بكم وأي بيانات أخرى تطلبها Google. كما نشارك في برنامج «تقييمات عملاء Google»: بموافقتكم، تتلقون بعد الشراء استبياناً عبر البريد الإلكتروني من Google، ويُنقل عنوان بريدكم الإلكتروني إلى Google لهذا الغرض. وقد تستلزم كلتا الخدمتين نقل بيانات إلى خوادم Google في الولايات المتحدة، بضمانات البنود التعاقدية القياسية الصادرة عن EDÖB.",
      ] },
      { title: "حقوقكم ومدة الاحتفاظ بالبيانات", paragraphs: [
        "بموجب قانون حماية البيانات المعمول به، يتمتع المستخدم على وجه الخصوص بحق الاطلاع (المادة 25 من DSG)، وحق تسليم أو نقل بياناته (المادة 28 من DSG)، وحق التصحيح (المادة 32 الفقرة 1 من DSG). يمكن إرسال الطلبات إلى info@thedesertrosegin.com.",
        "تُحفظ البيانات الشخصية فقط للمدة اللازمة لغرض المعالجة ووفقاً لأي مهل احتفاظ قانونية سارية (مثل ما ينص عليه قانون الالتزامات)؛ وفي حال استندت المعالجة إلى الموافقة، يستمر الاحتفاظ حتى سحب هذه الموافقة.",
      ] },
    ],
  },
  returns: {
    title: "سياسة الإرجاع واسترداد الأموال",
    shortLabel: "الإرجاع",
    sections: [
      { title: "إرجاع البضاعة", paragraphs: [
        "يمكنكم إرجاع البضاعة إلينا خلال 14 يوماً من استلام طلبكم. يُرجى إعلامنا مسبقاً عبر البريد الإلكتروني (orders@thedesertrosegin.com) في حال رغبتكم بإرجاع صنف واحد أو أكثر. يجب أن تكون البضاعة غير مفتوحة وفي عبوتها الأصلية.",
        "يتحمل العميل عادةً تكاليف الإرجاع، إلا في حال استلام صنف خاطئ أو إذا كان الصنف معيباً أو ناقصاً.",
        "عنوان الإرجاع: The Desert Rose Gin Co. Sagl، Via Campagna 32، صندوق بريد 48–49، 6934 Bioggio، سويسرا.",
      ] },
    ],
  },
  delivery: {
    title: "التوصيل والاستلام",
    shortLabel: "التوصيل",
    sections: [
      { title: "التوصيل", paragraphs: [
        "تقوم thedesertrosegin.com بالتوصيل داخل سويسرا وليختنشتاين. تُعالج الطلبات المقدَّمة حتى الساعة 17:00 (وحتى الساعة 15:00 لعملاء الشركات) وتُشحن في اليوم نفسه، بحيث يصل التسليم عادةً في يوم العمل التالي (باستثناء العطلات الرسمية وعطلات نهاية الأسبوع).",
        "يتم الشحن عبر البريد السويسري كتسليم ذي أولوية (Priority)، أو عبر شركة شحن للكميات الأكبر. نوصي بتقديم الطلب مبكراً بحيث تصل البضاعة قبل الموعد المطلوب بيوم أو يومين إن أمكن.",
      ] },
      { title: "الاستلام", paragraphs: [
        "لا يمكن الاستلام إلا بعد الحصول على تأكيد الاستلام، الذي يُرسل عادةً عبر البريد الإلكتروني خلال ساعتين إلى ثلاث ساعات أثناء ساعات العمل. يمكن الاستلام من الاثنين إلى الجمعة، من الساعة 9:00 حتى 12:00 ومن 13:30 حتى 17:30، لدى The Desert Rose Gin Co. Sagl، Via Campagna 32، 6934 Bioggio، سويسرا. الطلبات المقدَّمة قبل الساعة 15:00 فقط يمكن استلامها في اليوم نفسه.",
      ] },
      { title: "التسليم يوم السبت", paragraphs: [
        "عند اختيار التسليم يوم السبت، يُسلَّم طلبكم يوم السبت بغض النظر عن يوم تقديم الطلب. وللحصول على التسليم يوم السبت القادم، يجب تقديم الطلب حتى الساعة 17:00 من يوم الجمعة (حتى الساعة 15:00 لعملاء الشركات)؛ وتُسلَّم الطلبات اللاحقة يوم السبت الذي يليه.",
      ] },
    ],
  },
  cookie: {
    title: "سياسة ملفات تعريف الارتباط",
    shortLabel: "الكوكيز",
    sections: [
      { title: "ما هي ملفات تعريف الارتباط", paragraphs: ["ملفات تعريف الارتباط هي عناصر بيانات أو كود تثبت في متصفح المستخدم أو جهازه وتساعد في تقديم الخدمة وتحقيق الأغراض الموضحة.", "قد تستخدم أدوات التتبع لأغراض الأمان والامتثال ومنع الاستخدام غير المشروع المتعلق بالمنتجات المقيدة بالسن."] },
      { title: "الكوكيز التقنية والتفضيلات", paragraphs: ["يستخدم الموقع كوكيز ضرورية للجلسات وتوزيع الحركة والأمان وسلة التسوق والدفع والوظائف الأساسية.", "قد تحفظ كوكيز أخرى اللغة والعملة وتفضيلات التصفح."] },
      { title: "الإحصاءات والتسويق والأطراف الثالثة", paragraphs: ["قد يستخدم الموقع Shopify وGoogle Analytics 4 وGoogle Tag Manager وGoogle Ads وMeta Pixel وMeta Events Manager وإحصاءات داخلية.", "قد تعالج هذه الأدوات بيانات الاستخدام وأدوات التتبع والبيانات التقنية وإحصاءات الجلسات والتفاعلات وفق سياساتها الخاصة."] },
      { title: "إدارة الموافقة", paragraphs: ["يمكن للمستخدم إدارة التفضيلات عبر لافتة الكوكيز، إن وجدت، ومن خلال إعدادات المتصفح بما في ذلك حذف الكوكيز المثبتة.", "بالنسبة لكوكيز الأطراف الثالثة، يمكن استخدام أدوات إلغاء الاشتراك لدى المزودين أو موارد مثل EDAA وNAI وDAA وDAAC وDDAI."] },
      { title: "المتحكم والمراجع القانونية", paragraphs: [`المتحكم في البيانات هو ${COMPANY}.`, "أعدت هذه السياسة وفقا لقواعد حماية البيانات المعمول بها، بما في ذلك، حيثما ينطبق، قانون حماية البيانات السويسري والمادة 45c حرف b من قانون الاتصالات واللائحة الأوروبية 2016/679."] },
    ],
  },
};

export function getLegalLanguage(language: string): LegalLanguage {
  const normalized = language.split("-")[0] as LegalLanguage;
  return normalized in policies ? normalized : "en";
}

export function getLegalPolicy(language: string, key: LegalPolicyKey): LegalPolicyContent {
  return policies[getLegalLanguage(language)][key] ?? policies.en[key];
}
