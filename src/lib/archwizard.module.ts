import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {WizardCompletionStepComponent, WizardComponent, WizardNavigationBarComponent, WizardStepComponent} from './components';
import {
  EnableBackLinksDirective,
  GoToStepDirective,
  NextStepDirective,
  OptionalStepDirective,
  PreviousStepDirective,
  ResetWizardDirective,
  SelectedStepDirective,
  WizardCompletionStepDirective,
  WizardStepDirective,
  WizardStepSymbolDirective,
  WizardStepTitleDirective
} from './directives';

/**
 * The module defining all the content inside `angular-archwizard`
 *
 * @author Marc Arndt
 */
@NgModule({
  declarations: [
    WizardComponent,
    WizardStepComponent,
    WizardNavigationBarComponent,
    WizardCompletionStepComponent,
    GoToStepDirective,
    NextStepDirective,
    PreviousStepDirective,
    OptionalStepDirective,
    WizardStepSymbolDirective,
    WizardStepTitleDirective,
    EnableBackLinksDirective,
    WizardStepDirective,
    WizardCompletionStepDirective,
    SelectedStepDirective,
    ResetWizardDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WizardComponent,
    WizardStepComponent,
    WizardNavigationBarComponent,
    WizardCompletionStepComponent,
    GoToStepDirective,
    NextStepDirective,
    PreviousStepDirective,
    OptionalStepDirective,
    WizardStepSymbolDirective,
    WizardStepTitleDirective,
    EnableBackLinksDirective,
    WizardStepDirective,
    WizardCompletionStepDirective,
    SelectedStepDirective,
    ResetWizardDirective
  ]
})
export class ArchwizardModule {
  /* istanbul ignore next */
  static forRoot(): ModuleWithProviders {
    return {ngModule: ArchwizardModule, providers: []};
  }
}
