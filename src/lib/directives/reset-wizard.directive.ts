import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';

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
   * @param wizard The wizard component
   */
  constructor(private wizard: WizardComponent) {
  }

  /**
   * Resets the wizard
   */
  @HostListener('click')
  public onClick(): void {
    // do some optional cleanup work
    this.finalize.emit();
    // reset the wizard to its initial state
    this.wizard.reset();
  }
}
