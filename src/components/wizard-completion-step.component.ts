/**
 * Created by marc on 20.05.17.
 */

import {Component, forwardRef} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardCompletionStep} from '../util/wizard-completion-step.interface';

/**
 * The `wizard-completion-step` component can be used to define a completion/success step at the end of your wizard
 * After a `wizard-completion-step` has been entered, it has the characteristic that the user is blocked from
 * leaving it again to a previous step.
 * In addition entering a `wizard-completion-step` automatically sets the `wizard` amd all steps inside the `wizard`
 * as completed.
 *
 * ### Syntax
 *
 * ```html
 * <wizard-completion-step [stepTitle]="title of the wizard step" [navigationSymbol]="navigation symbol"
 *    [navigationSymbolFontFamily]="navigation symbol font family"
 *    (stepEnter)="event emitter to be called when the wizard step is entered"
 *    (stepExit)="event emitter to be called when the wizard step is exited">
 *    ...
 * </wizard-completion-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <wizard-completion-step stepTitle="Step 1" navigationSymbol="1">
 *    ...
 * </wizard-completion-step>
 * ```
 *
 * With a navigation symbol from the `font-awesome` font:
 *
 * ```html
 * <wizard-completion-step stepTitle="Step 1" navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    ...
 * </wizard-completion-step>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'wizard-completion-step',
  templateUrl: 'wizard-completion-step.component.html',
  styleUrls: ['wizard-completion-step.component.css'],
  providers: [
    { provide: WizardStep, useExisting: forwardRef(() => WizardCompletionStepComponent) },
    { provide: WizardCompletionStep, useExisting: forwardRef(() => WizardCompletionStepComponent) }
  ]
})
export class WizardCompletionStepComponent extends WizardCompletionStep {
}
