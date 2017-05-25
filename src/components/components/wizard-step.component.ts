import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/MovingDirection';
import {isBoolean} from 'util';
import {WizardStep} from '../util/WizardStep';

@Component({
  selector: 'wizard-step',
  templateUrl: 'wizard-step.component.html',
  styleUrls: ['wizard-step.component.css']
})
export class WizardStepComponent implements WizardStep {
  /**
   * The visible title of this step in the navigation bar of this wizard.
   */
  @Input()
  public title: string;

  /**
   * The symbol which is visible inside the circle belonging to this wizard step in the navigation bar.
   *
   * @type {string}
   */
  @Input()
  public navigationSymbol = '';

  /**
   * The font in which the navigation symbol should be shown.
   * If no font is specified the system one should be taken.
   */
  @Input()
  public navigationSymbolFontFamily: string;

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
  public canExit: ((direction: MovingDirection) => boolean) | boolean = true;

  /**
   * This EventEmitter is called when this step is entered.
   * The bound method should do initializing work.
   *
   * @type {EventEmitter<MovingDirection>}
   */
  @Output()
  public stepEnter = new EventEmitter<MovingDirection>();

  /**
   * This EventEmitter is called when this step is exited.
   * The bound method should do cleanup work.
   *
   * @type {EventEmitter<MovingDirection>}
   */
  @Output()
  public stepExit = new EventEmitter<MovingDirection>();

  @HostBinding('hidden')
  public get hidden(): boolean {
    return !this.selected;
  }

  /**
   * True if this step has been completed.
   * All steps previous to the currently selected step must be completed.
   *
   * @type {boolean}
   */
  public completed = false;

  /**
   * True if this step is currently selected and therefore currently visible to the user.
   * Always one step is selected at any time.
   *
   * @type {boolean}
   */
  public selected = false;

  /**
   * True if this step is optional.
   *
   * @type {boolean}
   */
  public optional = false;

  constructor() {
  }

  enter(direction: MovingDirection): void {
    this.stepEnter.emit(direction);
  }

  exit(direction: MovingDirection): void {
    this.stepExit.emit(direction);
  }
}
