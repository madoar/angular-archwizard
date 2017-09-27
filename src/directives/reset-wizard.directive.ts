import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

/**
 * The `resetWizard` directive can be used to reset the wizard to its initial state.
 * This directive accepts an output, which can be used to specify some custom cleanup work during the reset process.
 *
 * ### Syntax
 *
 * ```html
 * <button resetWizard (finalize)="custom reset task">...</button>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[reset], [resetWizard]'
})
export class ResetWizardDirective {
  /**
   * An [[EventEmitter]] containing some tasks to be done, directly before the wizard is being reset
   */
  @Output()
  public finalize: EventEmitter<void> = new EventEmitter();

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
   * @param wizardState The wizard state
   */
  constructor(private wizardState: WizardState) { }

  /**
   * Resets the wizard
   */
  @HostListener('click', ['$event']) onClick(): void {
    // do some optional cleanup work
    this.finalize.emit();
    // reset the wizard to its initial state
    this.navigationMode.reset();
  }
}
