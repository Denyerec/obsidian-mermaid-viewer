import { t } from '../i18n';

export const ROLES = {
  entry: { label: t('role.entry'), color: 'ink' },
  service: { label: t('role.service'), color: 'tint' },
  cache: { label: t('role.cache'), color: 'tint' },
  upstream: { label: t('role.upstream'), color: 'paper' },
  neutral: { label: t('role.neutral'), color: 'warm' },
  error: { label: t('role.error'), color: 'clay' },
} as const;

export type Role = keyof typeof ROLES;
export const SEMANTIC_ROLES: Record<string, Role> = {
  focus: 'entry',
  step: 'service',
  store: 'cache',
  ext: 'upstream',
  branch: 'neutral',
  err: 'error',
};
