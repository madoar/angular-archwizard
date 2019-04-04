import {FreeNavigationMode} from './free-navigation-mode';
import {NavigationMode} from './navigation-mode.interface';
import {SemiStrictNavigationMode} from './semi-strict-navigation-mode';
import {StrictNavigationMode} from './strict-navigation-mode';
import {WizardComponent} from '../components/wizard.component';
import {NavigationModeInput} from './navigation-mode-input.interface';
import {NavigationModeFactory} from './navigation-mode-factory.interface';

/**
 * A factory used to create [[NavigationMode]] instances
 */
export class BaseNavigationModeFactory implements NavigationModeFactory {

  /**
   * @inheritDoc
   */
  public create(wizard: WizardComponent, navigationModeInput: NavigationModeInput): NavigationMode {
    if (typeof navigationModeInput === 'string') {
      // input is a name
      return this.createByName(wizard, navigationModeInput);
    } else if (navigationModeInput) {
      // input is a NavigationMode instance
      return navigationModeInput;
    } else {
      // use default
      return this.createDefault(wizard);
    }
  }

  /**
   * Create a [[NavigationMode]] for the given wizard instance by a navigation mode name
   *
   * @param wizard The wizard componenent where the created [[NavigationMode]] will be used
   * @param navigationModeInput The name of a built-in navigation mode or a custom navigation mode
   * @returns The created [[NavigationMode]]
   */
  protected createByName(wizard: WizardComponent, navigationModeInput: string): NavigationMode {
    switch (navigationModeInput) {
      case 'free':
        return new FreeNavigationMode();
      case 'semi-strict':
        return new SemiStrictNavigationMode();
      case 'strict':
        return new StrictNavigationMode();
      default:
        return !navigationModeInput ? this.createDefault(wizard) : this.createUnknown(wizard, navigationModeInput);
    }
  }

  /**
   * Create a [[NavigationMode]] for the given wizard instance which does not have a configured navigation mode
   *
   * @param wizard The wizard componenent where the created [[NavigationMode]] will be used
   * @returns The created [[NavigationMode]]
   */
  protected createDefault(wizard: WizardComponent): NavigationMode {
    return new StrictNavigationMode();
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
  protected createUnknown(wizard: WizardComponent, navigationModeInput: string): NavigationMode {
    throw new Error(`Unknown navigation mode name: ${navigationModeInput}`);
  }
}
