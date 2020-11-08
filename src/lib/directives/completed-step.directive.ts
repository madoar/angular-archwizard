import {Directive, Host, Input, OnInit} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';

/**
 * The `awCompletedStep` directive can be used to make a wizard step initially completed.
 *
 * Initially completed steps are shown as completed when the wizard is presented to the user.
 *
 * A typical use case is to make a step initially completed if it is automatically filled with some derived/predefined information.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-step awCompletedStep>
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * An optional boolean condition can be specified:
 *
 * ```html
 * <aw-wizard-step [awCompletedStep]="shouldBeCompleted">
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <aw-wizard-step stepTitle="First step" [awCompletedStep]="firstStepPrefilled">
 *     ...
 * </aw-wizard-step>
 * ```
 */
@Directive({
  selector: '[awCompletedStep]'
})
export class CompletedStepDirective implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('awCompletedStep')
  public initiallyCompleted = true;

  /**
   * Constructor
   *
   * @param wizardStep The wizard step, which contains this [[CompletedStepDirective]]
   */
  constructor(@Host() private wizardStep: WizardStep) {
  }

  /**
   * Initialization work
   */
  public ngOnInit(): void {
    // The input receives '' when specified in the template without a value.  In this case, apply the default value (`true`).
    this.wizardStep.initiallyCompleted = this.initiallyCompleted || this.initiallyCompleted as any === '';
  }
}
