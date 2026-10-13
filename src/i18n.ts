import { getLanguage } from 'obsidian';
import en from './locales/en-GB.json';
import zhCN from './locales/zh-CN.json';

const dictionaries = {
  'en-GB': en,
  'zh-CN': zhCN,
};

export type Locale = keyof typeof dictionaries;
export type TranslationKey = keyof typeof en;

let localeOverride: Locale | undefined;

function getLocale(): Locale {
  if (localeOverride) return localeOverride;

  const language = getLanguage();

  return language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-GB';
}

export function setLocale(locale: Locale): void {
  localeOverride = locale;
}

export function t(key: TranslationKey): string {
  const dictionary = dictionaries[getLocale()] as Partial<Record<TranslationKey, string>>;

  return dictionary[key] ?? en[key] ?? key;
}
