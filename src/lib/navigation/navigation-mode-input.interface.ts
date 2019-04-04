import {NavigationMode} from './navigation-mode.interface';

/**
 * Type of [[WizardComponent]]'s [[navigationMode]] input: a navigation mode name or an already constructed instance.
 *
 * A set of supported mode names is determined by the configured navigation mode factory.
 * The default navigation mode factory recognizes `strict`, `semi-strict` and `free`.
 *
 * If the [[navigationMode]] input is not configured or set to a falsy value, a default mode will be chosen by the navigation mode factory.
 * For the default navigation mode factory, the default mode is `strict`.
 */
export type NavigationModeInput = string|NavigationMode;
