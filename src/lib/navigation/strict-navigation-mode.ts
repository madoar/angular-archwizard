import {BaseNavigationMode} from './base-navigation-mode.interface';

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
  protected canTransitionToStep(destinationIndex: number): boolean {
    // navigation with [goToStep] is permitted if all previous steps to the destination step have been completed or are optional
    return this.wizardState.wizardSteps
        .filter((step, index) => index < destinationIndex && index !== this.wizardState.currentStepIndex)
        .every(step => step.completed || step.optional);
  }

  /**
   * @inheritDoc
   */
  protected transition(destinationIndex: number): void {
    // set all steps after the destination step to incomplete
    this.wizardState.wizardSteps
      .filter((step, index) => this.wizardState.currentStepIndex > destinationIndex && index > destinationIndex)
      .forEach(step => step.completed = false);

    super.transition(destinationIndex);
  }

  /**
   * @inheritDoc
   */
  public isNavigable(destinationIndex: number): boolean {
    // a wizard step can be navigated to through the navigation bar, iff it's located before the current wizard step
    return destinationIndex < this.wizardState.currentStepIndex;
  }

  /**
   * @inheritDoc
   */
  protected checkReset(): boolean {
    if (!super.checkReset()) {
      return false;
    }

    // at least one step is before the default step, that is not optional
    const illegalDefaultStep = this.wizardState.wizardSteps
      .filter((step, index) => index < this.wizardState.defaultStepIndex)
      .some(step => !step.optional);
    if (illegalDefaultStep) {
      throw new Error(`The default step index ${this.wizardState.defaultStepIndex} is located after a non optional step`);
    }

    return true;
  }
}
