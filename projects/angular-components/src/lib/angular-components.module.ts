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
  PremuiTitleBar,
} from './components';

@NgModule({
  declarations: [
    PremuiIcon,
    PremuiButton,
    PremuiCard,
    PremuiLoading,
    PremuiSpacer,
    PremuiToggleButton,
    PremuiCollapsible,
    PremuiTabs,
    PremuiTabItem,
    PremuiExpandButton,
    PremuiExpandToggle,
    PremuiTitleBar,
  ],
  imports: [CommonModule],
  exports: [
    PremuiIcon,
    PremuiButton,
    PremuiCard,
    PremuiLoading,
    PremuiSpacer,
    PremuiToggleButton,
    PremuiCollapsible,
    PremuiTabs,
    PremuiTabItem,
    PremuiExpandButton,
    PremuiExpandToggle,
    PremuiTitleBar,
  ],
})
export class PremuiAngularComponentsModule {}
