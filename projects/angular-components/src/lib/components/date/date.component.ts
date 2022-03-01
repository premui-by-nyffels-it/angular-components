import { Component, Input, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import moment from 'moment-timezone';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class PremuiDate implements OnInit {
  private _label!: string;
  @Input('label') public set label(label: string) {
    this._label = label;
  }
  public get label(): string {
    return this._label;
  }

  private _format: DateFormat = DateFormat['DD/MM/YYYY'];
  private _placeholder: DateFormat = DateFormat['DD/MM/YYYY'];
  @Input('format') public set format(format: DateFormat) {
    this._format = format;
    this._placeholder = format;
  }
  public get format(): DateFormat {
    return this._format;
  }
  public get placeholder(): string {
    return this._placeholder as string;
  }

  private _date: Date | null = null;
  private _formattedDate: string | null = null;
  @Input('date') public set dateValue(date: Date | null) {
    if (!date || !moment(date).isValid()) {
      this._date = null;
      this._formattedDate = null;
    } else {
      this._date = new Date(date);
      this._formattedDate = moment(this._date).format(this._format);
    }
  }
  public get dateValue(): Date | null {
    return this._date;
  }
  public get formattedDate(): string | null {
    return this._formattedDate;
  }
  @Output('dateChange') valueEmitter: EventEmitter<Date | null> = new EventEmitter<Date | null>();

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

  private _debounceDueTime: number = 500;
  @Input('debounceTime') public set debounceDueTime(time: number) {
    this._debounceDueTime = time;
  }
  public get debounceDueTime(): number {
    return this._debounceDueTime;
  }

  changedValue: Subject<string | null> = new Subject();
  validDate: boolean = false;

  constructor(private styleService: PremuiStyleService, private ref: ElementRef) {
    this.styleService.applyStyle(this.ref);
  }

  ngOnInit(): void {
    if (!this.label) throw new Error('No label detected for Premui date. A label is required!');

    if (this.dateValue) {
      this.validDate = moment(this.dateValue).isValid();
    }

    this.changedValue.pipe(debounceTime(+this.debounceDueTime)).subscribe((data) => {
      if (data && data?.trim().length <= 0) data = null;

      if (!data) {
        this.dateValue = null;
        this.valueEmitter.emit(this.dateValue);
      } else {
        let valueStr: string = data.replace(/[^\d.-]/g, '');
        let splitSymbol: string = '/'; // TODO Get split symbol

        if (valueStr.length == 2) valueStr = valueStr += splitSymbol;
        if (valueStr.length > 2 && valueStr[2] != splitSymbol) valueStr = valueStr.substring(0, 2) + splitSymbol + valueStr.substring(2);
        if (valueStr.length == 5) valueStr = valueStr += splitSymbol;
        if (valueStr.length > 5 && valueStr[5] != splitSymbol) valueStr = valueStr.substring(0, 5) + splitSymbol + valueStr.substring(5);

        if (valueStr.length == this.placeholder.length) {
          // TODO Do convertion by convertion service
          let dateArray = valueStr.split(splitSymbol);
          let day = +dateArray[0];
          let month = +dateArray[1];
          let year = +dateArray[2];

          this.dateValue = new Date(year, month - 1, day);
          this.valueEmitter.emit(this.dateValue);
        }
      }
    });
  }

  onValueChange(value: string): void {
    this.changedValue.next(value);
  }
}

export enum DateFormat {
  'DD/MM/YYYY' = 'DD/MM/YYYY',
}
export const PossibleDateFormats: string[] = Object.values(DateFormat);
