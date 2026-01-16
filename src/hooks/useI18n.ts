import { useMemo } from 'react';
import { getTranslation, LocaleData } from '../lib/i18n';

export function useI18n(locale: string = 'en', customTranslations?: LocaleData) {
  const t = useMemo(() => {
    return (key: string): string => {
      return getTranslation(locale, key, customTranslations);
    };
  }, [locale, customTranslations]);

  return { t, locale };
}
