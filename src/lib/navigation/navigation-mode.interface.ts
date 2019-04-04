import {EventEmitter} from '@angular/core';
import {WizardState} from './wizard-state.model';

/**
 * An interface containing the basic functionality, which must be provided by a navigation mode.
 * A navigation mode manages the navigation between different wizard steps, this contains the validation, if a step transition can be done
 *
 * For base implementation see [[BaseNavigationMode]].
 *
 * @author Marc Arndt
 */
export interface NavigationMode {

  /**
   * Checks, whether a wizard step, as defined by the given destination index, can be transitioned to.
   *
   * This method controls navigation by [[goToStep]], [[goToPreviousStep]], and [[goToNextStep]] directives.
   * Navigation by navigation bar is governed by [[isNavigable]].
   *
   * @param wizardState The wizard state to operate on
   * @param destinationIndex The index of the destination step
   * @returns A [[Promise]] containing `true`, if the destination step can be transitioned to and false otherwise
   */
  canGoToStep(wizardState: WizardState, destinationIndex: number): Promise<boolean>;

  /**
   * Tries to transition to the wizard step, as denoted by the given destination index.
   *
   * @param wizardState The wizard state to operate on
   * @param destinationIndex The index of the destination wizard step, which should be entered
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  goToStep(
    wizardState: WizardState,
    destinationIndex: number,
    preFinalize?: EventEmitter<void>,
    postFinalize?: EventEmitter<void>): void;

  /**
   * Checks, whether the wizard step, located at the given index, can be navigated to using the navigation bar.
   *
   * @param wizardState The wizard state to operate on
   * @param destinationIndex The index of the destination step
   * @returns True if the step can be navigated to, false otherwise
   */
  isNavigable(wizardState: WizardState, destinationIndex: number): boolean;

  /**
   * Resets the state of this wizard.
   *
   * @param wizardState The wizard state to operate on
   */
  reset(wizardState: WizardState): void;

  /**
   * Tries to transition the wizard to the previous step from the `currentStep`
   *
   * @param wizardState The wizard state to operate on
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  goToPreviousStep(
    wizardState: WizardState,
    preFinalize?: EventEmitter<void>,
    postFinalize?: EventEmitter<void>): void;

  /**
   * Tries to transition the wizard to the next step from the `currentStep`
   *
   * @param wizardState The wizard state to operate on
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  goToNextStep(
    wizardState: WizardState,
    preFinalize?: EventEmitter<void>,
    postFinalize?: EventEmitter<void>): void;
}
