import {MovingDirection} from './MovingDirection';
import {EventEmitter} from '@angular/core';

export interface WizardStep {
  title: string,
  navigationSymbol: string,
  navigationSymbolFontFamily: string,
  completed: boolean,
  selected: boolean,
  optional: boolean,
  stepEnter: EventEmitter<MovingDirection>,
  stepExit: EventEmitter<MovingDirection>,
  canExitStep(direction: MovingDirection): boolean
}
