import {Directive, Host, OnInit} from '@angular/core';
import {WizardStep} from '../util';

/**
 * The `awSelectedStep` directive can be used on a [[WizardStep]] to set it as selected after the wizard initialisation or a reset.
 *
 * ### Syntax
 *
 * ```html
 * <aw-wizard-step stepTitle="Step title" awSelectedStep>
 *     ...
 * </aw-wizard-step>
 * ```
 *
 * @author Marc Arndt
 */
@Directive({
  selector: '[awSelectedStep]'
})
export class SelectedStepDirective implements OnInit {
  /**
   * Constructor
   *
   * @param wizardStep The wizard step, which should be selected by default
   */
  constructor(@Host() private wizardStep: WizardStep) {
  }

  /**
   * Initialization work
   */
  ngOnInit(): void {
    this.wizardStep.defaultSelected = true;
  }
}
