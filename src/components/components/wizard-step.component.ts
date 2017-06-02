import {Component, ContentChild, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/MovingDirection';
import {WizardStep} from '../util/WizardStep';
import {WizardStepTitleDirective} from '../directives/wizard-step-title.directive';

/**
 * A wizard step component to be used for normal steps
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'wizard-step',
  templateUrl: 'wizard-step.component.html',
  styleUrls: ['wizard-step.component.css']
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
