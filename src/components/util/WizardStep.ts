import {MovingDirection} from './MovingDirection';

/**
 * Basic functionality every wizard step needs to provide
 */
export interface WizardStep {
  /**
   * A title property, which contains the title of the step.
   * This title is then shown inside the navigation bar
   */
  title: string,

  /**
   * A symbol property, which contains an optional symbol for the step inside the navigation bar.
   * If no navigation symbol is specified, an empty string should be used
   */
  navigationSymbol: string,

  /**
   * The font family belonging to the ´navigationSymbol´.
   * If no font family is specified, null should be used
   */
  navigationSymbolFontFamily: string,

  /**
   * A boolean describing if the wizard step has been completed
   */
  completed: boolean,

  /**
   * A boolean describing if the wizard step is currently selected
   */
  selected: boolean,

  /**
   * A boolean describing if the wizard step is an optional step
   */
  optional: boolean,

  /**
   * A function, taking a ´MovingDirection´, or boolean returning true, if the step can be exited and false otherwise.
   */
  canExit: ((direction: MovingDirection) => boolean) | boolean,

  /**
   * A function called when the step is entered
   *
   * @param direction The direction in which the step is entered
   */
  enter(direction: MovingDirection): void,

  /**
   * A function called when the step is exited
   *
   * @param direction The direction in which the step is exited
   */
  exit(direction: MovingDirection): void
}
