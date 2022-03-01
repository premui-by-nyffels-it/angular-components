import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PremuiStyleService } from '../../services';
import { DefaultIconSettings, Icon, PossibleIcons } from '../icon/icon.component';

@Component({
  selector: 'premui-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class PremuiInput implements OnInit {
	get iconSettings() {
		return DefaultIconSettings.input();
	}

  private _label!: string;
  @Input('label') public set label(label: string) {
    this._label = label;
  }
  public get label(): string {
    return this._label;
  }

  private _placeholder: string = '';
  @Input('placeholder') public set placeholder(placeholder: string) {
    this._placeholder = placeholder ? placeholder : '';
  }
  public get placeholder(): string {
    return this._placeholder;
  }

  private _type: InputType = 'text';
  @Input('type') public set type(type: InputType) {
    this._type = type;
  }
  public get type(): InputType {
    return this._type;
  }

  private _value: string = '';
  @Input('value') public set value(value: string) {
    this._value = value ? value : '';
  }
  public get value(): string {
    return this._value;
  }
  @Output('valueChange') valueEmitter: EventEmitter<string> = new EventEmitter<string>();

  private _readOnly: boolean = false;
  @Input('readOnly') public set readOnly(isReadOnly: boolean) {
    this._readOnly = isReadOnly;
  }
  public get readOnly(): boolean {
    return this._readOnly;
  }

  private _disabled: boolean = false;
  @Input('disabled') public set disabled(isDisabled: boolean) {
    this._disabled = isDisabled;
  }
  public get disabled(): boolean {
    return this._disabled;
  }

  private _min!: number;
  @Input('min') public set min(min: number) {
    if (min !== null && min !== undefined && this._type !== 'number') throw new Error("min value is only allowed for type 'number'!");
    this._min = min;
  }
  public get min(): number {
    return this._min;
  }

  private _max!: number;
  @Input('max') public set max(max: number) {
    if (max !== null && max !== undefined && this._type !== 'number') throw new Error("max value is only allowed for type 'number'!");
    this._max = max;
  }
  public get max(): number {
    return this._max;
  }

  private _step: number = 1;
  @Input('step') public set step(step: number) {
    if (step !== null && step !== undefined && this._type !== 'number') throw new Error("step value is only allowed for type 'number'!");
    this._step = step;
  }
  public get step(): number {
    return this._step;
  }

  private _autocomplete: 'on' | 'off' = 'on';
  @Input('autocomplete') set autocompleteBoolean(autocomplete: boolean) {
    this._autocomplete = autocomplete ? 'on' : 'off';
  }
  get autocomplete(): string {
    return this._autocomplete;
  }

  private _debounceDueTime: number = 0;
  @Input('debounceTime') public set debounceDueTime(time: number) {
    this._debounceDueTime = time;
  }
  public get debounceDueTime(): number {
    return this._debounceDueTime;
  }

  private _button: boolean = false;
  @Input('button') public set button(isAButton: boolean) {
    this._button = isAButton;
  }
  public get button(): boolean {
    return this._button;
  }

  private _icon!: Icon | null;
  @Input('icon') public set icon(icon: Icon | null) {
    if (!PossibleIcons.find((v) => v == icon)) this._icon = null;
    else this._icon = icon;
  }
  public get icon(): Icon | null {
    return this._icon;
  }

  private _disableIcon: boolean = false;
  @Input('disableIcon') public set disableIcon(isIconDisabled: boolean) {
    this._disableIcon = isIconDisabled;
  }
  public get disableIcon(): boolean {
    return this._disableIcon;
  }

  @Output('iconClicked') iconClickedEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output('onClick') clickedEvent: EventEmitter<MouseEvent> = new EventEmitter();
  @Output('onFocus') focusEvent: EventEmitter<void> = new EventEmitter();
  @Output('onFocusLost') focusLostEvent: EventEmitter<void> = new EventEmitter();

  changedValue: Subject<string | null> = new Subject();

  constructor(private styleService: PremuiStyleService, private ref: ElementRef) {
    this.styleService.applyStyle(this.ref);
  }

  ngOnInit(): void {
    if (!this.label) throw new Error('No label detected for premui input. A label is required!');

    this.changedValue.pipe(debounceTime(+this.debounceDueTime)).subscribe((data) => {
      if (data && data?.trim().length <= 0) data = null;
      this.setValueChange(data);
    });
  }

  onValueChange(value: string): void {
    this.changedValue.next(value);
  }

  setValueChange(value: string | null): void {
    /* If value is empty, set value to null */
    if (value && value.trim() == '') value = null;

    /* If value is changed, set the value variable and emit it to the user */
    if (value != this.value) {
      this.value = value as string;
      this.valueEmitter.emit(this.value);
    }
  }

  onIconClick(event: MouseEvent) {
    if (this.disableIcon === false) {
      this.iconClickedEvent.emit(event);
    }
  }

  onClick(event: MouseEvent) {
    if (this.disabled === false) {
      this.clickedEvent.emit(event);
    }
  }

  onFocus() {
    if (this.disabled === false) {
      this.focusEvent.emit();
    }
  }

  onFocusLost() {
    if (this.disabled === false) {
      this.focusLostEvent.emit();
    }
  }
}

export type InputType = 'email' | 'number' | 'password' | 'tel' | 'text' | 'url';
