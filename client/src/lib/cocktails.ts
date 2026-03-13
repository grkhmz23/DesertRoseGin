import cocktailChiliPassion from "@assets/cocktails/Chili_Passion_Desert_Martini_LR_RGB_1765314255791.webp";
import cocktailDesertAperitif from "@assets/cocktails/Desert_Aperitif_LR_RGB_1765314255792.webp";
import cocktailDesertAviation from "@assets/cocktails/Desert_Aviation_LR_RGB_1765314255793.webp";
import cocktailDesertOnRock from "@assets/cocktails/Desert_On_the_Rock_LR_RGB_1765314255793.webp";
import cocktailOrangeSpritz from "@assets/cocktails/Desert_Orange_Spritz_LR_RGB_1765314255794.webp";
import cocktailPineappleBullet from "@assets/cocktails/Desert_Pineapple_Bullet_LR_RGB_1765314255794.webp";
import cocktailRoseBeer from "@assets/cocktails/Desert_Rose_Beer_LR_RGB_1765314255795.webp";
import cocktailGinTonic from "@assets/cocktails/Desert_Rose_Gin_Tonic_LR_RGB_1765314255796.webp";
import cocktailRoseCollins from "@assets/cocktails/Desert_Rose_Collins_LR_RGB_1765314255796.webp";
import cocktailRoseMartini from "@assets/cocktails/Desert_Rose_Martini_LR_RGB_1765314255797.webp";
import cocktailRoseNegroni from "@assets/cocktails/Desert_Rose_Negroni_LR_RGB_1765314255798.webp";
import cocktailRoseParadise from "@assets/cocktails/Desert_Rose_Paradise_LR_RGB_1765314255798.webp";
import cocktailSpringNegroni from "@assets/cocktails/Desert_Spring_Negroni_LR_RGB_1765314255799.webp";
import cocktailSunset from "@assets/cocktails/Desert_Sunset_LR_RGB_1765314255799.webp";
import cocktailTangerineFrench75 from "@assets/cocktails/Desert_Tangerine_French_75_LR_RGB_1765314255800.webp";
import cocktailMediterraneanTonic from "@assets/cocktails/Mediterranean_Desert_Tonic_LR_RGB_1765314255800.webp";
import cocktailSpanishRoseTonic from "@assets/cocktails/Spanish_Rose_Gin_Tonic_LR_RGB_1765314255801.webp";
import cocktailRedDesert from "@assets/cocktails/The_Red_Desert_LR_RGB_1765314255801.webp";
import cocktailWhiteNegroni from "@assets/cocktails/White_Desert_Negroni_LR_RGB_1765314255801.webp";

export interface CocktailAsset {
  id: string;
  title: string;
  description: string;
  pdf: string;
  image: string;
  tags?: string[];
}

