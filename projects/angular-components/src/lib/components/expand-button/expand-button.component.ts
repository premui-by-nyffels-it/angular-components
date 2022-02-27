import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { PremuiStyleService } from '../../services';
import { Icon } from '../icon/icon.component';

@Component({
  selector: 'premui-expand-button',
  templateUrl: './expand-button.component.html',
  styleUrls: ['./expand-button.component.scss'],
})
export class PremuiExpandButton implements OnInit {
  private _icon!: Icon;
  @Input('icon') public set icon(icon: Icon) {
    this._icon = icon;
  }
  public get icon(): Icon {
    return this._icon;
  }

  private _disabled: boolean = false;
  @Input('disabled') public set disabled(isDisabled: boolean) {
    this._disabled = isDisabled;
  }
  public get disabled(): boolean {
    return this._disabled;
  }

  private _expandedWidth: string = '40px';
  @Input('expandedWidth') public set expandedWidth(width: string) {
    this._expandedWidth = width;
  }
  public get expandedWidth(): string {
    return this._expandedWidth;
  }

  private _fixedOpen: boolean = false;
  @Input('expandedWidth') public set fixedOpen(isFixedOpen: boolean) {
    this._fixedOpen = isFixedOpen;
  }
  public get fixedOpen(): boolean {
    return this._fixedOpen;
  }

  @Output('onClick') clickEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }

  ngOnInit(): void {
    if (!this.icon) throw new Error('No icon found. An icon is required on expand-button!');
  }

  clicked(event: MouseEvent): void {
    this.clickEvent.emit(event);
  }
}
