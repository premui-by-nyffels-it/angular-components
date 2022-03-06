import { Component, Input, Output, EventEmitter, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import _ from 'lodash';
import { Subject } from 'rxjs';
import { compareTwoStrings } from 'string-similarity';
import { PremuiStyleService } from '../../services';
import { DefaultIconSettings, Icon } from '../icon/icon.component';

@Component({
  selector: 'premui-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class PremuiSelect implements OnInit, OnDestroy {
  @ViewChild('selectionInput') selectionInput: any;
  @ViewChild('fieldset') fieldset: any;
  @ViewChild('iconSpanInput') iconSpanInput: any;

  public icon: typeof Icon = Icon;
  private _showItems: boolean = false;
  get showItems(): boolean {
    return this._showItems;
  }

  public _selectOverlayWidth: string = '0px';
  public _maxSelectOverlayHeight: string = '200px';

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

  private _value: any = null;
  _valueLabel: string = '';
  public get value(): any {
    return this._value;
  }
  @Output('valueChange') valueEmitter: EventEmitter<any> = new EventEmitter<any>();
	@Input('selectedItem') public set selectedItem(item: any) {
		this._value = item ? item[this._itemValueKey] : null;
    this._valueLabel = item ? item[this._itemLabelKey] : null;
	}
  @Output('selectedItemChange') selectedItemEmitter: EventEmitter<any> = new EventEmitter<any>();

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

  private _items: any[] = [];
	private _originalItems: any[] = [];
  @Input('items') public set items(items: any[]) {
    this._items = items;
		this._originalItems = items;
  }
  public get items(): any[] {
    return this._items;
  }

  private _itemLabelKey!: string;
  @Input('itemLabelKey') public set itemLabelKey(key: string) {
    this._itemLabelKey = key;
  }
  private _itemValueKey!: string;
  @Input('itemValueKey') public set itemValueKey(key: string) {
    this._itemValueKey = key;
  }

  getItemByKey(item: any): string {
    return item[this._itemLabelKey];
  }

  @Output('onFocus') focusEvent: EventEmitter<void> = new EventEmitter();
  @Output('onFocusLost') focusLostEvent: EventEmitter<void> = new EventEmitter();

  private _enableSearch: boolean = true;
  @Input('enableSearch') public set enableSearch(isSearchEnabled: boolean) {
    this._enableSearch = isSearchEnabled;
  }
  public get enableSearch(): boolean {
    return this._enableSearch;
  }

	private onSearchChange: Subject<string> = new Subject();
	private onDestroy: Subject<void> = new Subject();

  constructor(private styleService: PremuiStyleService, private ref: ElementRef) {
    this.styleService.applyStyle(this.ref);
  }

  ngOnInit(): void {
    if (!this.label) throw new Error('No label detected for premui select. A label is required!');
  }

	ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onFocus() {
    if (this.disabled === false) {
      this._showItems = true;
      this._selectOverlayWidth = `${this.selectionInput.nativeElement.offsetWidth + 25}px`;
      this.focusEvent.emit();
    }
  }

  onButtonClick() {
		if (!this.enableSearch) {
			this.onIconClick();
		}
  }

  onFocusLost() {
    if (this.disabled === false) {
      this.focusLostEvent.emit();
    }
  }

  onIconClick(): void {
    if (this.disabled === false && this.readOnly === false) {
      this._showItems = !this._showItems;
      this._selectOverlayWidth = `${this.selectionInput.nativeElement.offsetWidth + 25}px`;
    }
  }

  onItemClick(item: any): void {
    this._showItems = false;

    this._value = item[this._itemValueKey];
    this._valueLabel = item[this._itemLabelKey];
    this.selectedItemEmitter.emit(item);
		this.valueEmitter.emit(this._value);
  }

	onSearchChanged(searchEntry: string): void {
		if (!searchEntry || searchEntry.trim().length < 3) {
			this._items = this._originalItems;
		} else {
			this._items = _.orderBy(this._originalItems.filter(item => compareTwoStrings(item[this._itemLabelKey], searchEntry) > 0.5), (itm) => compareTwoStrings(itm[this._itemLabelKey], searchEntry)).reverse();
		}
	}
}
