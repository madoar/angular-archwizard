import {Directive, Host, OnInit} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';

/**
 * The `optionalStep` directive can be used to define an optional `wizard-step`.
 * An optional `wizard-step` is a [[WizardStep]] that doesn't need to be completed to transition to later wizard steps.
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
  selector: '[optional], [optionalStep]'
})
export class OptionalStepDirective implements OnInit {
  /**
   * Constructor
   *
   * @param wizardStep The wizard step, which contains this [[OptionalStepDirective]]
   */
  constructor(@Host() private wizardStep: WizardStep) { }

  /**
   * Initialization work
   */
  ngOnInit(): void {
    this.wizardStep.optional = true;
  }
}
