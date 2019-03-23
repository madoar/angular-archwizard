import {WizardComponent} from '../components/wizard.component';
import {NavigationMode} from './navigation-mode.interface';

/**
 * Type of [[WizardComponent]]'s navigationMode input.
 */
export type NavigationModeInput = string|((wizard: WizardComponent) => NavigationMode);
