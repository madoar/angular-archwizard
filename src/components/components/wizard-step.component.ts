import {Component, ContentChild, EventEmitter, forwardRef, HostBinding, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardStepTitleDirective} from '../directives/wizard-step-title.directive';

/**
 * The `wizard-step` component is used to define a normal step inside a wizard.
 *
 * ### Syntax
 *
 * With `title` input:
 *
 * ```html
 * <wizard-step [title]="step title" [navigationSymbol]="symbol" [navigationSymbolFontFamily]="font-family"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    ...
 * </wizard-step>
 * ```
 *
 * With `wizardStepTitle` directive:
 *
 * ```html
 * <wizard-step [navigationSymbol]="symbol" [navigationSymbolFontFamily]="font-family"
 *    [canExit]="deciding function" (stepEnter)="enter function" (stepExit)="exit function">
 *    <ng-template wizardStepTitle>
 *        step title
 *    </ng-template>
 *    ...
 * </wizard-step>
 * ```
 *
 * ### Example
 *
 * With `title` input:
 *
 * ```html
 * <wizard-step title="Address information" navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    ...
 * </wizard-step>
 * ```
 *
 * With `wizardStepTitle` directive:
 *
 * ```html
 * <wizard-step navigationSymbol="&#xf1ba;" navigationSymbolFontFamily="FontAwesome">
 *    <ng-template wizardStepTitle>
 *        Address information
 *    </ng-template>
 * </wizard-step>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'wizard-step',
  templateUrl: 'wizard-step.component.html',
  styleUrls: ['wizard-step.component.css'],
  providers: [
    { provide: WizardStep, useExisting: forwardRef(() => WizardStepComponent) }
  ]
})
export class WizardStepComponent implements WizardStep {
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
  @Output()
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
