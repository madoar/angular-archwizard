/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {QueryList, Component, ViewChild} from '@angular/core';
import {WizardComponent} from './wizard.component';
import {WizardStepComponent} from './wizard-step.component';
import {WizardNavigationBarComponent} from './wizard-navigation-bar.component';
import {GoToStepDirective} from '../directives/go-to-step.directive';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step title='Steptitle 1'>Step 1</wizard-step>
      <wizard-step title='Steptitle 2'>Step 2</wizard-step>
      <wizard-step title='Steptitle 3'>Step 3</wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

function checkWizardSteps(steps: QueryList<WizardStepComponent>, selectedStepIndex: number) {
  steps.forEach((step, index, array) => {
    // Only the selected step should be selected
    if (index === selectedStepIndex) {
      expect(step.selected).toBe(true, `the selected wizard step index ${index} is not selected`);
    } else {
      expect(step.selected).toBe(false, `the not selected wizard step index ${index} is selected`);
    }

    // All steps before the selected step need to be completed
    if (index < selectedStepIndex) {
      expect(step.completed).toBe(true, `the wizard step ${index} is not completed while the currently selected step index is ${selectedStepIndex}`);
    } else if (index > selectedStepIndex) {
      expect(step.completed).toBe(false, `the wizard step ${index} is completed while the currently selected step index is ${selectedStepIndex}`);
    }
  });
}

