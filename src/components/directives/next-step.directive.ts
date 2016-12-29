import {Directive, Output, HostListener, EventEmitter} from '@angular/core';
import {WizardComponent} from "../components/wizard.component";

@Directive({
  selector: '[[nextStep]]'
})
export class NextStepDirective {
  @Output()
  public finalize = new EventEmitter();

  constructor(private wizard: WizardComponent) { }

  @HostListener('click', ['$event']) onClick(): void {
    this.finalize.emit();

    this.wizard.goToNextStep();
  }
}
