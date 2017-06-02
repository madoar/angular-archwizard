import {Directive, OnInit} from '@angular/core';
import {WizardStepComponent} from '../components/wizard-step.component';

/**
 * A directive used to define an optional [[WizardStep]].
 * An optional [[WizardStep]] is a [[WizardStep]] that doesn't need to be completed to transition to later wizard steps
 */
@Directive({
  selector: 'wizard-step[optionalStep]'
})
export class OptionalStepDirective implements OnInit {
  /**
   * Constructor
   *
   * @param wizardStep The wizard, which contains this [[OptionalStepDirective]]
   */
  constructor(private wizardStep: WizardStepComponent ) { }

  /**
   * Initialization work
   */
  ngOnInit(): void {
    this.wizardStep.optional = true;
  }
}
