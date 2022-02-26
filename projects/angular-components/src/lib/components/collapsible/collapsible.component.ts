import { Component, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef, ViewChild, Input, OnChanges, SimpleChanges, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss'],
})
export class PremuiCollapsible implements AfterViewInit {
  @ViewChild('title') titleComponent!: ElementRef;
  @ViewChild('content') contentComponent!: ElementRef;

  private _title: string = '';
  @Input('title') public set title(label: string) {
    this._title = label;
  }
  public get title(): string {
    return this._title;
  }

  private _open: boolean = false;
  @Input('open') public set open(isOpen: boolean) {
    this._open = isOpen;
    this.setContent();
  }
  public get open(): boolean {
    return this._open;
  }
  @Output('openChange') isOpenChangedEmitter: EventEmitter<boolean> = new EventEmitter();
  @Output('onContext') onContextEmitter: EventEmitter<MouseEvent> = new EventEmitter();

  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }

  ngAfterViewInit(): void {
    this.setContent();
  }

  onTitleClick(): void {
    this.toggleContent();
  }

  toggleContent(): void {
    this._open = !this._open;
    this.isOpenChangedEmitter.emit(this._open);
    this.setContent();
  }

  setContent(): void {
    if (this._open) {
      this.contentComponent.nativeElement.style.maxHeight = this.contentComponent.nativeElement.scrollHeight + 'px';
    } else {
      this.contentComponent.nativeElement.style.maxHeight = null;
    }
  }

  onContextClick(event: MouseEvent): void {
    this.onContextEmitter.emit(event);
  }
}
