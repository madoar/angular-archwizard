import {Component, Input} from '@angular/core';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';
import {WizardStep} from '../util/wizard-step.interface';

/**
 * The `aw-wizard-navigation-bar` component contains the navigation bar inside a [[WizardComponent]].
 * To correctly display the navigation bar, it's required to set the right css classes for the navigation bar,
 * otherwise it will look like a normal `ul` component.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-navigation-bar></aw-wizard-navigation-bar>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'aw-wizard-navigation-bar',
  templateUrl: 'wizard-navigation-bar.component.html',
})
export class WizardNavigationBarComponent {
  /**
   * The direction in which the wizard steps should be shown in the navigation bar.
   * This value can be either `left-to-right` or `right-to-left`
   */
  @Input()
  public direction = 'left-to-right';

  /**
   * Constructor
   *
   * @param wizardState The state the wizard currently resides in
   */
  constructor(public wizardState: WizardState) {
  }

  /**
   * The navigation mode
   */
  public get navigationMode(): NavigationMode {
    return this.wizardState.navigationMode;
  }

  /**
   * Returns all [[WizardStep]]s contained in the wizard
   *
   * @returns An array containing all [[WizardStep]]s
   */
  get wizardSteps(): Array<WizardStep> {
    switch (this.direction) {
      case 'right-to-left':
        return this.wizardState.wizardSteps.slice().reverse();
      case 'left-to-right':
      default:
        return this.wizardState.wizardSteps;
    }
  }

  /**
   * Returns the number of wizard steps, that need to be displaced in the navigation bar
   *
   * @returns The number of wizard steps to be displayed
   */
  get numberOfWizardSteps(): number {
    return this.wizardState.wizardSteps.length;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `current` in the navigation bar
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as `current`
   */
  public isCurrent(wizardStep: WizardStep): boolean {
    return wizardStep.selected;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `done` in the navigation bar
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as `done`
   */
  public isDone(wizardStep: WizardStep): boolean {
    return wizardStep.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `optional` in the navigation bar
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as `optional`
   */
  public isOptional(wizardStep: WizardStep): boolean {
    return wizardStep.optional;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `completed` in the navigation bar
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as `completed`
   */
  public isCompleted(wizardStep: WizardStep): boolean {
    return this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `navigable` in the navigation bar.
   * A wizard step can be navigated to if:
   * - the step is currently not selected
   * - the navigation bar isn't disabled
   * - the navigation mode allows navigation to the step
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as navigable
   */
  public isNavigable(wizardStep: WizardStep): boolean {
    return !wizardStep.selected && !this.wizardState.disableNavigationBar &&
      this.navigationMode.isNavigable(this.wizardState.getIndexOfStep(wizardStep));
  }
}
