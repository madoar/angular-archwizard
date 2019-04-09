import {BaseNavigationMode} from './base-navigation-mode.interface';
import {WizardCompletionStep} from '../util/wizard-completion-step.interface';
import {WizardComponent} from '../components/wizard.component';

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
  public isNavigable(wizard: WizardComponent, destinationIndex: number): boolean {
    if (wizard.getStepAtIndex(destinationIndex) instanceof WizardCompletionStep) {
      // a completion step can only be entered, if all previous steps have been completed, are optional, or selected
      return wizard.wizardSteps
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
  protected checkReset(wizard: WizardComponent): boolean {
    if (!super.checkReset(wizard)) {
      return false;
    }

    // the default step is a completion step and the wizard contains more than one step
    const defaultWizardStep = wizard.getStepAtIndex(wizard.defaultStepIndex);
    const defaultCompletionStep = defaultWizardStep instanceof WizardCompletionStep;
    if (defaultCompletionStep && wizard.wizardSteps.length !== 1) {
      throw new Error(`The default step index ${wizard.defaultStepIndex} references a completion step`);
    }

    return true;
  }
}
