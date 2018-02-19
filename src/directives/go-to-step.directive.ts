/**
 * Created by marc on 09.01.17.
 */

import {Directive, EventEmitter, HostListener, Input, Optional, Output} from '@angular/core';
import {isStepOffset, StepOffset} from '../util/step-offset.interface';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {isStepId, StepId} from '../util/step-id.interface';
import {isStepIndex, StepIndex} from '../util/step-index.interface';

/**
 * The `awGoToStep` directive can be used to navigate to a given step.
 * This step can be defined in one of multiple formats
 *
 * ### Syntax
 *
 * With absolute step index:
 *
 * ```html
 * <button [awGoToStep]="{ stepIndex: absolute step index }" (finalize)="finalize method">...</button>
 * ```
 *
 * With unique step id:
 *
 * ```html
 * <button [awGoToStep]="{ stepId: 'step id of destination step' }" (finalize)="finalize method">...</button>
 * ```
 *
 * With a wizard step object:
 *
 * ```html
 * <button [awGoToStep]="wizard step object" (finalize)="finalize method">...</button>
 * ```
 *
 * With an offset to the defining step:
 *
 * ```html
 * <button [awGoToStep]="{ stepOffset: offset }" (finalize)="finalize method">...</button>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[awGoToStep]'
})
export class GoToStepDirective {
  /**
   * This [[EventEmitter]] is called directly before the current step is exited during a transition through a component with this directive.
   */
  @Output()
  public preFinalize: EventEmitter<void> = new EventEmitter();

  /**
   * This [[EventEmitter]] is called directly after the current step is exited during a transition through a component with this directive.
   */
  @Output()
  public postFinalize: EventEmitter<void> = new EventEmitter();

  /**
   * A convenience name for `preFinalize`
   *
   * @param emitter The [[EventEmitter]] to be set
   */
  @Output()
  public set finalize(emitter: EventEmitter<void>) {
    /* istanbul ignore next */
    this.preFinalize = emitter;
  }

  /**
   * A convenience field for `preFinalize`
   */
  public get finalize(): EventEmitter<void> {
    return this.preFinalize;
  }

  /**
   * The destination step, to which the wizard should navigate, after the component, having this directive has been activated.
   * This destination step can be given either as a [[WizardStep]] containing the step directly,
   * a [[StepOffset]] between the current step and the `wizardStep`, in which this directive has been used,
   * or a step index as a number or string
   */
    // tslint:disable-next-line:no-input-rename
  @Input('awGoToStep')
  public targetStep: WizardStep | StepOffset | StepIndex | StepId;

  /**
   * The navigation mode
   */
  private get navigationMode(): NavigationMode {
    return this.wizardState.navigationMode;
  }

  /**
   * Constructor
   *
   * @param wizardState The wizard state
   * @param wizardStep The wizard step, which contains this [[GoToStepDirective]]
   */
  constructor(private wizardState: WizardState, @Optional() private wizardStep: WizardStep) {
  }

  /**
   * Returns the destination step of this directive as an absolute step index inside the wizard
   *
   * @returns The index of the destination step
   * @throws If `targetStep` is of an unknown type an `Error` is thrown
   */
  get destinationStep(): number {
    let destinationStep: number;

    if (isStepIndex(this.targetStep)) {
      destinationStep = this.targetStep.stepIndex;
    } else if (isStepId(this.targetStep)) {
      destinationStep = this.wizardState.getIndexOfStepWithId(this.targetStep.stepId);
    } else if (isStepOffset(this.targetStep) && this.wizardStep !== null) {
      destinationStep = this.wizardState.getIndexOfStep(this.wizardStep) + this.targetStep.stepOffset;
    } else if (this.targetStep instanceof WizardStep) {
      destinationStep = this.wizardState.getIndexOfStep(this.targetStep);
    } else {
      throw new Error(`Input 'targetStep' is neither a WizardStep, StepOffset, StepIndex or StepId`);
    }

    return destinationStep;
  }

  /**
   * Listener method for `click` events on the component with this directive.
   * After this method is called the wizard will try to transition to the `destinationStep`
   */
  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    this.navigationMode.goToStep(this.destinationStep, this.preFinalize, this.postFinalize);
  }
}
