/**
 * Created by marc on 20.05.17.
 */

import {Component, forwardRef, ViewEncapsulation} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardCompletionStep} from '../util/wizard-completion-step.interface';

/**
 * The `aw-wizard-completion-step` component can be used to define a completion/success step at the end of your wizard
 * After a `aw-wizard-completion-step` has been entered, it has the characteristic that the user is blocked from
 * leaving it again to a previous step.
 * In addition entering a `aw-wizard-completion-step` automatically sets the `aw-wizard` and all steps inside the `aw-wizard`
 * as completed.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-completion-step [stepTitle]="title of the wizard step" [navigationSymbol]="navigation symbol"
 *    [navigationSymbolFontFamily]="navigation symbol font family"
 *    (stepEnter)="event emitter to be called when the wizard step is entered"
 *    (stepExit)="event emitter to be called when the wizard step is exited">
 *    ...
 * </aw-wizard-completion-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <aw-wizard-completion-step stepTitle="Step 1" navigationSymbol="1">
 *    ...
 * </aw-wizard-completion-step>
 * ```
 *
 * With a navigation symbol from the `font-awesome` font:
 *
 * ```html
 * <aw-wizard-completion-step stepTitle="Step 1" navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    ...
 * </aw-wizard-completion-step>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'aw-wizard-completion-step',
  templateUrl: 'wizard-completion-step.component.html',
  styleUrls: ['wizard-completion-step.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {provide: WizardStep, useExisting: forwardRef(() => WizardCompletionStepComponent)},
    {provide: WizardCompletionStep, useExisting: forwardRef(() => WizardCompletionStepComponent)}
  ]
})
export class WizardCompletionStepComponent extends WizardCompletionStep {
}
