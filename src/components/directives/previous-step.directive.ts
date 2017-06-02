import {Directive, HostListener} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';

/**
 * A directive used to transition to the previous step from the current step
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[previousStep]'
})
export class PreviousStepDirective {
  /**
   * Constructor
   *
   * @param wizard The [[WizardComponent]], this directive is used inside
   */
  constructor(private wizard: WizardComponent) { }

  /**
   * Listener method for `click` events on the component with this directive.
   * After this method is called the wizard will try to transition to the previous step
   */
  @HostListener('click', ['$event']) onClick(): void {
    if (this.wizard.canGoToPreviousStep()) {
      this.wizard.goToPreviousStep();
    }
  }
}
