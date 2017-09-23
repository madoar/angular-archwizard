import {PreviousStepDirective} from './previous-step.directive';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {WizardModule} from '../wizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step stepTitle='Steptitle 1'>
        Step 1
        <button type="button" (finalize)="finalizeStep(1)" previousStep>Go to zero step</button>
      </wizard-step>
      <wizard-step stepTitle='Steptitle 2'>
        Step 2
        <button type="button" (finalize)="finalizeStep(2)" previousStep>Go to first step</button>
        <button type="button" (postFinalize)="finalizeStep(2)" previousStep>Go to first step</button>
      </wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  public eventLog: Array<string> = [];

  finalizeStep(stepIndex: number): void {
    this.eventLog.push(`finalize ${stepIndex}`);
  }
}

describe('PreviousStepDirective', () => {
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
    wizardTestFixture.detectChanges();

    wizardTest = wizardTestFixture.componentInstance;
    wizardState = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(WizardState);
    navigationMode = wizardState.navigationMode;
  });

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button[previousStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button[previousStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(
      By.directive(PreviousStepDirective)).length).toBe(3);
  });

  it('should move correctly to the previous step', () => {
    const firstStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button[previousStep]')).nativeElement;
    const secondStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button[previousStep]')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);

    // don't go to zero (-1) step, because it doesn't exist
    firstStepButton.click();

    expect(wizardState.currentStepIndex).toBe(0);

    // move to second step to test the previousStep directive
    navigationMode.goToStep(1);
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    // go back to first step
    secondStepButton.click();

    expect(wizardState.currentStepIndex).toBe(0);
  });

  it('should call finalize correctly when going the previous step', () => {
    const secondStepButtons = wizardTestFixture.debugElement.queryAll(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button[previousStep]'));

    navigationMode.goToStep(1);

    expect(wizardTest.eventLog).toEqual([]);

    // go to second step
    secondStepButtons[0].nativeElement.click();

    expect(wizardTest.eventLog).toEqual(['finalize 2']);
  });

  it('should call postFinalize correctly when going the previous step', () => {
    const secondStepButtons = wizardTestFixture.debugElement.queryAll(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button[previousStep]'));

    navigationMode.goToStep(1);

    expect(wizardTest.eventLog).toEqual([]);

    // go to second step
    secondStepButtons[1].nativeElement.click();

    expect(wizardTest.eventLog).toEqual(['finalize 2']);
  });

  it('shouldn\'t call finalize when going to an nonexistent step', () => {
    const firstStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button[previousStep]')).nativeElement;

    expect(wizardTest.eventLog).toEqual([]);

    // don't go to third step because it doesn't exist
    firstStepButton.click();

    expect(wizardTest.eventLog).toEqual([]);
  });
});
