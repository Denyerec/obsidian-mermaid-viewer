import {
  Notice,
  PluginSettingTab,
  Setting,
  type App,
  type Plugin,
  type SettingDefinition,
} from 'obsidian';
import { validNoteClass, type ViewerSettings } from './settings-model';
import { t } from "./i18n";
export { DEFAULT_SETTINGS, normalizeSettings, type ViewerSettings } from './settings-model';

interface SettingsHost extends Plugin {
  settings: ViewerSettings;
  updateSettings(settings: ViewerSettings): Promise<void>;
}
export class ViewerSettingsTab extends PluginSettingTab {
  constructor(
    app: App,
    private readonly host: SettingsHost,
  ) {
    super(app, host);
  }
  getSettingDefinitions(): SettingDefinition[] {
    return [
      {
        name: t('settings.scope.name'),
        desc: t('settings.scope.description'),
        aliases: ['Mermaid', 'scope', 'cssclasses'],
        render: (setting) => this.addScopeControl(setting),
      },
      {
        name: t('settings.colours.name'),
        desc: t('settings.colours.description'),
        aliases: ['Mermaid', 'colours', 'palette'],
      },
    ];
  }

  // Obsidian < 1.13 renders this fallback; newer versions use the searchable definitions.
  display(): void {
    this.containerEl.empty();
    for (const definition of this.getSettingDefinitions()) {
      const setting = new Setting(this.containerEl)
        .setName(definition.name)
        .setDesc(definition.desc ?? '');
      if (definition.render) this.addScopeControl(setting);
    }
  }

  private addScopeControl(setting: Setting): void {
    setting.addText((text) => {
      text.setPlaceholder(t('settings.scope.placeholder')).setValue(this.host.settings.noteClass);
      // Commit on blur so typing never rebuilds every diagram in the vault.
      text.inputEl.addEventListener('change', () => {
        const noteClass = text.getValue().trim();
        if (!validNoteClass(noteClass)) {
          new Notice(t('settings.scope.invalid'));
          text.setValue(this.host.settings.noteClass);
          return;
        }
        void this.host.updateSettings({ ...this.host.settings, noteClass });
      });
    });
  }
}
