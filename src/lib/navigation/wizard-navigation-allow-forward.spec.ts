import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ArchwizardModule } from '../archwizard.module';
import { WizardComponent } from '../components/wizard.component';
import { checkWizardNavigableSteps, checkWizardState } from '../util/test-utils';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard [awNavigationMode] navigateForward="allow">
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
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('Wizard navigation with navigateForward=allow', () => {
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardTest: WizardTestComponent;
  let wizard: WizardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [ArchwizardModule]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTestFixture.detectChanges();

    wizardTest = wizardTestFixture.componentInstance;
    wizard = wizardTest.wizard;

    // wait a tick to ensure that the initialization has been completed
    tick();
    wizardTestFixture.detectChanges();
  }));

  it('should return correct can go to step', waitForAsync(() => {
    wizard.canGoToStep(-1).then(result => expect(result).toBe(false));
    wizard.canGoToStep(0).then(result => expect(result).toBe(true));
    wizard.canGoToStep(1).then(result => expect(result).toBe(true));
    wizard.canGoToStep(2).then(result => expect(result).toBe(true));
    wizard.canGoToStep(3).then(result => expect(result).toBe(false));
  }));

  it('should go to step', fakeAsync(() => {
    checkWizardState(wizard, 0, false, [], false);
    checkWizardNavigableSteps(wizard, 0, [1, 2]);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, false, [0], false);
    checkWizardNavigableSteps(wizard, 1, [0, 2]);

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 2, false, [0, 1], false);
    checkWizardNavigableSteps(wizard, 2, [0, 1]);

    wizard.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    // If forward navigation is allowed, visited steps after
    // the selected step are still considered completed
    checkWizardState(wizard, 0, true, [0, 1, 2], true);
    checkWizardNavigableSteps(wizard, 0, [1, 2]);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, true, [0, 1, 2], true);
    checkWizardNavigableSteps(wizard, 1, [0, 2]);

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 2, true, [0, 1, 2], true);
    checkWizardNavigableSteps(wizard, 2, [0, 1]);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, true, [0, 1, 2], true);
    checkWizardNavigableSteps(wizard, 1, [0, 2]);
  }));

  it('should go to next step', fakeAsync(() => {
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, false, [0], false);
    checkWizardNavigableSteps(wizard, 1, [0, 2]);
  }));

  it('should go to previous step', fakeAsync(() => {
    checkWizardState(wizard, 0, false, [], false);
    checkWizardNavigableSteps(wizard, 0, [1, 2]);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, false, [0], false);
    checkWizardNavigableSteps(wizard, 1, [0, 2]);

    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    // If forward navigation is allowed, visited steps after
    // the selected step are still considered completed
    checkWizardState(wizard, 0, true, [0, 1], false);
    checkWizardNavigableSteps(wizard, 0, [1, 2]);
  }));

  it('should stay at the current step', fakeAsync(() => {
    expect(wizard.getStepAtIndex(0).completed).toBe(false);

    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 0, false, [], false);
    checkWizardNavigableSteps(wizard, 0, [1, 2]);

    wizard.goToStep(-1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 0, false, [], false);
    checkWizardNavigableSteps(wizard, 0, [1, 2]);

    wizard.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 0, true, [0], false);
    checkWizardNavigableSteps(wizard, 0, [1, 2]);
  }));

  it('should reset the wizard correctly', fakeAsync(() => {
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 2, false, [0, 1], false);
    checkWizardNavigableSteps(wizard, 2, [0, 1]);

    wizard.reset();

    checkWizardState(wizard, 0, false, [], false);
    checkWizardNavigableSteps(wizard, 0, [1, 2]);

    wizard.defaultStepIndex = -1;
    expect(() => wizard.reset())
      .toThrow(new Error(`The wizard doesn't contain a step with index -1`));

    checkWizardState(wizard, 0, false, [], false);
    checkWizardNavigableSteps(wizard, 0, [1, 2]);

    wizard.defaultStepIndex = 1;
    wizard.reset();

    checkWizardState(wizard, 1, false, [], false);
    checkWizardNavigableSteps(wizard, 1, [0, 2]);

    wizard.defaultStepIndex = 2;
    wizard.reset();

    checkWizardState(wizard, 2, false, [], false);
    checkWizardNavigableSteps(wizard, 2, [0, 1]);
  }));
});
