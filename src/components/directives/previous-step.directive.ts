import {Directive, HostListener} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';

@Directive({
  selector: '[previousStep]'
})
export class PreviousStepDirective {
  constructor(private wizard: WizardComponent) { }

  @HostListener('click', ['$event']) onClick(): void {
    if (this.wizard.canGoToPreviousStep()) {
      this.wizard.goToPreviousStep();
    }
  }
}
