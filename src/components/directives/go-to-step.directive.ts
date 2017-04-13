/**
 * Created by marc on 09.01.17.
 */

import {Directive, Output, HostListener, EventEmitter, Input, Optional} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {WizardStepComponent} from '../components/wizard-step.component';
import {isStepOffset, StepOffset} from '../util/StepOffset';
import {isNumber, isString} from 'util';

@Directive({
  selector: '[goToStep]'
})
export class GoToStepDirective {
  @Output()
  public finalize = new EventEmitter();

  @Input()
  private goToStep: WizardStepComponent | StepOffset | number | string;

  constructor(private wizard: WizardComponent, @Optional() private wizardStep: WizardStepComponent) { }

  get destinationStep(): number {
    let destinationStep: number;

    if (isNumber(this.goToStep)) {
      destinationStep = this.goToStep as number;
    } else if (isString(this.goToStep)) {
      destinationStep = parseInt(this.goToStep as string, 10);
    } else if (isStepOffset(this.goToStep) && this.wizardStep !== null) {
      destinationStep = this.wizard.getIndexOfStep(this.wizardStep) + this.goToStep.stepOffset;
    } else if (this.goToStep instanceof WizardStepComponent) {
      destinationStep = this.wizard.getIndexOfStep(this.goToStep);
    } else {
      throw new Error(`Input 'goToStep' is neither a WizardStep, StepOffset, number or string`);
    }

    return destinationStep;
  }

  @HostListener('click', ['$event']) onClick(): void {
    if (this.wizard.canGoToStep(this.destinationStep)) {
      this.finalize.emit();

      this.wizard.goToStep(this.destinationStep);
    }
  }
}
