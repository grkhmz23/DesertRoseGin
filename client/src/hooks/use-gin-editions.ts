import { useTranslation } from 'react-i18next';
import type { ProductData } from '@/components/media/scenes/product-scene';

import bottleClassic from '@assets/products/classic-500-normalized.webp';
import bottleLimited from '@assets/products/limited-500-normalized.webp';
import bottleClassic200 from '@assets/products/classic-200-normalized.webp';
import classicGiftBox from '@assets/products/classic-gift-normalized.webp';
import limitedGiftBox from '@assets/products/limited-gift-normalized.webp';
import sixBottleBox from '@assets/products/desert-rose-gift-box.webp';
import cocktailBookletImg from '@assets/products/cocktails-booklet.webp';

/**
 * The two gin editions, in one place.
 *
 * They are sold from two entry points on purpose: their own cards in
 * "Choose Your Journey" (the storytelling route) and THE STORE's GIN shelf
 * (the shopping route). Defining the catalogue once means a price or a new
 * format only ever has to be changed here, and the two routes cannot disagree.
 */
export function useGinEditions(): { classic: ProductData; limited: ProductData } {
  const { t } = useTranslation('common');

  const vatSuffix = ' CHF (IVA incl.)';
  const boxNote = t('ui.product.options.boxNote');
  const giftNote = t('ui.product.options.giftNote');
  const box10Note = t('ui.product.options.box10Note');
  const bookletNote = t('ui.product.options.bookletNote');

  const classic: ProductData = {
    id: 'classic',
    name: "Desert Rose Gin Classic Edition",
    batch: "042",
    abv: "43%",
    description: "Handcrafted with premium organic botanicals such as desert dates and saffron. Our Saharan-inspired gin is light and smooth on the palate with a distinct finish of spices.",
    shopifyHandle: 'desert-rose-gin-classic-edition-500ml',
    options: [
      {
        size: t('ui.product.options.bottle500Classic'),
        price: `48,80${vatSuffix}`,
        image: bottleClassic,
        shopifyLookupSize: "50cl Bottle",
      },
      {
        size: t('ui.product.options.gift500Classic'),
        price: `54,90${vatSuffix}`,
        image: classicGiftBox,
        note: giftNote,
        shopifyLookupSize: "500ml Gift Box",
        qty2LookupSize: "2 x 500ml Gift Box",
      },
      {
        size: t('ui.product.options.box6x500Classic'),
        price: `292,80${vatSuffix}`,
        image: sixBottleBox,
        note: boxNote,
        shopifyLookupSize: "Box of 6 x 50cl",
        isBox: true,
        qty2LookupSize: "2 x Box of 6 x 50cl",
      },
      { size: t('ui.product.options.box10x200'), price: `274,00${vatSuffix}`, image: bottleClassic200, note: box10Note, shopifyLookupSize: "Box of 10 x 20cl", isBox: true },
      { size: t('ui.product.options.cocktailBooklet'), price: `3,00${vatSuffix}`, image: cocktailBookletImg, note: bookletNote, shopifyLookupSize: "Cocktail Booklet" },
    ],
  };

  const limited: ProductData = {
    id: 'limited',
    name: "Desert Rose Gin Limited Edition",
    batch: "001",
    abv: "43%",
    description: "Organic high-quality distillate created from a fusion of Saharan and Asian botanicals. The delicate, floral taste of Darjeeling tea combines with the sweetness of date fruit, creating a complex aroma, soft on the nose and refreshing on the palate.",
    shopifyHandle: 'desert-rose-gin-limited-edition-500ml',
    options: [
      {
        size: t('ui.product.options.bottle500Limited'),
        price: `53,35${vatSuffix}`,
        image: bottleLimited,
        shopifyLookupSize: "50cl Bottle",
        qty2LookupSize: "2 x 500ml Bottle",
      },
      {
        size: t('ui.product.options.gift500Limited'),
        price: `62,35${vatSuffix}`,
        image: limitedGiftBox,
        note: giftNote,
        shopifyLookupSize: "500ml Gift Box",
        qty2LookupSize: "2 x 500ml Gift Box",
      },
      {
        size: t('ui.product.options.box6x500Limited'),
        price: `320${vatSuffix}`,
        image: sixBottleBox,
        note: boxNote,
        shopifyLookupSize: "Box of 6 x 50cl",
        isBox: true,
        qty2LookupSize: "2 x Box of 6 x 50cl",
      },
      { size: t('ui.product.options.cocktailBooklet'), price: `3,00${vatSuffix}`, image: cocktailBookletImg, note: bookletNote, shopifyLookupSize: "Cocktail Booklet" },
    ],
  };

  return { classic, limited };
}
