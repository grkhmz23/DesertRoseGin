import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import i18n from '@/i18n/config';
import { getLanguageFromCountry, hasManualLanguageOverride } from '@/lib/language';

export type MarketCountry = 'IT' | string;

interface Market {
  country: MarketCountry;
  currency: 'EUR' | 'CHF';
  currencyCode: 'EUR' | 'CHF';
  locale: string;
  ready: boolean;
}

const defaultMarket: Market = {
  country: 'CH',
  currency: 'CHF',
  currencyCode: 'CHF',
  locale: 'de-CH',
  ready: false,
};

function countryToMarket(country: string): Market {
  if (country === 'IT') {
    return { country: 'IT', currency: 'EUR', currencyCode: 'EUR', locale: 'it-IT', ready: true };
  }
  return { country, currency: 'CHF', currencyCode: 'CHF', locale: 'de-CH', ready: true };
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
        setMarket({ ...countryToMarket('CH') });

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
