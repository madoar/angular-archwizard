import {MovingDirection} from './moving-direction.enum';
import {WizardStepTitleDirective} from '../directives/wizard-step-title.directive';
import {EventEmitter} from '@angular/core';
import {isBoolean} from 'util';

/**
 * Basic functionality every type of wizard step needs to provide
 *
 * @author Marc Arndt
 */
export abstract class WizardStep {
  /**
   * A title property, which contains the title of the step.
   * This title is then shown inside the navigation bar.
   * Compared to `title` this property can contain any html content and not only plain text
   */
  titleTemplate: WizardStepTitleDirective;

  /**
   * A title property, which contains the title of the step.
   * This title is only shown inside the navigation bar, if `titleTemplate` is not defined or null.
   */
  title: string;

  /**
   * A symbol property, which contains an optional symbol for the step inside the navigation bar.
   * If no navigation symbol is specified, an empty string should be used
   */
  navigationSymbol: string;

  /**
   * The font family belonging to the `navigationSymbol`.
   * If no font family is specified, null should be used
   */
  navigationSymbolFontFamily: string;

  /**
   * A boolean describing if the wizard step has been completed
   */
  completed: boolean;

  /**
   * A boolean describing if the wizard step is currently selected
   */
  selected: boolean;

  /**
   * A boolean describing, if the wizard step should be selected by default, i.e. after the wizard has been initialized as the initial step
   */
  defaultSelected: boolean;

  /**
   * A boolean describing if the wizard step is an optional step
   */
  optional: boolean;

  /**
   * A function taking a [[MovingDirection]], or boolean returning true, if the step can be entered and false otherwise.
   */
  canEnter: ((direction: MovingDirection) => boolean) | boolean;

  /**
   * A function taking a [[MovingDirection]], or boolean returning true, if the step can be exited and false otherwise.
   */
  canExit: ((direction: MovingDirection) => boolean) | boolean;

  /**
   * This EventEmitter is called when the step is entered.
   * The bound method should be used to do initialization work.
   */
  public stepEnter: EventEmitter<MovingDirection>;

  /**
   * This EventEmitter is called when the step is exited.
   * The bound method can be used to do cleanup work.
   */
  public stepExit: EventEmitter<MovingDirection>;

  /**
   * Returns if this wizard step should be visible to the user.
   * If the step should be visible to the user false is returned, otherwise true
   *
   * @returns {boolean}
   */
  abstract get hidden(): boolean;

  /**
   * A function called when the step is entered
   *
   * @param direction The direction in which the step is entered
   */
  abstract enter(direction: MovingDirection): void;

  /**
   * A function called when the step is exited
   *
   * @param direction The direction in which the step is exited
   */
  abstract exit(direction: MovingDirection): void;

  /**
   * This method returns true, if the given step `wizardStep` can be entered and false otherwise.
   * Because this method depends on the value `canEnter`, it will throw an error, if `canEnter` is neither a boolean
   * nor a function.
   *
   * @param direction The direction in which this step should be entered
   * @returns {boolean} True if the given step `wizardStep` can be entered in the given direction, false otherwise
   * @throws An `Error` is thrown if `wizardStep.canEnter` is neither a function nor a boolean
   */
  public canEnterStep(direction: MovingDirection): boolean {
    if (isBoolean(this.canEnter)) {
      return this.canEnter as boolean;
    } else if (this.canEnter instanceof Function) {
      return this.canEnter(direction);
    } else {
      throw new Error(`Input value '${this.canEnter}' is neither a boolean nor a function`);
    }
  }

  /**
   * This method returns true, if the given step `wizardStep` can be exited and false otherwise.
   * Because this method depends on the value `canExit`, it will throw an error, if `canExit` is neither a boolean
   * nor a function.
   *
   * @param direction The direction in which this step should be left
   * @returns {boolean} True if the given step `wizardStep` can be exited in the given direction, false otherwise
   * @throws An `Error` is thrown if `wizardStep.canExit` is neither a function nor a boolean
   */
  public canExitStep(direction: MovingDirection): boolean {
    if (isBoolean(this.canExit)) {
      return this.canExit as boolean;
    } else if (this.canExit instanceof Function) {
      return this.canExit(direction);
    } else {
      throw new Error(`Input value '${this.canExit}' is neither a boolean nor a function`);
    }
  }
}
