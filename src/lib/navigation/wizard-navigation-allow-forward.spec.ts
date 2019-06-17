import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ArchwizardModule} from '../archwizard.module';
import {WizardComponent} from '../components/wizard.component';
import {checkWizardState} from '../util/test-utils';

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
    wizard.canGoToStep(2).then(result => expect(result).toBe(true));
    wizard.canGoToStep(3).then(result => expect(result).toBe(false));
  }));

  it('should go to step', fakeAsync(() => {
    checkWizardState(wizard, 0, false, [], false);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, false, [0], false);

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 2, false, [0, 1], false);

    wizard.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    // If forward navigation is allowed, visited steps after
    // the selected step are still considered completed
    checkWizardState(wizard, 0, true, [0, 1, 2], true);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, true, [0, 1, 2], true);

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 2, true, [0, 1, 2], true);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, true, [0, 1, 2], true);
  }));

  it('should go to next step', fakeAsync(() => {
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, false, [0], false);
  }));

  it('should go to previous step', fakeAsync(() => {
    checkWizardState(wizard, 0, false, [], false);

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, false, [0], false);

    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    // If forward navigation is allowed, visited steps after
    // the selected step are still considered completed
    checkWizardState(wizard, 0, true, [0, 1], false);
  }));

  it('should stay at the current step', fakeAsync(() => {
    expect(wizard.getStepAtIndex(0).completed).toBe(false);

    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 0, false, [], false);

    wizard.goToStep(-1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 0, false, [], false);

    wizard.goToStep(0);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 0, true, [0], false);
  }));

  it('should reset the wizard correctly', fakeAsync(() => {
    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    wizard.goToNextStep();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 2, false, [0, 1], false);

    wizard.reset();

    checkWizardState(wizard, 0, false, [], false);

    wizard.defaultStepIndex = -1;
    expect(() => wizard.reset())
      .toThrow(new Error(`The wizard doesn't contain a step with index -1`));

    checkWizardState(wizard, 0, false, [], false);

    wizard.defaultStepIndex = 1;
    wizard.reset();

    checkWizardState(wizard, 1, false, [], false);

    wizard.defaultStepIndex = 2;
    wizard.reset();

    checkWizardState(wizard, 2, false, [], false);
  }));
});
