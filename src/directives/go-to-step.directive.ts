/**
 * Created by marc on 09.01.17.
 */

import {Directive, EventEmitter, HostListener, Input, Optional, Output} from '@angular/core';
import {isStepOffset, StepOffset} from '../util/step-offset.interface';
import {isNumber, isString} from 'util';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

/**
 * The `goToStep` directive can be used to navigate to a given step.
 * This step can be defined in one of multiple formats
 *
 * ### Syntax
 *
 * With absolute step index:
 *
 * ```html
 * <button [goToStep]="absolute step index" (finalize)="finalize method">...</button>
 * ```
 *
 * With a wizard step object:
 *
 * ```html
 * <button [goToStep]="wizard step object" (finalize)="finalize method">...</button>
 * ```
 *
 * With an offset to the defining step
 *
 * ```html
 * <button [goToStep]="{ stepOffset: offset }" (finalize)="finalize method">...</button>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[goToStep]'
})
export class GoToStepDirective {
  /**
   * This [[EventEmitter]] is called directly before the current step is exited during a transition through a component with this directive.
   *
   * @type {EventEmitter}
   */
  @Output()
  public preFinalize: EventEmitter<void> = new EventEmitter();

  /**
   * This [[EventEmitter]] is called directly after the current step is exited during a transition through a component with this directive.
   *
   * @type {EventEmitter}
   */
  @Output()
  public postFinalize: EventEmitter<void> = new EventEmitter();

  /**
   * A convenience name for `preFinalize`
   *
   * @param {EventEmitter<void>} emitter The [[EventEmitter]] to be set
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
  @Input()
  public goToStep: WizardStep | StepOffset | number | string;

  /**
   * The navigation mode
   *
   * @returns {NavigationMode}
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
  constructor(private wizardState: WizardState, @Optional() private wizardStep: WizardStep) { }

  /**
   * Returns the destination step of this directive as an absolute step index inside the wizard
   *
   * @returns {number} The index of the destination step
   * @throws If `goToStep` is of an unknown type an `Error` is thrown
   */
  get destinationStep(): number {
    let destinationStep: number;

    if (isNumber(this.goToStep)) {
      destinationStep = this.goToStep as number;
    } else if (isString(this.goToStep)) {
      destinationStep = parseInt(this.goToStep as string, 10);
    } else if (isStepOffset(this.goToStep) && this.wizardStep !== null) {
      destinationStep = this.wizardState.getIndexOfStep(this.wizardStep) + this.goToStep.stepOffset;
    } else if (this.goToStep instanceof WizardStep) {
      destinationStep = this.wizardState.getIndexOfStep(this.goToStep);
    } else {
      throw new Error(`Input 'goToStep' is neither a WizardStep, StepOffset, number or string`);
    }

    return destinationStep;
  }

  /**
   * Listener method for `click` events on the component with this directive.
   * After this method is called the wizard will try to transition to the `destinationStep`
   */
  @HostListener('click', ['$event']) onClick(): void {
    this.navigationMode.goToStep(this.destinationStep, this.preFinalize, this.postFinalize);
  }
}
