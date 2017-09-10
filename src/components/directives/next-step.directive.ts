import {Directive, Output, HostListener, EventEmitter} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {navigationModeFactory} from '../navigation/navigation-mode.provider';

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
   * Constructor
   *
   * @param navigationMode The navigation mode, used for the wizard
   */
  constructor(private navigationMode: NavigationMode) { }

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
