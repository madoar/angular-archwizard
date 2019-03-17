import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardState} from './wizard-state.model';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1'>
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>
        Step 2
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3'>
        Step 3
      </aw-wizard-step>
    </aw-wizard>
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
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();

    wizardTest = wizardTestFixture.componentInstance;
    wizardState = wizardTestFixture.debugElement.query(By.css('aw-wizard')).injector.get(WizardState);
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardState).toBeTruthy();

    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard'))).toBeTruthy();
  });

  it('should have steps', () => {
    expect(wizardState.wizardSteps.length).toBe(3);
  });

  it('should start at first step', () => {
    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.currentStep.stepTitle).toBe('Steptitle 1');

    checkWizardSteps(wizardState.wizardSteps, 0);
  });

  it('should return correct step at index', () => {
    expect(() => wizardState.getStepAtIndex(-1))
      .toThrow(new Error(`Expected a known step, but got stepIndex: -1.`));

    expect(wizardState.getStepAtIndex(0).stepTitle).toBe('Steptitle 1');
    expect(wizardState.getStepAtIndex(1).stepTitle).toBe('Steptitle 2');
    expect(wizardState.getStepAtIndex(2).stepTitle).toBe('Steptitle 3');

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

  it('should return null when staying in an incorrect step', () => {
    wizardState.currentStepIndex = -1;
    expect(wizardState.currentStep).toBeNull();
  });
});
