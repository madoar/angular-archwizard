import {AfterContentInit, Component, ContentChild, ContentChildren, HostBinding, Input, QueryList} from '@angular/core';
import {WizardStepComponent} from './wizard-step.component';
import {MovingDirection} from '../util/MovingDirection';
import {SuccessStepComponent} from './success-step.component';
import {WizardStep} from '../util/WizardStep';

@Component({
  selector: 'wizard',
  templateUrl: 'wizard.component.html',
  styleUrls: ['wizard.component.less']
})
export class WizardComponent implements AfterContentInit {
  /**
   * A QueryList containing all WizardSteps in this Wizard
   */
  @ContentChildren(WizardStepComponent)
  public wizardSteps: QueryList<WizardStepComponent>;

  @ContentChild(SuccessStepComponent)
  public successStep: SuccessStepComponent;

  public get allSteps(): Array<WizardStep> {
    const steps: Array<WizardStep> = this.wizardSteps.toArray();

    if (this.successStep) {
      steps.push(this.successStep);
    }

    return steps;
  }

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

  @HostBinding('class.horizontal')
  public get horizontalOrientation(): boolean {
    return this.navBarLocation === 'top' || this.navBarLocation === 'bottom';
  }

  @HostBinding('class.vertical')
  public get verticalOrientation(): boolean {
    return this.navBarLocation === 'left' || this.navBarLocation === 'right';
  }

  /**
   * The index of the currently visible and selected step inside the wizardSteps QueryList.
   * If this wizard contains no steps, currentStepIndex is -1
   */
  public currentStepIndex: number = -1;

  /**
   * The WizardStep object belonging to the currently visible and selected step.
   * The currentStep is always the currently selected wizard step.
   * The currentStep can be either completed, if it was visited earlier,
   * or not completed, if it is visited for the first time or its state is currently out of date.
   *
   * If this wizard contains no steps, currentStep is null
   */
  public currentStep: WizardStep;

  public completed: boolean;

  constructor() {
  }

  ngAfterContentInit(): void {
    if (this.allSteps && this.allSteps.length > 0) {
      this.currentStepIndex = 0;

      this.currentStep = this.allSteps[0];
      this.currentStep.stepEnter.emit(MovingDirection.Forwards);
      this.currentStep.completed = false;
      this.currentStep.selected = true;
    }
  }

  /**
   * Checks if a given index is inside the range of possible wizard steps inside this wizard
   * @param stepIndex The to be checked index of a step inside this wizard
   * @returns {boolean} True if the given stepIndex is contained inside this wizard, false otherwise
   */
  hasStep(stepIndex: number): boolean {
    return this.allSteps.length > 0 && 0 <= stepIndex && stepIndex < this.allSteps.length;
  }

  hasPreviousStep(): boolean {
    return this.hasStep(this.currentStepIndex - 1);
  }

  hasNextStep(): boolean {
    return this.hasStep(this.currentStepIndex + 1);
  }

  isLastStep(): boolean {
    return this.allSteps.length > 0 && this.currentStepIndex === this.allSteps.length - 1;
  }

  getStepAtIndex(stepIndex: number): WizardStep {
    if (!this.hasStep(stepIndex)) {
      throw new Error(`Expected a known step, but got stepIndex: ${stepIndex}.`);
    }

    return this.allSteps.find((item, index, array) => index === stepIndex);
  }

  getIndexOfStep(step: WizardStep): number {
    let stepIndex: number = -1;

    this.allSteps.forEach((item, index, array) => {
      if (item === step) {
        stepIndex = index;
      }
    });

    return stepIndex;
  }

  getMovingDirection(destinationStep: number): MovingDirection {
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

  goToPreviousStep(): void {
    if (this.hasPreviousStep()) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  goToNextStep(): void {
    if (this.hasNextStep()) {
      this.goToStep(this.currentStepIndex + 1);
    }
  }

  canGoToPreviousStep(): boolean {
    const previousStepIndex = this.currentStepIndex - 1;

    return this.hasStep(previousStepIndex) && this.canGoToStep(previousStepIndex);
  }

  canGoToNextStep(): boolean {
    const nextStepIndex = this.currentStepIndex + 1;

    return this.hasStep(nextStepIndex) && this.canGoToStep(nextStepIndex);
  }

  canGoToStep(stepIndex: number): boolean {
    let result: boolean = this.hasStep(stepIndex);

    this.allSteps.forEach((wizardStep, index, array) => {
      if (index < stepIndex && index !== this.currentStepIndex) {
        // all steps before the next step, that aren't the current step, must be completed or optional
        result = result && (wizardStep.completed || wizardStep.optional);
      }
    });

    return result;
  }

  goToStep(destinationStepIndex: number): void {
    const destinationStep: WizardStep = this.getStepAtIndex(destinationStepIndex);

    // In which direction is a step transition done?
    const movingDirection: MovingDirection = this.getMovingDirection(destinationStepIndex);

    if (this.currentStep.canExitStep(movingDirection)) {
      // is it possible to leave the current step in the given direction?
      this.allSteps.forEach((wizardStep, index, array) => {
        if (index === this.currentStepIndex) {
          // finish processing old step
          wizardStep.completed = true;
        }

        if (this.currentStepIndex > destinationStepIndex && index > destinationStepIndex) {
          // if the next step is before the current step set all steps in between to incomplete
          wizardStep.completed = false;
        }
      });

      // leave current step
      this.currentStep.stepExit.emit(movingDirection);
      this.currentStep.selected = false;

      // go to next step
      this.currentStepIndex = destinationStepIndex;
      this.currentStep = destinationStep;
      this.currentStep.stepEnter.emit(movingDirection);
      this.currentStep.selected = true;
    } else {
      // if the current step can't be left, reenter the current step
      this.currentStep.stepExit.emit(MovingDirection.Stay);
      this.currentStep.stepEnter.emit(MovingDirection.Stay);
    }
  }
}
