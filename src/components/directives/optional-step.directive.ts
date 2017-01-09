import {Directive, OnInit} from '@angular/core';
import {WizardStepComponent} from "../components/wizard-step.component";

@Directive({
  selector: 'wizard-step[optionalStep]'
})
export class OptionalStepDirective implements OnInit {

  constructor(private wizardStep: WizardStepComponent ) { }

  ngOnInit(): void {
    this.wizardStep.optional = true;
  }
}
