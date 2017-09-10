import {Component} from '@angular/core';
import {WizardComponent} from './wizard.component';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

/**
 * The `wizard-navigation-bar` component contains the navigation bar inside a [[WizardComponent]].
 * To correctly display the navigation bar, it's required to set the right css classes for the navigation bar,
 * otherwise it will look like a normal `ul` component.
 *
 * ### Syntax
 *
 * ```html
 * <wizard-navigation-bar></wizard-navigation-bar>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'wizard-navigation-bar',
  templateUrl: 'wizard-navigation-bar.component.html',
  styleUrls: ['wizard-navigation-bar.component.horizontal.less', 'wizard-navigation-bar.component.vertical.less']
})
export class WizardNavigationBarComponent {
  /**
   * Constructor
   *
   * @param wizardState The state the wizard currently resides in
   * @param navigationMode The navigation mode used for navigating between different steps
   */
  constructor(public wizardState: WizardState, public navigationMode: NavigationMode) { }

  /**
   * Returns all [[WizardStep]]s contained in the wizard
   *
   * @returns {Array<WizardStep>} An array containing all [[WizardStep]]s
   */
  get wizardSteps(): Array<WizardStep> {
    return this.wizardState.wizardSteps;
  }

  /**
   * Returns the number of wizard steps, that need to be displaced in the navigation bar
   *
   * @returns {number} The number of wizard steps to be displayed
   */
  get numberOfWizardSteps(): number {
    return this.wizardState.wizardSteps.length;
  }
}
