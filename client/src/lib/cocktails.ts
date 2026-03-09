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
  pdf: string;
  image: string;
}

export const cocktailAssets: CocktailAsset[] = [
  { id: "cocktail-desert-rose-gin-tonic", title: "Desert Rose Gin Tonic", pdf: "/pdf/cocktails/Desert Rose Gin Tonic (1).pdf", image: cocktailGinTonic },
  { id: "cocktail-desert-rose-collins", title: "Desert Rose Collins", pdf: "/pdf/cocktails/Desert Rose Collins.pdf", image: cocktailRoseCollins },
  { id: "cocktail-mediterranean-desert-tonic", title: "Mediterranean Desert Tonic", pdf: "/pdf/cocktails/Mediterranean Desert Tonic.pdf", image: cocktailMediterraneanTonic },
  { id: "cocktail-desert-on-the-rock", title: "Desert On the Rock", pdf: "/pdf/cocktails/Desert On the Rock.pdf", image: cocktailDesertOnRock },
  { id: "cocktail-desert-rose-negroni", title: "Desert Rose Negroni", pdf: "/pdf/cocktails/Desert Rose Negroni.pdf", image: cocktailRoseNegroni },
  { id: "chili-passion-desert", title: "Chili Passion Desert", pdf: "/pdf/cocktails/Chili Passion Desert.pdf", image: cocktailChiliPassion },
  { id: "desert-aviation", title: "Desert Aviation", pdf: "/pdf/cocktails/Desert Aviation.pdf", image: cocktailDesertAviation },
  { id: "desert-tangerine-french-75", title: "Desert Tangerine French 75", pdf: "/pdf/cocktails/Desert Tangerine French 75 (1).pdf", image: cocktailTangerineFrench75 },
  { id: "desert-orange-spritz", title: "Desert Orange Spritz", pdf: "/pdf/cocktails/Desert Orange Spritz.pdf", image: cocktailOrangeSpritz },
  { id: "desert-rose-beer", title: "Desert Rose Beer", pdf: "/pdf/cocktails/Desert Rose Beer.pdf", image: cocktailRoseBeer },
  { id: "desert-aperitif", title: "Desert Aperitif", pdf: "/pdf/cocktails/Desert Aperitif.pdf", image: cocktailDesertAperitif },
  { id: "white-desert-negroni", title: "White Desert Negroni", pdf: "/pdf/cocktails/White Desert Negroni.pdf", image: cocktailWhiteNegroni },
  { id: "the-red-desert", title: "The Red Desert", pdf: "/pdf/cocktails/The Red Desert.pdf", image: cocktailRedDesert },
  { id: "spanish-rose-gin-tonic", title: "Spanish Rose Gin Tonic", pdf: "/pdf/cocktails/Spanish Rose Gin Tonic.pdf", image: cocktailSpanishRoseTonic },
  { id: "desert-spring-negroni", title: "Desert Spring Negroni", pdf: "/pdf/cocktails/Desert Spring Negroni.pdf", image: cocktailSpringNegroni },
  { id: "desert-sunset", title: "Desert Sunset", pdf: "/pdf/cocktails/Desert Sunset.pdf", image: cocktailSunset },
  { id: "desert-pineapple-bullet", title: "Desert Pineapple Bullet", pdf: "/pdf/cocktails/Desert Pineapple Bullet.pdf", image: cocktailPineappleBullet },
  { id: "desert-rose-martini", title: "Desert Rose Martini", pdf: "/pdf/cocktails/Desert Rose Martini.pdf", image: cocktailRoseMartini },
  { id: "desert-rose-paradise", title: "Desert Rose Paradise", pdf: "/pdf/cocktails/Desert Rose Paradise.pdf", image: cocktailRoseParadise },
];

export const cocktailAssetById = Object.fromEntries(
  cocktailAssets.map((cocktail) => [cocktail.id, cocktail]),
) as Record<string, CocktailAsset>;
