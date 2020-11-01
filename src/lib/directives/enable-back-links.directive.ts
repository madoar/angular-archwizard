import { Directive, EventEmitter, Host, OnInit, Output } from '@angular/core';
import { MovingDirection } from '../util/moving-direction.enum';
import { WizardCompletionStep } from '../util/wizard-completion-step.interface';

/**
 * The `awEnableBackLinks` directive can be used to allow the user to leave a [[WizardCompletionStep]] after is has been entered.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-completion-step awEnableBackLinks (stepExit)="exit function">
 *     ...
 * </aw-wizard-completion-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <aw-wizard-completion-step stepTitle="Final step" awEnableBackLinks>
 *     ...
 * </aw-wizard-completion-step>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[awEnableBackLinks]'
})
export class EnableBackLinksDirective implements OnInit {
  /**
   * This EventEmitter is called when the step is exited.
   * The bound method can be used to do cleanup work.
   */
  @Output()
  public stepExit = new EventEmitter<MovingDirection>();

  /**
   * Constructor
   *
   * @param completionStep The wizard completion step, which should be exitable
   */
  constructor(@Host() private completionStep: WizardCompletionStep) {
  }

  /**
   * Initialization work
   */
  public ngOnInit(): void {
    this.completionStep.canExit = true;
    this.completionStep.stepExit = this.stepExit;
  }
}
