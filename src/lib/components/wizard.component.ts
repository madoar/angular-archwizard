import {
  AfterContentInit,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
  EventEmitter,
} from '@angular/core';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardStep} from '../util/wizard-step.interface';
import {MovingDirection} from '../util/moving-direction.enum';
import {ConfigurableNavigationMode} from '../navigation/configurable-navigation-mode';

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
})
export class WizardComponent implements AfterContentInit {
  /**
   * A QueryList containing all [[WizardStep]]s inside this wizard
   */
  @ContentChildren(WizardStep, { descendants: true })
  public wizardStepsQueryList: QueryList<WizardStep>;

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
   * The initially selected step, represented by its index
   * Beware: This initial default is only used if no wizard step has been enhanced with the `selected` directive
   */
  @Input()
  public get defaultStepIndex(): number {
    // This value can be either:
    // - the index of a wizard step with a `selected` directive, or
    // - the default step index, set in the [[WizardComponent]]

    const foundDefaultStep = this.wizardSteps.find(step => step.defaultSelected);

    if (foundDefaultStep) {
      return this.getIndexOfStep(foundDefaultStep);
    } else {
      return this._defaultStepIndex;
    }
  }
  public set defaultStepIndex(defaultStepIndex: number) {
    this._defaultStepIndex = defaultStepIndex;
  }
  private _defaultStepIndex = 0;

  /**
   * True, if the navigation bar shouldn't be used for navigating
   */
  @Input()
  public disableNavigationBar = false;

  /**
   * The navigation mode used to navigate inside the wizard
   *
   * For outside access, use the [[navigation]] getter.
   */
  private _navigation: NavigationMode = new ConfigurableNavigationMode();

  /**
   * An array representation of all wizard steps belonging to this model
   *
   * For outside access, use the [[wizardSteps]] getter.
   */
  private _wizardSteps: WizardStep[] = [];

  /**
   * The index of the currently visible and selected step inside the wizardSteps QueryList.
   * If this wizard contains no steps, currentStepIndex is -1
   *
   * Note: Do not modify this field directly.  Instead, use navigation methods:
   * [[goToStep]], [[goToPreviousStep]], [[goToNextStep]].
   */
  public currentStepIndex = -1;

