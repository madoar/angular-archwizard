import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';

/**
 * The `nextStep` directive can be used to navigate to the next step.
 *
 * ### Syntax
 *
 * ```html
 * <button nextStep (finalize)="finalize method">...</button>
 * ```
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
   * The navigation mode
   *
   * @returns {NavigationMode}
   */
  private get navigationMode(): NavigationMode {
    return this.wizardState.navigationMode;
  }

  /**
   * Constructor
   *
   * @param wizardState The state of the wizard
   */
  constructor(private wizardState: WizardState) { }

  /**
   * Listener method for `click` events on the component with this directive.
   * After this method is called the wizard will try to transition to the next step
   */
  @HostListener('click', ['$event']) onClick(): void {
    if (this.navigationMode.canGoToNextStep()) {
      this.finalize.emit();

      this.navigationMode.goToNextStep();
    }
  }
}