export const cocktailAssets: CocktailAsset[] = [
  { id: "cocktail-desert-rose-gin-tonic", title: "Desert Rose Gin Tonic", description: "A bright, floral signature serve built around our desert botanicals with a crisp, refreshing finish.", pdf: "/pdf/cocktails/Desert Rose Gin Tonic (1).pdf", image: cocktailGinTonic, tags: ["Signature", "Tonic"] },
  { id: "cocktail-desert-rose-collins", title: "Desert Rose Collins", description: "A long and sparkling highball with lifted citrus, balanced sweetness, and a clean botanical backbone.", pdf: "/pdf/cocktails/Desert Rose Collins.pdf", image: cocktailRoseCollins, tags: ["Collins", "Sparkling"] },
  { id: "cocktail-mediterranean-desert-tonic", title: "Mediterranean Desert Tonic", description: "An herbaceous tonic serve that blends desert warmth with aromatic Mediterranean freshness.", pdf: "/pdf/cocktails/Mediterranean Desert Tonic.pdf", image: cocktailMediterraneanTonic, tags: ["Herbal", "Refreshing"] },
  { id: "cocktail-desert-on-the-rock", title: "Desert On the Rock", description: "A stripped-back, spirit-forward pour served over ice to let the gin’s structure speak clearly.", pdf: "/pdf/cocktails/Desert On the Rock.pdf", image: cocktailDesertOnRock, tags: ["Pure", "Strong"] },
  { id: "cocktail-desert-rose-negroni", title: "Desert Rose Negroni", description: "A bittersweet classic with floral accents and a richer, more perfumed desert-inspired profile.", pdf: "/pdf/cocktails/Desert Rose Negroni.pdf", image: cocktailRoseNegroni, tags: ["Negroni", "Bitter"] },
  { id: "chili-passion-desert", title: "Chili Passion Desert", description: "Passion fruit sweetness meets a controlled chili kick for a bold tropical-spiced cocktail.", pdf: "/pdf/cocktails/Chili Passion Desert.pdf", image: cocktailChiliPassion, tags: ["Spicy", "Exotic"] },
  { id: "desert-aviation", title: "Desert Aviation", description: "A delicate, aromatic serve with lifted citrus and floral notes that keep the finish elegant.", pdf: "/pdf/cocktails/Desert Aviation.pdf", image: cocktailDesertAviation, tags: ["Floral", "Classic"] },
  { id: "desert-tangerine-french-75", title: "Desert Tangerine French 75", description: "A bright sparkling cocktail with tangerine-led citrus and a celebratory, refined texture.", pdf: "/pdf/cocktails/Desert Tangerine French 75 (1).pdf", image: cocktailTangerineFrench75, tags: ["Sparkling", "Citrus"] },
  { id: "desert-orange-spritz", title: "Desert Orange Spritz", description: "A vibrant, bubbly aperitivo with juicy orange character and an easy sunset-drinking feel.", pdf: "/pdf/cocktails/Desert Orange Spritz.pdf", image: cocktailOrangeSpritz, tags: ["Spritz", "Summer"] },
  { id: "desert-rose-beer", title: "Desert Rose Beer", description: "An unexpected fusion where botanical gin complexity meets crisp beer refreshment.", pdf: "/pdf/cocktails/Desert Rose Beer.pdf", image: cocktailRoseBeer, tags: ["Fusion", "Highball"] },
  { id: "desert-aperitif", title: "Desert Aperitif", description: "Light, aromatic, and palate-awakening, designed to open the evening with precision.", pdf: "/pdf/cocktails/Desert Aperitif.pdf", image: cocktailDesertAperitif, tags: ["Aperitif", "Light"] },
  { id: "white-desert-negroni", title: "White Desert Negroni", description: "A lighter, clearer take on the Negroni where floral notes and white vermouth stay in focus.", pdf: "/pdf/cocktails/White Desert Negroni.pdf", image: cocktailWhiteNegroni, tags: ["Negroni", "Modern"] },
  { id: "the-red-desert", title: "The Red Desert", description: "A bold crimson cocktail with ripe fruit depth balanced by a dry and structured gin finish.", pdf: "/pdf/cocktails/The Red Desert.pdf", image: cocktailRedDesert, tags: ["Fruity", "Bold"] },
  { id: "spanish-rose-gin-tonic", title: "Spanish Rose Gin Tonic", description: "A copa-style gin and tonic built for garnish, aroma, and a more expansive drinking ritual.", pdf: "/pdf/cocktails/Spanish Rose Gin Tonic.pdf", image: cocktailSpanishRoseTonic, tags: ["Tonic", "Copa"] },
  { id: "desert-spring-negroni", title: "Desert Spring Negroni", description: "A fresher, greener expression of the classic with a lighter seasonal character.", pdf: "/pdf/cocktails/Desert Spring Negroni.pdf", image: cocktailSpringNegroni, tags: ["Seasonal", "Fresh"] },
  { id: "desert-sunset", title: "Desert Sunset", description: "Layered, warm, and visually rich, inspired by the colour gradient of dusk over the dunes.", pdf: "/pdf/cocktails/Desert Sunset.pdf", image: cocktailSunset, tags: ["Sweet", "Visual"] },
  { id: "desert-pineapple-bullet", title: "Desert Pineapple Bullet", description: "A tropical-forward mix with roasted pineapple character and a sharper dry finish.", pdf: "/pdf/cocktails/Desert Pineapple Bullet.pdf", image: cocktailPineappleBullet, tags: ["Tropical", "Punch"] },
  { id: "desert-rose-martini", title: "Desert Rose Martini", description: "A cold, precise martini expression with a polished floral signature.", pdf: "/pdf/cocktails/Desert Rose Martini.pdf", image: cocktailRoseMartini, tags: ["Martini", "Elegant"] },
  { id: "desert-rose-paradise", title: "Desert Rose Paradise", description: "A soft, lush, fruit-led cocktail designed to feel rich, easy, and escapist.", pdf: "/pdf/cocktails/Desert Rose Paradise.pdf", image: cocktailRoseParadise, tags: ["Fruity", "Sweet"] },
];

