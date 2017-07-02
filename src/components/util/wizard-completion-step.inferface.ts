import {WizardStep} from './wizard-step.interface';

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
