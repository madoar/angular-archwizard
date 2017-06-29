import {Directive, Host, OnInit} from '@angular/core';
import {WizardStep} from '../util/WizardStep';

/**
 * The `optionalStep` directive can be used to define an optional `wizard-step`.
 * An optional `wizard-step` is a [[WizardStepComponent]] that doesn't need to be completed to transition to later wizard steps.
 * It's important to note, that this directive can only be used on a [[WizardStepComponent]] and not a [[WizardCompletionStepComponent]]
 *
 * ### Syntax
 *
 * ```html
 * <wizard-step optionalStep>
 *     ...
 * </wizard-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <wizard-step title="Second step" optionalStep>
 *     ...
 * </wizard-step>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[optionalStep]'
})
export class OptionalStepDirective implements OnInit {
  /**
   * Constructor
   *
   * @param wizardStep The wizard, which contains this [[OptionalStepDirective]]
   */
  constructor(@Host() private wizardStep: WizardStep) { }

  /**
   * Initialization work
   */
  ngOnInit(): void {
    this.wizardStep.optional = true;
  }
}
