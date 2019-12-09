import {Directive, Host, Input, OnInit} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';

/**
 * The `awOptionalStep` directive can be used to define an optional `wizard-step`.
 * An optional wizard step is a [[WizardStep]] that doesn't need to be completed to transition to later wizard steps.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-step awOptionalStep>
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <aw-wizard-step stepTitle="Second step" awOptionalStep>
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[awOptionalStep]'
})
export class OptionalStepDirective implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('awOptionalStep')
  public optional = true;

  /**
   * Constructor
   *
   * @param wizardStep The wizard step, which contains this [[OptionalStepDirective]]
   */
  constructor(@Host() private wizardStep: WizardStep) {
  }

  /**
   * Initialization work
   */
  public ngOnInit(): void {
    // The input receives '' when specified in the template without a value.  In this case, apply the default value (`true`).
    this.wizardStep.optional = this.optional || this.optional as any === '';
  }
}
