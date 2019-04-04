import {BaseNavigationMode} from './base-navigation-mode.interface';
import {WizardCompletionStep} from '../util/wizard-completion-step.interface';
import {WizardState} from './wizard-state.model';

/**
 * A [[NavigationMode]], which allows the user to navigate with some limitations.
 * The user can only navigation to a given destination step, if:
 * - the current step can be exited in the direction of the destination step
 * - a completion step can only be entered, if all "normal" wizard steps have been completed
 *
 * @author Marc Arndt
 */
export class SemiStrictNavigationMode extends BaseNavigationMode {

  /**
   * @inheritDoc
   */
  public isNavigable(wizardState: WizardState, destinationIndex: number): boolean {
    if (wizardState.getStepAtIndex(destinationIndex) instanceof WizardCompletionStep) {
      // a completion step can only be entered, if all previous steps have been completed, are optional, or selected
      return wizardState.wizardSteps
        .filter((step, index) => index < destinationIndex)
        .every(step => step.completed || step.optional || step.selected);
    } else {
      // a "normal" step can always be entered
      return true;
    }
  }

  /**
   * @inheritDoc
   */
  protected checkReset(wizardState: WizardState): boolean {
    if (!super.checkReset(wizardState)) {
      return false;
    }

    // the default step is a completion step and the wizard contains more than one step
    const defaultWizardStep = wizardState.getStepAtIndex(wizardState.defaultStepIndex);
    const defaultCompletionStep = defaultWizardStep instanceof WizardCompletionStep;
    if (defaultCompletionStep && wizardState.wizardSteps.length !== 1) {
      throw new Error(`The default step index ${wizardState.defaultStepIndex} references a completion step`);
    }

    return true;
  }
}
