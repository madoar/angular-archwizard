import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';

import {WizardComponent} from './components/wizard.component';
import {WizardStepComponent} from './components/wizard-step.component';
import {NextStepDirective} from './directives/next-step.directive';
import {PreviousStepDirective} from './directives/previous-step.directive';
import {OptionalStepDirective} from './directives/optional-step.directive';
import {WizardNavigationBarComponent} from './components/wizard-navigation-bar.component';
import {GoToStepDirective} from './directives/go-to-step.directive';


@NgModule({
  declarations: [
    WizardComponent,
    WizardStepComponent,
    WizardNavigationBarComponent,
    GoToStepDirective,
    NextStepDirective,
    PreviousStepDirective,
    OptionalStepDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WizardComponent,
    WizardStepComponent,
    WizardNavigationBarComponent,
    GoToStepDirective,
    NextStepDirective,
    PreviousStepDirective,
    OptionalStepDirective,
  ],
  providers: [
    WizardStepComponent
  ]
})
export class WizardModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: WizardModule, providers: []};
  }
}
