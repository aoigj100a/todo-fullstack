import { TranslationsType } from '@/i18n/types';
import { en } from '@/i18n/translations/en';
import { zhTW } from '@/i18n/translations/zh-TW';

export const translations: TranslationsType = {
  en,
  'zh-TW': zhTW,
};

export type { TranslationsObject, TranslationsType } from '@/i18n/types';
