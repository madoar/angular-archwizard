import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {WizardStep} from '../util/wizard-step.interface';
import {WizardModule} from '../wizard.module';
import {WizardState} from './wizard-state.model';
import {WizardComponent} from '../components/wizard.component';
import {NavigationMode} from './navigation-mode.interface';

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
  private wizard: WizardComponent;
}

function checkWizardSteps(steps: Array<WizardStep>, selectedStepIndex: number) {
  steps.forEach((step, index, array) => {
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

describe('StrictNavigationMode', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardState: WizardState;
  let navigationMode: NavigationMode;

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
    navigationMode = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(NavigationMode);

    wizardTestFixture.detectChanges();
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('wizard'))).toBeTruthy();
  });

  it('should return correct can go to step', () => {
    expect(navigationMode.canGoToStep(-1)).toBe(false);
    expect(navigationMode.canGoToStep(0)).toBe(true);
    expect(navigationMode.canGoToStep(1)).toBe(true);
    expect(navigationMode.canGoToStep(2)).toBe(false);
    expect(navigationMode.canGoToStep(3)).toBe(false);
  });

  it('should return correct can go to next step', () => {
    expect(navigationMode.canGoToNextStep()).toBe(true);

    navigationMode.goToNextStep();

    checkWizardSteps(wizardState.wizardSteps, 1);
    expect(navigationMode.canGoToNextStep()).toBe(true);

    navigationMode.goToNextStep();

    checkWizardSteps(wizardState.wizardSteps, 2);
    expect(navigationMode.canGoToNextStep()).toBe(false);

    // should do nothing
    navigationMode.goToNextStep();

    checkWizardSteps(wizardState.wizardSteps, 2);
  });

  it('should return correct can go to previous step', () => {
    expect(navigationMode.canGoToPreviousStep()).toBe(false);

    // should do nothing
    navigationMode.goToPreviousStep();

    checkWizardSteps(wizardState.wizardSteps, 0);

    navigationMode.goToNextStep();

    checkWizardSteps(wizardState.wizardSteps, 1);
    expect(navigationMode.canGoToPreviousStep()).toBe(true);
  });

  it('should go to step', () => {
    checkWizardSteps(wizardState.wizardSteps, 0);

    navigationMode.goToStep(1);

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(1));
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 1);

    navigationMode.goToStep(2);

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(2));
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 2);

    navigationMode.goToStep(0);

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(0));
    expect(wizardState.currentStep.completed).toBe(true);

    checkWizardSteps(wizardState.wizardSteps, 0);

    navigationMode.goToStep(1);

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(1));
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 1);

    navigationMode.goToStep(2);

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(2));
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 2);

    navigationMode.goToStep(1);

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(1));
    expect(wizardState.currentStep.completed).toBe(true);

    checkWizardSteps(wizardState.wizardSteps, 1);
  });

  it('should go to next step', () => {
    navigationMode.goToNextStep();

    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep.title).toBe('Steptitle 2');
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 1);
  });

  it('should go to previous step', () => {
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    checkWizardSteps(wizardState.wizardSteps, 0);

    navigationMode.goToStep(1);

    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    checkWizardSteps(wizardState.wizardSteps, 1);

    navigationMode.goToPreviousStep();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(0));

    checkWizardSteps(wizardState.wizardSteps, 0);
  });
});
