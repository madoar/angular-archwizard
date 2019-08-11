import {Directive, Input, OnChanges, SimpleChanges} from '@angular/core';

import {NavigationMode} from '../navigation/navigation-mode.interface';
import {ConfigurableNavigationMode} from '../navigation/configurable-navigation-mode';
import {WizardComponent} from '../components/wizard.component';


/**
 * The [[awNavigationMode]] directive can be used to customize wizard'd navigation mode.
 *
 * There are several usage options:
 *
 * ### Option 1. Customize the default navigation mode with [[navigateBackward]] and/or [[navigateForward]] inputs.
 *
 * ```html
 * <aw-wizard [awNavigationMode] navigateBackward="deny" navigateForward="allow">...</aw-wizard>
 * ```
 *
 * ### Option 2. Pass in a custom navigation mode
 *
 * ```typescript
 * import { BaseNavigationMode } from 'angular-archwizard'
 *
 * class CustomNavigationMode extends BaseNavigationMode {
 *
 *   // ...
 * }
 * ```
 *
 * ```typescript
 * @Component({
 *   // ...
 * })
 * class MyComponent {
 *
 *   navigationMode = new CustomNavigationMode();
 * }
 * ```
 *
 * ```html
 * <aw-wizard [awNavigationMode]="navigationMode">...</aw-wizard>
 * ```
 *
 * ### Additional Notes
 *
 * - Specifying a custom navigation mode takes priority over [[navigateBackward]] and [[navigateForward]] inputs
 *
 * - Omitting the [[awNavigationMode]] directive or, equally, specifying just [[awNavigationMode]] without
 *   any inputs or parameters causes the wizard to use the default "strict" navigation mode equivalent to
 *
 * ```html
 * <aw-wizard [awNavigationMode] navigateBackward="deny" navigateForward="allow">...</aw-wizard>
 * ````
 */
@Directive({
  selector: '[awNavigationMode]',
})
export class NavigationModeDirective implements OnChanges {

  /**
   * Custom navigation mode instance (optional).
   */
  @Input()
  public awNavigationMode: NavigationMode|null;

  /**
   * A parameter for the default navigation mode.  Controls whether wizard steps before the current step are navigable:
   *
   * - `navigateBackward="deny"` -- the steps are not navigable
   * - `navigateBackward="allow"` -- the steps are navigable
   */
  @Input()
  public navigateBackward: 'allow'|'deny'|null;

  /**
   * A parameter for the default navigation mode.  Controls whether wizard steps after the current step are navigable:
   *
   * - `navigateForward="deny"` -- the steps are not navigable
   * - `navigateForward="allow"` -- the steps are navigable
   * - `navigateForward="visited"` -- a step is navigable iff it was already visited before
   */
  @Input()
  public navigateForward: 'allow'|'deny'|'visited'|null;

  constructor(private wizard: WizardComponent) { }

  public ngOnChanges(changes: SimpleChanges): void {
    this.wizard.navigation = this.getNavigationMode();
  }

  private getNavigationMode(): NavigationMode {
    if (this.awNavigationMode) {
      return this.awNavigationMode;
    }
    return new ConfigurableNavigationMode(this.navigateBackward, this.navigateForward);
  }

}
