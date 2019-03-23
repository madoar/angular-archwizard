import {
  AfterContentInit,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewEncapsulation,
  Inject,
  Optional
} from '@angular/core';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {NavigationModeInput} from '../navigation/navigation-mode-input.interface';
import {NavigationModeFactory, NAVIGATION_MODE_FACTORY} from '../navigation/navigation-mode-factory.interface';
import {BaseNavigationModeFactory} from '../navigation/navigation-mode-factory.provider';
import {WizardState} from '../navigation/wizard-state.model';
import {WizardStep} from '../util/wizard-step.interface';

/**
 * The `aw-wizard` component defines the root component of a wizard.
 * Through the setting of input parameters for the `aw-wizard` component it's possible to change the location and size
 * of its navigation bar.
 *
 * ### Syntax
 * ```html
 * <aw-wizard [navBarLocation]="location of navigation bar" [navBarLayout]="layout of navigation bar">
 *     ...
 * </aw-wizard>
 * ```
 *
 * ### Example
 *
 * Without completion step:
 *
 * ```html
 * <aw-wizard navBarLocation="top" navBarLayout="small">
 *     <aw-wizard-step>...</aw-wizard-step>
 *     <aw-wizard-step>...</aw-wizard-step>
 * </aw-wizard>
 * ```
 *
 * With completion step:
 *
 * ```html
 * <aw-wizard navBarLocation="top" navBarLayout="small">
 *     <aw-wizard-step>...</aw-wizard-step>
 *     <aw-wizard-step>...</aw-wizard-step>
 *     <aw-wizard-completion-step>...</aw-wizard-completion-step>
 * </aw-wizard>
 * ```
 *
 * @author Marc Arndt
 */
@Component({
  selector: 'aw-wizard',
  templateUrl: 'wizard.component.html',
  styleUrls: ['wizard.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [WizardState]
})
export class WizardComponent implements OnChanges, AfterContentInit {
  /**
   * A QueryList containing all [[WizardStep]]s inside this wizard
   */
  @ContentChildren(WizardStep)
  public wizardSteps: QueryList<WizardStep>;

  /**
   * The location of the navigation bar inside the wizard.
   * This location can be either top, bottom, left or right
   */
  @Input()
  public navBarLocation = 'top';

  /**
   * The layout of the navigation bar inside the wizard.
   * The layout can be either small, large-filled, large-empty or large-symbols
   */
  @Input()
  public navBarLayout = 'small';

  /**
   * The direction in which the steps inside the navigation bar should be shown.
   * The direction can be either `left-to-right` or `right-to-left`
   */
  @Input()
  public navBarDirection = 'left-to-right';

  /**
   * The navigation mode used for transitioning between different steps.
   * The navigation mode can be either `strict`, `semi-strict`, `free` or empty.
   *
   * When the value is empty, the configured [[NavigationModeFactory]] will use the default navigation mode.
   * For the default [[NavigationModeFactory]], the default navigation mode is `strict`.
   */
  @Input()
  public navigationMode: NavigationModeInput = '';

  /**
   * The initially selected step, represented by its index
   */
  @Input()
  public defaultStepIndex = 0;

  /**
   * True, if the navigation bar shouldn't be used for navigating
   */
  @Input()
  public disableNavigationBar = false;

  /**
   * Constructor
   *
   * @param model The model for this wizard component
   */
  constructor(
    public model: WizardState,
    // Using @Optional() in order not to break applications which import ArchwizardModule without calling forRoot().
    @Optional() @Inject(NAVIGATION_MODE_FACTORY) private navigationModeFactory: NavigationModeFactory) {
    if (!this.navigationModeFactory) {
      this.navigationModeFactory = new BaseNavigationModeFactory();
    }
  }

  /**
   * Returns true if this wizard uses a horizontal orientation.
   * The wizard uses a horizontal orientation, iff the navigation bar is shown at the top or bottom of this wizard
   *
   * @returns True if this wizard uses a horizontal orientation
   */
  @HostBinding('class.horizontal')
  public get horizontalOrientation(): boolean {
    return this.navBarLocation === 'top' || this.navBarLocation === 'bottom';
  }

  /**
   * Returns true if this wizard uses a vertical orientation.
   * The wizard uses a vertical orientation, iff the navigation bar is shown at the left or right of this wizard
   *
   * @returns True if this wizard uses a vertical orientation
   */
  @HostBinding('class.vertical')
  public get verticalOrientation(): boolean {
    return this.navBarLocation === 'left' || this.navBarLocation === 'right';
  }

  /**
   * The navigation mode for this wizard
   */
  public get navigation(): NavigationMode {
    return this.model.navigationMode;
  }

  /**
   * Updates the model after certain input values have changed
   *
   * @param changes The detected changes
   */
  ngOnChanges(changes: SimpleChanges) {
    for (const propName of Object.keys(changes)) {
      const change = changes[propName];

      if (!change.firstChange) {
        switch (propName) {
          case 'defaultStepIndex':
            this.model.defaultStepIndex = parseInt(change.currentValue, 10);
            break;
          case 'disableNavigationBar':
            this.model.disableNavigationBar = change.currentValue;
            break;
          case 'navigationMode':
            this.updateNavigationMode(change.currentValue);
            break;
          /* istanbul ignore next */
          default:
        }
      }
    }
  }

  /**
   * Initialization work
   */
  ngAfterContentInit(): void {
    // add a subscriber to the wizard steps QueryList to listen to changes in the DOM
    this.wizardSteps.changes.subscribe(changedWizardSteps => {
      this.model.updateWizardSteps(changedWizardSteps.toArray());
    });

    // initialize the model
    this.model.disableNavigationBar = this.disableNavigationBar;
    this.model.defaultStepIndex = this.defaultStepIndex;
    this.model.updateWizardSteps(this.wizardSteps.toArray());
    this.updateNavigationMode(this.navigationMode);

    // finally reset the whole wizard state
    this.navigation.reset();
  }

  public updateNavigationMode(navigationModeInput: NavigationModeInput) {
    this.model.updateNavigationMode(this.navigationModeFactory.create(this, navigationModeInput));
  }
}
