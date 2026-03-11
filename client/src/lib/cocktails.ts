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
}

export const cocktailAssets: CocktailAsset[] = [
  { id: "cocktail-desert-rose-gin-tonic", title: "Desert Rose Gin Tonic", description: "A bright, floral signature serve built around our desert botanicals with a crisp, refreshing finish.", pdf: "/pdf/cocktails/Desert Rose Gin Tonic (1).pdf", image: cocktailGinTonic },
  { id: "cocktail-desert-rose-collins", title: "Desert Rose Collins", description: "A long and sparkling highball with lifted citrus, balanced sweetness, and a clean botanical backbone.", pdf: "/pdf/cocktails/Desert Rose Collins.pdf", image: cocktailRoseCollins },
  { id: "cocktail-mediterranean-desert-tonic", title: "Mediterranean Desert Tonic", description: "An herbaceous tonic serve that blends desert warmth with aromatic Mediterranean freshness.", pdf: "/pdf/cocktails/Mediterranean Desert Tonic.pdf", image: cocktailMediterraneanTonic },
  { id: "cocktail-desert-on-the-rock", title: "Desert On the Rock", description: "A stripped-back, spirit-forward pour served over ice to let the gin’s structure speak clearly.", pdf: "/pdf/cocktails/Desert On the Rock.pdf", image: cocktailDesertOnRock },
  { id: "cocktail-desert-rose-negroni", title: "Desert Rose Negroni", description: "A bittersweet classic with floral accents and a richer, more perfumed desert-inspired profile.", pdf: "/pdf/cocktails/Desert Rose Negroni.pdf", image: cocktailRoseNegroni },
  { id: "chili-passion-desert", title: "Chili Passion Desert", description: "Passion fruit sweetness meets a controlled chili kick for a bold tropical-spiced cocktail.", pdf: "/pdf/cocktails/Chili Passion Desert.pdf", image: cocktailChiliPassion },
  { id: "desert-aviation", title: "Desert Aviation", description: "A delicate, aromatic serve with lifted citrus and floral notes that keep the finish elegant.", pdf: "/pdf/cocktails/Desert Aviation.pdf", image: cocktailDesertAviation },
  { id: "desert-tangerine-french-75", title: "Desert Tangerine French 75", description: "A bright sparkling cocktail with tangerine-led citrus and a celebratory, refined texture.", pdf: "/pdf/cocktails/Desert Tangerine French 75 (1).pdf", image: cocktailTangerineFrench75 },
  { id: "desert-orange-spritz", title: "Desert Orange Spritz", description: "A vibrant, bubbly aperitivo with juicy orange character and an easy sunset-drinking feel.", pdf: "/pdf/cocktails/Desert Orange Spritz.pdf", image: cocktailOrangeSpritz },
  { id: "desert-rose-beer", title: "Desert Rose Beer", description: "An unexpected fusion where botanical gin complexity meets crisp beer refreshment.", pdf: "/pdf/cocktails/Desert Rose Beer.pdf", image: cocktailRoseBeer },
  { id: "desert-aperitif", title: "Desert Aperitif", description: "Light, aromatic, and palate-awakening, designed to open the evening with precision.", pdf: "/pdf/cocktails/Desert Aperitif.pdf", image: cocktailDesertAperitif },
  { id: "white-desert-negroni", title: "White Desert Negroni", description: "A lighter, clearer take on the Negroni where floral notes and white vermouth stay in focus.", pdf: "/pdf/cocktails/White Desert Negroni.pdf", image: cocktailWhiteNegroni },
  { id: "the-red-desert", title: "The Red Desert", description: "A bold crimson cocktail with ripe fruit depth balanced by a dry and structured gin finish.", pdf: "/pdf/cocktails/The Red Desert.pdf", image: cocktailRedDesert },
  { id: "spanish-rose-gin-tonic", title: "Spanish Rose Gin Tonic", description: "A copa-style gin and tonic built for garnish, aroma, and a more expansive drinking ritual.", pdf: "/pdf/cocktails/Spanish Rose Gin Tonic.pdf", image: cocktailSpanishRoseTonic },
  { id: "desert-spring-negroni", title: "Desert Spring Negroni", description: "A fresher, greener expression of the classic with a lighter seasonal character.", pdf: "/pdf/cocktails/Desert Spring Negroni.pdf", image: cocktailSpringNegroni },
  { id: "desert-sunset", title: "Desert Sunset", description: "Layered, warm, and visually rich, inspired by the colour gradient of dusk over the dunes.", pdf: "/pdf/cocktails/Desert Sunset.pdf", image: cocktailSunset },
  { id: "desert-pineapple-bullet", title: "Desert Pineapple Bullet", description: "A tropical-forward mix with roasted pineapple character and a sharper dry finish.", pdf: "/pdf/cocktails/Desert Pineapple Bullet.pdf", image: cocktailPineappleBullet },
  { id: "desert-rose-martini", title: "Desert Rose Martini", description: "A cold, precise martini expression with a polished floral signature.", pdf: "/pdf/cocktails/Desert Rose Martini.pdf", image: cocktailRoseMartini },
  { id: "desert-rose-paradise", title: "Desert Rose Paradise", description: "A soft, lush, fruit-led cocktail designed to feel rich, easy, and escapist.", pdf: "/pdf/cocktails/Desert Rose Paradise.pdf", image: cocktailRoseParadise },
];

export const cocktailAssetById = Object.fromEntries(
  cocktailAssets.map((cocktail) => [cocktail.id, cocktail]),
) as Record<string, CocktailAsset>;
