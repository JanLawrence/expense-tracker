// src/hooks/useCurrency.ts
import { useMemo } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { currencyService, CurrencyInfo } from '@/services/currencyService';

export const useCurrency = () => {
  const { user } = useAuthContext();

  const currency = useMemo((): CurrencyInfo => {
    if (!user?.countryCode) {
      return currencyService.getDefaultCurrency();
    }
    const userCurrency = currencyService.getCurrencyByCountryCode(user.countryCode);
    return userCurrency || currencyService.getDefaultCurrency();
  }, [user?.countryCode]);

  const formatAmount = (amount: number): string => {
    if (!user?.countryCode) {
      return currencyService.formatAmount(amount, 'US'); // Default to US
    }
    return currencyService.formatAmount(amount, user.countryCode);
  };

  const getCurrencySymbol = (): string => {
    return currency.symbol;
  };

  const getCurrencyCode = (): string => {
    return currency.code;
  };

  const getCurrencyName = (): string => {
    return currency.name;
  };

  return {
    currency,
    formatAmount,
    getCurrencySymbol,
    getCurrencyCode,
    getCurrencyName
  };
};