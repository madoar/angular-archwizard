import {AfterContentInit, Component, ContentChildren, HostBinding, Input, QueryList} from '@angular/core';
import {WizardStep} from '../util/wizard-step.interface';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {navigationModeFactory} from '../navigation/navigation-mode.provider';
import {WizardState} from '../navigation/wizard-state.model';

/**
 * The `wizard` component defines the root component of a wizard.
 * Through the setting of input parameters for the `wizard` component it's possible to change the location and size
 * of its navigation bar.
 *
 * ### Syntax
 * ```html
 * <wizard [navBarLocation]="location of navigation bar" [navBarLayout]="layout of navigation bar">
 *     ...
 * </wizard>
 * ```
 *
 * ### Example
 *
 * Without completion step:
 *
 * ```html
 * <wizard navBarLocation="top" navBarLayout="small">
 *     <wizard-step>...</wizard-step>
 *     <wizard-step>...</wizard-step>
 * </wizard>
 * ```
 *
 * With completion step:
 *
 * ```html
 * <wizard navBarLocation="top" navBarLayout="small">
 *     <wizard-step>...</wizard-step>
 *     <wizard-step>...</wizard-step>
 *     <wizard-completion-step>...</wizard-completion-step>
 * </wizard>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'wizard',
  templateUrl: 'wizard.component.html',
  styleUrls: ['wizard.component.less'],
  providers: [
    WizardState,
    { provide: NavigationMode, useFactory: navigationModeFactory, deps: [WizardComponent, WizardState] }
  ]
})
export class WizardComponent implements AfterContentInit {
  /**
   * A QueryList containing all [[WizardStep]]s inside this wizard
   */
  @ContentChildren(WizardStep)
  public wizardSteps: QueryList<WizardStep>;

  /**
   * The location of the navigation bar inside the wizard.
   * This location can be either top, bottom, left or right
   *
   * @type {string}
   */
  @Input()
  public navBarLocation = 'top';

  /**
   * The layout of the navigation bar inside the wizard.
   * The layout can be either small, large-filled, large-empty or large-symbols
   *
   * @type {string}
   */
  @Input()
  public navBarLayout = 'small';

  /**
   * The navigation mode used for transitioning between different steps
   *
   * @type {string}
   */
  @Input()
  public navigationMode = 'strict';

  /**
   * Returns true if this wizard uses a horizontal orientation.
   * The wizard uses a horizontal orientation, iff the navigation bar is shown at the top or bottom of this wizard
   *
   * @returns {boolean} True if this wizard uses a horizontal orientation
   */
  @HostBinding('class.horizontal')
  public get horizontalOrientation(): boolean {
    return this.navBarLocation === 'top' || this.navBarLocation === 'bottom';
  }

  /**
   * Returns true if this wizard uses a vertical orientation.
   * The wizard uses a vertical orientation, iff the navigation bar is shown at the left or right of this wizard
   *
   * @returns {boolean} True if this wizard uses a vertical orientation
   */
  @HostBinding('class.vertical')
  public get verticalOrientation(): boolean {
    return this.navBarLocation === 'left' || this.navBarLocation === 'right';
  }

  /**
   * Constructor
   */
  constructor(private model: WizardState) {
  }

  /**
   * Initialization work
   */
  ngAfterContentInit(): void {
    this.model.initialize(this.wizardSteps);
  }
}
