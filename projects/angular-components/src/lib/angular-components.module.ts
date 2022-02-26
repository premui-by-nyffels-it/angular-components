import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PremuiButton, PremuiCard, PremuiLoading, PremuiSpacer, PremuiToggleButton } from './components';
import { PremuiIcon } from './components/icon/icon.component';

@NgModule({
  declarations: [PremuiIcon, PremuiButton, PremuiCard, PremuiLoading, PremuiSpacer, PremuiToggleButton],
  imports: [CommonModule],
  exports: [PremuiIcon, PremuiButton, PremuiCard, PremuiLoading, PremuiSpacer, PremuiToggleButton],
})
export class PremuiAngularComponentsModule {}
