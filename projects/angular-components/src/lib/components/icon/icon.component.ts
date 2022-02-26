import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { PremuiStyleService } from '../../services/style.service';

@Component({
  selector: 'premui-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class PremuiIcon implements OnInit, OnChanges {
  /**
   * @description icon The name of the icon to be displayed.
   */
  private _icon!: Icon;
  @Input('icon') public set icon(icon: Icon) {
    this._icon = icon;
  }
  public get icon(): Icon {
    return this._icon;
  }

  /**
   * @description Additional style settings applied to the chosen icon. If left empty, default style settings will be applied.
   */
  private _settings: IconSettings = DefaultIconSettings.icon();
  @Input('settings') public set settings(settings: IconSettings) {
    this._settings = settings ? settings : DefaultIconSettings.icon();
  }
  public get settings(): IconSettings {
    return this._settings;
  }

  /**
   * @description Set the icon as disabled. This will apply the disabled style for the selected icon.
   */
  private _disabled: boolean = false;
  @Input('disabled') public set disabled(disabled: boolean) {
    this._disabled = disabled;
  }
  public get disabled(): boolean {
    return this._disabled;
  }

  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }

  ngOnInit(): void {
    if (!this._icon) throw new Error('No icon has been set!');
    if (!PossibleIcons.find((icon) => icon == this._icon)) throw new Error('The given icon is unknown!');
  }

  ngOnChanges(changes: SimpleChanges): void {}
}

export enum Icon {
  ACTIVATE = 'activate',
  ADD = 'add',
  CLOSE = 'close',
  CONFIRM = 'confirm',
  CONCEPT = 'concept',
  COPY = 'copy',
  DELETE = 'delete',
  DEACTIVATE = 'deactivate',
  DOCUMENT = 'document',
  DOCUMENTS = 'documents',
  DOWN = 'down',
  DEFECT = 'defect',
  DESTROYED = 'destroyed',
  ERASE = 'erase',
  EYE = 'eye',
  'EYE-CROSSED' = 'eye-crossed',
  EDIT = 'edit',
  EXPORT = 'export',
  EXCLAMATION = 'exclamation',
  HOUSE = 'house',
  KEY = 'key',
  ORDERED = 'ordered',
  OPEN = 'open',
  FILTER = 'filter',
  'GENERATE-DOCUMENT' = 'generate-document',
  IMPORT = 'import',
  LOANED = 'loaned',
  LOCK = 'lock',
  MAIL = 'mail',
  MINUS = 'minus',
  PAID = 'paid',
  PERSON = 'person',
  PROCESSED = 'processed',
  PLUS = 'plus',
  PHONE = 'phone',
  POINTER = 'pointer',
  REFRESH = 'refresh',
  REFRESH2 = 'refresh2',
  RECEIVED = 'received',
  SAVE = 'save',
  SEARCH = 'search',
  STOCK = 'stock',
  SOLD = 'sold',
  SETTINGS = 'settings',
  'SEND-MAIL' = 'send-mail',
  UP = 'up',
  UPGRADE = 'upgrade',
  UNPAID = 'unpaid',
  UNPROCESSED = 'unprocessed',
  UNLOCK = 'unlock',
  QUESTION = 'question',
  SANDCLOCK = 'sandclock',
  DELIVERY = 'delivery',
}
export const PossibleIcons: string[] = Object.values(Icon);

export interface IconSettings {
  margin?: string;
  padding?: string;
  height?: string;
  cursorOnHover?: string;
}

export class DefaultIconSettings {
  public static icon(): IconSettings {
    return {
      margin: '0 auto',
      padding: '0',
      height: '20px',
    };
  }
}
