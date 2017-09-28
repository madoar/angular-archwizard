import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {WizardComponent} from './components/wizard.component';
import {WizardNavigationBarComponent} from './components/wizard-navigation-bar.component';
import {WizardStepComponent} from './components/wizard-step.component';
import {WizardCompletionStepComponent} from './components/wizard-completion-step.component';

import {NextStepDirective} from './directives/next-step.directive';
import {PreviousStepDirective} from './directives/previous-step.directive';
import {OptionalStepDirective} from './directives/optional-step.directive';
import {GoToStepDirective} from './directives/go-to-step.directive';
import {WizardStepTitleDirective} from './directives/wizard-step-title.directive';
import {EnableBackLinksDirective} from './directives/enable-back-links.directive';
import {WizardStepDirective} from './directives/wizard-step.directive';
import {WizardCompletionStepDirective} from './directives/wizard-completion-step.directive';
import {SelectedStepDirective} from './directives/selected-step.directive';
import {ResetWizardDirective} from './directives/reset-wizard.directive';

/**
 * The module defining all the content inside `ng2-archwizard`
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
