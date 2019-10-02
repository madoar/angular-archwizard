import {EventEmitter, Directive} from '@angular/core';
import {WizardStep} from './wizard-step.interface';
import {MovingDirection} from './moving-direction.enum';

/**
 * Basic functionality every wizard completion step needs to provide
 *
 * @author Marc Arndt
 */
@Directive({
  // Use a dummy decorator to make Ivy recognize @Input's inherited from this class
  // https://github.com/angular/angular/issues/30080#issuecomment-536287895
  selector: 'aw-abstract-wizard-completion-step',
})
// tslint:disable-next-line:directive-class-suffix
export class WizardCompletionStep extends WizardStep {
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
