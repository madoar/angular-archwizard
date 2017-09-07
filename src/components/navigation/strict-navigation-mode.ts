import {NavigationMode} from './navigation-mode.interface';
import {WizardComponent} from '../components/wizard.component';
import {WizardStep} from '../util/wizard-step.interface';
import {MovingDirection} from '../util/moving-direction.enum';
import {Injectable} from '@angular/core';

/**
 * A [[NavigationMode]], which allows the user to navigate with strict limitations.
 * The user can only navigation to a given destination step, if:
 * - the current step can be exited in the direction of the destination step
 * - all previous steps to the destination step have been completed or are optional
 *
 * @author Marc Arndt
 */
@Injectable()
export class StrictNavigationMode implements NavigationMode {
  /**
   * Constructor
   *
   * @param {WizardComponent} wizard The wizard, that is configured with this navigation mode
   */
  constructor(private wizard: WizardComponent) {
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
  canGoToStep(destinationIndex: number): boolean {
    const movingDirection: MovingDirection = this.wizard.getMovingDirection(destinationIndex);

    const canExit = this.wizard.canExitStep(this.wizard.currentStep, movingDirection);

    const hasStep = this.wizard.hasStep(destinationIndex);

    const allPreviousStepsComplete = this.wizard.wizardSteps
      .filter((step, index) => index < destinationIndex && index !== this.wizard.currentStepIndex)
      .every(step => step.completed || step.optional);

    return canExit && hasStep && allPreviousStepsComplete;
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
   */
  goToStep(destinationIndex: number): void {
    const destinationStep: WizardStep = this.wizard.getStepAtIndex(destinationIndex);

    const movingDirection: MovingDirection = this.wizard.getMovingDirection(destinationIndex);

    if (this.canGoToStep(destinationIndex)) {
      // leave current step
      this.wizard.currentStep.completed = true;
      this.wizard.currentStep.exit(movingDirection);
      this.wizard.currentStep.selected = false;

      // set all steps after the destination step to incomplete
      this.wizard.wizardSteps
        .filter((step, index) => this.wizard.currentStepIndex > destinationIndex && index > destinationIndex)
        .forEach(step => step.completed = false);

      this.wizard.currentStepIndex = destinationIndex;
      this.wizard.currentStep = destinationStep;

      // go to next step
      this.wizard.currentStep.enter(movingDirection);
      this.wizard.currentStep.selected = true;
    } else {
      // if the current step can't be left, reenter the current step
      this.wizard.currentStep.exit(MovingDirection.Stay);
      this.wizard.currentStep.enter(MovingDirection.Stay);
    }
  }
}
