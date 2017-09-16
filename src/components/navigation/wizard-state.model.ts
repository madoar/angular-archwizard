import {Injectable, QueryList} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';
import {MovingDirection} from '../util/moving-direction.enum';
import {NavigationMode} from './navigation-mode.interface';
import {navigationModeFactory} from './navigation-mode.provider';

/**
 * The internal model/state of a wizard.
 * This model contains:
 * - an array with all steps the wizard contains
 * - the index of the step the wizard currently resides inside
 * - information about the completeness of the wizard
 * - some additional helper methods
 *
 * @author Marc Arndt
 */
@Injectable()
export class WizardState {
  /**
   * The internal [[QueryList]] with all [[WizardStep]] objects belonging to the wizard model
   */
  private _wizardSteps: QueryList<WizardStep>;

  /**
   * The initial step index, as taken from the [[WizardComponent]]
   */
  private _defaultStepIndex = 0;

  /**
   * An array representation of all wizard steps belonging to this model
   */
  public get wizardSteps(): Array<WizardStep> {
    /* istanbul ignore else */
    if (this._wizardSteps) {
      return this._wizardSteps.toArray();
    } else {
      return [];
    }
  }

  /**
   * Sets the initial default step.
   * Beware: This initial default is only used if no wizard step has been enhanced with the `selected` directive
   *
   * @param defaultStepIndex The new default wizard step index
   */
  public set defaultStepIndex(defaultStepIndex) {
    this._defaultStepIndex = defaultStepIndex;
  }

  /**
   * The initial step index.
   * This value can be either:
   * - the index of a wizard step with a `selected` directive, or
   * - the default step index, set in the [[WizardComponent]]
   */
  public get defaultStepIndex(): number {
    const foundDefaultStep = this.wizardSteps.find(step => step.defaultSelected);

    if (foundDefaultStep) {
      return this.getIndexOfStep(foundDefaultStep);
    } else {
      return this._defaultStepIndex;
    }
  };

  /**
   * The index of the currently visible and selected step inside the wizardSteps QueryList.
   * If this wizard contains no steps, currentStepIndex is -1
   */
  public currentStepIndex = -1;

  /**
   * The navigation mode used to navigate inside the wizard
   */
  public navigationMode: NavigationMode;

  /**
   * The WizardStep object belonging to the currently visible and selected step.
   * The currentStep is always the currently selected wizard step.
   * The currentStep can be either completed, if it was visited earlier,
   * or not completed, if it is visited for the first time or its state is currently out of date.
   *
   * If this wizard contains no steps, currentStep is null
   */
  public get currentStep(): WizardStep {
    if (this.hasStep(this.currentStepIndex)) {
      return this.wizardSteps[this.currentStepIndex];
    } else {
      return null;
    }
  }

  /**
   * The completeness of the wizard.
   * If the wizard has been completed, i.e. all steps are either completed or optional, this value is true, otherwise it is false
   */
  public get completed(): boolean {
    return this.wizardSteps.every(step => step.completed || step.optional);
  }

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Initializes the wizard state with the given array of wizard steps.
   * This process contains a reset of the wizard
   *
   * @param {QueryList<WizardStep>} wizardSteps The wizard steps
   */
  initialize(wizardSteps: QueryList<WizardStep>, navigationMode: string, defaultStepIndex: number): void {
    this._wizardSteps = wizardSteps;
    this._defaultStepIndex = defaultStepIndex;
    this.navigationMode = navigationModeFactory(navigationMode, this);
    this.navigationMode.reset();
  }

  /**
   * Checks if a given index `stepIndex` is inside the range of possible wizard steps inside this wizard
   *
   * @param stepIndex The to be checked index of a step inside this wizard
   * @returns {boolean} True if the given `stepIndex` is contained inside this wizard, false otherwise
   */
  hasStep(stepIndex: number): boolean {
    return this.wizardSteps.length > 0 && 0 <= stepIndex && stepIndex < this.wizardSteps.length;
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
    return this.wizardSteps.length > 0 && this.currentStepIndex === this.wizardSteps.length - 1;
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

    return this.wizardSteps[stepIndex];
  }

  /**
   * Find the index of the given [[WizardStep]] `step`.
   * If the given [[WizardStep]] is not contained inside this wizard, `-1` is returned
   *
   * @param step The given [[WizardStep]]
   * @returns {number} The found index of `step` or `-1` if the step is not included in the wizard
   */
  getIndexOfStep(step: WizardStep): number {
    return this.wizardSteps.indexOf(step);
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
}
