import { Component, ElementRef, Input } from '@angular/core';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-spacer',
  templateUrl: './spacer.component.html',
  styleUrls: ['./spacer.component.scss'],
})
export class PremuiSpacer {
  /**
   * @description The height of the spacer.
   * @default "50px"
   */
  private _height: string = '50px';
  @Input('height') public set height(height: string) {
    this._height = height ? height : '50px';
  }
  public get height(): string {
    return this._height;
  }

  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }
}
