import {WizardState} from './wizard-state.model';
import {EventEmitter} from '@angular/core';

/**
 * An interface describing the basic functionality, which must be provided by a navigation mode.
 * A navigation mode manages the navigation between different wizard steps, this contains the validation, if a step transition can be done
 *
 * @author Marc Arndt
 */
export abstract class NavigationMode {
  constructor(protected wizardState: WizardState) {
  }

  /**
   * Checks, whether a wizard step, as defined by the given destination index, can be transitioned to.
   *
   * @param {number} destinationIndex The index of the destination step
   * @returns {Promise<boolean>} A [[Promise]] containing `true`, if the destination step can be transitioned to and false otherwise
   */
  abstract canGoToStep(destinationIndex: number): Promise<boolean>;

  /**
   * Tries to transition to the wizard step, as denoted by the given destination index.
   * If this is not possible, the current wizard step should be exited and then reentered with `MovingDirection.Stay`
   *
   * @param {number} destinationIndex The index of the destination step
   * @param {EventEmitter<void>} preFinalize An event emitter, to be called before the step has been transitioned
   * @param {EventEmitter<void>} postFinalize An event emitter, to be called after the step has been transitioned
   */
  abstract goToStep(destinationIndex: number, preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void;

  /**
   * Checks, whether the wizard step, located at the given index, is can be navigated to
   *
   * @param {number} destinationIndex The index of the destination step
   * @returns {boolean} True if the step can be navigated to, false otherwise
   */
  abstract isNavigable(destinationIndex: number): boolean;

  /**
   * Resets the state of this wizard.
   * A reset transitions the wizard automatically to the first step and sets all steps as incomplete.
   * In addition the whole wizard is set as incomplete
   */
  abstract reset(): void;

  /**
   * Tries to transition the wizard to the previous step from the `currentStep`
   */
  goToPreviousStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    if (this.wizardState.hasPreviousStep()) {
      this.goToStep(this.wizardState.currentStepIndex - 1, preFinalize, postFinalize);
    }
  }

  /**
   * Tries to transition the wizard to the next step from the `currentStep`
   */
  goToNextStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    if (this.wizardState.hasNextStep()) {
      this.goToStep(this.wizardState.currentStepIndex + 1, preFinalize, postFinalize);
    }
  }
}
