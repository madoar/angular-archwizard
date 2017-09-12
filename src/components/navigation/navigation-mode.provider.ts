import {WizardComponent} from '../components/wizard.component';
import {FreeNavigationMode} from './free-navigation-mode';
import {SemiStrictNavigationMode} from './semi-strict-navigation-mode';
import {StrictNavigationMode} from './strict-navigation-mode';

import {NavigationMode} from './navigation-mode.interface';
import {WizardState} from './wizard-state.model';

/**
 * A factory method used to create [[NavigationMode]] instances
 *
 * @param {WizardComponent} wizard The wizard, for which a navigation mode will be created
 * @param {WizardState} wizardState The wizard state of the wizard
 * @returns {NavigationMode} The created [[NavigationMode]]
 */
export function navigationModeFactory(navigationMode: string, wizardState: WizardState): NavigationMode {
  switch (navigationMode) {
    case 'free':
      return new FreeNavigationMode(wizardState);
    case 'semi-strict':
      return new SemiStrictNavigationMode(wizardState);
    case 'strict':
    default:
      return new StrictNavigationMode(wizardState);
  }
};
