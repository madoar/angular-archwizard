import {Directive, Output, HostListener, EventEmitter} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';

/**
 * A directive used to transition to the next step from the current step
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[nextStep]'
})
export class NextStepDirective {
  /**
   * An EventEmitter to be called when this directive is used to exit the current step.
   * This EventEmitter can be used to do cleanup work
   *
   * @type {EventEmitter}
   */
  @Output()
  public finalize = new EventEmitter();

  /**
   * Constructor
   *
   * @param wizard The [[WizardComponent]], this directive is used inside
   */
  constructor(private wizard: WizardComponent) { }

  /**
   * Listener method for `click` events on the component with this directive.
   * After this method is called the wizard will try to transition to the next step
   */
  @HostListener('click', ['$event']) onClick(): void {
    if (this.wizard.canGoToNextStep()) {
      this.finalize.emit();

      this.wizard.goToNextStep();
    }
  }
}
