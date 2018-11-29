import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {WizardStep} from '../util';
import {NavigationMode, WizardState} from '../navigation';
import {NavBarDirectionTypes} from '../util/nav-bar-direction-types.enum';

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
  styleUrls: ['wizard-navigation-bar.component.horizontal.less', 'wizard-navigation-bar.component.vertical.less'],
  encapsulation: ViewEncapsulation.None,
})
export class WizardNavigationBarComponent implements OnInit {
  /**
   * The direction in which the wizard steps should be shown in the navigation bar.
   * This value can be either `left-to-right` or `right-to-left`
   */
  @Input()
  public direction: NavBarDirectionTypes = NavBarDirectionTypes.LTR;

  /**
   * Step Changed event that fired with the new current step
   */
  @Output()
  stepChanged: EventEmitter<WizardStep> = new EventEmitter<WizardStep>();

  /**
   * The navigation mode
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

  ngOnInit() {
    if (!this.navigationMode) {
      throw Error('no navigation mode founded');
    }

    this.wizardState.stepChangedObs.subscribe((currentStep: WizardStep) => {
      this.stepChanged.emit(currentStep);
    });
  }

  /**
   * Returns all [[WizardStep]]s contained in the wizard
   *
   * @returns An array containing all [[WizardStep]]s
   */
  get wizardSteps(): Array<WizardStep> {
    return (this.direction === NavBarDirectionTypes.RTL)
      ? this.wizardState.wizardSteps.slice().reverse()
      : this.wizardState.wizardSteps;
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
   * @returns True if the step can be marked as current
   */
  public isCurrent(wizardStep: WizardStep): boolean {
    return wizardStep.selected && !wizardStep.completed && !this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `done` in the navigation bar
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as done
   */
  public isDone(wizardStep: WizardStep): boolean {
    return (wizardStep.completed && !wizardStep.selected) || this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `default` in the navigation bar
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as default
   */
  public isDefault(wizardStep: WizardStep): boolean {
    return !wizardStep.optional && !wizardStep.completed && !wizardStep.selected && !this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `editing` in the navigation bar
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as editing
   */
  public isEditing(wizardStep: WizardStep): boolean {
    return wizardStep.selected && wizardStep.completed && !this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `optional` in the navigation bar
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as optional
   */
  public isOptional(wizardStep: WizardStep): boolean {
    return wizardStep.optional && !wizardStep.completed && !wizardStep.selected && !this.wizardState.completed;
  }

  /**
   * Checks, whether a [[WizardStep]] can be marked as `disabled` in the navigation bar
   *
   * @param wizardStep The wizard step to be checked
   * @returns True if the step can be marked as disabled
   */
  public isDisabled(wizardStep: WizardStep): boolean {
    return wizardStep.disabled;
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

  /**
   * Get StepClass
   * @param step step to get his class to
   * @return the classes of the step
   */
  getStepClass(step): any {
    const stepClass = {
      default: this.isDefault(step),
      current: this.isCurrent(step),
      done: this.isDone(step),
      editing: this.isEditing(step),
      optional: this.isOptional(step),
      navigable: this.isNavigable(step),
      disabled: this.isDisabled(step)
    };
    stepClass[step.customNavBarClass] = !!step.customNavBarClass;

    return stepClass;
  }
}
