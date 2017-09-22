import {ContentChild, Directive, EventEmitter, forwardRef, HostBinding, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardStepTitleDirective} from './wizard-step-title.directive';
import {WizardCompletionStep} from '../util/wizard-completion-step.interface';

/**
 * The `wizardCompletionStep` directive can be used to define a completion/success step at the end of your wizard
 * After a [[WizardCompletionStep]] has been entered, it has the characteristic that the user is blocked from
 * leaving it again to a previous step.
 * In addition entering a [[WizardCompletionStep]] automatically sets the `wizard` amd all steps inside the `wizard`
 * as completed.
 *
 * ### Syntax
 *
 * ```html
 * <div wizardCompletionStep [stepTitle]="title of the wizard step" [navigationSymbol]="navigation symbol"
 *    [navigationSymbolFontFamily]="navigation symbol font family"
 *    (stepEnter)="event emitter to be called when the wizard step is entered"
 *    (stepExit)="event emitter to be called when the wizard step is exited">
 *    ...
 * </div>
 * ```
 *
 * ### Example
 *
 * ```html
 * <div wizardCompletionStep stepTitle="Step 1" navigationSymbol="1">
 *    ...
 * </div>
 * ```
 *
 * With a navigation symbol from the `font-awesome` font:
 *
 * ```html
 * <div wizardCompletionStep stepTitle="Step 1" navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    ...
 * </div>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[wizardCompletionStep]',
  providers: [
    { provide: WizardStep, useExisting: forwardRef(() => WizardCompletionStepDirective) },
    { provide: WizardCompletionStep, useExisting: forwardRef(() => WizardCompletionStepDirective) }
  ]
})
export class WizardCompletionStepDirective extends WizardCompletionStep {
}
