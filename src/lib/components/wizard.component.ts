import {
  AfterContentInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {WizardStep} from '../util';
import {NavigationMode, WizardState} from '../navigation';
import {NavBarLocationTypes} from '../util/nav-bar-location-types.enum';
import {NavBarLayoutTypes} from '../util/nav-bar-layout-types.enum';
import {NavBarDirectionTypes} from '../util/nav-bar-direction-types.enum';
import {NavigationModeTypes} from '../util/navigation-mode-types.enum';

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
   * Step Changed event that fired with the new current step
   */
  @Output()
  stepChanged: EventEmitter<WizardStep> = new EventEmitter<WizardStep>();

  /**
   * The location of the navigation bar inside the wizard.
   * This location can be either top, bottom, left or right
   *
   * @see NavBarLocationTypes
   */
  private _navBarLocation: NavBarLocationTypes = NavBarLocationTypes.TOP;

  @Input()
  /**
   * The location of the navigation bar inside the wizard.
   * This location can be either top, bottom, left or right
   *
   * @see NavBarLocationTypes
   */
  public get navBarLocation(): NavBarLocationTypes {
    return this._navBarLocation;
  }

  /**
   * The location of the navigation bar inside the wizard.
   * This location can be either top, bottom, left or right
   *
   * @see NavBarLocationTypes
   */
  public set navBarLocation(navBarLocation: NavBarLocationTypes) {
    delete this.navigationClass[this.navBarLocationClasses[this._navBarLocation]];

    this._navBarLocation = navBarLocation;

    this.navigationClass[this.navBarLocationClasses[navBarLocation]] = !!this.navBarLocationClasses[navBarLocation];
  }

  /**
   * The layout of the navigation bar inside the wizard.
   * The layout can be either small, large-filled, large-empty, large-symbols, large-filled-symbols or large-empty-symbols
   *
   * @see NavBarLayoutTypes
   */
  private _navBarLayout: NavBarLayoutTypes = NavBarLayoutTypes.SMALL;

  @Input()
  /**
   * The layout of the navigation bar inside the wizard.
   * The layout can be either small, large-filled, large-empty, large-symbols, large-filled-symbols or large-empty-symbols
   *
   * @see NavBarLayoutTypes
   */
  get navBarLayout(): NavBarLayoutTypes {
    return this._navBarLayout;
  }

  /**
   * The layout of the navigation bar inside the wizard.
   * The layout can be either small, large-filled, large-empty, large-symbols, large-filled-symbols or large-empty-symbols
   *
   * @see NavBarLayoutTypes
   */
  set navBarLayout(value: NavBarLayoutTypes) {
    delete this.navigationClass[this._navBarLayout];

    this._navBarLayout = value;

    this.navigationClass[this._navBarLayout] = !!this._navBarLayout;
  }

  /**
   * The direction in which the steps inside the navigation bar should be shown.
   * The direction can be either `left-to-right` or `right-to-left`
   *
   * @see NavBarDirectionTypes
   */
  @Input()
  public navBarDirection: NavBarDirectionTypes = NavBarDirectionTypes.LTR;

  /**
   * The navigation mode used for transitioning between different steps.
   * The navigation mode can be either `strict`, `semi-strict` or `free`
   *
   * @see NavigationModeTypes
   */
  @Input()
  public navigationMode: NavigationModeTypes = NavigationModeTypes.STRICT;

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
   * Navigation custom class
   */
  private _navigationCustomClass: string;

  /**
   * Navigation custom class
   */
  @Input()
  get navigationCustomClass(): string {
    return this._navigationCustomClass;
  }

  /**
   * Navigation custom class
   */
  set navigationCustomClass(customClass: string) {
    delete this._navigationClass[this._navigationCustomClass];

    this._navigationCustomClass = customClass;

    if (customClass) {
      this._navigationClass[this._navigationCustomClass] = true;
    }
  }

  /**
   * Navigation class
   */
  private _navigationClass: any = {};

  public get navigationClass() {
    return this._navigationClass;
  }

  /**
   * Returns true if this wizard uses a horizontal orientation.
   * The wizard uses a horizontal orientation, iff the navigation bar is shown at the top or bottom of this wizard
   *
   * @returns True if this wizard uses a horizontal orientation
   */
  @HostBinding('class.horizontal')
  public get horizontalOrientation(): boolean {
    return this.navBarLocation === NavBarLocationTypes.TOP || this.navBarLocation === NavBarLocationTypes.BOTTOM;
  }

  /**
   * Returns true if this wizard uses a vertical orientation.
   * The wizard uses a vertical orientation, iff the navigation bar is shown at the left or right of this wizard
   *
   * @returns True if this wizard uses a vertical orientation
   */
  @HostBinding('class.vertical')
  public get verticalOrientation(): boolean {
    return this.navBarLocation === NavBarLocationTypes.LEFT || this.navBarLocation === NavBarLocationTypes.RIGHT;
  }

  /**
   * The navigation mode for this wizard
   */
  public get navigation(): NavigationMode {
    return this.model.navigationMode;
  }

  /**
   * NavBarLocation classes by there value
   */
  private navBarLocationClasses = {
    left: 'vertical',
    top: 'horizontal',
    right: 'vertical',
    bottom: 'horizontal'
  };

  /**
   * Constructor
   *
   * @param model The model for this wizard component
   */
  constructor(public model: WizardState) {
    // set the nav-bar layout and location so it will change the navigation class
    this.navBarLocation = NavBarLocationTypes.TOP;
    this.navBarLayout = NavBarLayoutTypes.SMALL;
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
            this.model.updateNavigationMode(change.currentValue);
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
    this.model.updateNavigationMode(this.navigationMode);

    // finally reset the whole wizard state
    this.navigation.reset();
  }

  /**
   * Step Changed event handler
   * @param currentStep The Current Step
   */
  _stepChanged(currentStep: WizardStep) {
    this.stepChanged.emit(currentStep);
  }
}
