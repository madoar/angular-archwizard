import {Component} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

/**
 * The `wizard-navigation-bar` component contains the navigation bar inside a [[WizardComponent]].
 * To correctly display the navigation bar, it's required to set the right css classes for the navigation bar,
 * otherwise it will look like a normal `ul` component.
 *
 * ### Syntax
 *
 * ```html
 * <wizard-navigation-bar></wizard-navigation-bar>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'wizard-navigation-bar',
  templateUrl: 'wizard-navigation-bar.component.html',
  styleUrls: ['wizard-navigation-bar.component.horizontal.less', 'wizard-navigation-bar.component.vertical.less']
})
export class WizardNavigationBarComponent {
  /**
   * The navigation mode
   *
   * @returns {NavigationMode}
   */
  public get navigationMode(): NavigationMode {
    return this.wizardState.navigationMode;
  }

  /**
   * Constructor
   *
   * @param wizardState The state the wizard currently resides in
   */
  constructor(public wizardState: WizardState) {
  }

  /**
   * Returns all [[WizardStep]]s contained in the wizard
   *
   * @returns {Array<WizardStep>} An array containing all [[WizardStep]]s
   */
  get wizardSteps(): Array<WizardStep> {
    return this.wizardState.wizardSteps;
  }

  /**
   * Returns the number of wizard steps, that need to be displaced in the navigation bar
   *
   * @returns {number} The number of wizard steps to be displayed
   */
  get numberOfWizardSteps(): number {
    return this.wizardState.wizardSteps.length;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `current` in the navigation bar
   *
   * @param {WizardStep} wizardStep The wizard step to be checked
   * @returns {boolean} True if the step can be marked as current
   */
  public isCurrent(wizardStep: WizardStep): boolean {
    return wizardStep.selected && !wizardStep.completed && !this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `done` in the navigation bar
   *
   * @param {WizardStep} wizardStep The wizard step to be checked
   * @returns {boolean} True if the step can be marked as done
   */
  public isDone(wizardStep: WizardStep): boolean {
    return (wizardStep.completed && !wizardStep.selected) || this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `default` in the navigation bar
   *
   * @param {WizardStep} wizardStep The wizard step to be checked
   * @returns {boolean} True if the step can be marked as default
   */
  public isDefault(wizardStep: WizardStep): boolean {
    return !wizardStep.optional && !wizardStep.completed && !wizardStep.selected && !this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `editing` in the navigation bar
   *
   * @param {WizardStep} wizardStep The wizard step to be checked
   * @returns {boolean} True if the step can be marked as editing
   */
  public isEditing(wizardStep: WizardStep): boolean {
    return wizardStep.selected && wizardStep.completed && !this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `optional` in the navigation bar
   *
   * @param {WizardStep} wizardStep The wizard step to be checked
   * @returns {boolean} True if the step can be marked as optional
   */
  public isOptional(wizardStep: WizardStep): boolean {
    return wizardStep.optional && !wizardStep.completed && !wizardStep.selected && !this.wizardState.completed
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `navigable` in the navigation bar.
   * A wizard step can be navigated to if:
   * - the step is currently not selected
   * - the navigation bar isn't disabled
   * - the navigation mode allows navigation to the step
   *
   * @param {WizardStep} wizardStep The wizard step to be checked
   * @returns {boolean} True if the step can be marked as navigable
   */
  public isNavigable(wizardStep: WizardStep): boolean {
    return !wizardStep.selected && !this.wizardState.disableNavigationBar &&
      this.navigationMode.isNavigable(this.wizardState.getIndexOfStep(wizardStep));
  }
}
