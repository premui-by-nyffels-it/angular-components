import { Component, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { PremuiStyleService } from '../../services';

@Component({
  selector: 'premui-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class PremuiLoading {
  constructor(private ref: ElementRef, private styleService: PremuiStyleService) {
    this.styleService.applyStyle(this.ref);
  }
}
