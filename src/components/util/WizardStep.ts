import {MovingDirection} from './moving-direction.enum';
import {WizardStepTitleDirective} from '../directives/wizard-step-title.directive';

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
   * A function called when the step is entered
   *
   * @param direction The direction in which the step is entered
   */
  enter: (direction: MovingDirection) => void;

  /**
   * A function called when the step is exited
   *
   * @param direction The direction in which the step is exited
   */
  exit: (direction: MovingDirection) => void;
}

/**
 * Checks whether the given `value` implements the interface [[WizardStep]].
 *
 * @param value The value to be checked
 * @returns {boolean} True if the given value implements interface [[WizardStep]]
 */
export function isWizardStep(value: any): value is WizardStep {
  return 'titleTemplate' in value && 'title' in value;
}
