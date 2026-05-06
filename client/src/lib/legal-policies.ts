export type LegalPolicyKey = "terms" | "privacy" | "cookie";

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

export const legalPolicyKeys: LegalPolicyKey[] = ["terms", "privacy", "cookie"];

const COMPANY = "THE DESERT ROSE GIN CO. SAGL, Piazzetta S. Carlo 2, 6900 Lugano, P.IVA CH-382.909.266, info@thedesertrosegin.com";

const policies: Record<LegalLanguage, Record<LegalPolicyKey, LegalPolicyContent>> = {
  it: {
    terms: {
      title: "Termini e Condizioni di Vendita",
      shortLabel: "Termini",
      sections: [
        {
          title: "Parti del contratto e politica commerciale",
          paragraphs: [
            `Le presenti Condizioni di Vendita regolano l'offerta e la vendita dei prodotti tramite thedesertrosegin.com e il rapporto contrattuale tra il Cliente e ${COMPANY}.`,
            "Il Cliente è qualsiasi persona fisica o giuridica che acquista tramite il sito, come consumatore finale o per finalità professionali. Alcune disposizioni si applicano esclusivamente ai Consumatori secondo la normativa applicabile.",
            "La società può non dare seguito a ordini anomali, fraudolenti, incompleti, non coerenti con la politica commerciale o provenienti da soggetti non autorizzati. Eventuali collegamenti a siti terzi non implicano responsabilità per servizi o vendite effettuate da soggetti diversi da The Desert Rose Gin Co. Sagl.",
          ],
        },
        {
          title: "Vendita di prodotti alcolici e limiti di età",
          paragraphs: [
            "I prodotti venduti sono bevande alcoliche e possono essere acquistati solo da persone che abbiano raggiunto l'età minima legale prevista nel proprio Paese o giurisdizione.",
            "Effettuando un ordine, il Cliente dichiara di avere l'età minima richiesta, di essere legalmente autorizzato ad acquistare e ricevere i prodotti e di fornire dati veritieri, completi e aggiornati.",
            "La società può rifiutare, sospendere o annullare ordini qualora ritenga che non sussistano i requisiti legali. Ove applicabile, può essere richiesta verifica dell'età alla consegna.",
          ],
        },
        {
          title: "Applicazione e modifiche",
          paragraphs: [
            "Prima dell'acquisto il Cliente dichiara di aver letto e accettato le Condizioni di Vendita, la Privacy Policy e la Cookie Policy.",
            "Le condizioni applicabili sono quelle pubblicate sul sito al momento dell'invio dell'ordine. La società può aggiornarle pubblicando le modifiche sul sito.",
          ],
        },
        {
          title: "Prodotti, prezzi e disponibilità",
          paragraphs: [
            "Le caratteristiche essenziali dei prodotti sono indicate nelle schede prodotto. Immagini e colori possono differire leggermente dalla realtà per effetto del browser, dello schermo o della resa fotografica.",
            "I prezzi sono quelli indicati al momento dell'ordine. Salvo diversa indicazione, includono le imposte applicabili mostrate al checkout e non includono costi di spedizione, dazi, accise, imposte di importazione o ulteriori oneri del Paese di destinazione.",
            "In caso di indisponibilità, errore, frode sospetta o impossibilità di verificare i requisiti di legge, l'ordine può essere rifiutato o annullato senza responsabilità per danni diretti o indiretti.",
          ],
        },
        {
          title: "Conclusione del contratto",
          paragraphs: [
            "Per acquistare, il Cliente compila e invia il modulo d'ordine tramite checkout seguendo le istruzioni del sito.",
            "Il contratto si perfeziona quando The Desert Rose Gin Co. Sagl invia conferma dell'ordine dopo la verifica dei dati e della disponibilità dei prodotti.",
            "L'ordine può essere archiviato per il tempo necessario all'evasione e secondo i termini di legge.",
          ],
        },
        {
          title: "Spedizione e consegna",
          paragraphs: [
            "I prodotti sono consegnati tramite corriere all'indirizzo indicato dal Cliente. I tempi di consegna sono indicativi e non costituiscono termine essenziale.",
            "La società non risponde di ritardi imputabili al vettore, a cause di forza maggiore, eventi doganali o circostanze indipendenti dalla propria volontà.",
            "Il rischio di perdita o danneggiamento si trasferisce al Cliente al momento della consegna fisica. Il Cliente è responsabile della liceità dell'importazione di bevande alcoliche nel proprio Paese e di eventuali dazi, accise, imposte o restrizioni locali.",
          ],
        },
        {
          title: "Pagamenti",
          paragraphs: [
            "Il pagamento può avvenire tramite carte supportate, PayPal, Stripe o gateway equivalenti, Shop Pay, TWINT o bonifico bancario ove espressamente consentito.",
            "I dati finanziari sono trasmessi tramite protocolli sicuri ai provider di pagamento e non sono utilizzati dalla società se non per completare l'acquisto, gestire rimborsi o prevenire frodi.",
            "I pagamenti sono effettuati nella valuta indicata al checkout; eventuali costi di conversione restano a carico del Cliente.",
          ],
        },
        {
          title: "Diritto di recesso, resi e garanzia",
          paragraphs: [
            "Il Cliente può recedere entro 14 giorni di calendario dal ricevimento della merce inviando comunicazione scritta a info@thedesertrosegin.com o all'indirizzo della società.",
            "La merce deve essere restituita entro 14 giorni, nella confezione originale, completa di accessori e documento di consegna. I costi e i rischi di restituzione sono a carico del Cliente.",
            "Il rimborso avviene entro 20 giorni di calendario, a condizione che la merce sia stata ricevuta o che il Cliente fornisca prova della spedizione. La società può trattenere importi per danni, usura eccessiva o perdita di valore.",
            "Il diritto di recesso non si applica nei casi esclusi dalla legge, tra cui beni non idonei alla restituzione, prodotti personalizzati, beni deteriorabili, contenuti digitali o servizi già integralmente eseguiti con consenso.",
            "La garanzia legale di conformità si applica secondo il Codice delle Obbligazioni svizzero, fatti salvi i diritti inderogabili del consumatore.",
          ],
        },
        {
          title: "Privacy, servizio clienti, legge applicabile e foro",
          paragraphs: [
            "Il trattamento dei dati personali è descritto nella Privacy Policy e nella Cookie Policy.",
            "Per assistenza, reclami o richieste il Cliente può contattare info@thedesertrosegin.com.",
            "Le Condizioni di Vendita sono regolate dal diritto svizzero, con esclusione della CISG. Per le controversie è competente in via esclusiva il foro di Lugano, Cantone Ticino, Svizzera, fatti salvi eventuali diritti inderogabili del consumatore.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      shortLabel: "Privacy",
      updated: "Ultima modifica: 16 Aprile 2026",
      sections: [
        {
          title: "Titolare del trattamento",
          paragraphs: [`Il Titolare del trattamento è ${COMPANY}.`],
        },
        {
          title: "Dati raccolti",
          paragraphs: [
            "Il sito può raccogliere, autonomamente o tramite terze parti, nome, cognome, email, numero di telefono, indirizzo, sito web, Cookie, Dati di utilizzo, dati tecnici del dispositivo, dati relativi a ordini e pagamenti e dichiarazioni o informazioni necessarie alla verifica dell'età.",
            "Alcuni dati sono necessari per fornire il servizio, gestire ordini, spedizioni, pagamenti e obblighi normativi. Il mancato conferimento dei dati obbligatori può impedire la fornitura del servizio.",
            "L'Utente è responsabile dei dati personali di terzi eventualmente comunicati tramite il sito.",
          ],
        },
        {
          title: "Modalità, luogo e soggetti autorizzati",
          paragraphs: [
            "Il trattamento avviene con strumenti informatici e telematici, mediante misure di sicurezza idonee a prevenire accessi, divulgazioni, modifiche o distruzioni non autorizzate.",
            "Possono accedere ai dati personale amministrativo e commerciale interno, collaboratori autorizzati, provider tecnici e hosting, gateway di pagamento, partner logistici, spedizionieri, agenzie marketing, advertising e analytics. Ove necessario tali soggetti sono nominati Responsabili del trattamento.",
            "I dati sono trattati presso le sedi operative del Titolare e presso infrastrutture di terze parti. Alcuni dati possono essere trasferiti verso Paesi extra UE/SEE, inclusi Canada, Stati Uniti e Regno Unito, sulla base di garanzie adeguate come Clausole Contrattuali Standard, decisioni di adeguatezza e misure supplementari ove richieste.",
          ],
        },
        {
          title: "Base giuridica",
          paragraphs: [
            "Il trattamento può fondarsi sul consenso dell'Utente, sull'esecuzione di un contratto o di misure precontrattuali, sull'adempimento di obblighi legali, sull'esecuzione di compiti di interesse pubblico o sul legittimo interesse del Titolare o di terzi.",
            "L'Utente può richiedere chiarimenti sulla concreta base giuridica di ciascun trattamento.",
          ],
        },
        {
          title: "Finalità del trattamento",
          paragraphs: [
            "I dati sono trattati per fornire il servizio ecommerce, processare ordini e spedizioni, adempiere obblighi fiscali e normativi, verificare requisiti di età per l'acquisto di bevande alcoliche, prevenire frodi e abusi, inviare comunicazioni commerciali previo consenso, effettuare analisi statistiche, migliorare il servizio e gestire campagne marketing e remarketing.",
            "La verifica dell'età può includere dati o dichiarazioni relativi alla maggiore età dell'Utente, sulla base di obblighi legali, misure precontrattuali e legittimo interesse alla tutela dell'attività commerciale.",
          ],
        },
        {
          title: "Servizi e categorie di strumenti",
          paragraphs: [
            "Il sito può utilizzare Shopify per hosting, ecommerce, carrello, checkout e gestione ordini; gateway di pagamento; Google Analytics e Google Tag Manager; Meta Pixel e Meta Ads; piattaforme email marketing o CRM; servizi anti-spam e sicurezza; provider logistici e spedizionieri.",
            "Shopify può trattare dati personali per conto del Titolare secondo i propri standard di sicurezza e conformità. Maggiori informazioni sono disponibili nella privacy policy di Shopify.",
          ],
        },
        {
          title: "Periodo di conservazione",
          paragraphs: [
            "I dati sono conservati per il tempo necessario alle finalità per cui sono raccolti: dati contrattuali e ordini per la durata del rapporto e secondo obblighi fiscali e contabili; dati marketing fino a revoca del consenso; dati analytics e cookie secondo quanto indicato nella Cookie Policy.",
            "Quando il trattamento si basa sul consenso, i dati possono essere conservati fino alla revoca. Eventuali obblighi di legge o ordini dell'autorità possono richiedere periodi più lunghi. Al termine, i dati sono cancellati o anonimizzati ove applicabile.",
          ],
        },
        {
          title: "Diritti dell'Utente",
          paragraphs: [
            "L'Utente può esercitare i diritti riconosciuti dalla normativa applicabile, inclusi accesso, consegna o trasmissione dei dati, rettifica, revoca del consenso, opposizione, limitazione del trattamento, cancellazione, portabilità e reclamo all'autorità competente.",
            "Le richieste possono essere inviate a info@thedesertrosegin.com e saranno gestite nei termini previsti dalla normativa applicabile.",
          ],
        },
        {
          title: "Ulteriori informazioni",
          paragraphs: [
            "I dati possono essere utilizzati per difesa in giudizio o nelle fasi preparatorie, per prevenire abusi del sito o adempiere ordini delle autorità.",
            "Il sito può raccogliere log di sistema per funzionamento e manutenzione. Thedesertrosegin.com non supporta le richieste Do Not Track.",
            "Il Titolare può modificare la Privacy Policy in qualunque momento pubblicando l'aggiornamento sul sito e, ove tecnicamente e legalmente possibile, informando gli Utenti.",
          ],
        },
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
      title: "Terms and Conditions of Sale",
      shortLabel: "Terms",
      sections: [
        { title: "Contracting parties and commercial policy", paragraphs: [`These Terms of Sale govern the offer and sale of products through thedesertrosegin.com and the contractual relationship between the Customer and ${COMPANY}.`, "The Customer may be a consumer or a professional purchaser. Certain provisions apply only to consumers under applicable law.", "The company may refuse abnormal, fraudulent, incomplete or unlawful orders, or orders inconsistent with its commercial policy. Links to third-party websites do not create liability for third-party services or sales."] },
        { title: "Alcohol sales and age restrictions", paragraphs: ["Products sold on the website are alcoholic beverages and may only be purchased by persons who have reached the legal minimum age in their country or jurisdiction.", "By placing an order, the Customer confirms that they meet the legal age requirement, are legally entitled to purchase and receive the products, and provide truthful, complete and current information.", "The company may refuse, suspend or cancel orders where legal requirements are not met. Age verification may be required on delivery where applicable."] },
        { title: "Application and amendments", paragraphs: ["Before purchasing, the Customer confirms that they have read and accepted these Terms of Sale, the Privacy Policy and the Cookie Policy.", "The applicable terms are those published on the website when the order is submitted. The company may update them by publishing changes on the website."] },
        { title: "Products, prices and availability", paragraphs: ["Essential product characteristics are shown on product pages. Images and colours may differ slightly because of browser, display or photographic rendering.", "Prices are those shown at checkout. Unless otherwise stated, they include applicable taxes shown at checkout and exclude shipping, customs duties, excise duties, import taxes or destination-country charges.", "Orders may be refused or cancelled in case of unavailability, errors, suspected fraud or inability to verify legal requirements."] },
        { title: "Order formation", paragraphs: ["To purchase, the Customer submits the checkout form following the website instructions.", "The sales contract is concluded when The Desert Rose Gin Co. Sagl confirms the order after verifying the data and product availability.", "Orders may be stored for fulfilment and statutory retention periods."] },
        { title: "Shipping and delivery", paragraphs: ["Products are delivered by courier to the address provided by the Customer. Delivery times are indicative and are not essential terms.", "The company is not liable for delays caused by carriers, force majeure, customs events or circumstances beyond its control.", "Risk passes to the Customer on physical delivery. The Customer is responsible for lawful import of alcoholic beverages and for local duties, excise, taxes or restrictions."] },
        { title: "Payments", paragraphs: ["Payment may be made by supported cards, PayPal, Stripe or equivalent gateways, Shop Pay, TWINT or bank transfer where expressly allowed.", "Financial data is transmitted securely to payment providers and used only to complete purchases, manage refunds or prevent fraud.", "Payments are made in the currency shown at checkout; currency conversion costs remain the Customer's responsibility."] },
        { title: "Withdrawal, returns and warranty", paragraphs: ["The Customer may withdraw within 14 calendar days of receiving the goods by written notice to info@thedesertrosegin.com or the company address.", "Goods must be returned within 14 days in original packaging, complete with accessories and delivery document. Return costs and risks are borne by the Customer.", "Refunds are made within 20 calendar days, provided the goods have been received or shipment proof is supplied. The company may deduct amounts for damage, excessive wear or loss of value.", "Withdrawal does not apply where excluded by law, including non-returnable, personalised, perishable or fully performed digital/service items.", "Legal conformity warranty applies under the Swiss Code of Obligations, without prejudice to mandatory consumer rights."] },
        { title: "Privacy, customer service, law and jurisdiction", paragraphs: ["Personal data processing is described in the Privacy Policy and Cookie Policy.", "For assistance, complaints or requests, contact info@thedesertrosegin.com.", "These Terms are governed by Swiss law, excluding the CISG. The exclusive place of jurisdiction is Lugano, Canton Ticino, Switzerland, subject to mandatory consumer protections."] },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      shortLabel: "Privacy",
      updated: "Last updated: 16 April 2026",
      sections: [
        { title: "Data Controller", paragraphs: [`The Data Controller is ${COMPANY}.`] },
        { title: "Data collected", paragraphs: ["The website may collect first name, last name, email, phone number, address, website, cookies, usage data, device technical data, order and payment data, and information or declarations required for age verification.", "Some data is necessary to provide the service, manage orders, shipping, payments and legal obligations. Failure to provide mandatory data may prevent service delivery.", "Users are responsible for any third-party personal data they provide through the website."] },
        { title: "Processing methods, place and authorised parties", paragraphs: ["Processing is carried out through IT and telematic tools with security measures designed to prevent unauthorised access, disclosure, alteration or destruction.", "Data may be accessed by internal administrative and commercial staff, authorised collaborators, technical and hosting providers, payment gateways, logistics partners, couriers, marketing, advertising and analytics providers. Where required, these parties are appointed processors.", "Data is processed at the Controller's operating premises and third-party infrastructures. Some data may be transferred outside the EU/EEA, including Canada, the United States and the United Kingdom, based on appropriate safeguards such as Standard Contractual Clauses, adequacy decisions and supplementary measures where required."] },
        { title: "Legal basis", paragraphs: ["Processing may be based on consent, performance of a contract or pre-contractual measures, compliance with legal obligations, public-interest tasks or legitimate interests of the Controller or third parties.", "Users may request clarification of the specific legal basis for each processing activity."] },
        { title: "Purposes", paragraphs: ["Data is processed to provide ecommerce services, process orders and shipments, comply with tax and regulatory obligations, verify age requirements for alcohol purchases, prevent fraud and abuse, send marketing communications with consent, perform analytics, improve the service and manage marketing or remarketing campaigns.", "Age verification may include age-related data or declarations and is based on legal obligations, pre-contractual measures and legitimate interest in protecting the business."] },
        { title: "Services and tools", paragraphs: ["The website may use Shopify for hosting, ecommerce, cart, checkout and order management; payment gateways; Google Analytics and Google Tag Manager; Meta Pixel and Meta Ads; email marketing or CRM platforms; anti-spam and security services; logistics providers and couriers.", "Shopify may process personal data on behalf of the Controller under its security and compliance standards."] },
        { title: "Retention", paragraphs: ["Data is retained for as long as necessary for the purposes collected: contractual and order data for the business relationship and statutory tax/accounting periods; marketing data until consent is withdrawn; analytics and cookie data as described in the Cookie Policy.", "Where processing is based on consent, data may be retained until withdrawal. Legal obligations or authority orders may require longer retention. After expiry, data is deleted or anonymised where applicable."] },
        { title: "User rights", paragraphs: ["Users may exercise rights under applicable law, including access, delivery or transmission of data, rectification, consent withdrawal, objection, restriction, deletion, portability and complaint to the competent authority.", "Requests may be sent to info@thedesertrosegin.com and will be handled within the applicable legal deadlines."] },
        { title: "Further information", paragraphs: ["Data may be used for legal defence, preparatory legal activities, abuse prevention or compliance with authority orders.", "The website may collect system logs for operation and maintenance. Thedesertrosegin.com does not support Do Not Track requests.", "The Controller may amend this Privacy Policy at any time by publishing the updated version on the website and, where technically and legally feasible, informing Users."] },
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
    title: "Verkaufsbedingungen",
    shortLabel: "AGB",
    sections: [
      { title: "Vertragsparteien und Geltungsbereich", paragraphs: [`Diese Verkaufsbedingungen regeln das Angebot und den Verkauf von Produkten über thedesertrosegin.com sowie das Vertragsverhältnis zwischen dem Kunden und ${COMPANY}.`, "Der Kunde kann Verbraucher oder professioneller Käufer sein. Bestimmte Regelungen gelten nur für Verbraucher, soweit dies gesetzlich vorgesehen ist. Die Gesellschaft kann ungewöhnliche, betrügerische, unvollständige oder rechtswidrige Bestellungen ablehnen."] },
      { title: "Alkoholische Produkte und Altersprüfung", paragraphs: ["Die Produkte sind alkoholische Getränke und dürfen nur von Personen erworben werden, die das gesetzliche Mindestalter in ihrem Land oder ihrer Rechtsordnung erreicht haben.", "Mit der Bestellung bestätigt der Kunde sein gesetzliches Mindestalter, seine Berechtigung zum Kauf und Empfang der Ware sowie die Richtigkeit der gemachten Angaben. Soweit anwendbar, kann bei Lieferung eine Altersprüfung erfolgen."] },
      { title: "Produkte, Preise, Bestellungen und Verfügbarkeit", paragraphs: ["Produktmerkmale werden auf den jeweiligen Produktseiten beschrieben. Bilder und Farben können aus technischen Gründen leicht abweichen.", "Maßgeblich sind die Preise im Checkout. Sofern nicht anders angegeben, verstehen sie sich einschließlich der dort ausgewiesenen Steuern, jedoch ohne Versandkosten, Zölle, Verbrauchsteuern, Einfuhrabgaben oder lokale Gebühren.", "Der Vertrag kommt zustande, wenn The Desert Rose Gin Co. Sagl die Bestellung nach Prüfung der Angaben und Verfügbarkeit bestätigt. Bei Nichtverfügbarkeit, Fehlern, Betrugsverdacht oder fehlender gesetzlicher Berechtigung kann die Bestellung abgelehnt oder storniert werden."] },
      { title: "Versand, Zahlung, Widerruf und Gewährleistung", paragraphs: ["Die Lieferung erfolgt per Kurier an die vom Kunden angegebene Adresse. Lieferzeiten sind unverbindliche Richtwerte. Das Risiko geht mit der physischen Übergabe auf den Kunden über.", "Zahlungen können über unterstützte Karten, PayPal, Stripe oder gleichwertige Anbieter, Shop Pay, TWINT oder, sofern ausdrücklich erlaubt, per Banküberweisung erfolgen.", "Der Kunde kann binnen 14 Kalendertagen ab Erhalt der Ware schriftlich widerrufen. Die Rücksendung erfolgt innerhalb von 14 Tagen in Originalverpackung auf Kosten und Risiko des Kunden. Eine Erstattung erfolgt binnen 20 Kalendertagen nach Warenerhalt oder Versandnachweis. Gesetzliche Ausschlüsse des Widerrufsrechts bleiben vorbehalten.", "Die gesetzliche Gewährleistung gilt nach schweizerischem Obligationenrecht, unbeschadet zwingender Verbraucherrechte."] },
      { title: "Datenschutz, Kundendienst, Recht und Gerichtsstand", paragraphs: ["Die Verarbeitung personenbezogener Daten ist in der Datenschutzerklärung und der Cookie-Richtlinie beschrieben.", "Für Unterstützung, Beschwerden oder Anfragen kontaktieren Sie info@thedesertrosegin.com.", "Es gilt schweizerisches Recht unter Ausschluss des CISG. Ausschließlicher Gerichtsstand ist Lugano, Kanton Tessin, Schweiz, vorbehaltlich zwingender Verbraucherrechte."] },
    ],
  },
  privacy: {
    title: "Datenschutzerklärung",
    shortLabel: "Datenschutz",
    updated: "Letzte Änderung: 16. April 2026",
    sections: [
      { title: "Verantwortlicher und erhobene Daten", paragraphs: [`Verantwortlicher ist ${COMPANY}.`, "Die Website kann Name, Nachname, E-Mail, Telefonnummer, Adresse, Website, Cookies, Nutzungsdaten, technische Gerätedaten, Bestell- und Zahlungsdaten sowie Angaben zur Altersprüfung verarbeiten.", "Einige Daten sind für Bestellung, Zahlung, Lieferung, gesetzliche Pflichten und Altersprüfung erforderlich. Ohne Pflichtangaben kann der Dienst nicht bereitgestellt werden."] },
      { title: "Zwecke und Rechtsgrundlagen", paragraphs: ["Daten werden verarbeitet, um den E-Commerce-Dienst bereitzustellen, Bestellungen und Lieferungen abzuwickeln, steuerliche und regulatorische Pflichten zu erfüllen, Altersanforderungen für Alkoholkauf zu prüfen, Betrug zu verhindern, Marketing mit Einwilligung zu versenden, Statistiken zu erstellen und den Dienst zu verbessern.", "Rechtsgrundlagen sind Einwilligung, Vertragserfüllung oder vorvertragliche Maßnahmen, gesetzliche Pflichten, öffentliches Interesse und berechtigte Interessen des Verantwortlichen oder Dritter."] },
      { title: "Empfänger, Dienste und internationale Übermittlung", paragraphs: ["Zugriff erhalten können interne Verwaltungs- und Vertriebsmitarbeiter, autorisierte Mitarbeitende, technische und Hosting-Anbieter, Zahlungsdienstleister, Logistikpartner, Versanddienstleister sowie Marketing-, Werbe- und Analyseanbieter.", "Die Website kann Shopify, Zahlungs-Gateways, Google Analytics, Google Tag Manager, Meta Pixel, Meta Ads, E-Mail-Marketing- oder CRM-Plattformen, Sicherheitsdienste und Logistikdienstleister nutzen.", "Daten können unter geeigneten Garantien, etwa Standardvertragsklauseln, Angemessenheitsbeschlüssen und zusätzlichen Schutzmaßnahmen, in Länder außerhalb der EU/des EWR übermittelt werden."] },
      { title: "Aufbewahrung und Rechte", paragraphs: ["Daten werden nur so lange aufbewahrt, wie es für die Zwecke erforderlich ist: Vertrags- und Bestelldaten für die Geschäftsbeziehung und gesetzliche Steuer- und Buchhaltungsfristen, Marketingdaten bis zum Widerruf, Analyse- und Cookie-Daten gemäß Cookie-Richtlinie.", "Nutzer können Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit, Widerruf der Einwilligung und Beschwerde bei der zuständigen Behörde verlangen. Anfragen sind an info@thedesertrosegin.com zu richten."] },
      { title: "Weitere Informationen", paragraphs: ["Daten können zur Rechtsverteidigung, Missbrauchsprävention, Systemwartung und Erfüllung behördlicher Anordnungen verwendet werden. Thedesertrosegin.com unterstützt keine Do-Not-Track-Anfragen.", "Der Verantwortliche kann diese Datenschutzerklärung durch Veröffentlichung auf der Website ändern."] },
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
    title: "Conditions Générales de Vente",
    shortLabel: "Conditions",
    sections: [
      { title: "Parties au contrat et champ d'application", paragraphs: [`Les présentes Conditions de Vente régissent l'offre et la vente des produits via thedesertrosegin.com ainsi que la relation contractuelle entre le Client et ${COMPANY}.`, "Le Client peut être un consommateur ou un acheteur professionnel. Certaines dispositions s'appliquent uniquement aux consommateurs conformément au droit applicable. La société peut refuser les commandes anormales, frauduleuses, incomplètes ou contraires à la loi ou à sa politique commerciale."] },
      { title: "Produits alcoolisés et restrictions d'âge", paragraphs: ["Les produits vendus sont des boissons alcoolisées et ne peuvent être achetés que par des personnes ayant atteint l'âge légal minimum dans leur pays ou juridiction.", "En passant commande, le Client confirme qu'il remplit les conditions d'âge, qu'il est autorisé à acheter et recevoir les produits et que les informations fournies sont exactes, complètes et à jour. Une vérification de l'âge peut être demandée à la livraison."] },
      { title: "Produits, prix, commandes et livraison", paragraphs: ["Les caractéristiques essentielles des produits figurent sur les fiches produit. Les images et couleurs peuvent varier légèrement pour des raisons techniques.", "Les prix applicables sont ceux indiqués au checkout. Sauf indication contraire, ils incluent les taxes affichées au checkout et excluent les frais de livraison, droits de douane, accises, taxes d'importation ou charges locales.", "Le contrat est conclu lorsque The Desert Rose Gin Co. Sagl confirme la commande après vérification des données et de la disponibilité. Les délais de livraison sont indicatifs et le risque est transféré lors de la remise physique des produits."] },
      { title: "Paiement, rétractation, retours et garantie", paragraphs: ["Le paiement peut être effectué par cartes acceptées, PayPal, Stripe ou passerelles équivalentes, Shop Pay, TWINT ou virement bancaire lorsque cela est expressément autorisé.", "Le Client peut exercer un droit de rétractation dans les 14 jours calendaires suivant la réception. Les produits doivent être retournés dans les 14 jours, dans leur emballage d'origine, aux frais et risques du Client. Le remboursement intervient dans les 20 jours calendaires après réception des produits ou preuve d'expédition.", "Les exclusions légales du droit de rétractation demeurent applicables. La garantie légale de conformité s'applique selon le droit suisse, sous réserve des droits impératifs du consommateur."] },
      { title: "Données personnelles, droit applicable et juridiction", paragraphs: ["Le traitement des données personnelles est décrit dans la Politique de Confidentialité et la Politique relative aux Cookies.", "Pour toute demande, contactez info@thedesertrosegin.com.", "Les présentes conditions sont régies par le droit suisse, à l'exclusion de la CVIM. Le for exclusif est Lugano, Canton du Tessin, Suisse, sous réserve des protections impératives du consommateur."] },
    ],
  },
  privacy: {
    title: "Politique de Confidentialité",
    shortLabel: "Confidentialité",
    updated: "Dernière modification : 16 avril 2026",
    sections: [
      { title: "Responsable du traitement et données collectées", paragraphs: [`Le Responsable du traitement est ${COMPANY}.`, "Le site peut collecter nom, prénom, email, téléphone, adresse, site web, cookies, données d'utilisation, données techniques de l'appareil, données de commande et de paiement, ainsi que les informations nécessaires à la vérification de l'âge.", "Certaines données sont nécessaires pour fournir le service, gérer les commandes, paiements, livraisons, obligations légales et contrôles d'âge."] },
      { title: "Finalités et bases juridiques", paragraphs: ["Les données sont traitées pour fournir le service ecommerce, traiter commandes et expéditions, respecter les obligations fiscales et réglementaires, vérifier l'âge pour l'achat d'alcool, prévenir fraudes et abus, envoyer des communications marketing avec consentement, réaliser des statistiques et améliorer le service.", "Les bases juridiques peuvent être le consentement, l'exécution d'un contrat ou de mesures précontractuelles, une obligation légale, l'intérêt public ou l'intérêt légitime du Responsable ou de tiers."] },
      { title: "Destinataires, services et transferts", paragraphs: ["Les données peuvent être accessibles au personnel interne autorisé, prestataires techniques et d'hébergement, passerelles de paiement, partenaires logistiques, transporteurs et prestataires marketing, publicité ou analytics.", "Le site peut utiliser Shopify, passerelles de paiement, Google Analytics, Google Tag Manager, Meta Pixel, Meta Ads, plateformes email marketing ou CRM, services de sécurité et prestataires logistiques.", "Des transferts hors UE/EEE peuvent avoir lieu avec des garanties appropriées, notamment clauses contractuelles types, décisions d'adéquation et mesures supplémentaires."] },
      { title: "Conservation et droits", paragraphs: ["Les données sont conservées pour la durée nécessaire : données contractuelles et commandes pendant la relation commerciale et les délais fiscaux/comptables, données marketing jusqu'au retrait du consentement, données analytics et cookies selon la Cookie Policy.", "L'Utilisateur peut demander accès, rectification, effacement, limitation, opposition, portabilité, retrait du consentement et introduire une réclamation auprès de l'autorité compétente. Les demandes sont envoyées à info@thedesertrosegin.com."] },
      { title: "Informations complémentaires", paragraphs: ["Les données peuvent être utilisées pour la défense en justice, la prévention des abus, la maintenance système ou le respect d'ordres d'autorités. Thedesertrosegin.com ne prend pas en charge les demandes Do Not Track.", "Le Responsable peut modifier cette politique en publiant la version mise à jour sur le site."] },
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
    title: "Términos y Condiciones de Venta",
    shortLabel: "Términos",
    sections: [
      { title: "Partes del contrato y ámbito", paragraphs: [`Estos Términos de Venta regulan la oferta y venta de productos a través de thedesertrosegin.com y la relación contractual entre el Cliente y ${COMPANY}.`, "El Cliente puede ser consumidor o comprador profesional. Algunas disposiciones se aplican solo a consumidores conforme a la ley aplicable. La sociedad puede rechazar pedidos anómalos, fraudulentos, incompletos, ilícitos o contrarios a su política comercial."] },
      { title: "Alcohol y restricciones de edad", paragraphs: ["Los productos vendidos son bebidas alcohólicas y solo pueden ser adquiridos por personas que hayan alcanzado la edad mínima legal en su país o jurisdicción.", "Al realizar un pedido, el Cliente confirma que cumple la edad legal, que está autorizado a comprar y recibir los productos y que la información facilitada es veraz, completa y actual. Puede exigirse verificación de edad en la entrega."] },
      { title: "Productos, precios, pedidos y entrega", paragraphs: ["Las características esenciales de los productos aparecen en las fichas de producto. Imágenes y colores pueden variar ligeramente por razones técnicas.", "Los precios aplicables son los indicados en el checkout. Salvo indicación contraria, incluyen los impuestos mostrados en checkout y excluyen envío, aduanas, accisas, impuestos de importación o cargos locales.", "El contrato se concluye cuando The Desert Rose Gin Co. Sagl confirma el pedido tras verificar datos y disponibilidad. Los plazos de entrega son orientativos y el riesgo se transmite con la entrega física."] },
      { title: "Pago, desistimiento, devoluciones y garantía", paragraphs: ["El pago puede realizarse con tarjetas admitidas, PayPal, Stripe o pasarelas equivalentes, Shop Pay, TWINT o transferencia bancaria si se permite expresamente.", "El Cliente puede desistir dentro de los 14 días naturales desde la recepción. Los productos deben devolverse en 14 días, en embalaje original, a costa y riesgo del Cliente. El reembolso se efectúa en 20 días naturales tras recibir la mercancía o prueba de envío.", "Se mantienen las exclusiones legales del desistimiento. La garantía legal de conformidad se aplica conforme al derecho suizo, sin perjuicio de derechos imperativos del consumidor."] },
      { title: "Privacidad, atención al cliente, ley y jurisdicción", paragraphs: ["El tratamiento de datos personales se describe en la Política de Privacidad y la Política de Cookies.", "Para asistencia, reclamaciones o solicitudes, contacte con info@thedesertrosegin.com.", "Estos términos se rigen por la ley suiza, excluida la CISG. El foro exclusivo es Lugano, Cantón del Tesino, Suiza, sin perjuicio de protecciones imperativas del consumidor."] },
    ],
  },
  privacy: {
    title: "Política de Privacidad",
    shortLabel: "Privacidad",
    updated: "Última modificación: 16 de abril de 2026",
    sections: [
      { title: "Responsable y datos recogidos", paragraphs: [`El Responsable del tratamiento es ${COMPANY}.`, "El sitio puede recoger nombre, apellidos, email, teléfono, dirección, sitio web, cookies, datos de uso, datos técnicos del dispositivo, datos de pedido y pago, e información necesaria para verificar la edad.", "Algunos datos son necesarios para prestar el servicio, gestionar pedidos, pagos, envíos, obligaciones legales y verificación de edad."] },
      { title: "Finalidades y bases jurídicas", paragraphs: ["Los datos se tratan para prestar el servicio ecommerce, procesar pedidos y envíos, cumplir obligaciones fiscales y regulatorias, verificar requisitos de edad para alcohol, prevenir fraude y abuso, enviar marketing con consentimiento, realizar estadísticas y mejorar el servicio.", "Las bases jurídicas pueden ser consentimiento, ejecución contractual o medidas precontractuales, obligación legal, interés público o interés legítimo del Responsable o terceros."] },
      { title: "Destinatarios, servicios y transferencias", paragraphs: ["Pueden acceder a los datos personal interno autorizado, proveedores técnicos y hosting, pasarelas de pago, socios logísticos, transportistas y proveedores de marketing, publicidad o analytics.", "El sitio puede utilizar Shopify, pasarelas de pago, Google Analytics, Google Tag Manager, Meta Pixel, Meta Ads, plataformas email marketing o CRM, servicios de seguridad y proveedores logísticos.", "Pueden producirse transferencias fuera de la UE/EEE con garantías adecuadas, incluidas cláusulas contractuales tipo, decisiones de adecuación y medidas suplementarias."] },
      { title: "Conservación y derechos", paragraphs: ["Los datos se conservan durante el tiempo necesario: datos contractuales y pedidos durante la relación y plazos fiscales/contables, datos marketing hasta retirada del consentimiento, datos analytics y cookies según la Cookie Policy.", "El Usuario puede solicitar acceso, rectificación, supresión, limitación, oposición, portabilidad, retirada del consentimiento y reclamación ante la autoridad competente. Las solicitudes se envían a info@thedesertrosegin.com."] },
      { title: "Información adicional", paragraphs: ["Los datos pueden utilizarse para defensa legal, prevención de abusos, mantenimiento del sistema o cumplimiento de órdenes de autoridades. Thedesertrosegin.com no admite solicitudes Do Not Track.", "El Responsable puede modificar esta política publicando la versión actualizada en el sitio."] },
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
    title: "شروط وأحكام البيع",
    shortLabel: "الشروط",
    sections: [
      { title: "أطراف العقد ونطاق التطبيق", paragraphs: [`تنظم هذه الشروط عرض المنتجات وبيعها عبر thedesertrosegin.com والعلاقة التعاقدية بين العميل و ${COMPANY}.`, "يجوز أن يكون العميل مستهلكا أو مشتريا مهنيا. وتطبق بعض الأحكام على المستهلكين فقط وفقا للقانون المعمول به. يجوز للشركة رفض الطلبات غير العادية أو الاحتيالية أو الناقصة أو غير القانونية أو المخالفة لسياستها التجارية."] },
      { title: "المنتجات الكحولية وقيود السن", paragraphs: ["المنتجات المعروضة هي مشروبات كحولية ولا يجوز شراؤها إلا من أشخاص بلغوا السن القانونية الدنيا في بلدهم أو ولايتهم القضائية.", "بتقديم الطلب، يؤكد العميل استيفاء شرط السن القانوني، وأهليته لشراء المنتجات واستلامها، وصحة البيانات المقدمة واكتمالها وحداثتها. وقد تطلب الشركة التحقق من السن عند التسليم حيثما ينطبق ذلك."] },
      { title: "المنتجات والأسعار والطلبات والتسليم", paragraphs: ["توضح صفحات المنتجات الخصائص الأساسية. وقد تختلف الصور والألوان قليلا لأسباب تقنية.", "الأسعار المعتمدة هي الأسعار المعروضة عند الدفع. وما لم يذكر خلاف ذلك، فهي تشمل الضرائب المعروضة في صفحة الدفع ولا تشمل الشحن أو الرسوم الجمركية أو الضرائب الانتقائية أو ضرائب الاستيراد أو الرسوم المحلية.", "ينعقد العقد عند تأكيد The Desert Rose Gin Co. Sagl للطلب بعد التحقق من البيانات والتوافر. أوقات التسليم إرشادية وينتقل الخطر عند التسليم الفعلي."] },
      { title: "الدفع والانسحاب والإرجاع والضمان", paragraphs: ["يمكن الدفع بالبطاقات المدعومة أو PayPal أو Stripe أو بوابات دفع مماثلة أو Shop Pay أو TWINT أو التحويل البنكي إذا سمح بذلك صراحة.", "يجوز للعميل الانسحاب خلال 14 يوما تقويميا من استلام البضائع. يجب إعادة المنتجات خلال 14 يوما في عبوتها الأصلية وعلى نفقة ومسؤولية العميل. يتم رد المبالغ خلال 20 يوما تقويميا بعد استلام البضائع أو إثبات الشحن.", "تبقى الاستثناءات القانونية من حق الانسحاب سارية. يطبق ضمان المطابقة القانوني بموجب القانون السويسري مع عدم الإخلال بحقوق المستهلك الإلزامية."] },
      { title: "الخصوصية وخدمة العملاء والقانون والاختصاص", paragraphs: ["يرد وصف معالجة البيانات الشخصية في سياسة الخصوصية وسياسة ملفات تعريف الارتباط.", "للمساعدة أو الشكاوى أو الطلبات يرجى التواصل عبر info@thedesertrosegin.com.", "تخضع هذه الشروط للقانون السويسري مع استبعاد اتفاقية البيع الدولي للبضائع. يكون الاختصاص الحصري للوجانو، كانتون تيتشينو، سويسرا، مع مراعاة حقوق المستهلك الإلزامية."] },
    ],
  },
  privacy: {
    title: "سياسة الخصوصية",
    shortLabel: "الخصوصية",
    updated: "آخر تحديث: 16 أبريل 2026",
    sections: [
      { title: "المتحكم في البيانات والبيانات المجمعة", paragraphs: [`المتحكم في البيانات هو ${COMPANY}.`, "قد يجمع الموقع الاسم واللقب والبريد الإلكتروني ورقم الهاتف والعنوان والموقع الإلكتروني وملفات تعريف الارتباط وبيانات الاستخدام والبيانات التقنية للجهاز وبيانات الطلب والدفع والمعلومات اللازمة للتحقق من السن.", "بعض البيانات ضرورية لتقديم الخدمة وإدارة الطلبات والمدفوعات والشحن والالتزامات القانونية والتحقق من السن."] },
      { title: "الأغراض والأسس القانونية", paragraphs: ["تعالج البيانات لتقديم خدمة التجارة الإلكترونية ومعالجة الطلبات والشحنات والامتثال للالتزامات الضريبية والتنظيمية والتحقق من شروط السن لشراء الكحول ومنع الاحتيال وإرسال التسويق بموافقة المستخدم وإجراء الإحصاءات وتحسين الخدمة.", "قد تستند المعالجة إلى الموافقة أو تنفيذ عقد أو إجراءات سابقة للتعاقد أو التزام قانوني أو مصلحة عامة أو مصلحة مشروعة للمتحكم أو أطراف ثالثة."] },
      { title: "المستلمون والخدمات والتحويلات", paragraphs: ["قد تصل إلى البيانات فرق داخلية مصرح لها ومزودو التقنية والاستضافة وبوابات الدفع والشركاء اللوجستيون وشركات الشحن ومقدمو التسويق والإعلانات والتحليلات.", "قد يستخدم الموقع Shopify وبوابات الدفع وGoogle Analytics وGoogle Tag Manager وMeta Pixel وMeta Ads ومنصات البريد أو CRM وخدمات الأمان ومقدمي الخدمات اللوجستية.", "قد تتم تحويلات خارج الاتحاد الأوروبي أو المنطقة الاقتصادية الأوروبية بضمانات مناسبة مثل البنود التعاقدية القياسية وقرارات الملاءمة والتدابير الإضافية."] },
      { title: "الاحتفاظ والحقوق", paragraphs: ["تحتفظ الشركة بالبيانات للمدة اللازمة: بيانات العقود والطلبات طوال العلاقة والفترات الضريبية والمحاسبية، وبيانات التسويق حتى سحب الموافقة، وبيانات التحليلات والكوكيز وفقا لسياسة الكوكيز.", "يمكن للمستخدم طلب الوصول أو التصحيح أو الحذف أو التقييد أو الاعتراض أو النقل أو سحب الموافقة أو تقديم شكوى إلى الجهة المختصة. ترسل الطلبات إلى info@thedesertrosegin.com."] },
      { title: "معلومات إضافية", paragraphs: ["قد تستخدم البيانات للدفاع القانوني أو منع إساءة الاستخدام أو صيانة النظام أو الامتثال لأوامر السلطات. لا يدعم thedesertrosegin.com طلبات Do Not Track.", "يجوز للمتحكم تعديل هذه السياسة بنشر النسخة المحدثة على الموقع."] },
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
