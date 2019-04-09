import {BaseNavigationMode} from './base-navigation-mode.interface';
import {WizardComponent} from '../components/wizard.component';

/**
 * A [[NavigationMode]], which allows the user to navigate with strict limitations.
 * The user can only navigation to a given destination step, if:
 * - the current step can be exited in the direction of the destination step
 *
 * @author Marc Arndt
 */
export class StrictNavigationMode extends BaseNavigationMode {

  /**
   * @inheritDoc
   */
  protected canTransitionToStep(wizard: WizardComponent, destinationIndex: number): boolean {
    // navigation with [goToStep] is permitted if all previous steps to the destination step have been completed or are optional
    return wizard.wizardSteps
        .filter((step, index) => index < destinationIndex && index !== wizard.currentStepIndex)
        .every(step => step.completed || step.optional);
  }

  /**
   * @inheritDoc
   */
  protected transition(wizard: WizardComponent, destinationIndex: number): void {
    // set all steps after the destination step to incomplete
    wizard.wizardSteps
      .filter((step, index) => wizard.currentStepIndex > destinationIndex && index > destinationIndex)
      .forEach(step => step.completed = false);

    super.transition(wizard, destinationIndex);
  }

  /**
   * @inheritDoc
   */
  public isNavigable(wizard: WizardComponent, destinationIndex: number): boolean {
    // a wizard step can be navigated to through the navigation bar, iff it's located before the current wizard step
    return destinationIndex < wizard.currentStepIndex;
  }

  /**
   * @inheritDoc
   */
  protected checkReset(wizard: WizardComponent): boolean {
    if (!super.checkReset(wizard)) {
      return false;
    }

    // at least one step is before the default step, that is not optional
    const illegalDefaultStep = wizard.wizardSteps
      .filter((step, index) => index < wizard.defaultStepIndex)
      .some(step => !step.optional);
    if (illegalDefaultStep) {
      throw new Error(`The default step index ${wizard.defaultStepIndex} is located after a non optional step`);
    }

    return true;
  }
}
