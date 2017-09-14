import {WizardState} from './wizard-state.model';
import {MovingDirection} from '../util/moving-direction.enum';

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
   * @returns {boolean} True if the destination step can be transitioned to, false otherwise
   */
  abstract canGoToStep(destinationIndex: number): boolean;

  /**
   * Tries to transition to the wizard step, as denoted by the given destination index.
   * If this is not possible, the current wizard step should be exited and then reentered with `MovingDirection.Stay`
   *
   * @param {number} destinationIndex The index of the destination step
   */
  abstract goToStep(destinationIndex: number): void;

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
  goToPreviousStep(): void {
    if (this.wizardState.hasPreviousStep()) {
      this.goToStep(this.wizardState.currentStepIndex - 1);
    }
  }

  /**
   * Tries to transition the wizard to the next step from the `currentStep`
   */
  goToNextStep(): void {
    if (this.wizardState.hasNextStep()) {
      this.goToStep(this.wizardState.currentStepIndex + 1);
    }
  }

  /**
   * Checks if it's possible to transition to the previous step from the `currentStep`
   *
   * @returns {boolean} True if it's possible to transition to the previous step, false otherwise
   */
  canGoToPreviousStep(): boolean {
    const previousStepIndex = this.wizardState.currentStepIndex - 1;

    return this.wizardState.hasStep(previousStepIndex) && this.canGoToStep(previousStepIndex);
  }

  /**
   * Checks if it's possible to transition to the next step from the `currentStep`
   *
   * @returns {boolean} True if it's possible to transition to the next step, false otherwise
   */
  canGoToNextStep(): boolean {
    const nextStepIndex = this.wizardState.currentStepIndex + 1;

    return this.wizardState.hasStep(nextStepIndex) && this.canGoToStep(nextStepIndex);
  }
}
