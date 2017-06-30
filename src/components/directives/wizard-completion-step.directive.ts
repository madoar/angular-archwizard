import {ContentChild, Directive, EventEmitter, forwardRef, HostBinding, Inject, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardComponent} from '../components/wizard.component';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardStepTitleDirective} from './wizard-step-title.directive';
import {WizardCompletionStep} from '../util/wizard-completion-step.inferface';

/**
 * The `wizardCompletionStep` directive can be used to define a completion/success step at the end of your wizard
 * After a [[WizardCompletionStep]] has been entered, it has the characteristic that the user is blocked from
 * leaving it again to a previous step.
 * In addition entering a [[WizardCompletionStep]] automatically sets the `wizard` amd all steps inside the `wizard`
 * as completed.
 *
 * ### Syntax
 *
 * ```html
 * <div wizardCompletionStep [title]="title of the wizard step" [navigationSymbol]="navigation symbol"
 *    [navigationSymbolFontFamily]="navigation symbol font family"
 *    (stepEnter)="event emitter to be called when the wizard step is entered"
 *    (stepExit)="event emitter to be called when the wizard step is exited">
 *    ...
 * </div>
 * ```
 *
 * ### Example
 *
 * ```html
 * <div wizardCompletionStep title="Step 1" navigationSymbol="1">
 *    ...
 * </div>
 * ```
 *
 * With a navigation symbol from the `font-awesome` font:
 *
 * ```html
 * <div wizardCompletionStep title="Step 1" navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    ...
 * </div>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[wizardCompletionStep]',
  providers: [
    { provide: WizardStep, useExisting: forwardRef(() => WizardCompletionStepDirective) },
    { provide: WizardCompletionStep, useExisting: forwardRef(() => WizardCompletionStepDirective) }
  ]
})
export class WizardCompletionStepDirective extends WizardCompletionStep {
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
  /* istanbul ignore next */
  constructor(@Inject(forwardRef(() => WizardComponent)) private wizard: WizardComponent) {
    super();
  }

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
    this.wizard.completed = false;
    this.stepExit.emit(direction);
  }
}
