import {EventEmitter, Directive} from '@angular/core';
import {WizardStep} from './wizard-step.interface';
import {MovingDirection} from './moving-direction.enum';

/**
 * Basic functionality every wizard completion step needs to provide
 *
 * @author Marc Arndt
 */
@Directive()
/* tslint:disable-next-line directive-class-suffix */
export abstract class WizardCompletionStep extends WizardStep {
  /**
   * @inheritDoc
   */
  public stepExit = new EventEmitter<MovingDirection>();

  /**
   * @inheritDoc
   */
  public canExit: ((direction: MovingDirection) => boolean) | boolean = false;

  /**
   * @inheritDoc
   */
  public enter(direction: MovingDirection): void {
    this.completed = true;
    this.stepEnter.emit(direction);
  }

  /**
   * @inheritDoc
   */
  public exit(direction: MovingDirection): void {
    // set this completion step as incomplete (unless it happens to be initiallyCompleted)
    this.completed = this.initiallyCompleted;
    this.stepExit.emit(direction);
  }
}
