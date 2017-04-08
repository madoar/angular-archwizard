/**
 * Created by marc on 09.01.17.
 */

import {Directive, Output, HostListener, EventEmitter, Input} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {WizardStepComponent} from '../components/wizard-step.component';

@Directive({
  selector: '[goToStep]'
})
export class GoToStepDirective {
  @Output()
  public finalize = new EventEmitter();

  @Input()
  public goToStep: WizardStepComponent | number | string;

  constructor(private wizard: WizardComponent) { }

  @HostListener('click', ['$event']) onClick(): void {
    if (this.wizard.canGoToStep(this.goToStep)) {
      this.finalize.emit();

      this.wizard.goToStep(this.goToStep);
    }
  }
}
