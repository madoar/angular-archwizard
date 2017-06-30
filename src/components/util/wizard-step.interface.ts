import {MovingDirection} from './moving-direction.enum';
import {WizardStepTitleDirective} from '../directives/wizard-step-title.directive';
import {EventEmitter} from "@angular/core";

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
   * A boolean describing if the wizard step is an optional step
   */
  optional: boolean;

  /**
   * A function, taking a [[MovingDirection]], or boolean returning true, if the step can be exited and false otherwise.
   */
  canExit: ((direction: MovingDirection) => boolean) | boolean;

  /**
   * This EventEmitter is called when the step is entered.
   * The bound method should be used to do initialization work.
   *
   * @type {EventEmitter<MovingDirection>}
   */
  public stepEnter: EventEmitter<MovingDirection>;

  /**
   * This EventEmitter is called when the step is exited.
   * The bound method can be used to do cleanup work.
   *
   * @type {EventEmitter<MovingDirection>}
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
}
