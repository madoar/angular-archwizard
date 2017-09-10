/**
 * Created by marc on 20.05.17.
 */

import {Component, ContentChild, EventEmitter, forwardRef, HostBinding, Inject, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardComponent} from './wizard.component';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardStepTitleDirective} from '../directives/wizard-step-title.directive';
import {WizardCompletionStep} from '../util/wizard-completion-step.inferface';

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
  styleUrls: ['wizard-completion-step.component.css'],
  providers: [
    { provide: WizardStep, useExisting: forwardRef(() => WizardCompletionStepComponent) },
    { provide: WizardCompletionStep, useExisting: forwardRef(() => WizardCompletionStepComponent) }
  ]
})
export class WizardCompletionStepComponent extends WizardCompletionStep {
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
   * @inheritDoc
   */
  @Output()
  public stepEnter = new EventEmitter<MovingDirection>();

  /**
   * @inheritDoc
   */
  public stepExit = new EventEmitter<MovingDirection>();

  /**
   * @inheritDoc
   */
  @HostBinding('hidden')
  public get hidden(): boolean {
    return !this.selected;
  }

  /**
   * @inheritDoc
   */
  public completed = false;

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
   */
  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  enter(direction: MovingDirection): void {
    this.completed = true;
    this.stepEnter.emit(direction);
  }

  /**
   * @inheritDoc
   */
  exit(direction: MovingDirection): void {
    // set this completion step as incomplete
    this.completed = false;
    this.stepExit.emit(direction);
  }
}
