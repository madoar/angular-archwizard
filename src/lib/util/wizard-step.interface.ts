import { ContentChild, EventEmitter, HostBinding, Input, Output, Directive } from '@angular/core';
import { WizardStepSymbolDirective } from '../directives/wizard-step-symbol.directive';
import { WizardStepTitleDirective } from '../directives/wizard-step-title.directive';
import { MovingDirection } from './moving-direction.enum';
import { NavigationSymbol } from './navigation-symbol.interface';

/**
 * Basic functionality every type of wizard step needs to provide
 *
 * @author Marc Arndt
 */
@Directive()
/* tslint:disable-next-line directive-class-suffix */
export abstract class WizardStep {
  /**
   * A step title property, which contains the visible header title of the step.
   * This title is then shown inside the navigation bar.
   * Compared to `stepTitle` this property can contain any html content and not only plain text
   */
  @ContentChild(WizardStepTitleDirective)
  public stepTitleTemplate: WizardStepTitleDirective;

  /**
   * A step symbol property that, if defined, overrides `navigationSymbol`.
   * Allows to display arbitrary content as a step symbol instead of plain text.
   */
  @ContentChild(WizardStepSymbolDirective)
  public stepSymbolTemplate: WizardStepSymbolDirective;

  /**
   * A step id, unique to the step
   */
  @Input()
  public stepId: string;

  /**
   * A step title property, which contains the visible header title of the step.
   * This title is only shown inside the navigation bar, if `stepTitleTemplate` is not defined or null.
   */
  @Input()
  public stepTitle: string;

  /**
   * A symbol property, which contains an optional symbol for the step inside the navigation bar.
   * Takes effect when `stepSymbolTemplate` is not defined or null.
   */
  @Input()
  public navigationSymbol: NavigationSymbol = { symbol: '' };

  /**
   * A boolean describing if the wizard step is currently selected
   */
  public selected = false;

  /**
   * A boolean describing if the wizard step has been completed
   */
  public completed = false;

  /**
   * A boolean describing if the wizard step is shown as completed when the wizard is presented to the user
   *
   * Users will typically use `CompletedStepDirective` to set this flag
   */
  public initiallyCompleted = false;

  /**
   * A boolean describing if the wizard step is being edited after being competed
   *
   * This flag can only be true when `selected` is true.
   */
  public editing = false;

  /**
   * A boolean describing, if the wizard step should be selected by default, i.e. after the wizard has been initialized as the initial step
   */
  public defaultSelected = false;

  /**
   * A boolean describing if the wizard step is an optional step
   */
  public optional = false;

  /**
   * A function or boolean deciding, if this step can be entered
   */
  @Input()
  public canEnter: ((direction: MovingDirection) => boolean) | ((direction: MovingDirection) => Promise<boolean>) | boolean = true;

  /**
   * A function or boolean deciding, if this step can be exited
   */
  @Input()
  public canExit: ((direction: MovingDirection) => boolean) | ((direction: MovingDirection) => Promise<boolean>) | boolean = true;

  /**
   * This [[EventEmitter]] is called when the step is entered.
   * The bound method should be used to do initialization work.
   */
  @Output()
  public stepEnter: EventEmitter<MovingDirection> = new EventEmitter<MovingDirection>();

  /**
   * This [[EventEmitter]] is called when the step is exited.
   * The bound method can be used to do cleanup work.
   */
  @Output()
  public stepExit: EventEmitter<MovingDirection> = new EventEmitter<MovingDirection>();

  /**
   * Returns true if this wizard step should be visible to the user.
   * If the step should be visible to the user false is returned, otherwise true
   */
  @HostBinding('hidden')
  public get hidden(): boolean {
    return !this.selected;
  }

  /**
   * This method returns true, if this wizard step can be transitioned with a given direction.
   * Transitioned in this case means either entered or exited, depending on the given `condition` parameter.
   *
   * @param condition A condition variable, deciding if the step can be transitioned
   * @param direction The direction in which this step should be transitioned
   * @returns A [[Promise]] containing `true`, if this step can transitioned in the given direction
   * @throws An `Error` is thrown if `condition` is neither a function nor a boolean
   */
  private static canTransitionStep(condition: ((direction: MovingDirection) => boolean) |
    ((direction: MovingDirection) => Promise<boolean>) |
    boolean,
    direction: MovingDirection): Promise<boolean> {
    if (typeof (condition) === typeof (true)) {
      return Promise.resolve(condition as boolean);
    } else if (condition instanceof Function) {
      return Promise.resolve(condition(direction));
    } else {
      return Promise.reject(new Error(`Input value '${condition}' is neither a boolean nor a function`));
    }
  }

  /**
   * A function called when the step is entered
   *
   * @param direction The direction in which the step is entered
   */
  public enter(direction: MovingDirection): void {
    this.stepEnter.emit(direction);
  }

  /**
   * A function called when the step is exited
   *
   * @param direction The direction in which the step is exited
   */
  public exit(direction: MovingDirection) {
    this.stepExit.emit(direction);
  }

  /**
   * This method returns true, if this wizard step can be entered from the given direction.
   * Because this method depends on the value `canEnter`, it will throw an error, if `canEnter` is neither a boolean
   * nor a function.
   *
   * @param direction The direction in which this step should be entered
   * @returns A [[Promise]] containing `true`, if the step can be entered in the given direction, false otherwise
   * @throws An `Error` is thrown if `anEnter` is neither a function nor a boolean
   */
  public canEnterStep(direction: MovingDirection): Promise<boolean> {
    return WizardStep.canTransitionStep(this.canEnter, direction);
  }

  /**
   * This method returns true, if this wizard step can be exited into given direction.
   * Because this method depends on the value `canExit`, it will throw an error, if `canExit` is neither a boolean
   * nor a function.
   *
   * @param direction The direction in which this step should be left
   * @returns A [[Promise]] containing `true`, if the step can be exited in the given direction, false otherwise
   * @throws An `Error` is thrown if `canExit` is neither a function nor a boolean
   */
  public canExitStep(direction: MovingDirection): Promise<boolean> {
    return WizardStep.canTransitionStep(this.canExit, direction);
  }
}
