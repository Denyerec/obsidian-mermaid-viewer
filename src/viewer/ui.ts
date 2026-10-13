import { setIcon } from 'obsidian';
import { ROLES } from '../theme/roles';
import type { DiagramMetadata } from '../diagram/types';
import { t } from "../i18n";

export function iconButton(
  parent: HTMLElement,
  icon: string,
  label: string,
  action: () => void,
  signal: AbortSignal,
): HTMLButtonElement {
  const button = parent.createEl('button', {
    cls: 'mpv-icon-button',
    attr: { type: 'button', title: label, 'aria-label': label },
  });
  setIcon(button, icon);
  button.addEventListener('click', action, { signal });
  return button;
}

export function legend(parent: HTMLElement, svg: SVGSVGElement): void {
  const roles = new Set(
    Array.from(svg.querySelectorAll('[data-mpv-role]'), (el) => el.getAttribute('data-mpv-role')),
  );
  const el = parent.createDiv({ cls: 'mpv-diagram-legend' });
  for (const [role, info] of Object.entries(ROLES)) {
    if (!roles.has(role)) continue;
    const item = el.createSpan({
      cls: 'mpv-diagram-legend-item',
      attr: { 'data-role': role },
    });
    item.createEl('i', { attr: { 'aria-hidden': 'true' } });
    item.createSpan({ text: info.label });
  }
}

export interface UIActions {
  close(): void;
  fit(): void;
  fitWidth(): void;
  actualSize(): void;
  zoomCenter(factor: number): void;
}
export function createViewerUI(
  parent: HTMLElement,
  meta: DiagramMetadata,
  actions: UIActions,
  signal: AbortSignal,
) {
  const header = parent.createDiv({ cls: 'mpv-diagram-header' });
  const identity = header.createDiv({ cls: 'mpv-diagram-identity' });
  identity.createSpan({ cls: 'mpv-diagram-kind', text: meta.kind });
  identity.createEl('h2', { text: meta.title, attr: { title: meta.title } });
  if (meta.file.replace(/^\d+[-_\s]*/, '') !== meta.title)
    identity.createSpan({ cls: 'mpv-diagram-file', text: meta.file });
  const headerActions = header.createDiv({ cls: 'mpv-diagram-actions' });
  const helpButton = iconButton(
    headerActions,
    'circle-help',
    t('viewer.help'),
    () => {
      help.hidden = !help.hidden;
      helpButton.setAttribute('aria-expanded', String(!help.hidden));
    },
    signal,
  );
  helpButton.setAttribute('aria-expanded', 'false');
  iconButton(headerActions, 'x', t('viewer.close'), () => actions.close(), signal);

  const help = parent.createDiv({
    cls: 'mpv-diagram-help',
    attr: { role: 'region', 'aria-label': t('viewer.help.label') },
  });
  help.createEl('strong', { text: t('viewer.help.heading') });
  for (const [keys, label] of [
    [t('viewer.shortcut.pan'), t('viewer.pan')],
    [t('viewer.shortcut.zoomPointer'), t('viewer.zoom.pointer')],
    [t('viewer.shortcut.zoomPinch'), t('viewer.zoom.pinch')],
    [t('viewer.shortcut.zoomInOut'), t('viewer.zoom.inOut')],
    [t('viewer.shortcut.fitAll'), t('viewer.fitAll')],
    [t('viewer.shortcut.fitWidth'), t('viewer.fitWidth')],
    [t('viewer.shortcut.actualSize'), t('viewer.actualSize')],
    [t('viewer.shortcut.panKeys'), t('viewer.pan.keys')],
    [t('viewer.shortcut.close'), t('viewer.close')],
  ]) {
    const row = help.createDiv({ cls: 'mpv-help-row' });
    row.createSpan({ text: keys });
    row.createSpan({ text: label });
  }
  help.hidden = true;
  // Obsidian turns aria-label into a hover tooltip; use a referenced label
  // so the canvas does not show a large tooltip over the view controls.
  const canvasLabel = `mpv-canvas-${Date.now()}`;
  parent.createSpan({
    cls: 'mpv-sr-only',
    text: t('viewer.canvas.label'),
    attr: { id: canvasLabel },
  });
  const stage = parent.createDiv({
    cls: 'mpv-diagram-stage',
    attr: { tabindex: '0', 'aria-labelledby': canvasLabel },
  });
  const canvas = stage.createDiv({ cls: 'mpv-diagram-canvas' });
  const toolbar = parent.createDiv({
    cls: 'mpv-diagram-toolbar',
    attr: { role: 'group', 'aria-label': t('viewer.toolbar.label') },
  });
  const modes = toolbar.createDiv({ cls: 'mpv-diagram-modes' });
  const button = (label: string, action: () => void, title: string) => {
    const el = modes.createEl('button', {
      cls: 'mpv-text-button',
      text: label,
      attr: { type: 'button', title, 'aria-pressed': 'false' },
    });
    el.addEventListener('click', action, { signal: signal });
    return el;
  };
  const fitButton = button(t('viewer.fitAll'), () => actions.fit(), t('viewer.fitAll'));
  const widthButton = button(t('viewer.fitWidth'), () => actions.fitWidth(), t('viewer.fitWidth'));
  const actualButton = button(t('viewer.actualSize'), () => actions.actualSize(), t('viewer.actualSize'));
  const zoom = toolbar.createDiv({ cls: 'mpv-diagram-zoom' });
  const zoomOut = iconButton(zoom, 'minus', t('viewer.zoomOut'), () => actions.zoomCenter(1 / 1.25), signal);
  const counter = zoom.createSpan({
    cls: 'mpv-diagram-scale',
    text: '100%',
    attr: { 'aria-label': t('viewer.zoomLevel') },
  });
  const zoomIn = iconButton(zoom, 'plus', t('viewer.zoomIn'), () => actions.zoomCenter(1.25), signal);
  toolbar.createSpan({ cls: 'mpv-diagram-hint', text: t('viewer.zoomHint') });

  return {
    help,
    helpButton,
    stage,
    canvas,
    counter,
    fitButton,
    widthButton,
    actualButton,
    zoomIn,
    zoomOut,
  };
}
export type ViewerUI = ReturnType<typeof createViewerUI>;
