import {EventEmitter} from '@angular/core';
import {NavigationMode} from './navigation-mode.interface';
import {WizardState} from './wizard-state.model';
import {MovingDirection} from '../util';

/**
 * A [[NavigationMode]], which allows the user to navigate without any limitations,
 * as long as the current step can be exited in the given direction
 *
 * @author Marc Arndt
 */
export class FreeNavigationMode extends NavigationMode {
  /**
   * Constructor
   *
   * @param wizardState The model/state of the wizard, that is configured with this navigation mode
   */
  constructor(wizardState: WizardState) {
    super(wizardState);
  }

  /**
   * Checks whether the wizard can be transitioned to the given destination step.
   * A destination wizard step can be entered if:
   * - it exists
   * - the current step can be exited in the direction of the destination step
   *
   * @param destinationIndex The index of the destination wizard step
   * @returns True if the destination wizard step can be entered, false otherwise
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

    return Promise.resolve(hasStep)
      .then(canExitCurrentStep)
      .then(canEnterDestinationStep);
  }

  /**
   * Tries to enter the wizard step with the given destination index.
   * When entering the destination step, the following actions are done:
   * - the old current step is set as completed
   * - the old current step is set as unselected
   * - the old current step is exited
   * - the destination step is set as selected
   * - the destination step is entered
   *
   * When the destination step couldn't be entered, the following actions are done:
   * - the current step is exited and entered in the direction `MovingDirection.Stay`
   *
   * @param destinationIndex The index of the destination wizard step, which should be entered
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  goToStep(destinationIndex: number, preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    this.canGoToStep(destinationIndex).then(navigationAllowed => {
      if (navigationAllowed) {
        // the current step can be exited in the given direction
        const movingDirection: MovingDirection = this.wizardState.getMovingDirection(destinationIndex);

        /* istanbul ignore if */
        if (preFinalize) {
          preFinalize.emit();
        }

        // leave current step
        this.wizardState.currentStep.completed = true;
        this.wizardState.currentStep.exit(movingDirection);
        this.wizardState.currentStep.selected = false;

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
    return true;
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
