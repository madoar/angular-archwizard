import {Directive, HostListener} from '@angular/core';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';

/**
 * The `previousStep` directive can be used to navigate to the previous step.
 * Compared to the [[NextStepDirective]] it's important to note, that this directive doesn't contain a `finalize` output method.
 *
 * ### Syntax
 *
 * ```html
 * <button previousStep>...</button>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[previousStep]'
})
export class PreviousStepDirective {
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
   * After this method is called the wizard will try to transition to the previous step
   */
  @HostListener('click', ['$event']) onClick(): void {
    if (this.navigationMode.canGoToPreviousStep()) {
      this.navigationMode.goToPreviousStep();
    }
  }
}
