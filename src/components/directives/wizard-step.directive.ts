import {ContentChild, Directive, EventEmitter, forwardRef, HostBinding, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardStepTitleDirective} from './wizard-step-title.directive';

/**
 * The `wizardStep` directive can be used to define a normal step inside a wizard.
 *
 * ### Syntax
 *
 * With `title` input:
 *
 * ```html
 * <div wizardStep [title]="step title" [navigationSymbol]="symbol" [navigationSymbolFontFamily]="font-family"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    ...
 * </div>
 * ```
 *
 * With `wizardStepTitle` directive:
 *
 * ```html
 * <div wizardStep [navigationSymbol]="symbol" [navigationSymbolFontFamily]="font-family"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    <ng-template wizardStepTitle>
 *        step title
 *    </ng-template>
 *    ...
 * </div>
 * ```
 *
 * ### Example
 *
 * With `title` input:
 *
 * ```html
 * <div wizardStep title="Address information" navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    ...
 * </div>
 * ```
 *
 * With `wizardStepTitle` directive:
 *
 * ```html
 * <div wizardStep navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    <ng-template wizardStepTitle>
 *        Address information
 *    </ng-template>
 * </div>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[wizardStep]',
  providers: [
    { provide: WizardStep, useExisting: forwardRef(() => WizardStepDirective) }
  ]
})
export class WizardStepDirective extends WizardStep {
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
  @Input()
  public canExit: ((direction: MovingDirection) => boolean) | boolean = true;

  /**
   * @inheritDoc
   */
  @Output()
  public stepEnter = new EventEmitter<MovingDirection>();

  /**
   * @inheritDoc
   */
  @Output()
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
   * Constructor
   */
  constructor() {
    super();
  }

  /**
   * @inheritDoc
   */
  enter(direction: MovingDirection): void {
    this.stepEnter.emit(direction);
  }

  /**
   * @inheritDoc
   */
  exit(direction: MovingDirection): void {
    this.stepExit.emit(direction);
  }
}
