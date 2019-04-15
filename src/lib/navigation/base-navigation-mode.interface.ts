import {EventEmitter} from '@angular/core';
import {WizardState} from './wizard-state.model';
import {MovingDirection} from '../util/moving-direction.enum';
import {NavigationMode} from './navigation-mode.interface';

/**
 * Base implementation of [[NavigationMode]]
 *
 * @author Marc Arndt
 */
export abstract class BaseNavigationMode implements NavigationMode {
  constructor(protected wizardState: WizardState) {
  }

  /**
   * Checks, whether a wizard step, as defined by the given destination index, can be transitioned to.
   *
   * This method controls navigation by [[goToStep]], [[goToPreviousStep]], and [[goToNextStep]] directives.
   * Navigation by navigation bar is governed by [[isNavigable]].
   *
   * In this implementation, a destination wizard step can be entered if:
   * - it exists
   * - the current step can be exited in the direction of the destination step
   * - the destination step can be entered in the direction from the current step
   *
   * Subclasses can impose additional restrictions, see [[canTransitionToStep]].
   *
   * @param destinationIndex The index of the destination step
   * @returns A [[Promise]] containing `true`, if the destination step can be transitioned to and false otherwise
   */
  public canGoToStep(destinationIndex: number): Promise<boolean> {
    const hasStep = this.wizardState.hasStep(destinationIndex);

    const movingDirection = this.wizardState.getMovingDirection(destinationIndex);

    const canExitCurrentStep = (previous: boolean) => {
      return previous && this.wizardState.currentStep.canExitStep(movingDirection);
    };

    const canEnterDestinationStep = (previous: boolean) => {
      return previous && this.wizardState.getStepAtIndex(destinationIndex).canEnterStep(movingDirection);
    };

    const canTransitionToStep = (previous: boolean) => {
      return previous && this.canTransitionToStep(destinationIndex);
    };

    return Promise.resolve(hasStep)
      .then(canTransitionToStep)
      // Apply user-defined checks at the end.  They can involve user interaction
      // which is better to be avoided if navigation mode does not actually allow the transition
      // (`canTransitionToStep` returns `false`).
      .then(canExitCurrentStep)
      .then(canEnterDestinationStep);
  }

  /**
   * Imposes additional restrictions for `canGoToStep` in current navigation mode.
   *
   * The base implementation allows transition iff the given step is navigable from the navigation bar (see `isNavigable`).
   * However, in some navigation modes `canTransitionToStep` can be more relaxed to allow navigation to certain steps
   * by previous/next buttons, but not using the navigation bar.
   */
  protected canTransitionToStep(destinationIndex: number): boolean {
    return this.isNavigable(destinationIndex);
  }

  /**
   * Tries to transition to the wizard step, as denoted by the given destination index.
   *
   * When entering the destination step, the following actions are done:
   * - the old current step is set as completed
   * - the old current step is set as unselected
   * - the old current step is exited
   * - the destination step is set as selected
   * - the destination step is entered
   *
   * When the destination step couldn't be entered, the following actions are done:
   * - the current step is exited and entered in the direction `MovingDirection.Stay`
   *
   * @param destinationIndex The index of the destination wizard step, which should be entered
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  public goToStep(destinationIndex: number, preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    this.canGoToStep(destinationIndex).then(navigationAllowed => {
      if (navigationAllowed) {
        // the current step can be exited in the given direction
        const movingDirection: MovingDirection = this.wizardState.getMovingDirection(destinationIndex);

        /* istanbul ignore if */
        if (preFinalize) {
          preFinalize.emit();
        }

        // leave current step
        this.wizardState.currentStep.completed = true;
        this.wizardState.currentStep.exit(movingDirection);
        this.wizardState.currentStep.selected = false;

        this.transition(destinationIndex);

        // go to next step
        this.wizardState.currentStep.enter(movingDirection);
        this.wizardState.currentStep.selected = true;

        /* istanbul ignore if */
        if (postFinalize) {
          postFinalize.emit();
        }
      } else {
        // if the current step can't be left, reenter the current step
        this.wizardState.currentStep.exit(MovingDirection.Stay);
        this.wizardState.currentStep.enter(MovingDirection.Stay);
      }
    });
  }

  /**
   * Transitions the wizard to the given step index.
   *
   * Can perform additional actions in particular navigation mode implementations.
   *
   * @param destinationIndex The index of the destination wizard step
   */
  protected transition(destinationIndex: number): void {
    this.wizardState.currentStepIndex = destinationIndex;
  }

  /**
   * @inheritDoc
   */
  public abstract isNavigable(destinationIndex: number): boolean;

  /**
   * Resets the state of this wizard.
   *
   * A reset transitions the wizard automatically to the first step and sets all steps as incomplete.
   * In addition the whole wizard is set as incomplete.
   */
  public reset(): void {
    this.ensureCanReset();

    // reset the step internal state
    this.wizardState.wizardSteps.forEach(step => {
      step.completed = false;
      step.selected = false;
    });

    // set the first step as the current step
    this.wizardState.currentStepIndex = this.wizardState.defaultStepIndex;
    this.wizardState.currentStep.selected = true;
    this.wizardState.currentStep.enter(MovingDirection.Forwards);
  }

  /**
   * Checks if wizard configuration allows to perform reset.
   *
   * A check failure is indicated by throwing an `Error` with the message discribing the discovered misconfiguration issue.
   *
   * Can include additional checks in particular navigation mode implementations.
   *
   * @throws An `Error` is thrown, if a micconfiguration issue is discovered.
   */
  protected ensureCanReset(): void {
    // the wizard doesn't contain a step with the default step index
    if (!this.wizardState.hasStep(this.wizardState.defaultStepIndex)) {
      throw new Error(`The wizard doesn't contain a step with index ${this.wizardState.defaultStepIndex}`);
    }
  }

  /**
   * @inheritDoc
   */
  public goToPreviousStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    this.goToStep(this.wizardState.currentStepIndex - 1, preFinalize, postFinalize);
  }

  /**
   * @inheritDoc
   */
  public goToNextStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    this.goToStep(this.wizardState.currentStepIndex + 1, preFinalize, postFinalize);
  }
}
