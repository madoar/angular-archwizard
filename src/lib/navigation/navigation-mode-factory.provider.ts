import {FreeNavigationMode} from './free-navigation-mode';
import {NavigationMode} from './navigation-mode.interface';
import {SemiStrictNavigationMode} from './semi-strict-navigation-mode';
import {StrictNavigationMode} from './strict-navigation-mode';
import {WizardComponent} from '../components/wizard.component';
import {NavigationModeInput} from './navigation-mode-input.interface';

/**
 * A factory used to create [[NavigationMode]] instances
 */
export class BaseNavigationModeFactory {

  /**
   * @inheritDoc
   */
  create(wizard: WizardComponent, navigationModeInput: NavigationModeInput): NavigationMode {
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
    return this.createByName(wizard, navigationModeName);
  }

  /**
   * Create a [[NavigationMode]] for the given wizard instance by a navigation mode name
   *
   * @param wizard The wizard componenent where the created [[NavigationMode]] will be used
   * @param navigationModeInput The name of a built-in navigation mode or a custom navigation mode
   * @returns The created [[NavigationMode]]
   */
  createByName(wizard: WizardComponent, navigationMode: string): NavigationMode {
    switch (navigationMode) {
      case 'free':
        return new FreeNavigationMode(wizard.model);
      case 'semi-strict':
        return new SemiStrictNavigationMode(wizard.model);
      case 'strict':
        return new StrictNavigationMode(wizard.model);
      default:
        return !navigationMode ? this.createDefault(wizard) : this.createUnknown(wizard, navigationMode);
    }
  }

  /**
   * Create a [[NavigationMode]] for the given wizard instance which does not have a configured navigation mode
   *
   * @param wizard The wizard componenent where the created [[NavigationMode]] will be used
   * @returns The created [[NavigationMode]]
   */
  createDefault(wizard: WizardComponent): NavigationMode {
    return new StrictNavigationMode(wizard.model);
  }

  /**
   * Create a [[NavigationMode]] for the given wizard instance by a not recognized navigation mode name
   *
   * The base implementation always throws an Error.
   *
   * @param wizard The wizard componenent where the created [[NavigationMode]] will be used
   * @param navigationModeInput The name of a custom navigation mode
   * @returns The created [[NavigationMode]]
   */
  createUnknown(wizard: WizardComponent, navigationMode: string): NavigationMode {
    throw new Error(`Unknown navigation mode name: ${navigationMode}`);
  }
}
