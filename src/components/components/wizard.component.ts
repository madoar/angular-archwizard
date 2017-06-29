import {AfterContentInit, Component, ContentChildren, HostBinding, Input, QueryList} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardStep} from '../util/WizardStep';
import {isBoolean} from 'util';

/**
 * The `wizard` component defines the root component of a wizard.
 * Through the setting of input parameters for the `wizard` component it's possible to change the location and size
 * of its navigation bar.
 *
 * ### Syntax
 * ```html
 * <wizard [navBarLocation]="location of navigation bar" [navBarLayout]="layout of navigation bar">
 *     ...
 * </wizard>
 * ```
 *
 * ### Example
 *
 * Without completion step:
 *
 * ```html
 * <wizard navBarLocation="top" navBarLayout="small">
 *     <wizard-step>...</wizard-step>
 *     <wizard-step>...</wizard-step>
 * </wizard>
 * ```
 *
 * With completion step:
 *
 * ```html
 * <wizard navBarLocation="top" navBarLayout="small">
 *     <wizard-step>...</wizard-step>
 *     <wizard-step>...</wizard-step>
 *     <wizard-completion-step>...</wizard-completion-step>
 * </wizard>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'wizard',
  templateUrl: 'wizard.component.html',
  styleUrls: ['wizard.component.less']
})
export class WizardComponent implements AfterContentInit {
  /**
   * A QueryList containing all WizardSteps in this Wizard
   */
  @ContentChildren(WizardStep)
  public wizardSteps: QueryList<WizardStep>;

  /**
   * Returns a list containing all steps inside this [[WizardComponent]].
   * This list contains both the normal [[WizardStepComponent]] inside `wizardSteps` and the optional [[WizardCompletionStepComponent]]
   * inside `completionStep`
   *
   * @returns {Array<WizardStep>} A list containing all steps inside this wizard
   */
  public get allSteps(): Array<WizardStep> {
    const steps: Array<WizardStep> = this.wizardSteps.toArray();

    return steps;
  }

  /**
   * The location of the navigation bar inside the wizard.
   * This location can be either top, bottom, left or right
   *
   * @type {string}
   */
  @Input()
  public navBarLocation = 'top';

  /**
   * The layout of the navigation bar inside the wizard.
   * The layout can be either small, large-filled, large-empty or large-symbols
   *
   * @type {string}
   */
  @Input()
  public navBarLayout = 'small';

  /**
   * Returns true if this wizard uses a horizontal orientation.
   * The wizard uses a horizontal orientation, iff the navigation bar is shown at the top or bottom of this wizard
   *
   * @returns {boolean} True if this wizard uses a horizontal orientation
   */
  @HostBinding('class.horizontal')
  public get horizontalOrientation(): boolean {
    return this.navBarLocation === 'top' || this.navBarLocation === 'bottom';
  }

  /**
   * Returns true if this wizard uses a vertical orientation.
   * The wizard uses a vertical orientation, iff the navigation bar is shown at the left or right of this wizard
   *
   * @returns {boolean} True if this wizard uses a vertical orientation
   */
  @HostBinding('class.vertical')
  public get verticalOrientation(): boolean {
    return this.navBarLocation === 'left' || this.navBarLocation === 'right';
  }

  /**
   * The index of the currently visible and selected step inside the wizardSteps QueryList.
   * If this wizard contains no steps, currentStepIndex is -1
   */
  public currentStepIndex: number = -1;

  /**
   * The WizardStep object belonging to the currently visible and selected step.
   * The currentStep is always the currently selected wizard step.
   * The currentStep can be either completed, if it was visited earlier,
   * or not completed, if it is visited for the first time or its state is currently out of date.
   *
   * If this wizard contains no steps, currentStep is null
   */
  public currentStep: WizardStep;

  /**
   * If this wizard has been completed, `completed` will be true
   */
  public completed: boolean;

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Initialization work
   */
  ngAfterContentInit(): void {
    this.reset();
  }

  /**
   * Checks if a given index `stepIndex` is inside the range of possible wizard steps inside this wizard
   *
   * @param stepIndex The to be checked index of a step inside this wizard
   * @returns {boolean} True if the given `stepIndex` is contained inside this wizard, false otherwise
   */
  hasStep(stepIndex: number): boolean {
    return this.allSteps.length > 0 && 0 <= stepIndex && stepIndex < this.allSteps.length;
  }

  /**
   * Checks if this wizard has a previous step, compared to the current step
   *
   * @returns {boolean} True if this wizard has a previous step before the current step
   */
  hasPreviousStep(): boolean {
    return this.hasStep(this.currentStepIndex - 1);
  }

  /**
   * Checks if this wizard has a next step, compared to the current step
   *
   * @returns {boolean} True if this wizard has a next step after the current step
   */
  hasNextStep(): boolean {
    return this.hasStep(this.currentStepIndex + 1);
  }

  /**
   * Checks if this wizard is currently inside its last step
   *
   * @returns {boolean} True if the wizard is currently inside its last step
   */
  isLastStep(): boolean {
    return this.allSteps.length > 0 && this.currentStepIndex === this.allSteps.length - 1;
  }

  /**
   * Finds the [[WizardStep]] at the given index `stepIndex`.
   * If no [[WizardStep]] exists at the given index an Error is thrown
   *
   * @param stepIndex The given index
   * @returns {undefined|WizardStep} The found [[WizardStep]] at the given index `stepIndex`
   * @throws An `Error` is thrown, if the given index `stepIndex` doesn't exist
   */
  getStepAtIndex(stepIndex: number): WizardStep {
    if (!this.hasStep(stepIndex)) {
      throw new Error(`Expected a known step, but got stepIndex: ${stepIndex}.`);
    }

    return this.allSteps.find((item, index, array) => index === stepIndex);
  }

  /**
   * Find the index of the given [[WizardStep]] `step`.
   * If the given [[WizardStep]] is not contained inside this wizard, `-1` is returned
   *
   * @param step The given [[WizardStep]]
   * @returns {number} The found index of `step` or `-1` if the step is not included in the wizard
   */
  getIndexOfStep(step: WizardStep): number {
    let stepIndex: number = -1;

    this.allSteps.forEach((item, index, array) => {
      if (item === step) {
        stepIndex = index;
      }
    });

    return stepIndex;
  }

  /**
   * Calculates the correct [[MovingDirection]] value for a given `destinationStep` compared to the `currentStepIndex`.
   *
   * @param destinationStep The given destination step
   * @returns {MovingDirection} The calculated [[MovingDirection]]
   */
  getMovingDirection(destinationStep: number): MovingDirection {
    let movingDirection: MovingDirection;

    if (destinationStep > this.currentStepIndex) {
      movingDirection = MovingDirection.Forwards;
    } else if (destinationStep < this.currentStepIndex) {
      movingDirection = MovingDirection.Backwards;
    } else {
      movingDirection = MovingDirection.Stay;
    }

    return movingDirection;
  }

  /**
   * Tries to transition the wizard to the previous step from the `currentStep`
   */
  goToPreviousStep(): void {
    if (this.hasPreviousStep()) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  /**
   * Tries to transition the wizard to the next step from the `currentStep`
   */
  goToNextStep(): void {
    if (this.hasNextStep()) {
      this.goToStep(this.currentStepIndex + 1);
    }
  }

  /**
   * Checks if it's possible to transition to the previous step from the `currentStep`
   *
   * @returns {boolean} True if it's possible to transition to the previous step, false otherwise
   */
  canGoToPreviousStep(): boolean {
    const previousStepIndex = this.currentStepIndex - 1;

    return this.hasStep(previousStepIndex) && this.canGoToStep(previousStepIndex);
  }

  /**
   * Checks if it's possible to transition to the next step from the `currentStep`
   *
   * @returns {boolean} True if it's possible to transition to the next step, false otherwise
   */
  canGoToNextStep(): boolean {
    const nextStepIndex = this.currentStepIndex + 1;

    return this.hasStep(nextStepIndex) && this.canGoToStep(nextStepIndex);
  }

  /**
   * Checks if it's possible to transition to the step with the given `stepIndex` from the `currentStep`.
   *
   * @param stepIndex The to be checked step index
   * @returns {boolean} True if it's possible to transition to the given `stepIndex`
   */
  canGoToStep(stepIndex: number): boolean {
    let result: boolean =
      this.canExitStep(this.currentStep, this.getMovingDirection(stepIndex)) && this.hasStep(stepIndex);

    this.allSteps.forEach((wizardStep, index, array) => {
      if (index < stepIndex && index !== this.currentStepIndex) {
        // all steps before the next step, that aren't the current step, must be completed or optional
        result = result && (wizardStep.completed || wizardStep.optional);
      }
    });

    return result;
  }

  /**
   * Tries to transition to the given `destinationStepIndex`.
   * This will only fail, if the `currentStep` can't be left
   *
   * @param destinationStepIndex The index of the destination step
   */
  goToStep(destinationStepIndex: number): void {
    const destinationStep: WizardStep = this.getStepAtIndex(destinationStepIndex);

    // In which direction is a step transition done?
    const movingDirection: MovingDirection = this.getMovingDirection(destinationStepIndex);

    if (this.canExitStep(this.currentStep, movingDirection)) {
      // is it possible to leave the current step in the given direction?
      this.allSteps.forEach((wizardStep, index, array) => {
        if (index === this.currentStepIndex) {
          // finish processing old step
          wizardStep.completed = true;
        }

        if (this.currentStepIndex > destinationStepIndex && index > destinationStepIndex) {
          // if the next step is before the current step set all steps in between to incomplete
          wizardStep.completed = false;
        }
      });

      // leave current step
      this.currentStep.exit(movingDirection);
      this.currentStep.selected = false;

      // go to next step
      this.currentStepIndex = destinationStepIndex;
      this.currentStep = destinationStep;
      this.currentStep.enter(movingDirection);
      this.currentStep.selected = true;
    } else {
      // if the current step can't be left, reenter the current step
      this.currentStep.exit(MovingDirection.Stay);
      this.currentStep.enter(MovingDirection.Stay);
    }
  }

  /**
   * Resets the state of this wizard.
   * A reset transitions the wizard automatically to the first step and sets all steps as incomplete.
   * In addition the whole wizard is set as incomplete
   */
  reset(): void {
    // reset the step internal state
    this.allSteps.forEach((step, index) => {
      step.completed = false;
      step.selected = false;
    });

    // set the wizard to incomplete
    this.completed = false;

    // set the first step as the current step
    this.currentStepIndex = 0;
    this.currentStep = this.getStepAtIndex(0);
    this.currentStep.selected = true;
    this.currentStep.enter(MovingDirection.Forwards);
  }

  /**
   * This method returns true, if the given step `wizardStep` can be exited and false otherwise.
   * Because this method depends on the value `canExit`, it will throw an error, if `canExit` is neither a boolean
   * nor a function.
   *
   * @param wizardStep The [[WizardStep]] to be checked
   * @param direction The direction in which this step should be left
   * @returns {any} True if the given step `wizardStep` can be exited in the given direction, false otherwise
   * @throws An `Error` is thrown if `wizardStep.canExit` is neither a function nor a boolean
   */
  public canExitStep(wizardStep: WizardStep, direction: MovingDirection): boolean {
    if (isBoolean(wizardStep.canExit)) {
      return wizardStep.canExit as boolean;
    } else if (wizardStep.canExit instanceof Function) {
      return wizardStep.canExit(direction);
    } else {
      throw new Error(`Input value '${wizardStep.canExit}' is neither a boolean nor a function`);
    }
  }
}
