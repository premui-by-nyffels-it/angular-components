import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PremuiStyleService {
  private _settings: SystemStyleSetting;
  public set settings(settings: SystemStyleSetting) {
    this._theme = 'CUSTOM';
    this._settings = settings;
  }
  public get settings() {
    return this._settings;
  }

  private _theme: PremuiTheme;
  public set theme(theme: PremuiTheme) {
    switch (theme) {
      case 'DARK':
        this._settings = DefaultSystemStyleSettings.dark();
        this._theme = theme;
        break;
      case 'LIGHT':
        this._settings = DefaultSystemStyleSettings.light();
        this._theme = theme;
        break;
    }
  }
  public get theme() {
    return this._theme;
  }

  constructor() {
    this._theme = 'DARK';
    this._settings = DefaultSystemStyleSettings.dark();
  }

  public applyStyle(ref: ElementRef): void {
    ref.nativeElement.style.setProperty('--primColor', this._settings.colorSettings.primColor);
    ref.nativeElement.style.setProperty('--accentColor', this._settings.colorSettings.accent);
    ref.nativeElement.style.setProperty('--altColor', this._settings.colorSettings.altColor);
    ref.nativeElement.style.setProperty('--iconColor', this._settings.colorSettings.iconColor);
    ref.nativeElement.style.setProperty('--disabledColor', this._settings.colorSettings.disabled);
    ref.nativeElement.style.setProperty('--disabledFontColor', this._settings.colorSettings.disabledFontColor);
    ref.nativeElement.style.setProperty('--fontColor', this._settings.colorSettings.font);
    ref.nativeElement.style.setProperty('--hoverColor', this._settings.colorSettings.hoverColor);
    ref.nativeElement.style.setProperty('--backgroundColor', this._settings.colorSettings.backgroundColor);
    ref.nativeElement.style.setProperty('--scrollColor', this._settings.colorSettings.scroll);
    ref.nativeElement.style.setProperty('--invalidColor', this._settings.colorSettings.invalid);
    ref.nativeElement.style.setProperty('--validColor', this._settings.colorSettings.valid);
    ref.nativeElement.style.setProperty('--warningColor', this._settings.colorSettings.warning);

    ref.nativeElement.style.setProperty('--mainfont', this._settings.fontSettings.mainfont);
  }
}

export class DefaultSystemStyleSettings {
  public static dark(): SystemStyleSetting {
    return {
      colorSettings: {
        primColor: '#363636',
        accent: '#3b3b3b',
        altColor: '#ffffff',
        iconColor: '#ffffff',
        disabled: '#303030',
        disabledFontColor: '#6e6e6e',
        font: '#ffffff',
        hoverColor: '#777',
        backgroundColor: '#565e6b',
        scroll: '#4d4444',
        invalid: '#cf1204',
        valid: '#06a800',
        warning: '#a87300',
      },
      fontSettings: {
        mainfont: 'proxima_nova',
      },
    };
  }

  public static light(): SystemStyleSetting {
    return {
      colorSettings: {
        primColor: '#ebebeb',
        accent: '#e0e0e0',
        altColor: '#3d3d3d',
        iconColor: '#3d3d3d',
        disabled: '#cfcfcf',
        disabledFontColor: '#919191',
        font: '#212121',
        hoverColor: '#d1d1d1',
        backgroundColor: '#cfcfcf',
        scroll: '#b2bbbb',
        invalid: '#cf1204',
        valid: '#06a800',
        warning: '#a87300',
      },
      fontSettings: {
        mainfont: 'proxima_nova',
      },
    };
  }
}

export interface SystemStyleSetting {
  colorSettings: SystemStyleColorSetting;
  fontSettings: SystemStyleFontSetting;
}

export interface SystemStyleFontSetting {
  mainfont: string;
}

export interface SystemStyleColorSetting {
  primColor: string;
  accent: string;
  altColor: string;
  iconColor: string;
  disabled: string;
  disabledFontColor: string;
  font: string;
  hoverColor: string;
  backgroundColor: string;
  scroll: string;
  invalid: string;
  valid: string;
  warning: string;
}

export type PremuiTheme = 'DARK' | 'LIGHT' | 'CUSTOM'; // TODO Add CUSTOM
