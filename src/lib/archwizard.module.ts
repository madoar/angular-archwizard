import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {WizardCompletionStepComponent} from './components/wizard-completion-step.component';
import {WizardNavigationBarComponent} from './components/wizard-navigation-bar.component';
import {WizardStepComponent} from './components/wizard-step.component';
import {WizardComponent} from './components/wizard.component';
import {EnableBackLinksDirective} from './directives/enable-back-links.directive';
import {GoToStepDirective} from './directives/go-to-step.directive';
import {NextStepDirective} from './directives/next-step.directive';
import {OptionalStepDirective} from './directives/optional-step.directive';
import {PreviousStepDirective} from './directives/previous-step.directive';
import {ResetWizardDirective} from './directives/reset-wizard.directive';
import {SelectedStepDirective} from './directives/selected-step.directive';
import {WizardCompletionStepDirective} from './directives/wizard-completion-step.directive';
import {WizardStepSymbolDirective} from './directives/wizard-step-symbol.directive';
import {WizardStepTitleDirective} from './directives/wizard-step-title.directive';
import {WizardStepDirective} from './directives/wizard-step.directive';
import {NavigationModeDirective} from './directives/navigation-mode.directive';
import {CompletedStepDirective} from './directives/completed-step.directive';


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
    ResetWizardDirective,
    NavigationModeDirective,
    CompletedStepDirective,
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
    ResetWizardDirective,
    NavigationModeDirective,
    CompletedStepDirective,
  ]
})
export class ArchwizardModule {
  /* istanbul ignore next */
  public static forRoot(): ModuleWithProviders<ArchwizardModule> {
    return {
      ngModule: ArchwizardModule,
      providers: [
        // Nothing here yet
      ]
    };
  }
}
