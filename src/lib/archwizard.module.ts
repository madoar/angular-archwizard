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
import {NAVIGATION_MODE_FACTORY, NavigationModeFactory} from './navigation/navigation-mode-factory.interface';
import {BaseNavigationModeFactory} from './navigation/base-navigation-mode-factory.provider';


/**
 * Configuration object for the `angular-archwizard` module.
 *
 * Allows to customize global settings.
 */
export interface ArchwizardModuleConfig {

  /**
   * Custom factory of [[NavigationMode]] instances.
   *
   * You may need a custom factory in order to support custom navigation modes.
   * By default, [[BaseNavigationModeFactory]] is used.
   */
  navigationModeFactory?: NavigationModeFactory;
}

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
  public static forRoot(config?: ArchwizardModuleConfig): ModuleWithProviders {
    return {
      ngModule: ArchwizardModule,
      providers: [
        { provide: NAVIGATION_MODE_FACTORY, useValue: config && config.navigationModeFactory || new BaseNavigationModeFactory() },
      ]
    };
  }
}
