import {Injectable, EventEmitter} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardStep} from '../util/wizard-step.interface';
import {NavigationMode} from './navigation-mode.interface';

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
   * An array representation of all wizard steps belonging to this model
   */
  public wizardSteps: Array<WizardStep> = [];

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
   * True, if the navigation bar shouldn't be used for navigating
   */
  public disableNavigationBar: boolean;

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * The initial step index, as taken from the [[WizardComponent]]
   */
  private _defaultStepIndex = 0;

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
   * Updates the navigation mode
   *
   * @param navigationMode An already constructed `NavigationMode` instance
   */
  public updateNavigationMode(navigationMode: NavigationMode): void {
    this.navigationMode = navigationMode;
  }

  /**
   * Updates the wizard steps to the new array
   *
   * @param updatedWizardSteps The updated wizard steps
   */
  public updateWizardSteps(updatedWizardSteps: Array<WizardStep>): void {
    // the wizard is currently not in the initialization phase
    if (this.wizardSteps.length > 0 && this.currentStepIndex > -1) {
      this.currentStepIndex = updatedWizardSteps.indexOf(this.wizardSteps[this.currentStepIndex]);
    }

    this.wizardSteps = updatedWizardSteps;
  }

  /**
   * Checks if a given index `stepIndex` is inside the range of possible wizard steps inside this wizard
   *
   * @param stepIndex The to be checked index of a step inside this wizard
   * @returns True if the given `stepIndex` is contained inside this wizard, false otherwise
   */
  public hasStep(stepIndex: number): boolean {
    return this.wizardSteps.length > 0 && 0 <= stepIndex && stepIndex < this.wizardSteps.length;
  }

  /**
   * Checks if this wizard has a previous step, compared to the current step
   *
   * @returns True if this wizard has a previous step before the current step
   */
  public hasPreviousStep(): boolean {
    return this.hasStep(this.currentStepIndex - 1);
  }

  /**
   * Checks if this wizard has a next step, compared to the current step
   *
   * @returns True if this wizard has a next step after the current step
   */
  public hasNextStep(): boolean {
    return this.hasStep(this.currentStepIndex + 1);
  }

  /**
   * Checks if this wizard is currently inside its last step
   *
   * @returns True if the wizard is currently inside its last step
   */
  public isLastStep(): boolean {
    return this.wizardSteps.length > 0 && this.currentStepIndex === this.wizardSteps.length - 1;
  }

  /**
   * Finds the [[WizardStep]] at the given index `stepIndex`.
   * If no [[WizardStep]] exists at the given index an Error is thrown
   *
   * @param stepIndex The given index
   * @returns The found [[WizardStep]] at the given index `stepIndex`
   * @throws An `Error` is thrown, if the given index `stepIndex` doesn't exist
   */
  public getStepAtIndex(stepIndex: number): WizardStep {
    if (!this.hasStep(stepIndex)) {
      throw new Error(`Expected a known step, but got stepIndex: ${stepIndex}.`);
    }

    return this.wizardSteps[stepIndex];
  }

  /**
   * Finds the index of the step with the given `stepId`.
   * If no step with the given `stepId` exists, `-1` is returned
   *
   * @param stepId The given step id
   * @returns The found index of a step with the given step id, or `-1` if no step with the given id is included in the wizard
   */
  public getIndexOfStepWithId(stepId: string): number {
    return this.wizardSteps.findIndex(step => step.stepId === stepId);
  }

  /**
   * Finds the index of the given [[WizardStep]] `step`.
   * If the given [[WizardStep]] is not contained inside this wizard, `-1` is returned
   *
   * @param step The given [[WizardStep]]
   * @returns The found index of `step` or `-1` if the step is not included in the wizard
   */
  public getIndexOfStep(step: WizardStep): number {
    return this.wizardSteps.indexOf(step);
  }

  /**
   * Calculates the correct [[MovingDirection]] value for a given `destinationStep` compared to the `currentStepIndex`.
   *
   * @param destinationStep The given destination step
   * @returns The calculated [[MovingDirection]]
   */
  public getMovingDirection(destinationStep: number): MovingDirection {
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
   * Checks, whether a wizard step, as defined by the given destination index, can be transitioned to.
   *
   * This method controls navigation by [[goToStep]], [[goToPreviousStep]], and [[goToNextStep]] directives.
   * Navigation by navigation bar is governed by [[isNavigable]].
   *
   * @param destinationIndex The index of the destination step
   * @returns A [[Promise]] containing `true`, if the destination step can be transitioned to and false otherwise
   */
  public canGoToStep(destinationIndex: number): Promise<boolean> {
    return this.navigationMode.canGoToStep(this, destinationIndex);
  }

  /**
   * Tries to transition to the wizard step, as denoted by the given destination index.
   *
   * @param destinationIndex The index of the destination wizard step, which should be entered
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  public goToStep(destinationIndex: number, preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    return this.navigationMode.goToStep(this, destinationIndex, preFinalize, postFinalize);
  }

  /**
   * Checks, whether the wizard step, located at the given index, can be navigated to using the navigation bar.
   *
   * @param destinationIndex The index of the destination step
   * @returns True if the step can be navigated to, false otherwise
   */
  public isNavigable(destinationIndex: number): boolean {
    return this.navigationMode.isNavigable(this, destinationIndex);
  }

  /**
   * Resets the state of this wizard.
   */
  public reset(): void {
    this.navigationMode.reset(this);
  }

  /**
   * Tries to transition the wizard to the previous step
   *
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  public goToPreviousStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    return this.navigationMode.goToStep(this, this.currentStepIndex - 1, preFinalize, postFinalize);
  }

  /**
   * Tries to transition the wizard to the next step
   *
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  public goToNextStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    return this.navigationMode.goToStep(this, this.currentStepIndex + 1, preFinalize, postFinalize);
  }
}
