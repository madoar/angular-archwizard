import {Directive, Host, OnInit} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';

/**
 * The `selected` directive can be used on a [[WizardStep]] to set it as selected after the wizard initialisation or a reset.
 *
 * ### Syntax
 *
 * ```html
 * <wizard-step title="Step title" selected>
 *     ...
 * </wizard-step>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[selected]'
})
export class SelectedDirective implements OnInit {
  /**
   * Constructor
   * @param wizardStep The wizard step, which should be selected by default
   */
  constructor(@Host() private wizardStep: WizardStep) { }

  /**
   * Initialization work
   */
  ngOnInit(): void {
    this.wizardStep.defaultSelected = true;
  }
}