  /**
   * Constructor
   */
  constructor() {
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
   * Initialization work
   */
  public ngAfterContentInit(): void {
    // add a subscriber to the wizard steps QueryList to listen to changes in the DOM
    this.wizardStepsQueryList.changes.subscribe(changedWizardSteps => {
      this.updateWizardSteps(changedWizardSteps.toArray());
    });

    // initialize the model
    this.updateWizardSteps(this.wizardStepsQueryList.toArray());

    // finally reset the whole wizard component
    setTimeout(() => this.reset());
  }

  /**
   * The WizardStep object belonging to the currently visible and selected step.
   * The currentStep is always the currently selected wizard step.
   * The currentStep can be either completed, if it was visited earlier,
   * or not completed, if it is visited for the first time or its state is currently out of date.
   *
   * If this wizard contains no steps, currentStep is null
   */
  public get currentStep(): WizardStep {
    if (this.hasStep(this.currentStepIndex)) {
      return this.wizardSteps[this.currentStepIndex];
    } else {
      return null;
    }
  }

  /**
   * The completeness of the wizard.
   * If the wizard has been completed, i.e. all steps are either completed or optional, this value is true, otherwise it is false
   */
  public get completed(): boolean {
    return this.wizardSteps.every(step => step.completed || step.optional);
  }

  /**
   * An array representation of all wizard steps belonging to this model
   */
  public get wizardSteps(): WizardStep[] {
    return this._wizardSteps;
  }

  /**
   * Updates the wizard steps to the new array
   *
   * @param wizardSteps The updated wizard steps
   */
  private updateWizardSteps(wizardSteps: WizardStep[]): void {
    // the wizard is currently not in the initialization phase
    if (this.wizardSteps.length > 0 && this.currentStepIndex > -1) {
      this.currentStepIndex = wizardSteps.indexOf(this.wizardSteps[this.currentStepIndex]);
    }

    this._wizardSteps = wizardSteps;
  }

  /**
   * The navigation mode used to navigate inside the wizard
   */
  public get navigation(): NavigationMode {
    return this._navigation;
  }

  /**
   * Updates the navigation mode for this wizard component
   *
   * @param navigation The updated navigation mode
   */
  public set navigation(navigation: NavigationMode) {
    this._navigation = navigation;
  }

  /**
   * Checks if a given index `stepIndex` is inside the range of possible wizard steps inside this wizard
   *
   * @param stepIndex The to be checked index of a step inside this wizard
   * @returns True if the given `stepIndex` is contained inside this wizard, false otherwise
   */
  public hasStep(stepIndex: number): boolean {
    return this.wizardSteps.length > 0 && 0 <= stepIndex && stepIndex < this.wizardSteps.length;
  }

  /**
   * Checks if this wizard has a previous step, compared to the current step
   *
   * @returns True if this wizard has a previous step before the current step
   */
  public hasPreviousStep(): boolean {
    return this.hasStep(this.currentStepIndex - 1);
  }

  /**
   * Checks if this wizard has a next step, compared to the current step
   *
   * @returns True if this wizard has a next step after the current step
   */
  public hasNextStep(): boolean {
    return this.hasStep(this.currentStepIndex + 1);
  }

  /**
   * Checks if this wizard is currently inside its last step
   *
   * @returns True if the wizard is currently inside its last step
   */
  public isLastStep(): boolean {
    return this.wizardSteps.length > 0 && this.currentStepIndex === this.wizardSteps.length - 1;
  }

  /**
   * Finds the [[WizardStep]] at the given index `stepIndex`.
   * If no [[WizardStep]] exists at the given index an Error is thrown
   *
   * @param stepIndex The given index
   * @returns The found [[WizardStep]] at the given index `stepIndex`
   * @throws An `Error` is thrown, if the given index `stepIndex` doesn't exist
   */
  public getStepAtIndex(stepIndex: number): WizardStep {
    if (!this.hasStep(stepIndex)) {
      throw new Error(`Expected a known step, but got stepIndex: ${stepIndex}.`);
    }

    return this.wizardSteps[stepIndex];
  }

  /**
   * Finds the index of the step with the given `stepId`.
   * If no step with the given `stepId` exists, `-1` is returned
   *
   * @param stepId The given step id
   * @returns The found index of a step with the given step id, or `-1` if no step with the given id is included in the wizard
   */
  public getIndexOfStepWithId(stepId: string): number {
    return this.wizardSteps.findIndex(step => step.stepId === stepId);
  }

  /**
   * Finds the index of the given [[WizardStep]] `step`.
   * If the given [[WizardStep]] is not contained inside this wizard, `-1` is returned
   *
   * @param step The given [[WizardStep]]
   * @returns The found index of `step` or `-1` if the step is not included in the wizard
   */
  public getIndexOfStep(step: WizardStep): number {
    return this.wizardSteps.indexOf(step);
  }

  /**
   * Calculates the correct [[MovingDirection]] value for a given `destinationStep` compared to the `currentStepIndex`.
   *
   * @param destinationStep The given destination step
   * @returns The calculated [[MovingDirection]]
   */
  public getMovingDirection(destinationStep: number): MovingDirection {
    let movingDirection: MovingDirection;

    if (destinationStep > this.currentStepIndex) {
      movingDirection = MovingDirection.Forwards;
    } else if (destinationStep < this.currentStepIndex) {
      movingDirection = MovingDirection.Backwards;
    } else {
      movingDirection = MovingDirection.Stay;
    }

    return movingDirection;
  }

  /**
   * Checks, whether a wizard step, as defined by the given destination index, can be transitioned to.
   *
   * This method controls navigation by [[goToStep]], [[goToPreviousStep]], and [[goToNextStep]] directives.
   * Navigation by navigation bar is governed by [[isNavigable]].
   *
   * @param destinationIndex The index of the destination step
   * @returns A [[Promise]] containing `true`, if the destination step can be transitioned to and false otherwise
   */
  public canGoToStep(destinationIndex: number): Promise<boolean> {
    return this.navigation.canGoToStep(this, destinationIndex);
  }

  /**
   * Tries to transition to the wizard step, as denoted by the given destination index.
   *
   * Note: You do not have to call [[canGoToStep]] before calling [[goToStep]].
   * The [[canGoToStep]] method will be called automatically.
   *
   * @param destinationIndex The index of the destination wizard step, which should be entered
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  public goToStep(destinationIndex: number, preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    return this.navigation.goToStep(this, destinationIndex, preFinalize, postFinalize);
  }

  /**
   * Tries to transition the wizard to the previous step
   *
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  public goToPreviousStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    return this.navigation.goToStep(this, this.currentStepIndex - 1, preFinalize, postFinalize);
  }

  /**
   * Tries to transition the wizard to the next step
   *
   * @param preFinalize An event emitter, to be called before the step has been transitioned
   * @param postFinalize An event emitter, to be called after the step has been transitioned
   */
  public goToNextStep(preFinalize?: EventEmitter<void>, postFinalize?: EventEmitter<void>): void {
    return this.navigation.goToStep(this, this.currentStepIndex + 1, preFinalize, postFinalize);
  }

  /**
   * Checks, whether the wizard step, located at the given index, can be navigated to using the navigation bar.
   *
   * @param destinationIndex The index of the destination step
   * @returns True if the step can be navigated to, false otherwise
   */
  public isNavigable(destinationIndex: number): boolean {
    return this.navigation.isNavigable(this, destinationIndex);
  }

  /**
   * Resets the state of this wizard.
   */
  public reset(): void {
    this.navigation.reset(this);
  }
}
