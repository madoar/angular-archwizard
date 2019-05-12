import {BaseNavigationMode} from './base-navigation-mode.interface';
import {WizardComponent} from '../components/wizard.component';
import { WizardCompletionStep } from '../util/wizard-completion-step.interface';

export class ConfigurableNavigationMode extends BaseNavigationMode {

  constructor(
    private navigateBackward: 'allow'|'deny'|null = null,
    private navigateForward: 'allow'|'deny'|null = null,
  ) {
    super();
    this.navigateBackward = this.navigateBackward || 'allow';
    this.navigateForward = this.navigateForward || 'deny';
  }

  /**
   * @inheritDoc
   */
  protected canTransitionToStep(wizard: WizardComponent, destinationIndex: number): boolean {
    // if the destination step can be navigated to using the navigation bar,
    // it should be accessible with [goToStep] as well
    if (this.isNavigable(wizard, destinationIndex)) {
      return true;
    }

    // navigation with [goToStep] is permitted if all previous steps
    // to the destination step have been completed or are optional
    return wizard.wizardSteps
        .filter((step, index) => index < destinationIndex && index !== wizard.currentStepIndex)
        .every(step => step.completed || step.optional);
  }

  /**
   * @inheritDoc
   */
  protected transition(wizard: WizardComponent, destinationIndex: number): void {
    if (this.navigateForward === 'deny') {
      // set all steps after the destination step to incomplete
      wizard.wizardSteps
        .filter((step, index) => wizard.currentStepIndex > destinationIndex && index > destinationIndex)
        .forEach(step => step.completed = false);
    }

    super.transition(wizard, destinationIndex);
  }

  /**
   * @inheritDoc
   */
  public isNavigable(wizard: WizardComponent, destinationIndex: number): boolean {
    if (wizard.getStepAtIndex(destinationIndex) instanceof WizardCompletionStep) {
      // a completion step can only be entered, if all previous steps have been completed, are optional, or selected
      const previousStepsCompleted = wizard.wizardSteps
        .filter((step, index) => index < destinationIndex)
        .every(step => step.completed || step.optional || step.selected);
      if (!previousStepsCompleted) {
        return false;
      }
    }

    if (destinationIndex < wizard.currentStepIndex) {

      switch (this.navigateBackward) {
        case 'allow': return true;
        case 'deny': return false;
        default:
          throw new Error(`Invalid value for navigateBackward: ${this.navigateBackward}`);
      }

    } else if (destinationIndex > wizard.currentStepIndex) {

      switch (this.navigateForward) {
        case 'allow': return true;
        case 'deny': return false;
        default:
          throw new Error(`Invalid value for navigateForward: ${this.navigateForward}`);
      }

    } else {
      return false;
    }
  }

  /**
   * @inheritDoc
   */
  protected ensureCanReset(wizard: WizardComponent): void {
    super.ensureCanReset(wizard);

    if (this.navigateBackward === 'deny') {
      // at least one step is before the default step, that is not optional
      const illegalDefaultStep = wizard.wizardSteps
        .filter((step, index) => index < wizard.defaultStepIndex)
        .some(step => !step.optional);
      if (illegalDefaultStep) {
        throw new Error(`The default step index ${wizard.defaultStepIndex} is located after a non optional step`);
      }
    }

    // the default step is a completion step and the wizard contains more than one step
    const defaultWizardStep = wizard.getStepAtIndex(wizard.defaultStepIndex);
    const defaultCompletionStep = defaultWizardStep instanceof WizardCompletionStep;
    if (defaultCompletionStep && wizard.wizardSteps.length !== 1) {
      throw new Error(`The default step index ${wizard.defaultStepIndex} references a completion step`);
    }
  }
}
