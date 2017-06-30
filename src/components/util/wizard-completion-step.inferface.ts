import {WizardStep} from './wizard-step.interface';
import {EventEmitter} from '@angular/core';
import {MovingDirection} from './moving-direction.enum';

export abstract class WizardCompletionStep extends WizardStep {
  public stepExit: EventEmitter<MovingDirection>;

  constructor() {
    super();
  }
}
