import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardComponent} from '../components/wizard.component';
import {WizardStep} from '../util/wizard-step.interface';
import {NavigationMode} from './navigation-mode.interface';
import {StrictNavigationMode} from './strict-navigation-mode';
import {WizardState} from './wizard-state.model';

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
  private wizard: WizardComponent;
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
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardState: WizardState;
  let navigationMode: NavigationMode;

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
    navigationMode = wizardState.navigationMode;
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard'))).toBeTruthy();
    expect(navigationMode instanceof StrictNavigationMode).toBe(true,
      'Navigation mode is not an instance of StrictNavigationMode');
  });

  it('should return correct can go to step', async(() => {
    navigationMode.canGoToStep(-1).then(result => expect(result).toBe(false));
    navigationMode.canGoToStep(0).then(result => expect(result).toBe(true));
    navigationMode.canGoToStep(1).then(result => expect(result).toBe(true));
    navigationMode.canGoToStep(2).then(result => expect(result).toBe(false));
    navigationMode.canGoToStep(3).then(result => expect(result).toBe(false));
  }));

  it('should go to step', fakeAsync(() => {
    checkWizardSteps(wizardState.wizardSteps, 0);

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(1));
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 1);

    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(2));
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 2);

    navigationMode.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(0));
    expect(wizardState.currentStep.completed).toBe(true);

    checkWizardSteps(wizardState.wizardSteps, 0);

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(1));
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 1);

    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(2));
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 2);

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(1));
    expect(wizardState.currentStep.completed).toBe(true);

    checkWizardSteps(wizardState.wizardSteps, 1);
  }));

  it('should go to next step', fakeAsync(() => {
    navigationMode.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep.stepTitle).toBe('Steptitle 2');
    expect(wizardState.currentStep.completed).toBe(false);

    checkWizardSteps(wizardState.wizardSteps, 1);
  }));

  it('should go to previous step', fakeAsync(() => {
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    checkWizardSteps(wizardState.wizardSteps, 0);

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    checkWizardSteps(wizardState.wizardSteps, 1);

    navigationMode.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.currentStep).toBe(wizardState.getStepAtIndex(0));

    checkWizardSteps(wizardState.wizardSteps, 0);
  }));

  it('should reset the wizard correctly', fakeAsync(() => {
    navigationMode.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    navigationMode.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(true);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(true);
    expect(wizardState.getStepAtIndex(2).selected).toBe(true);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    navigationMode.reset();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.defaultStepIndex = -1;
    expect(() => navigationMode.reset()).toThrow(new Error(`The wizard doesn't contain a step with index -1`));

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardState.getStepAtIndex(0).selected).toBe(true);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(false);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.defaultStepIndex = 1;
    navigationMode.reset();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);

    wizardState.defaultStepIndex = 2;
    expect(() => navigationMode.reset()).toThrow(new Error(`The default step index 2 is located after a non optional step`));

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.getStepAtIndex(0).selected).toBe(false);
    expect(wizardState.getStepAtIndex(0).completed).toBe(false);
    expect(wizardState.getStepAtIndex(1).selected).toBe(true);
    expect(wizardState.getStepAtIndex(1).completed).toBe(false);
    expect(wizardState.getStepAtIndex(2).selected).toBe(false);
    expect(wizardState.getStepAtIndex(2).completed).toBe(false);
    expect(wizardState.completed).toBe(false);
  }));
});
