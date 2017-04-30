import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/MovingDirection';
import {isBoolean} from 'util';

@Component({
  selector: 'wizard-step',
  templateUrl: 'wizard-step.component.html',
  styleUrls: ['wizard-step.component.css']
})
export class WizardStepComponent {
  /**
   * This is the visible title of this step in the navigation bar of this wizard.
   */
  @Input()
  public title: string;

  @Input()
  public navigationSymbol: string = "";

  @Input()
  public navigationSymbolFontFamily: string = "Times New Roman";

  /**
   * This value can either be a boolean or a function taking a moving direction and returning boolean.
   *
   * If this value is a boolean the value says, if the step can be exited both in the forwards and backwards direction.
   * If this value is a function, it will be called when an exit operation, like a button press, has been made.
   * This function then receives the direction in which the step should be exited (e.g. Forwards, Backwards and Stay).
   * Next it returns true, if it's ok to leave the step in the given direction and false otherwise.
   *
   * This input can be used to validate the content of the step before allowing the user to leave it.
   * @type {boolean}
   */
  @Input()
  private canExit: ((direction: MovingDirection) => boolean) | boolean = true;

  /**
   * This EventEmitter is called when this step is entered.
   * The bound method should do initializing work.
   * @type {EventEmitter<void>}
   */
  @Output()
  public stepEnter = new EventEmitter<MovingDirection>();

  /**
   * This EventEmitter is called when this step is exited.
   * The bound method should do cleanup work.
   * @type {EventEmitter<void>}
   */
  @Output()
  public stepExit = new EventEmitter<MovingDirection>();

  /**
   * True if this step has been completed.
   * All steps previous to the currently selected step must be completed.
   * @type {boolean}
   */
  @HostBinding('class.done')
  public completed = false;

  /**
   * True if this step is currently selected and therefore currently visible to the user.
   * Always one step is selected at any time.
   * @type {boolean}
   */
  @HostBinding('class.current')
  public selected = false;

  @HostBinding('hidden')
  public get hidden(): boolean {
    return !this.selected;
  }

  /**
   * True if this step is optional.
   * @type {boolean}
   */
  public optional = false;

  constructor() {
  }

  /**
   * This method returns true, if this step can be exited and false otherwise.
   * Because this method depends on the value canExit, it will throw an error, if canExit is neither a boolean
   * nor a function.
   * @param direction The direction in which this step should be left
   * @returns {any}
   */
  canExitStep(direction: MovingDirection): boolean {
    if (isBoolean(this.canExit)) {
      return this.canExit as boolean;
    } else if (this.canExit instanceof Function) {
      return this.canExit(direction);
    } else {
      throw new Error(`Input value 'canExit' is neither a boolean nor a function`);
    }
  }
}
