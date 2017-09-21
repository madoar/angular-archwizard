import {WizardStep} from './wizard-step.interface';
import {MovingDirection} from './moving-direction.enum';
import {EventEmitter} from '@angular/core';

/**
 * Basic functionality every wizard completion step needs to provide
 *
 * @author Marc Arndt
 */
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
    // set this completion step as incomplete
    this.completed = false;
    this.stepExit.emit(direction);
  }
}
