import {WizardState} from './wizard-state.model';
import {EventEmitter} from '@angular/core';
import {NavigationMode} from './navigation-mode.interface';

/**
 * An interface describing the basic functionality, which must be provided by a navigation mode.
 * A navigation mode manages the navigation between different wizard steps, this contains the validation, if a step transition can be done
 *
 * @author Marc Arndt
 */
export abstract class BaseNavigationMode implements NavigationMode {
  constructor(protected wizardState: WizardState) {
  }

  /**
   * @inheritDoc
   */
  abstract canGoToStep(destinationIndex: number): Promise<boolean>;

  /**
   * @inheritDoc
   */
  abstract goToStep(destinationIndex: number, preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void;

  /**
   * @inheritDoc
   */
  abstract isNavigable(destinationIndex: number): boolean;

  /**
   * @inheritDoc
   */
  abstract reset(): void;

  /**
   * @inheritDoc
   */
  goToPreviousStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    if (this.wizardState.hasPreviousStep()) {
      this.goToStep(this.wizardState.currentStepIndex - 1, preFinalize, postFinalize);
    }
  }

  /**
   * @inheritDoc
   */
  goToNextStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    if (this.wizardState.hasNextStep()) {
      this.goToStep(this.wizardState.currentStepIndex + 1, preFinalize, postFinalize);
    }
  }
}
