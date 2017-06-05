/**
 * Created by marc on 20.05.17.
 */

import {Component, ContentChild, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/MovingDirection';
import {WizardComponent} from './wizard.component';
import {WizardStep} from '../util/WizardStep';
import {WizardStepTitleDirective} from '../directives/wizard-step-title.directive';

/**
 * The `wizard-completion-step` component can be used to define a completion/success step at the end of your wizard
 * After a `wizard-completion-step` has been entered, it has the characteristic that the user is blocked from
 * leaving it again to a previous step.
 * In addition entering a `wizard-completion-step` automatically sets the `wizard` amd all steps inside the `wizard`
 * as completed.
 *
 * ### Syntax
 *
 * ```html
 * <wizard-completion-step [title]="title of the wizard step" [navigationSymbol]="navigation symbol"
 *    [navigationSymbolFontFamily]="navigation symbol font family"
 *    (stepEnter)="event emitter to be called when the wizard step is entered"
 *    (stepExit)="event emitter to be called when the wizard step is exited">
 *    ...
 * </wizard-completion-step>
 * ```
 *
 * ### Example
 *
 * ```html
 * <wizard-completion-step title="Step 1" navigationSymbol="1">
 *    ...
 * </wizard-completion-step>
 * ```
 *
 * With a navigation symbol from the `font-awesome` font:
 *
 * ```html
 * <wizard-completion-step title="Step 1" navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    ...
 * </wizard-completion-step>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'wizard-completion-step',
  templateUrl: 'wizard-completion-step.component.html',
  styleUrls: ['wizard-completion-step.component.css']
})
export class WizardCompletionStepComponent implements WizardStep {
  /**
   * @inheritDoc
   */
  @ContentChild(WizardStepTitleDirective)
  public titleTemplate: WizardStepTitleDirective;

  /**
   * @inheritDoc
   */
  @Input()
  public title: string;

  /**
   * @inheritDoc
   */
  @Input()
  public navigationSymbol = '';

  /**
   * @inheritDoc
   */
  @Input()
  public navigationSymbolFontFamily: string;

  /**
   * This EventEmitter is called when the step is entered.
   * The bound method should be used to do initialization work.
   *
   * @type {EventEmitter<MovingDirection>}
   */
  @Output()
  public stepEnter = new EventEmitter<MovingDirection>();

  /**
   * This EventEmitter is called when the step is exited.
   * The bound method can be used to do cleanup work.
   *
   * @type {EventEmitter<MovingDirection>}
   */
  public stepExit = new EventEmitter<MovingDirection>();

  /**
   * Returns if this wizard step should be visible to the user.
   * If the step should be visible to the user false is returned, otherwise true
   *
   * @returns {boolean}
   */
  @HostBinding('hidden')
  public get hidden(): boolean {
    return !this.selected;
  }

  /**
   * @inheritDoc
   */
  public completed: false;

  /**
   * @inheritDoc
   */
  public selected = false;

  /**
   * @inheritDoc
   */
  public optional = false;

  /**
   * @inheritDoc
   */
  public canExit: ((direction: MovingDirection) => boolean) | boolean = false;

  /**
   * Constructor
   * @param wizard The [[WizardComponent]], this completion step is contained inside
   */
  constructor(private wizard: WizardComponent) { }

  /**
   * @inheritDoc
   */
  enter(direction: MovingDirection): void {
    this.wizard.completed = true;
    this.stepEnter.emit(direction);
  }

  /**
   * @inheritDoc
   */
  exit(direction: MovingDirection): void {
    // do nothing
  }
}
