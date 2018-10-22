import {FreeNavigationMode} from './free-navigation-mode';
import {SemiStrictNavigationMode} from './semi-strict-navigation-mode';
import {StrictNavigationMode} from './strict-navigation-mode';
import {NavigationMode} from './navigation-mode.interface';
import {WizardComponent} from '../components/wizard.component';
import {WizardState} from './wizard-state.model';

/**
 * Type of [[WizardComponent]]'s navigationMode input.
 */
export type NavigationModeInput = string|((wizard: WizardComponent) => string|NavigationMode);

/**
 * A factory method used to create [[NavigationMode]] instances
 *
 * @param navigationModeInput The name of a built-in navigation mode or a function returning
 *                            such name or a created [[NavigationMode]] instance
 * @param wizard The wizard componenent where the created [[NavigationMode]] will be used
 * @returns The created [[NavigationMode]]
 */
export function navigationModeFactory(wizard: WizardComponent, navigationModeInput: NavigationModeInput): NavigationMode {
  let navigationModeName: string;
  if (typeof navigationModeInput === 'function') {
    // input is a function
    const navigationMode = navigationModeInput(wizard);
    if (typeof navigationMode === 'string') {
      // function returned a name
      navigationModeName = navigationMode;
    } else {
      // function returned a `NavigationMode` instance
      return navigationMode;
    }
  } else {
    // input is a name
    navigationModeName = navigationModeInput;
  }
  // create NavigationMode by name
  return createNavigationModeByName(wizard.model, navigationModeName);
}

/**
 * A factory method used to create a built-in [[NavigationMode]] by name
 *
 * @param navigationModeInput The name of the navigation mode to return
 * @param wizardState The wizard state of the wizard
 * @returns The created [[NavigationMode]]
 */
export function createNavigationModeByName(wizardState: WizardState, navigationMode: string) {
  switch (navigationMode) {
    case 'free':
      return new FreeNavigationMode(wizardState);
    case 'semi-strict':
      return new SemiStrictNavigationMode(wizardState);
    case 'strict':
    default:
      return new StrictNavigationMode(wizardState);
  }
}
