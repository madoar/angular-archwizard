import {WizardStep} from './wizard-step.interface';
import {EventEmitter} from '@angular/core';
import {MovingDirection} from './moving-direction.enum';

/**
 * Basic functionality every wizard completion step needs to provide
 *
 * @author Marc Arndt
 */
export abstract class WizardCompletionStep extends WizardStep {
  /**
   * Constructor
   */
  constructor() {
    super();
  }
}
