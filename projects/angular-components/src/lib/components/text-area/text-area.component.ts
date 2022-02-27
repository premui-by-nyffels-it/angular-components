import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss'],
})
export class PremuiTextArea implements OnInit {
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

  private _debounceDueTime: number = 0;
  @Input('debounceTime') public set debounceDueTime(time: number) {
    this._debounceDueTime = time;
  }
  public get debounceDueTime(): number {
    return this._debounceDueTime;
  }

  private _amountOfLines: number = 5;
  @Input('lines') public set amountOfLines(lines: number) {
    this._amountOfLines = lines;
  }
  public get amountOfLines(): number {
    return this._amountOfLines;
  }

  @Output('onFocus') focusEvent: EventEmitter<void> = new EventEmitter();
  @Output('onFocusLost') focusLostEvent: EventEmitter<void> = new EventEmitter();

  changedValue: Subject<string | null> = new Subject();

  constructor(private cdr: ChangeDetectorRef, private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }

  ngOnInit(): void {
    if (!this.label) throw new Error('No label detected for premui text area. A label is required!');

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