describe('WizardComponent', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardComponent, WizardStepComponent, WizardNavigationBarComponent, WizardTestComponent, GoToStepDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
  });

  it('should have steps', () => {
    expect(wizardTest.wizard.wizardSteps.length).toBe(3);
  });

  it('should start at first step', () => {
    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTest.wizard.currentStep.title).toBe('Steptitle 1');

    checkWizardSteps(wizardTest.wizard.wizardSteps, 0);
  });

  it('should return correct step at index', () => {
    expect(() => wizardTest.wizard.getStepAtIndex(-1)).toThrow(new Error(`Expected a known step, but got stepIndex: -1.`));

    expect(wizardTest.wizard.getStepAtIndex(0).title).toBe('Steptitle 1');
    expect(wizardTest.wizard.getStepAtIndex(1).title).toBe('Steptitle 2');
    expect(wizardTest.wizard.getStepAtIndex(2).title).toBe('Steptitle 3');

    // Check that the first wizard step is the only selected one
    checkWizardSteps(wizardTest.wizard.wizardSteps, 0);

    expect(() => wizardTest.wizard.getStepAtIndex(3)).toThrow(new Error(`Expected a known step, but got stepIndex: 3.`));
  });

  it('should return correct index at step', () => {
    expect(wizardTest.wizard.getIndexOfStep(wizardTest.wizard.getStepAtIndex(0))).toBe(0);
    expect(wizardTest.wizard.getIndexOfStep(wizardTest.wizard.getStepAtIndex(1))).toBe(1);
    expect(wizardTest.wizard.getIndexOfStep(wizardTest.wizard.getStepAtIndex(2))).toBe(2);
  });

  it('should return correct can go to step', () => {
    expect(wizardTest.wizard.canGoToStep(-1)).toBe(false);
    expect(wizardTest.wizard.canGoToStep(0)).toBe(true);
    expect(wizardTest.wizard.canGoToStep(1)).toBe(true);
    expect(wizardTest.wizard.canGoToStep(2)).toBe(false);
    expect(wizardTest.wizard.canGoToStep(3)).toBe(false);
  });

  it('should return correct can go to next step', () => {
    expect(wizardTest.wizard.canGoToNextStep()).toBe(true);

    wizardTest.wizard.goToNextStep();

    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);
    expect(wizardTest.wizard.canGoToNextStep()).toBe(true);

    wizardTest.wizard.goToNextStep();

    checkWizardSteps(wizardTest.wizard.wizardSteps, 2);
    expect(wizardTest.wizard.canGoToNextStep()).toBe(false);
  });

  it('should return correct can go to previous step', () => {
    expect(wizardTest.wizard.canGoToPreviousStep()).toBe(false);

    wizardTest.wizard.goToNextStep();

    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);
    expect(wizardTest.wizard.canGoToPreviousStep()).toBe(true);
  });

  it('should go to step', () => {
    checkWizardSteps(wizardTest.wizard.wizardSteps, 0);

    wizardTest.wizard.goToStep(1);

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.currentStep).toBe(wizardTest.wizard.getStepAtIndex(1));
    expect(wizardTest.wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);

    wizardTest.wizard.goToStep(2);

    expect(wizardTest.wizard.currentStepIndex).toBe(2);
    expect(wizardTest.wizard.currentStep).toBe(wizardTest.wizard.getStepAtIndex(2));
    expect(wizardTest.wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizardTest.wizard.wizardSteps, 2);

    wizardTest.wizard.goToStep(0);

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTest.wizard.currentStep).toBe(wizardTest.wizard.getStepAtIndex(0));
    expect(wizardTest.wizard.currentStep.completed).toBe(true);

    checkWizardSteps(wizardTest.wizard.wizardSteps, 0);

    wizardTest.wizard.goToStep(1);

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.currentStep).toBe(wizardTest.wizard.getStepAtIndex(1));
    expect(wizardTest.wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);

    wizardTest.wizard.goToStep(2);

    expect(wizardTest.wizard.currentStepIndex).toBe(2);
    expect(wizardTest.wizard.currentStep).toBe(wizardTest.wizard.getStepAtIndex(2));
    expect(wizardTest.wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizardTest.wizard.wizardSteps, 2);

    wizardTest.wizard.goToStep(1);

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.currentStep).toBe(wizardTest.wizard.getStepAtIndex(1));
    expect(wizardTest.wizard.currentStep.completed).toBe(true);

    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);
  });

  it('should go to next step', () => {
    wizardTest.wizard.goToNextStep();

    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.currentStep.title).toBe('Steptitle 2');
    expect(wizardTest.wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);
  });

  it('should go to previous step', () => {
    expect(wizardTest.wizard.getStepAtIndex(0).completed).toBe(false);
    checkWizardSteps(wizardTest.wizard.wizardSteps, 0);

    wizardTest.wizard.goToStep(1);

    expect(wizardTest.wizard.getStepAtIndex(0).completed).toBe(true);
    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);

    wizardTest.wizard.goToPreviousStep();

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTest.wizard.currentStep).toBe(wizardTest.wizard.getStepAtIndex(0));

    checkWizardSteps(wizardTest.wizard.wizardSteps, 0);
  });

  it('should have next step', () => {
    checkWizardSteps(wizardTest.wizard.wizardSteps, 0);
    expect(wizardTest.wizard.hasNextStep()).toBe(true);

    wizardTest.wizard.goToNextStep();

    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);
    expect(wizardTest.wizard.hasNextStep()).toBe(true);

    wizardTest.wizard.goToNextStep();

    checkWizardSteps(wizardTest.wizard.wizardSteps, 2);
    expect(wizardTest.wizard.hasNextStep()).toBe(false);
  });

  it('should have previous step', () => {
    checkWizardSteps(wizardTest.wizard.wizardSteps, 0);
    expect(wizardTest.wizard.hasPreviousStep()).toBe(false);

    wizardTest.wizard.goToNextStep();

    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);
    expect(wizardTest.wizard.hasPreviousStep()).toBe(true);

    wizardTest.wizard.goToNextStep();

    checkWizardSteps(wizardTest.wizard.wizardSteps, 2);
    expect(wizardTest.wizard.hasPreviousStep()).toBe(true);
  });

  it('should be last step', () => {
    checkWizardSteps(wizardTest.wizard.wizardSteps, 0);
    expect(wizardTest.wizard.isLastStep()).toBe(false);

    wizardTest.wizard.goToNextStep();

    checkWizardSteps(wizardTest.wizard.wizardSteps, 1);
    expect(wizardTest.wizard.isLastStep()).toBe(false);

    wizardTest.wizard.goToNextStep();

    checkWizardSteps(wizardTest.wizard.wizardSteps, 2);
    expect(wizardTest.wizard.isLastStep()).toBe(true);
  });
});
