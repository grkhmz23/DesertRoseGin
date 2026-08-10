import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import i18n from '@/i18n/config';
import { getLanguageFromCountry, hasManualLanguageOverride } from '@/lib/language';
import { STORE_COUNTRY, STORE_CURRENCY } from '@/lib/currency';

export type MarketCountry = 'IT' | string;
export type MarketCurrency = typeof STORE_CURRENCY;

/**
 * The detected country drives language selection and the CH-only apparel gate.
 * It deliberately does NOT drive currency: the store quotes in CHF everywhere,
 * so prices, cart totals and checkout stay in Swiss francs for every visitor.
 */
interface Market {
  country: MarketCountry;
  currency: MarketCurrency;
  currencyCode: MarketCurrency;
  ready: boolean;
}

const defaultMarket: Market = {
  country: STORE_COUNTRY,
  currency: STORE_CURRENCY,
  currencyCode: STORE_CURRENCY,
  ready: false,
};

function countryToMarket(country: string): Market {
  return { country, currency: STORE_CURRENCY, currencyCode: STORE_CURRENCY, ready: true };
}

const MarketContext = createContext<Market>(defaultMarket);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [market, setMarket] = useState<Market>(defaultMarket);

  useEffect(() => {
    fetch('/api/market')
      .then(r => r.json())
      .then(({ country }: { country: string }) => {
        setMarket(countryToMarket(country));

        if (!hasManualLanguageOverride()) {
          void i18n.changeLanguage(getLanguageFromCountry(country));
        }
      })
      .catch(() => {
        setMarket({ ...countryToMarket(STORE_COUNTRY) });

        if (!hasManualLanguageOverride()) {
          void i18n.changeLanguage('en');
        }
      });
  }, []);

  return <MarketContext.Provider value={market}>{children}</MarketContext.Provider>;
}

export function useMarket() {
  return useContext(MarketContext);
}
