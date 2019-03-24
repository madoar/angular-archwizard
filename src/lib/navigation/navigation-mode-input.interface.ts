import {WizardComponent} from '../components/wizard.component';
import {NavigationMode} from './navigation-mode.interface';

/**
 * Type of [[WizardComponent]]'s [[navigationMode]] input: either a navigation mode name or a function.
 *
 * A set of supported mode names is determined by the configured navigation mode factory.
 * The default navigation mode factory recognizes `strict`, `semi-strict` and `free`.
 *
 * Alternatively, an input can take a function which will be called during the initialization of the wizard
 * component. The function must return an instance of [[NavigationMode]] to be used in the component.
 *
 * If the [[navigationMode]] input is not configured or set to a falsy value, a default mode will be chosen by the navigation mode factory.
 * For the default navigation mode factory, the default mode is `strict`.
 */
export type NavigationModeInput = string|((wizard: WizardComponent) => NavigationMode);
