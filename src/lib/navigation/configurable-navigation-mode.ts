import {BaseNavigationMode} from './base-navigation-mode.interface';
import {WizardComponent} from '../components/wizard.component';
import {WizardCompletionStep} from '../util/wizard-completion-step.interface';

/**
 * The default navigation mode used by [[WizardComponent]] and [[NavigationModeDirective]].
 *
 * It is parameterized with two navigation policies passed to constructor:
 *
 * - [[navigateBackward]] policy controls whether wizard steps before the current step are navigable:
 *
 *   - `"deny"` -- the steps are not navigable
 *   - `"allow"` -- the steps are navigable
 *   - If the corresponding constructor argument is omitted or is `null` or `undefined`,
 *     then the default value is applied which is `"deny"`
 *
 * - [[navigateForward]] policy controls whether wizard steps after the current step are navigable:
 *
 *   - `"deny"` -- the steps are not navigable
 *   - `"allow"` -- the steps are navigable
 *   - `"visited"` -- a step is navigable iff it was already visited before
 *   - If the corresponding constructor argument is omitted or is `null` or `undefined`,
 *     then the default value is applied which is `"allow"`
 */
export class ConfigurableNavigationMode extends BaseNavigationMode {

  /**
   * Constructor
   *
   * @param navigateBackward Controls whether wizard steps before the current step are navigable
   * @param navigateForward Controls whether wizard steps before the current step are navigable
   */
  constructor(
    private navigateBackward: 'allow'|'deny'|null = null,
    private navigateForward: 'allow'|'deny'|'visited'|null = null,
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
    // Check if the destination step can be navigated to
    const destinationStep = wizard.getStepAtIndex(destinationIndex);
    if (destinationStep instanceof WizardCompletionStep) {
      // A completion step can only be entered, if all previous steps have been completed, are optional, or selected
      const previousStepsCompleted = wizard.wizardSteps
        .filter((step, index) => index < destinationIndex)
        .every(step => step.completed || step.optional || step.selected);
      if (!previousStepsCompleted) {
        return false;
      }
    }

    // Apply navigation pocicies
    if (destinationIndex < wizard.currentStepIndex) {
      // If the destination step is before current, apply the `navigateBackward` policy
      switch (this.navigateBackward) {
        case 'allow': return true;
        case 'deny': return false;
        default:
          throw new Error(`Invalid value for navigateBackward: ${this.navigateBackward}`);
      }
    } else if (destinationIndex > wizard.currentStepIndex) {
      // If the destination step is after current, apply the `navigateForward` policy
      switch (this.navigateForward) {
        case 'allow': return true;
        case 'deny': return false;
        case 'visited': return destinationStep.completed;
        default:
          throw new Error(`Invalid value for navigateForward: ${this.navigateForward}`);
      }
    } else {
      // Re-entering the current step is not allowed
      return false;
    }
  }

  /**
   * @inheritDoc
   */
  protected ensureCanReset(wizard: WizardComponent): void {
    super.ensureCanReset(wizard);

    // the default step is a completion step and the wizard contains more than one step
    const defaultWizardStep = wizard.getStepAtIndex(wizard.defaultStepIndex);
    const defaultCompletionStep = defaultWizardStep instanceof WizardCompletionStep;
    if (defaultCompletionStep && wizard.wizardSteps.length !== 1) {
      throw new Error(`The default step index ${wizard.defaultStepIndex} references a completion step`);
    }
  }
}
