import {NavigationMode} from './navigation-mode.interface';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardCompletionStep} from '../util/wizard-completion-step.inferface';
import {WizardState} from './wizard-state.model';

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
   * @param {WizardState} wizardState The model/state of the wizard, that is configured with this navigation mode
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
   * @param {number} destinationIndex The index of the destination wizard step
   * @returns {boolean} True if the destination wizard step can be entered, false otherwise
   */
  canGoToStep(destinationIndex: number): boolean {
    const hasStep = this.wizardState.hasStep(destinationIndex);

    const movingDirection = this.wizardState.getMovingDirection(destinationIndex);

    const canExitCurrentStep = () => this.wizardState.currentStep.canExitStep(movingDirection);
    const canEnterDestinationStep = () => this.wizardState.getStepAtIndex(destinationIndex).canEnterStep(movingDirection);

    const allNormalStepsCompleted = this.wizardState.wizardSteps
      .filter((step, index) => index < destinationIndex)
      .every(step => step.completed || step.optional || step.selected);

    // provide the destination step as a lambda in case the index doesn't exist (i.e. hasStep === false)
    const destinationStep = () => this.wizardState.getStepAtIndex(destinationIndex);

    return hasStep && canExitCurrentStep() && canEnterDestinationStep() &&
      (!(destinationStep() instanceof WizardCompletionStep) || allNormalStepsCompleted);
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
   * @param {number} destinationIndex The index of the destination wizard step, which should be entered
   */
  goToStep(destinationIndex: number): void {
    const movingDirection: MovingDirection = this.wizardState.getMovingDirection(destinationIndex);

    // the current step can be exited in the given direction
    if (this.canGoToStep(destinationIndex)) {
      // leave current step
      this.wizardState.currentStep.completed = true;
      this.wizardState.currentStep.exit(movingDirection);
      this.wizardState.currentStep.selected = false;

      this.wizardState.currentStepIndex = destinationIndex;

      // go to next step
      this.wizardState.currentStep.enter(movingDirection);
      this.wizardState.currentStep.selected = true;
    } else {
      // if the current step can't be left, reenter the current step
      this.wizardState.currentStep.exit(MovingDirection.Stay);
      this.wizardState.currentStep.enter(MovingDirection.Stay);
    }
  }

  /**
   * @inheritDoc
   */
  isNavigable(destinationIndex: number): boolean {
    return this.canGoToStep(destinationIndex);
  }

  /**
   * @inheritDoc
   */
  reset(): void {
    // reset the step internal state
    this.wizardState.wizardSteps.forEach(step => {
      step.completed = false;
      step.selected = false;
    });

    // the default step is a completion step
    const defaultCompletionStep = this.wizardState.getStepAtIndex(this.wizardState.defaultStepIndex) instanceof WizardCompletionStep;

    if (defaultCompletionStep) {
      throw new Error(`The default step index ${this.wizardState.defaultStepIndex} references a completion step`);
    }

    // at least one step is before the default step, that is not optional
    const illegalDefaultStep = this.wizardState.wizardSteps
      .filter((step, index) => index < this.wizardState.defaultStepIndex)
      .some(step => !step.optional);

    if (illegalDefaultStep) {
      throw new Error(`The default step index ${this.wizardState.defaultStepIndex} is located after a non optional step`);
    }

    // set the first step as the current step
    this.wizardState.currentStepIndex = this.wizardState.defaultStepIndex;
    this.wizardState.currentStep.selected = true;
    this.wizardState.currentStep.enter(MovingDirection.Forwards);
  }
}
