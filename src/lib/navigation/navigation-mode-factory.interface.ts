import {InjectionToken} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {NavigationMode} from './navigation-mode.interface';
import { NavigationModeInput } from './navigation-mode-input.interface';


/**
 * The injection token to provide a particular implmentation of [[NavigationModeFactory]]
 */
export const NAVIGATION_MODE_FACTORY = new InjectionToken('NavigationModeFactory');


/**
 * A factory used to create [[NavigationMode]] instances
 */
export interface NavigationModeFactory {

  /**
   * Create a [[NavigationMode]] for the given wizard instance
   *
   * @param wizard The wizard componenent where the created [[NavigationMode]] will be used
   * @param navigationModeInput The name of a built-in navigation mode or a function returning
   *                            such name or a created [[NavigationMode]] instance
   * @returns The created [[NavigationMode]]
   */
  create(wizard: WizardComponent, navigationModeInput: NavigationModeInput): NavigationMode;
}