export const cocktailAssetById = Object.fromEntries(
  cocktailAssets.map((cocktail) => [cocktail.id, cocktail]),
) as Record<string, CocktailAsset>;

const cocktailTranslations: Record<string, Record<string, Pick<CocktailAsset, "title" | "description" | "tags">>> = {
  en: Object.fromEntries(
    cocktailAssets.map(({ id, title, description, tags }) => [id, { title, description, tags: tags ?? [] }]),
  ),
  it: {
    "cocktail-desert-rose-gin-tonic": { title: "Desert Rose Gin Tonic", description: "Un signature drink luminoso e floreale che esalta i nostri botanici del deserto con un finale fresco e netto.", tags: ["Signature", "Tonic"] },
    "cocktail-desert-rose-collins": { title: "Desert Rose Collins", description: "Un highball lungo e frizzante con agrumi vivaci, dolcezza equilibrata e una base botanica pulita.", tags: ["Collins", "Frizzante"] },
    "cocktail-mediterranean-desert-tonic": { title: "Mediterranean Desert Tonic", description: "Un tonic erbaceo che unisce il calore del deserto alla freschezza aromatica mediterranea.", tags: ["Erbaceo", "Rinfrescante"] },
    "cocktail-desert-on-the-rock": { title: "Desert On the Rock", description: "Un servizio essenziale e deciso, versato sul ghiaccio per lasciare parlare chiaramente la struttura del gin.", tags: ["Puro", "Intenso"] },
    "cocktail-desert-rose-negroni": { title: "Desert Rose Negroni", description: "Un classico agrodolce con accenti floreali e un profilo desertico più ricco e profumato.", tags: ["Negroni", "Amaro"] },
    "chili-passion-desert": { title: "Chili Passion Desert", description: "La dolcezza del frutto della passione incontra un tocco controllato di chili in un cocktail tropicale e speziato.", tags: ["Speziato", "Esotico"] },
    "desert-aviation": { title: "Desert Aviation", description: "Un drink delicato e aromatico con agrumi sollevati e note floreali che mantengono il finale elegante.", tags: ["Floreale", "Classico"] },
    "desert-tangerine-french-75": { title: "Desert Tangerine French 75", description: "Un cocktail frizzante e luminoso, guidato dal mandarino, con una texture raffinata e celebrativa.", tags: ["Frizzante", "Agrumato"] },
    "desert-orange-spritz": { title: "Desert Orange Spritz", description: "Un aperitivo vibrante e leggermente effervescente con carattere d'arancia succosa e anima da tramonto.", tags: ["Spritz", "Estivo"] },
    "desert-rose-beer": { title: "Desert Rose Beer", description: "Una fusione inattesa in cui la complessità botanica del gin incontra la freschezza della birra.", tags: ["Fusione", "Highball"] },
    "desert-aperitif": { title: "Desert Aperitif", description: "Leggero, aromatico e capace di risvegliare il palato, pensato per aprire la serata con precisione.", tags: ["Aperitivo", "Leggero"] },
    "white-desert-negroni": { title: "White Desert Negroni", description: "Una lettura più chiara e leggera del Negroni, dove le note floreali e il vermouth bianco restano protagonisti.", tags: ["Negroni", "Moderno"] },
    "the-red-desert": { title: "The Red Desert", description: "Un cocktail cremisi e deciso, con profondità fruttata bilanciata da un finale di gin asciutto e strutturato.", tags: ["Fruttato", "Deciso"] },
    "spanish-rose-gin-tonic": { title: "Spanish Rose Gin Tonic", description: "Un gin tonic in stile copa, pensato per guarnizioni abbondanti, aroma e un rituale di degustazione più ampio.", tags: ["Tonic", "Copa"] },
    "desert-spring-negroni": { title: "Desert Spring Negroni", description: "Un'interpretazione più fresca e verde del classico, con un carattere stagionale più leggero.", tags: ["Stagionale", "Fresco"] },
    "desert-sunset": { title: "Desert Sunset", description: "Caldo, stratificato e visivamente ricco, ispirato al gradiente del tramonto sulle dune.", tags: ["Dolce", "Scenografico"] },
    "desert-pineapple-bullet": { title: "Desert Pineapple Bullet", description: "Un mix dal profilo tropicale con ananas arrostito e un finale più secco e affilato.", tags: ["Tropicale", "Punch"] },
    "desert-rose-martini": { title: "Desert Rose Martini", description: "Un martini freddo e preciso con una firma floreale elegante e pulita.", tags: ["Martini", "Elegante"] },
    "desert-rose-paradise": { title: "Desert Rose Paradise", description: "Un cocktail morbido, ricco e fruttato, pensato per risultare avvolgente, facile e d'evasione.", tags: ["Fruttato", "Dolce"] },
  },
  de: {
    "cocktail-desert-rose-gin-tonic": { title: "Desert Rose Gin Tonic", description: "Ein heller, floraler Signature-Serve, der unsere Wüstenbotanicals mit einem frischen, klaren Finish hervorhebt.", tags: ["Signature", "Tonic"] },
    "cocktail-desert-rose-collins": { title: "Desert Rose Collins", description: "Ein langer, spritziger Highball mit gehobener Zitrusfrische, ausgewogener Süße und sauberem botanischem Rückgrat.", tags: ["Collins", "Spritzig"] },
    "cocktail-mediterranean-desert-tonic": { title: "Mediterranean Desert Tonic", description: "Ein kräuterbetonter Tonic-Serve, der Wüstenwärme mit mediterraner Aromafrishe verbindet.", tags: ["Kräuterig", "Erfrischend"] },
    "cocktail-desert-on-the-rock": { title: "Desert On the Rock", description: "Ein reduzierter, spirituosenbetonter Serve auf Eis, damit die Struktur des Gins klar zur Geltung kommt.", tags: ["Pur", "Kräftig"] },
    "cocktail-desert-rose-negroni": { title: "Desert Rose Negroni", description: "Ein bittersüßer Klassiker mit floralen Akzenten und einem reicheren, parfümierten Wüstenprofil.", tags: ["Negroni", "Bitter"] },
    "chili-passion-desert": { title: "Chili Passion Desert", description: "Die Süße von Passionsfrucht trifft auf einen kontrollierten Chili-Kick für einen mutigen tropisch-würzigen Cocktail.", tags: ["Würzig", "Exotisch"] },
    "desert-aviation": { title: "Desert Aviation", description: "Ein feiner, aromatischer Drink mit heller Zitrusnote und floralen Nuancen für ein elegantes Finish.", tags: ["Floral", "Klassisch"] },
    "desert-tangerine-french-75": { title: "Desert Tangerine French 75", description: "Ein heller, perlender Cocktail mit Tangerinenfokus und raffinierter, festlicher Textur.", tags: ["Spritzig", "Zitrus"] },
    "desert-orange-spritz": { title: "Desert Orange Spritz", description: "Ein lebendiger, prickelnder Aperitivo mit saftiger Orangennote und leichtem Sunset-Charakter.", tags: ["Spritz", "Sommer"] },
    "desert-rose-beer": { title: "Desert Rose Beer", description: "Eine unerwartete Fusion, in der botanische Gin-Komplexität auf die Frische von Bier trifft.", tags: ["Fusion", "Highball"] },
    "desert-aperitif": { title: "Desert Aperitif", description: "Leicht, aromatisch und den Gaumen weckend, entwickelt um den Abend präzise zu eröffnen.", tags: ["Aperitif", "Leicht"] },
    "white-desert-negroni": { title: "White Desert Negroni", description: "Eine hellere, klarere Interpretation des Negroni, bei der florale Noten und weißer Wermut im Fokus bleiben.", tags: ["Negroni", "Modern"] },
    "the-red-desert": { title: "The Red Desert", description: "Ein kräftiger karminroter Cocktail mit reifer Fruchttiefe und trocken-strukturiertem Gin-Finish.", tags: ["Fruchtig", "Kräftig"] },
    "spanish-rose-gin-tonic": { title: "Spanish Rose Gin Tonic", description: "Ein Copa-Stil Gin Tonic, gebaut für Garnitur, Duft und ein großzügigeres Trinkritual.", tags: ["Tonic", "Copa"] },
    "desert-spring-negroni": { title: "Desert Spring Negroni", description: "Eine frischere, grünere Version des Klassikers mit leichterem saisonalem Charakter.", tags: ["Saisonal", "Frisch"] },
    "desert-sunset": { title: "Desert Sunset", description: "Warm, vielschichtig und visuell reich, inspiriert vom Farbübergang der Dämmerung über den Dünen.", tags: ["Süß", "Visuell"] },
    "desert-pineapple-bullet": { title: "Desert Pineapple Bullet", description: "Ein tropisch geprägter Mix mit gerösteter Ananas und schärferem, trockenem Finish.", tags: ["Tropisch", "Punch"] },
    "desert-rose-martini": { title: "Desert Rose Martini", description: "Ein kalter, präziser Martini mit einer polierten floralen Signatur.", tags: ["Martini", "Elegant"] },
    "desert-rose-paradise": { title: "Desert Rose Paradise", description: "Ein weicher, üppiger, fruchtbetonter Cocktail, der reich, leicht und escapistisch wirken soll.", tags: ["Fruchtig", "Süß"] },
  },
  fr: {
    "cocktail-desert-rose-gin-tonic": { title: "Desert Rose Gin Tonic", description: "Un serve signature lumineux et floral qui met en valeur nos botaniques du désert avec une finale nette et rafraîchissante.", tags: ["Signature", "Tonic"] },
    "cocktail-desert-rose-collins": { title: "Desert Rose Collins", description: "Un highball long et pétillant aux agrumes vifs, à la douceur équilibrée et à l'assise botanique pure.", tags: ["Collins", "Pétillant"] },
    "cocktail-mediterranean-desert-tonic": { title: "Mediterranean Desert Tonic", description: "Un tonic herbacé qui mêle la chaleur du désert à une fraîcheur aromatique méditerranéenne.", tags: ["Herbacé", "Rafraîchissant"] },
    "cocktail-desert-on-the-rock": { title: "Desert On the Rock", description: "Un service épuré et porté par l'esprit, servi sur glace pour laisser parler la structure du gin.", tags: ["Pur", "Intense"] },
    "cocktail-desert-rose-negroni": { title: "Desert Rose Negroni", description: "Un classique doux-amer avec des accents floraux et un profil désertique plus riche et parfumé.", tags: ["Negroni", "Amer"] },
    "chili-passion-desert": { title: "Chili Passion Desert", description: "La douceur du fruit de la passion rencontre une pointe de chili maîtrisée dans un cocktail tropical et épicé.", tags: ["Épicé", "Exotique"] },
    "desert-aviation": { title: "Desert Aviation", description: "Un verre délicat et aromatique, porté par les agrumes et les fleurs pour une finale élégante.", tags: ["Floral", "Classique"] },
    "desert-tangerine-french-75": { title: "Desert Tangerine French 75", description: "Un cocktail pétillant et lumineux, guidé par la mandarine, à la texture raffinée et festive.", tags: ["Pétillant", "Agrumes"] },
    "desert-orange-spritz": { title: "Desert Orange Spritz", description: "Un aperitivo vibrant et effervescent aux notes d'orange juteuse et à l'esprit coucher de soleil.", tags: ["Spritz", "Été"] },
    "desert-rose-beer": { title: "Desert Rose Beer", description: "Une fusion inattendue où la complexité botanique du gin rencontre la fraîcheur de la bière.", tags: ["Fusion", "Highball"] },
    "desert-aperitif": { title: "Desert Aperitif", description: "Léger, aromatique et éveillant le palais, conçu pour ouvrir la soirée avec précision.", tags: ["Apéritif", "Léger"] },
    "white-desert-negroni": { title: "White Desert Negroni", description: "Une lecture plus claire et plus légère du Negroni, où les notes florales et le vermouth blanc restent au centre.", tags: ["Negroni", "Moderne"] },
    "the-red-desert": { title: "The Red Desert", description: "Un cocktail rouge profond et affirmé, où la richesse du fruit mûr rencontre une finale de gin sèche et structurée.", tags: ["Fruité", "Audacieux"] },
    "spanish-rose-gin-tonic": { title: "Spanish Rose Gin Tonic", description: "Un gin tonic style copa pensé pour la garniture, l'arôme et un rituel de dégustation plus ample.", tags: ["Tonic", "Copa"] },
    "desert-spring-negroni": { title: "Desert Spring Negroni", description: "Une expression plus fraîche et plus verte du classique, au caractère saisonnier plus léger.", tags: ["Saisonnier", "Frais"] },
    "desert-sunset": { title: "Desert Sunset", description: "Chaud, stratifié et visuellement riche, inspiré par le dégradé du crépuscule sur les dunes.", tags: ["Doux", "Visuel"] },
    "desert-pineapple-bullet": { title: "Desert Pineapple Bullet", description: "Un mélange au profil tropical porté par l'ananas rôti et une finale plus sèche et incisive.", tags: ["Tropical", "Punch"] },
    "desert-rose-martini": { title: "Desert Rose Martini", description: "Une expression de martini froide et précise à la signature florale soignée.", tags: ["Martini", "Élégant"] },
    "desert-rose-paradise": { title: "Desert Rose Paradise", description: "Un cocktail doux, ample et fruité, pensé pour être généreux, accessible et évocateur d'évasion.", tags: ["Fruité", "Doux"] },
  },
  es: {
    "cocktail-desert-rose-gin-tonic": { title: "Desert Rose Gin Tonic", description: "Un signature serve luminoso y floral que resalta nuestros botánicos del desierto con un final limpio y refrescante.", tags: ["Signature", "Tonic"] },
    "cocktail-desert-rose-collins": { title: "Desert Rose Collins", description: "Un highball largo y chispeante con cítricos vivos, dulzor equilibrado y una base botánica limpia.", tags: ["Collins", "Burbujeante"] },
    "cocktail-mediterranean-desert-tonic": { title: "Mediterranean Desert Tonic", description: "Un tonic herbal que mezcla el calor del desierto con frescura aromática mediterránea.", tags: ["Herbal", "Refrescante"] },
    "cocktail-desert-on-the-rock": { title: "Desert On the Rock", description: "Un servicio directo y centrado en el destilado, servido sobre hielo para dejar hablar a la estructura del gin.", tags: ["Puro", "Intenso"] },
    "cocktail-desert-rose-negroni": { title: "Desert Rose Negroni", description: "Un clásico agridulce con acentos florales y un perfil desértico más rico y perfumado.", tags: ["Negroni", "Amargo"] },
    "chili-passion-desert": { title: "Chili Passion Desert", description: "La dulzura del maracuyá se une a un toque controlado de chili en un cóctel tropical y especiado.", tags: ["Picante", "Exótico"] },
    "desert-aviation": { title: "Desert Aviation", description: "Un trago delicado y aromático con cítricos brillantes y notas florales que mantienen el final elegante.", tags: ["Floral", "Clásico"] },
    "desert-tangerine-french-75": { title: "Desert Tangerine French 75", description: "Un cóctel brillante y espumoso, guiado por la mandarina, con una textura refinada y festiva.", tags: ["Espumoso", "Cítrico"] },
    "desert-orange-spritz": { title: "Desert Orange Spritz", description: "Un aperitivo vibrante y burbujeante con carácter de naranja jugosa y una sensación de atardecer fácil de beber.", tags: ["Spritz", "Verano"] },
    "desert-rose-beer": { title: "Desert Rose Beer", description: "Una fusión inesperada donde la complejidad botánica del gin se encuentra con la frescura de la cerveza.", tags: ["Fusión", "Highball"] },
    "desert-aperitif": { title: "Desert Aperitif", description: "Ligero, aromático y diseñado para despertar el paladar al inicio de la noche.", tags: ["Aperitivo", "Ligero"] },
    "white-desert-negroni": { title: "White Desert Negroni", description: "Una versión más clara y ligera del Negroni, donde las notas florales y el vermut blanco permanecen al frente.", tags: ["Negroni", "Moderno"] },
    "the-red-desert": { title: "The Red Desert", description: "Un cóctel carmesí y audaz con profundidad frutal madura equilibrada por un final seco y estructurado de gin.", tags: ["Frutal", "Audaz"] },
    "spanish-rose-gin-tonic": { title: "Spanish Rose Gin Tonic", description: "Un gin tonic estilo copa pensado para garnish abundante, aroma y un ritual de consumo más amplio.", tags: ["Tonic", "Copa"] },
    "desert-spring-negroni": { title: "Desert Spring Negroni", description: "Una expresión más fresca y verde del clásico con un carácter estacional más ligero.", tags: ["Estacional", "Fresco"] },
    "desert-sunset": { title: "Desert Sunset", description: "Cálido, en capas y visualmente rico, inspirado en el degradado del atardecer sobre las dunas.", tags: ["Dulce", "Visual"] },
    "desert-pineapple-bullet": { title: "Desert Pineapple Bullet", description: "Una mezcla de perfil tropical con carácter de piña asada y un final más seco y afilado.", tags: ["Tropical", "Punch"] },
    "desert-rose-martini": { title: "Desert Rose Martini", description: "Una expresión de martini fría y precisa con una firma floral pulida.", tags: ["Martini", "Elegante"] },
    "desert-rose-paradise": { title: "Desert Rose Paradise", description: "Un cóctel suave, exuberante y frutal, pensado para sentirse rico, fácil y escapista.", tags: ["Frutal", "Dulce"] },
  },
  ar: {
    "cocktail-desert-rose-gin-tonic": { title: "Desert Rose Gin Tonic", description: "كوكتيل مميز مشرق وزهري يبرز نباتاتنا الصحراوية مع نهاية منعشة وواضحة.", tags: ["سيغنتشر", "تونك"] },
    "cocktail-desert-rose-collins": { title: "Desert Rose Collins", description: "هاي بول طويل وفوّار بنفحات حمضية نابضة وحلاوة متوازنة وقاعدة نباتية نظيفة.", tags: ["كولينز", "فوّار"] },
    "cocktail-mediterranean-desert-tonic": { title: "Mediterranean Desert Tonic", description: "تونك عشبي يمزج دفء الصحراء مع الانتعاش العطري المتوسطي.", tags: ["عشبي", "منعش"] },
    "cocktail-desert-on-the-rock": { title: "Desert On the Rock", description: "تقديم مباشر ومركز على الروح يُقدَّم فوق الثلج ليُظهر بنية الجن بوضوح.", tags: ["نقي", "قوي"] },
    "cocktail-desert-rose-negroni": { title: "Desert Rose Negroni", description: "كلاسيكي بطابع حلو ومر مع لمسات زهرية وملف صحراوي أكثر غنى وعطراً.", tags: ["نيغروني", "مر"] },
    "chili-passion-desert": { title: "Chili Passion Desert", description: "حلاوة فاكهة العاطفة تلتقي بحرارة فلفل مدروسة في كوكتيل استوائي متبّل.", tags: ["حار", "استوائي"] },
    "desert-aviation": { title: "Desert Aviation", description: "مشروب رقيق وعطري مع حمضيات مشرقة ونفحات زهرية تحافظ على نهاية أنيقة.", tags: ["زهري", "كلاسيكي"] },
    "desert-tangerine-french-75": { title: "Desert Tangerine French 75", description: "كوكتيل متلألئ ومشرق تقوده اليوسفي بقوام راقٍ واحتفالي.", tags: ["فوّار", "حمضي"] },
    "desert-orange-spritz": { title: "Desert Orange Spritz", description: "أبيريتيف نابض بالحياة وفقاعات خفيفة بطابع برتقالي عصيري وإحساس غروب دافئ.", tags: ["سبريتز", "صيفي"] },
    "desert-rose-beer": { title: "Desert Rose Beer", description: "اندماج غير متوقع حيث تلتقي تعقيدات الجن النباتية مع انتعاش البيرة.", tags: ["دمج", "هاي بول"] },
    "desert-aperitif": { title: "Desert Aperitif", description: "خفيف وعطري ويوقظ الحنك، صُمم لافتتاح المساء بدقة.", tags: ["أبيريتيف", "خفيف"] },
    "white-desert-negroni": { title: "White Desert Negroni", description: "قراءة أخف وأكثر صفاءً للنيغروني تبقى فيها النغمات الزهرية والفيرموث الأبيض في الواجهة.", tags: ["نيغروني", "حديث"] },
    "the-red-desert": { title: "The Red Desert", description: "كوكتيل قرمزي جريء بعمق فاكهي ناضج ومتوازن مع نهاية جافة ومنظمة من الجن.", tags: ["فاكهي", "جريء"] },
    "spanish-rose-gin-tonic": { title: "Spanish Rose Gin Tonic", description: "جين وتونيك بأسلوب الكوبا مصمم للزينة الكثيفة والعطر وطقس شرب أكثر اتساعاً.", tags: ["تونك", "كوبا"] },
    "desert-spring-negroni": { title: "Desert Spring Negroni", description: "تعبير أكثر خضرة وانتعاشاً عن الكلاسيكي بطابع موسمي أخف.", tags: ["موسمي", "منعش"] },
    "desert-sunset": { title: "Desert Sunset", description: "دافئ ومتدرج وغني بصرياً، مستوحى من تدرج الغروب فوق الكثبان.", tags: ["حلو", "بصري"] },
    "desert-pineapple-bullet": { title: "Desert Pineapple Bullet", description: "مزيج بطابع استوائي مع نكهة أناناس مشوي ونهاية أكثر جفافاً وحدّة.", tags: ["استوائي", "بانش"] },
    "desert-rose-martini": { title: "Desert Rose Martini", description: "تعبير مارتيني بارد ودقيق يحمل توقيعاً زهرّياً مصقولاً.", tags: ["مارتيني", "أنيق"] },
    "desert-rose-paradise": { title: "Desert Rose Paradise", description: "كوكتيل ناعم وغني ومرتَكز على الفاكهة، صُمم ليمنح شعوراً بالترف والسهولة والهروب.", tags: ["فاكهي", "حلو"] },
  },
};

export function getLocalizedCocktailAssets(language: string): CocktailAsset[] {
  const normalized = language.split('-')[0];
  const localized = cocktailTranslations[normalized] ?? cocktailTranslations.en;

  return cocktailAssets.map((cocktail) => ({
    ...cocktail,
    ...localized[cocktail.id],
  }));
}
