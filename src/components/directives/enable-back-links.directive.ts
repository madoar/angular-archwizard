import {Directive, EventEmitter, Host, OnInit, Output} from '@angular/core';
import {WizardCompletionStepComponent} from '../components/wizard-completion-step.component';
import {MovingDirection} from '../util/moving-direction.enum';

/**
 * The `enableBackLinks` directive can be used to allow the user to leave a [[WizardCompletionStepComponent]] after is has been entered.
 *
 * ### Syntax
 *
 * ```html
 * <wizard-completion-step enableBackLinks (stepExit)="exit function">
 *     ...
 * </wizard-completion-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <wizard-completion-step title="Final step" enableBackLinks>
 *     ...
 * </wizard-completion-step>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: 'wizard-completion-step[enableBackLinks]'
})
export class EnableBackLinksDirective implements OnInit {
  /**
   * This EventEmitter is called when the step is exited.
   * The bound method can be used to do cleanup work.
   *
   * @type {EventEmitter<MovingDirection>}
   */
  @Output()
  public stepExit = new EventEmitter<MovingDirection>();

  /**
   * Constructor
   *
   * @param completionStep The wizard completion step, which should be exitable
   */
  constructor(@Host() private completionStep: WizardCompletionStepComponent) { }

  /**
   * Initialization work
   */
  ngOnInit(): void {
    this.completionStep.canExit = true;
    this.completionStep.stepExit = this.stepExit;
  }
}
