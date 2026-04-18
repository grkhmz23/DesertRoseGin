export const LANGUAGE_OVERRIDE_STORAGE_KEY = 'drg-language-override';

const ITALIAN_SPEAKING_COUNTRIES = new Set([
  'IT', 'SM', 'VA',
]);

const GERMAN_SPEAKING_COUNTRIES = new Set([
  'DE', 'AT', 'CH', 'LI', 'LU',
]);

const FRENCH_SPEAKING_COUNTRIES = new Set([
  'FR', 'BE', 'BF', 'BI', 'BJ', 'CD', 'CF', 'CG', 'CI', 'CM', 'CH',
  'DJ', 'GA', 'GF', 'GN', 'GP', 'HT', 'KM', 'LU', 'MC', 'MF', 'MG',
  'ML', 'MQ', 'NC', 'NE', 'PF', 'PM', 'RE', 'RW', 'SC', 'SN', 'TD',
  'TG', 'VU', 'WF', 'YT',
]);

const SPANISH_SPEAKING_COUNTRIES = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'SV', 'GQ', 'GT',
  'HN', 'MX', 'NI', 'PA', 'PY', 'PE', 'PR', 'ES', 'UY', 'VE',
]);

const ARABIC_SPEAKING_COUNTRIES = new Set([
  'DZ', 'BH', 'KM', 'DJ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MR',
  'MA', 'OM', 'PS', 'QA', 'SA', 'SO', 'SD', 'SY', 'TN', 'AE', 'YE',
]);

export function getLanguageFromCountry(country: string): string {
  const normalizedCountry = country.toUpperCase();

  if (ITALIAN_SPEAKING_COUNTRIES.has(normalizedCountry)) return 'it';
  if (GERMAN_SPEAKING_COUNTRIES.has(normalizedCountry)) return 'de';
  if (FRENCH_SPEAKING_COUNTRIES.has(normalizedCountry)) return 'fr';
  if (SPANISH_SPEAKING_COUNTRIES.has(normalizedCountry)) return 'es';
  if (ARABIC_SPEAKING_COUNTRIES.has(normalizedCountry)) return 'ar';

  return 'en';
}

export function hasManualLanguageOverride(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(LANGUAGE_OVERRIDE_STORAGE_KEY) === 'manual';
}

export function setManualLanguageOverride(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LANGUAGE_OVERRIDE_STORAGE_KEY, 'manual');
}
