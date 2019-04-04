import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';

/**
 * The `awResetWizard` directive can be used to reset the wizard to its initial state.
 * This directive accepts an output, which can be used to specify some custom cleanup work during the reset process.
 *
 * ### Syntax
 *
 * ```html
 * <button awResetWizard (finalize)="custom reset task">...</button>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[awResetWizard]'
})
export class ResetWizardDirective {
  /**
   * An [[EventEmitter]] containing some tasks to be done, directly before the wizard is being reset
   */
  @Output()
  public finalize: EventEmitter<void> = new EventEmitter();

  /**
   * Constructor
   *
   * @param wizardState The wizard state
   */
  constructor(private wizardState: WizardState) {
  }

  /**
   * The navigation mode
   */
  private get navigationMode(): NavigationMode {
    return this.wizardState.navigationMode;
  }

  /**
   * Resets the wizard
   */
  @HostListener('click', ['$event'])
  public onClick(event: Event): void {
    // do some optional cleanup work
    this.finalize.emit();
    // reset the wizard to its initial state
    this.navigationMode.reset(this.wizardState);
  }
}
