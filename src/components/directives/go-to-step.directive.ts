/**
 * Created by marc on 09.01.17.
 */

import {Directive, Output, HostListener, EventEmitter, Input, Optional} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {isStepOffset, StepOffset} from '../util/step-offset.interface';
import {isNumber, isString} from 'util';
import {isWizardStep, WizardStep} from '../util/wizard-step.interface';

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
   * An EventEmitter to be called when this directive is used to exit the current step.
   * This EventEmitter can be used to do cleanup work
   *
   * @type {EventEmitter}
   */
  @Output()
  public finalize = new EventEmitter();

  /**
   * The destination step, to which the wizard should navigate, after the component, having this directive has been activated.
   * This destination step can be given either as a [[WizardStep]] containing the step directly,
   * a [[StepOffset]] between the current step and the `wizardStep`, in which this directive has been used,
   * or a step index as a number or string
   */
  @Input()
  private goToStep: WizardStep | StepOffset | number | string;

  /**
   * Constructor
   *
   * @param wizard The wizard, which contains this [[GoToStepDirective]]
   * @param wizardStep The wizard step, which contains this [[GoToStepDirective]]
   */
  constructor(private wizard: WizardComponent, @Optional() private wizardStep: WizardStep) { }

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
      destinationStep = this.wizard.getIndexOfStep(this.wizardStep) + this.goToStep.stepOffset;
    } else if (isWizardStep(this.goToStep)) {
      destinationStep = this.wizard.getIndexOfStep(this.goToStep);
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
    if (this.wizard.canGoToStep(this.destinationStep)) {
      this.finalize.emit();

      this.wizard.goToStep(this.destinationStep);
    }
  }
}
