import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PremuiButton, PremuiCard, PremuiCollapsible, PremuiLoading, PremuiSpacer, PremuiToggleButton } from './components';
import { PremuiIcon } from './components/icon/icon.component';

@NgModule({
  declarations: [PremuiIcon, PremuiButton, PremuiCard, PremuiLoading, PremuiSpacer, PremuiToggleButton, PremuiCollapsible],
  imports: [CommonModule],
  exports: [PremuiIcon, PremuiButton, PremuiCard, PremuiLoading, PremuiSpacer, PremuiToggleButton, PremuiCollapsible],
})
export class PremuiAngularComponentsModule {}
