import { AfterViewInit, ChangeDetectorRef, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Component, ChangeDetectionStrategy, ElementRef, Input, Output } from '@angular/core';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class PremuiSwitch implements AfterViewInit, OnChanges {
  private _elementsPerRow: number | null = null;
  @Input('elementPerRow') public set elementsPerRow(elements: number | null) {
    this._elementsPerRow = elements;
  }
  public get elementsPerRow(): number | null {
    return this._elementsPerRow;
  }

  constructor(private ref: ElementRef, private styleService: PremuiStyleService, private cdr: ChangeDetectorRef) {
    this.styleService.applyStyle(this.ref);
  }

  ngAfterViewInit(): void {
    this.setGridColumns();
  }

  ngOnChanges(): void {
    this.setGridColumns();
  }

  private _gridColumns!: string;
  public get gridColumns(): string {
    return this._gridColumns;
  }
  private setGridColumns(): void {
    let elementAmount: number = this.elementsPerRow != null && this.elementsPerRow > 0 ? this.elementsPerRow : this.ref.nativeElement.querySelectorAll('premui-switch-element').length;
    let percentage: number = 100 / elementAmount;

    let gridColumnsStr: string = '';
    for (let i = 0; i < elementAmount; i++) {
      switch (i) {
        case 0:
        case elementAmount - 1:
          gridColumnsStr += `calc(${percentage}% - 10px)`;
          break;
        default:
          gridColumnsStr += `calc(${percentage}% - 20px)`;
          break;
      }
    }

    this._gridColumns = gridColumnsStr;
		this.cdr.detectChanges();
  }
}

@Component({
  selector: 'premui-switch-element',
  templateUrl: './switch-element.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class PremuiSwitchElement {
  private _selected!: boolean;
  @Input() public set selected(isSelected: boolean) {
    this._selected = isSelected;
  }
  public get selected(): boolean {
    return this._selected;
  }

  /**
   * @description Emits a value when the element is clicked
   * @returns Emits an event without value.
   */
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }

  elementClicked(): void {
    this.onClick.emit();
  }
}
