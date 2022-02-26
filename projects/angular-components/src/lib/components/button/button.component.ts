import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class PremuiButton {
  private _disabled: boolean = false;
  @Input('disabled') public set disabled(isDisabled: boolean) {
    this._disabled = isDisabled;
  }
  public get disabled(): boolean {
    return this._disabled;
  }

  /**
   * @description Emits the mouse event when the user clicked on the button.
   * @returns MouseEvent of the click.
   */
  @Output('onClick') onClickEmitter: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }

  onClick(ev: MouseEvent): void {
    this.onClickEmitter.emit(ev);
  }
}
