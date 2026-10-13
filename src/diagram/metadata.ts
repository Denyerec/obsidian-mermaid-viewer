import type { App } from 'obsidian';
import type { DiagramMetadata } from './types';
import { t } from '../i18n';

export function diagramMetadata(app: App, svg: SVGSVGElement): DiagramMetadata {
  const leaf = app.workspace
    .getLeavesOfType('markdown')
    .find((leaf) => leaf.view.containerEl.contains(svg));
  const view = leaf?.view;
  const file =
    view && 'file' in view
      ? ((view.file as { basename?: string } | null)?.basename ?? 'Mermaid')
      : 'Mermaid';
  const root =
    svg.closest('.markdown-preview-view, .markdown-source-view') ?? leaf?.view.containerEl;
  const headings = Array.from(root?.querySelectorAll('h1,h2,h3,h4,h5,h6,.cm-header') ?? []).filter(
    (h) => h.compareDocumentPosition(svg) & Node.DOCUMENT_POSITION_FOLLOWING,
  );
  const title = (headings.at(-1)?.textContent ?? file)
    .replace(/\u200b/g, '')
    .replace(/^#+\s*/, '')
    .trim();
  return {
    file,
    title,
    kind: svg.querySelector('text.actor')
      ? t('metadata.kind.sequence')
      : svg.querySelector('g.node')
        ? t('metadata.kind.flowchart')
        : t('metadata.kind.generic'),
  };
}
