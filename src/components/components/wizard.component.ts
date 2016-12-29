import {Component, ContentChildren, QueryList, AfterContentInit} from "@angular/core";
import {WizardStepComponent} from "./wizard-step.component";
import {isNumber} from "util";

@Component({
  selector: 'wizard',
  templateUrl: 'wizard.component.html',
  styleUrls: ['wizard.component.css']
})
export class WizardComponent implements AfterContentInit {
  /**
   * A QueryList containing all WizardSteps in this Wizard
   */
  @ContentChildren(WizardStepComponent)
  public wizardSteps: QueryList<WizardStepComponent>;

  /**
   * The index of the currently visible and selected step inside the wizardSteps QueryList.
   * If this wizard contains no steps, currentStepIndex is -1
   */
  public currentStepIndex: number = -1;

  /**
   * The WizardStep object belonging to the currently visible and selected step.
   * The currentStep is always the currently selected wizard step.
   * The currentStep can be either completed, if it was visited earlier, or not completed, if it is visited for the first time or its state is currently out of date.
   *
   * If this wizard contains no steps, currentStep is null
   */
  public currentStep: WizardStepComponent;

  constructor() {
  }

  ngAfterContentInit(): void {
    if (this.wizardSteps && this.wizardSteps.length > 0) {
      this.currentStepIndex = 0;

      this.currentStep = this.wizardSteps.first;
      this.currentStep.stepEnter.emit();
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
    return this.wizardSteps.length > 0 && 0 <= stepIndex && stepIndex < this.wizardSteps.length;
  }

  hasPreviousStep(): boolean {
    return this.wizardSteps.length > 0 && this.currentStepIndex > 0;
  }

  hasNextStep(): boolean {
    return this.wizardSteps.length > 0 && this.currentStepIndex < this.wizardSteps.length - 1;
  }

  isLastStep(): boolean {
    return this.wizardSteps.length > 0 && this.currentStepIndex === this.wizardSteps.length - 1;
  }

  getStepAtIndex(stepIndex: number): WizardStepComponent {
    if (!this.hasStep(stepIndex)) {
      throw new Error(`Expected a valid step, but got stepIndex: ${stepIndex}.`);
    }

    return this.wizardSteps.find((item, index, array) => index === stepIndex);
  }

  getIndexOfStep(step: WizardStepComponent): number {
    let stepIndex: number = -1;

    this.wizardSteps.forEach((item, index, array) => {
      if (item === step) {
        stepIndex = index;
      }
    });

    return stepIndex;
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

  canGoToStep(nextStep: WizardStepComponent | number): boolean {
    let result: boolean = true;
    let nextStepIndex: number;

    if (nextStep instanceof WizardStepComponent) {
      nextStepIndex = this.getIndexOfStep(nextStep);
    } else if (isNumber(nextStep)) {
      nextStepIndex = nextStep as number;
    }

    if (!this.hasStep(nextStepIndex)) {
      throw new Error(`Expected a valid step, but got nextStepIndex: ${nextStepIndex}.`);
    }

    this.wizardSteps.forEach((wizardStep, index, array) => {
      if (index < nextStepIndex && index !== this.currentStepIndex) {
        // all steps before the next step, that aren't the current step, must be completed
        result = result && wizardStep.completed;
      }
    });

    return result;
  }

  goToStep(nextStep: WizardStepComponent | number) {
    if (!this.canGoToStep(nextStep)) {
      throw new Error(`Expected a reachable step, but got nextStep: ${nextStep}.`);
    }

    let nextStepIndex: number;

    if (nextStep instanceof WizardStepComponent) {
      nextStepIndex = this.getIndexOfStep(nextStep);
    } else if (isNumber(nextStep)) {
      nextStepIndex = nextStep as number;
    }

    this.wizardSteps.forEach((wizardStep, index, array) => {
      if (index === this.currentStepIndex) {
        // finish processing old step
        this.currentStep.stepExit.emit();
        this.currentStep.completed = true;
        this.currentStep.selected = false;
      }

      if (this.currentStepIndex > nextStepIndex && index > nextStepIndex) {
        // if the next step is before the current step set all steps in between to incomplete
        this.currentStep.completed = false;
      }
    });

    // go to next step
    this.currentStepIndex = nextStepIndex;
    this.currentStep = this.getStepAtIndex(nextStepIndex);
    this.currentStep.stepEnter.emit();
    this.currentStep.selected = true;
  }
}
