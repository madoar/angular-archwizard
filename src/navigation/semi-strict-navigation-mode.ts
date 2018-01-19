import {NavigationMode} from './navigation-mode.interface';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardCompletionStep} from '../util/wizard-completion-step.interface';
import {WizardState} from './wizard-state.model';
import {EventEmitter} from '@angular/core';

/**
 * A [[NavigationMode]], which allows the user to navigate with some limitations.
 * The user can only navigation to a given destination step, if:
 * - the current step can be exited in the direction of the destination step
 * - a completion step can only be entered, if all "normal" wizard steps have been completed
 *
 * @author Marc Arndt
 */
export class SemiStrictNavigationMode extends NavigationMode {
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
   * - all "normal" wizard steps have been completed, are optional or selected, or the destination step isn't a completion step
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

    // provide the destination step as a lambda in case the index doesn't exist (i.e. hasStep === false)
    const destinationStep = (previous: boolean) => {
      if (previous) {
        const allNormalStepsCompleted = this.wizardState.wizardSteps
          .filter((step, index) => index < destinationIndex)
          .every(step => step.completed || step.optional || step.selected);

        return Promise.resolve(
          !(this.wizardState.getStepAtIndex(destinationIndex) instanceof WizardCompletionStep) || allNormalStepsCompleted);
      } else {
        return Promise.resolve(false);
      }
    };

    return Promise.resolve(hasStep)
      .then(canExitCurrentStep)
      .then(canEnterDestinationStep)
      .then(destinationStep);
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

  /**
   * @inheritDoc
   */
  isNavigable(destinationIndex: number): boolean {
    if (this.wizardState.getStepAtIndex(destinationIndex) instanceof WizardCompletionStep) {
      // a completion step can only be entered, if all previous steps have been completed, are optional, or selected
      return this.wizardState.wizardSteps.filter((step, index) => index < destinationIndex)
        .every(step => step.completed || step.optional || step.selected);
    } else {
      // a "normal" step can always be entered
      return true;
    }
  }

  /**
   * @inheritDoc
   */
  reset(): void {
    // the wizard doesn't contain a step with the default step index
    if (!this.wizardState.hasStep(this.wizardState.defaultStepIndex)) {
      throw new Error(`The wizard doesn't contain a step with index ${this.wizardState.defaultStepIndex}`);
    }

    // the default step is a completion step and the wizard contains more than one step
    const defaultCompletionStep = this.wizardState.getStepAtIndex(this.wizardState.defaultStepIndex) instanceof WizardCompletionStep &&
      this.wizardState.wizardSteps.length !== 1;

    if (defaultCompletionStep) {
      throw new Error(`The default step index ${this.wizardState.defaultStepIndex} references a completion step`);
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
