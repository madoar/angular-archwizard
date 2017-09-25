import {NavigationMode} from './navigation-mode.interface';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardState} from './wizard-state.model';
import {EventEmitter} from '@angular/core';

/**
 * A [[NavigationMode]], which allows the user to navigate with strict limitations.
 * The user can only navigation to a given destination step, if:
 * - the current step can be exited in the direction of the destination step
 * - all previous steps to the destination step have been completed or are optional
 *
 * @author Marc Arndt
 */
export class StrictNavigationMode extends NavigationMode {
  /**
   * Constructor
   *
   * @param {WizardState} wizardState The state of the wizard, that is configured with this navigation mode
   */
  constructor(wizardState: WizardState) {
    super(wizardState);
  }

  /**
   * Checks whether the wizard can be transitioned to the given destination step.
   * A destination wizard step can be entered if:
   * - it exists
   * - the current step can be exited in the direction of the destination step
   * - all previous steps to the destination step have been completed or are optional
   *
   * @param {number} destinationIndex The index of the destination wizard step
   * @returns {boolean} True if the destination wizard step can be entered, false otherwise
   */
  canGoToStep(destinationIndex: number): Promise<boolean> {
    const hasStep = this.wizardState.hasStep(destinationIndex);

    const movingDirection = this.wizardState.getMovingDirection(destinationIndex);

    const canExitCurrentStep = (previous: boolean) => {
      return previous ? this.wizardState.currentStep.canExitStep(movingDirection) : Promise.resolve(false);
    };

    const canEnterDestinationStep = (previous: boolean) => {
      return previous ? this.wizardState.getStepAtIndex(destinationIndex).canEnterStep(movingDirection) : Promise.resolve(false);
    };

    const allPreviousStepsComplete = (previous: boolean) => {
      if (previous) {
        return Promise.resolve(this.wizardState.wizardSteps
          .filter((step, index) => index < destinationIndex && index !== this.wizardState.currentStepIndex)
          .every(step => step.completed || step.optional)
        );
      } else {
        return Promise.resolve(false);
      }
    };

    return Promise.resolve(hasStep)
      .then(canExitCurrentStep)
      .then(canEnterDestinationStep)
      .then(allPreviousStepsComplete);
  }

  /**
   * Tries to enter the wizard step with the given destination index.
   * When entering the destination step, the following actions are done:
   * - the old current step is set as completed
   * - the old current step is set as unselected
   * - the old current step is exited
   * - all steps between the old current step and the destination step are marked as incomplete
   * - the destination step is set as selected
   * - the destination step is entered
   *
   * When the destination step couldn't be entered, the following actions are done:
   * - the current step is exited and entered in the direction `MovingDirection.Stay`
   *
   * @param {number} destinationIndex The index of the destination wizard step, which should be entered
   * @param {EventEmitter<void>} preFinalize An event emitter, to be called before the step has been transitioned
   * @param {EventEmitter<void>} postFinalize An event emitter, to be called after the step has been transitioned
   */
  goToStep(destinationIndex: number, preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    this.canGoToStep(destinationIndex).then(navigationAllowed => {
      if (navigationAllowed) {
        const movingDirection: MovingDirection = this.wizardState.getMovingDirection(destinationIndex);

        /* istanbul ignore if */
        if (preFinalize) {
          preFinalize.emit();
        }

        // leave current step
        this.wizardState.currentStep.completed = true;
        this.wizardState.currentStep.exit(movingDirection);
        this.wizardState.currentStep.selected = false;

        // set all steps after the destination step to incomplete
        this.wizardState.wizardSteps
          .filter((step, index) => this.wizardState.currentStepIndex > destinationIndex && index > destinationIndex)
          .forEach(step => step.completed = false);

        this.wizardState.currentStepIndex = destinationIndex;

        // go to next step
        this.wizardState.currentStep.enter(movingDirection);
        this.wizardState.currentStep.selected = true;

        /* istanbul ignore if */
        if (postFinalize) {
          postFinalize.emit();
        }
      } else {
        // if the current step can't be left, reenter the current step
        this.wizardState.currentStep.exit(MovingDirection.Stay);
        this.wizardState.currentStep.enter(MovingDirection.Stay);
      }
    });
  }

  isNavigable(destinationIndex: number): boolean {
    // a wizard step can be navigated to through the navigation bar, iff it's located before the current wizard step
    return destinationIndex < this.wizardState.currentStepIndex;
  }

  /**
   * Resets the state of this wizard.
   * A reset transitions the wizard automatically to the first step and sets all steps as incomplete.
   * In addition the whole wizard is set as incomplete
   */
  reset(): void {
    // the wizard doesn't contain a step with the default step index
    if (!this.wizardState.hasStep(this.wizardState.defaultStepIndex)) {
      throw new Error(`The wizard doesn't contain a step with index ${this.wizardState.defaultStepIndex}`);
    }

    // at least one step is before the default step, that is not optional
    const illegalDefaultStep = this.wizardState.wizardSteps
      .filter((step, index) => index < this.wizardState.defaultStepIndex)
      .some(step => !step.optional);

    if (illegalDefaultStep) {
      throw new Error(`The default step index ${this.wizardState.defaultStepIndex} is located after a non optional step`);
    }

    // reset the step internal state
    this.wizardState.wizardSteps.forEach(step => {
      step.completed = false;
      step.selected = false;
    });

    // set the first step as the current step
    this.wizardState.currentStepIndex = this.wizardState.defaultStepIndex;
    this.wizardState.currentStep.selected = true;
    this.wizardState.currentStep.enter(MovingDirection.Forwards);
  }
}
