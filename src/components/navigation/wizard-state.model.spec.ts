import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardModule} from '../wizard.module';
import {WizardState} from './wizard-state.model';
import {WizardComponent} from '../components/wizard.component';

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
}

function checkWizardSteps(steps: Array<WizardStep>, selectedStepIndex: number) {
  steps.forEach((step, index) => {
    // Only the selected step should be selected
    if (index === selectedStepIndex) {
      expect(step.selected).toBe(true, `the selected wizard step index ${index} is not selected`);
    } else {
      expect(step.selected).toBe(false, `the not selected wizard step index ${index} is selected`);
    }

    // All steps before the selected step need to be completed
    if (index < selectedStepIndex) {
      expect(step.completed).toBe(true,
        `the wizard step ${index} is not completed while the currently selected step index is ${selectedStepIndex}`);
    } else if (index > selectedStepIndex) {
      expect(step.completed).toBe(false,
        `the wizard step ${index} is completed while the currently selected step index is ${selectedStepIndex}`);
    }
  });
}

describe('WizardState', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;
  let wizardState: WizardState;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [WizardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;

    wizardState = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(WizardState);

    wizardTestFixture.detectChanges();
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardState).toBeTruthy();

    expect(wizardTestFixture.debugElement.query(By.css('wizard'))).toBeTruthy();
  });

  it('should have steps', () => {
    expect(wizardState.wizardSteps.length).toBe(3);
  });

  it('should start at first step', () => {
    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.currentStep.title).toBe('Steptitle 1');

    checkWizardSteps(wizardState.wizardSteps, 0);
  });

  it('should return correct step at index', () => {
    expect(() => wizardState.getStepAtIndex(-1))
      .toThrow(new Error(`Expected a known step, but got stepIndex: -1.`));

    expect(wizardState.getStepAtIndex(0).title).toBe('Steptitle 1');
    expect(wizardState.getStepAtIndex(1).title).toBe('Steptitle 2');
    expect(wizardState.getStepAtIndex(2).title).toBe('Steptitle 3');

    // Check that the first wizard step is the only selected one
    checkWizardSteps(wizardState.wizardSteps, 0);

    expect(() => wizardState.getStepAtIndex(3))
      .toThrow(new Error(`Expected a known step, but got stepIndex: 3.`));
  });

  it('should return correct index at step', () => {
    expect(wizardState.getIndexOfStep(wizardState.getStepAtIndex(0))).toBe(0);
    expect(wizardState.getIndexOfStep(wizardState.getStepAtIndex(1))).toBe(1);
    expect(wizardState.getIndexOfStep(wizardState.getStepAtIndex(2))).toBe(2);
  });

  it('should have next step', () => {
    expect(wizardState.hasNextStep()).toBe(true);

    wizardState.currentStepIndex++;

    expect(wizardState.hasNextStep()).toBe(true);

    wizardState.currentStepIndex++;

    expect(wizardState.hasNextStep()).toBe(false);
  });

  it('should have previous step', () => {
    expect(wizardState.hasPreviousStep()).toBe(false);

    wizardState.currentStepIndex++;

    expect(wizardState.hasPreviousStep()).toBe(true);

    wizardState.currentStepIndex++;

    expect(wizardState.hasPreviousStep()).toBe(true);
  });

  it('should be last step', () => {
    expect(wizardState.isLastStep()).toBe(false);

    wizardState.currentStepIndex++;

    expect(wizardState.isLastStep()).toBe(false);

    wizardState.currentStepIndex++;

    expect(wizardState.isLastStep()).toBe(true);
  });

  it('should reset the wizard correctly', () => {
    wizardState.currentStepIndex = 2;
    wizardState.getStepAtIndex(0).completed = true;
    wizardState.getStepAtIndex(0).selected = false;
    wizardState.getStepAtIndex(1).completed = true;
    wizardState.getStepAtIndex(2).selected = true;

    expect(wizardState.currentStepIndex).toBe(2);
    checkWizardSteps(wizardState.wizardSteps, 2);

    wizardState.reset();

    expect(wizardState.currentStepIndex).toBe(0);
    checkWizardSteps(wizardState.wizardSteps, 0);
  });
});
