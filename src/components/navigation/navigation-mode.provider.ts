import {WizardComponent} from '../components/wizard.component';
import {FreeNavigationMode} from './free-navigation-mode';
import {SemiStrictNavigationMode} from './semi-strict-navigation-mode';
import {StrictNavigationMode} from './strict-navigation-mode';
import {forwardRef, InjectionToken, Type} from '@angular/core';
import {NavigationMode} from './navigation-mode.interface';

/**
 * An injection token to be used to inject a [[NavigationMode]] in an angular component or directive
 * @type {InjectionToken<NavigationMode>}
 */
export let NAVIGATION_MODE = new InjectionToken<NavigationMode>('wizard.navigation.mode');

/**
 * A factory method used to create [[NavigationMode]] instances
 * @param {WizardComponent} wizard
 * @returns {any}
 */
let navigationModeFactory = (wizard: WizardComponent) => {
  switch (this.navigationMode) {
    case 'free':
      return new FreeNavigationMode(wizard);
    case 'semi-strict':
      return new SemiStrictNavigationMode(wizard);
    case 'strict':
    default:
      return new StrictNavigationMode(wizard);
  }
};

/**
 * A provider for [[NavigationMode]] instances
 */
export let navigationModeProvider = {
  provide: NAVIGATION_MODE,
  useFactory: navigationModeFactory,
  deps: [forwardRef(() => WizardComponent)]
};
