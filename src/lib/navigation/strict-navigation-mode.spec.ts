import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ArchwizardModule} from '../archwizard.module';
import {WizardComponent} from '../components/wizard.component';
import {WizardStep} from '../util/wizard-step.interface';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1' awOptionalStep>
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
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
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

describe('StrictNavigationMode', () => {
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardTest: WizardTestComponent;
  let wizard: WizardComponent;

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
    wizard = wizardTest.wizard;
  });

  it('should return correct can go to step', async(() => {
    wizard.canGoToStep(-1).then(result => expect(result).toBe(false));
    wizard.canGoToStep(0).then(result => expect(result).toBe(true));
    wizard.canGoToStep(1).then(result => expect(result).toBe(true));
    wizard.canGoToStep(2).then(result => expect(result).toBe(false));
    wizard.canGoToStep(3).then(result => expect(result).toBe(false));
  }));

  it('should go to step', fakeAsync(() => {
    checkWizardSteps(wizard.wizardSteps, 0);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.currentStep).toBe(wizard.getStepAtIndex(1));
    expect(wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizard.wizardSteps, 1);

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);
    expect(wizard.currentStep).toBe(wizard.getStepAtIndex(2));
    expect(wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizard.wizardSteps, 2);

    wizard.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(0);
    expect(wizard.currentStep).toBe(wizard.getStepAtIndex(0));
    expect(wizard.currentStep.completed).toBe(true);

    checkWizardSteps(wizard.wizardSteps, 0);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.currentStep).toBe(wizard.getStepAtIndex(1));
    expect(wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizard.wizardSteps, 1);

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);
    expect(wizard.currentStep).toBe(wizard.getStepAtIndex(2));
    expect(wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizard.wizardSteps, 2);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.currentStep).toBe(wizard.getStepAtIndex(1));
    expect(wizard.currentStep.completed).toBe(true);

    checkWizardSteps(wizard.wizardSteps, 1);
  }));

  it('should go to next step', fakeAsync(() => {
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.currentStep.stepTitle).toBe('Steptitle 2');
    expect(wizard.currentStep.completed).toBe(false);

    checkWizardSteps(wizard.wizardSteps, 1);
  }));

  it('should go to previous step', fakeAsync(() => {
    expect(wizard.getStepAtIndex(0).completed).toBe(false);
    checkWizardSteps(wizard.wizardSteps, 0);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.getStepAtIndex(0).completed).toBe(true);
    checkWizardSteps(wizard.wizardSteps, 1);

    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(0);
    expect(wizard.currentStep).toBe(wizard.getStepAtIndex(0));

    checkWizardSteps(wizard.wizardSteps, 0);
  }));

  it('should reset the wizard correctly', fakeAsync(() => {
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);
    expect(wizard.getStepAtIndex(0).selected).toBe(false);
    expect(wizard.getStepAtIndex(0).completed).toBe(true);
    expect(wizard.getStepAtIndex(1).selected).toBe(false);
    expect(wizard.getStepAtIndex(1).completed).toBe(true);
    expect(wizard.getStepAtIndex(2).selected).toBe(true);
    expect(wizard.getStepAtIndex(2).completed).toBe(false);
    expect(wizard.completed).toBe(false);

    wizard.reset();

    expect(wizard.currentStepIndex).toBe(0);
    expect(wizard.getStepAtIndex(0).selected).toBe(true);
    expect(wizard.getStepAtIndex(0).completed).toBe(false);
    expect(wizard.getStepAtIndex(1).selected).toBe(false);
    expect(wizard.getStepAtIndex(1).completed).toBe(false);
    expect(wizard.getStepAtIndex(2).selected).toBe(false);
    expect(wizard.getStepAtIndex(2).completed).toBe(false);
    expect(wizard.completed).toBe(false);

    wizard.defaultStepIndex = -1;
    expect(() => wizard.reset())
      .toThrow(new Error(`The wizard doesn't contain a step with index -1`));

    expect(wizard.currentStepIndex).toBe(0);
    expect(wizard.getStepAtIndex(0).selected).toBe(true);
    expect(wizard.getStepAtIndex(0).completed).toBe(false);
    expect(wizard.getStepAtIndex(1).selected).toBe(false);
    expect(wizard.getStepAtIndex(1).completed).toBe(false);
    expect(wizard.getStepAtIndex(2).selected).toBe(false);
    expect(wizard.getStepAtIndex(2).completed).toBe(false);
    expect(wizard.completed).toBe(false);

    wizard.defaultStepIndex = 1;
    wizard.reset();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizard.getStepAtIndex(0).selected).toBe(false);
    expect(wizard.getStepAtIndex(0).completed).toBe(false);
    expect(wizard.getStepAtIndex(1).selected).toBe(true);
    expect(wizard.getStepAtIndex(1).completed).toBe(false);
    expect(wizard.getStepAtIndex(2).selected).toBe(false);
    expect(wizard.getStepAtIndex(2).completed).toBe(false);
    expect(wizard.completed).toBe(false);
  }));
});
