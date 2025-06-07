// src/services/currencyService.ts
import countriesData from './countries.json';

interface Country {
  code: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
}

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  country: string;
  flag: string;
}

// Currency symbols mapping for common currencies
const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  KRW: '₩',
  PHP: '₱',
  SGD: 'S$',
  MYR: 'RM',
  THB: '฿',
  VND: '₫',
  IDR: 'Rp',
  HKD: 'HK$',
  AUD: 'A$',
  CAD: 'C$',
  NZD: 'NZ$',
  CHF: 'CHF',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  RUB: '₽',
  BRL: 'R$',
  MXN: '$',
  ARS: '$',
  CLP: '$',
  COP: '$',
  PEN: 'S/',
  ZAR: 'R',
  EGP: 'E£',
  AED: 'د.إ',
  SAR: '﷼',
  QAR: '﷼',
  KWD: 'د.ك',
  BHD: '.د.ب',
  OMR: '﷼',
  JOD: 'د.ا',
  LBP: 'ل.ل',
  TRY: '₺',
  ILS: '₪',
  // Add more as needed
};

class CurrencyService {
  private countries: Country[];

  constructor() {
    this.countries = countriesData as Country[];
  }

  /**
   * Get currency information by country code
   */
  getCurrencyByCountryCode(countryCode: string): CurrencyInfo | null {
    const country = this.countries.find(c => c.countryCode === countryCode);
    
    if (!country) {
      return null;
    }

    return {
      code: country.code,
      name: country.name,
      symbol: this.getCurrencySymbol(country.code),
      country: country.country,
      flag: country.flag
    };
  }

  /**
   * Get currency symbol by currency code
   */
  getCurrencySymbol(currencyCode: string): string {
    return currencySymbols[currencyCode] || currencyCode;
  }

  /**
   * Format amount with currency
   */
  formatAmount(amount: number, countryCode: string): string {
    const currency = this.getCurrencyByCountryCode(countryCode);
    
    if (!currency) {
      return amount.toFixed(2);
    }

    // For most currencies, symbol goes before the amount
    // For some currencies like EUR in some countries, it goes after
    const symbolFirst = ['USD', 'GBP', 'JPY', 'CNY', 'INR', 'KRW', 'PHP', 'SGD', 'MYR', 'AUD', 'CAD', 'NZD'];
    
    if (symbolFirst.includes(currency.code)) {
      return `${currency.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency.symbol}`;
    }
  }

  /**
   * Get all available currencies
   */
  getAllCurrencies(): CurrencyInfo[] {
    return this.countries.map(country => ({
      code: country.code,
      name: country.name,
      symbol: this.getCurrencySymbol(country.code),
      country: country.country,
      flag: country.flag
    }));
  }

  /**
   * Get default currency (fallback)
   */
  getDefaultCurrency(): CurrencyInfo {
    return {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      country: 'United States',
      flag: ''
    };
  }
}

export const currencyService = new CurrencyService();
export type { CurrencyInfo };