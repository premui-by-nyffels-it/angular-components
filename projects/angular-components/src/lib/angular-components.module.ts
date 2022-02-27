import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  PremuiButton,
  PremuiCard,
  PremuiCollapsible,
  PremuiExpandButton,
  PremuiLoading,
  PremuiSpacer,
  PremuiToggleButton,
  PremuiIcon,
  PremuiTabItem,
  PremuiTabs,
  PremuiExpandToggle,
} from './components';

@NgModule({
  declarations: [PremuiIcon, PremuiButton, PremuiCard, PremuiLoading, PremuiSpacer, PremuiToggleButton, PremuiCollapsible, PremuiTabs, PremuiTabItem, PremuiExpandButton, PremuiExpandToggle],
  imports: [CommonModule],
  exports: [PremuiIcon, PremuiButton, PremuiCard, PremuiLoading, PremuiSpacer, PremuiToggleButton, PremuiCollapsible, PremuiTabs, PremuiTabItem, PremuiExpandButton, PremuiExpandToggle],
})
export class PremuiAngularComponentsModule {}
