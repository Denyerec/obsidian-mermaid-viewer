import { getLanguage } from 'obsidian';
import en from './locales/en-GB.json';
import zhCN from './locales/zh-CN.json';

type Dictionary = Partial<Record<keyof typeof en, string>>;

const dictionaries = {
  'en-GB': en,
  'zh-CN': zhCN,
} satisfies Record<string, Dictionary>;

export type Locale = keyof typeof dictionaries;
export type TranslationKey = keyof typeof en;

let localeOverride: Locale | undefined;

function getLocale(): Locale {
  if (localeOverride) return localeOverride;

  return getLanguage().toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-GB';
}

export function setLocale(locale?: Locale): void {
  localeOverride = locale;
}

export function t(key: TranslationKey): string {
  return dictionaries[getLocale()][key] ?? en[key];
}
