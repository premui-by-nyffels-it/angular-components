import { Component, ElementRef, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss'],
})
export class PremuiToggleButton {
  @Input() checkedLabel = '';
  @Input() uncheckedLabel = '';

  private _size: ButtonSize = 'small';
  // @Input() public set size(size: ButtonSize) {
  //   this._size = size;
  // }
  public get size(): ButtonSize {
    return this._size;
  }

  private _checked: boolean = true;
  @Input() public set checked(isChecked: boolean) {
    this._checked = isChecked !== false;
  }
  public get checked() {
    return this._checked;
  }
  @Output() public checkedChange = new EventEmitter<boolean>();

  private _disabled: boolean = false;
  @Input() public set disabled(isDisabled: boolean) {
    this._disabled = isDisabled !== false;
  }
  public get disabled() {
    return this._disabled;
  }

  private _readonly: boolean = false;
  @Input() public set readonly(isReadOnly: boolean) {
    this._readonly = isReadOnly !== false;
  }
  public get readonly() {
    return this._readonly;
  }

  private _reverse: boolean = false;
  @Input() public set reverse(isReverse: boolean) {
    this._reverse = isReverse !== false;
  }
  public get reverse() {
    return this._reverse;
  }

  private _loading: boolean = false;
  @Input() public set loading(isLoading: boolean) {
    this._loading = isLoading !== false;
  }
  public get loading() {
    return this._loading;
  }

  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }

  onClick() {
    if (this._disabled || this._readonly) {
      return;
    }

    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }

  @HostListener('click', ['$event']) onToggle() {
    if (this._disabled || this._readonly) {
      return;
    }

    this.onClick();
  }

  writeValue(obj: any): void {
    if (obj !== this.checked) {
      this.checked = !!obj;
    }
  }

  get borderColor(): string {
    return this._checked ? this.styleService.settings.colorSettings.valid : this.styleService.settings.colorSettings.invalid;
  }
}

export type ButtonSize = 'small' | 'medium' | 'large';
