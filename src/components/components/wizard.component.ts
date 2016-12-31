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
    return this.hasStep(this.currentStepIndex - 1);
  }

  hasNextStep(): boolean {
    return this.hasStep(this.currentStepIndex + 1);
  }

  isLastStep(): boolean {
    return this.wizardSteps.length > 0 && this.currentStepIndex === this.wizardSteps.length - 1;
  }

  getStepAtIndex(stepIndex: number): WizardStepComponent {
    if (!this.hasStep(stepIndex)) {
      throw new Error(`Expected a known step, but got stepIndex: ${stepIndex}.`);
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

  canGoToPreviousStep(): boolean {
    const previousStepIndex = this.currentStepIndex - 1;

    return this.hasStep(previousStepIndex) && this.canGoToStep(previousStepIndex);
  }

  canGoToNextStep(): boolean {
    const nextStepIndex = this.currentStepIndex + 1;

    return this.hasStep(nextStepIndex) && this.canGoToStep(nextStepIndex);
  }

  canGoToStep(inputStep: WizardStepComponent | number): boolean {
    let nextStepIndex: number;

    if (inputStep instanceof WizardStepComponent) {
      nextStepIndex = this.getIndexOfStep(inputStep);
    } else if (isNumber(inputStep)) {
      nextStepIndex = inputStep as number;
    }

    let result: boolean = this.hasStep(nextStepIndex);

    this.wizardSteps.forEach((wizardStep, index, array) => {
      if (index < nextStepIndex && index !== this.currentStepIndex) {
        // all steps before the next step, that aren't the current step, must be completed
        result = result && wizardStep.completed;
      }
    });

    return result;
  }

  goToStep(inputStep: WizardStepComponent | number) {
    let nextStepIndex: number;
    let nextStep: WizardStepComponent;

    if (inputStep instanceof WizardStepComponent) {
      nextStepIndex = this.getIndexOfStep(inputStep);
      nextStep = inputStep;
    } else if (isNumber(inputStep)) {
      nextStepIndex = inputStep as number;
      nextStep = this.getStepAtIndex(inputStep);
    }

    this.wizardSteps.forEach((wizardStep, index, array) => {
      if (index === this.currentStepIndex) {
        // finish processing old step
        this.currentStep.completed = true;
      }

      if (this.currentStepIndex > nextStepIndex && index > nextStepIndex) {
        // if the next step is before the current step set all steps in between to incomplete
        this.currentStep.completed = false;
      }
    });

    // leave current step
    this.currentStep.stepExit.emit();
    this.currentStep.selected = false;

    // go to next step
    this.currentStepIndex = nextStepIndex;
    this.currentStep = nextStep;
    this.currentStep.stepEnter.emit();
    this.currentStep.selected = true;
  }
}
