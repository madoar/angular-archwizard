/**
 * Created by marc on 20.05.17.
 */

import {Component, EventEmitter, HostBinding, Input, Output} from '@angular/core';
import {MovingDirection} from '../util/MovingDirection';
import {WizardComponent} from './wizard.component';
import {WizardStep} from '../util/WizardStep';

@Component({
  selector: 'success-step',
  templateUrl: 'success-step.component.html',
  styleUrls: ['success-step.component.css']
})
export class SuccessStepComponent implements WizardStep {
  /**
   * The visible title of this step in the navigation bar of this wizard
   */
  @Input()
  public title: string;

  /**
   * The symbol which is visible inside the circle belonging to this wizard step in the navigation bar.
   *
   * @type {string}
   */
  @Input()
  public navigationSymbol = '';

  /**
   * The font in which the navigation symbol should be shown.
   * If no font is specified the system one should be taken.
   */
  @Input()
  public navigationSymbolFontFamily: string;

  /**
   * This EventEmitter is called when this step is entered.
   * The bound method should do initializing work.
   *
   * @type {EventEmitter<MovingDirection>}
   */
  @Output()
  public stepEnter = new EventEmitter<MovingDirection>();

  /**
   * This EventEmitter is called when this step is exited.
   *
   * @type {EventEmitter<MovingDirection>}
   */
  public stepExit = new EventEmitter<MovingDirection>();

  @HostBinding('hidden')
  public get hidden(): boolean {
    return !this.selected;
  }

  public completed: false;
  public selected = false;
  public optional = false;

  constructor(wizard: WizardComponent) {
    this.stepEnter.emit = direction => wizard.completed = true;
  }

  canExitStep(direction: MovingDirection): boolean {
    return false;
  }
}
