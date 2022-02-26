import { Component, ChangeDetectionStrategy, ElementRef, Input } from '@angular/core';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class PremuiCard {
  private _padding: string = '20px 0';
  @Input('padding') public set padding(padding: string) {
    this._padding = padding ? padding : '20px 0';
  }
  public get padding() {
    return this._padding;
  }

	private _margin: string = '20px 0';
  @Input('margin') public set margin(margin: string) {
    this._margin = margin ? margin : '20px 0';
  }
  public get margin() {
    return this._margin;
  }

  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }
}
