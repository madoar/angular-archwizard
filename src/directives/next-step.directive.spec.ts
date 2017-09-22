import {NextStepDirective} from './next-step.directive';
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
        <button type="button" nextStep (finalize)="finalizeStep(1)">Go to second step</button>
      </wizard-step>
      <wizard-step stepTitle='Steptitle 2'>
        Step 2
        <button type="button" nextStep (finalize)="finalizeStep(2)">Go to third step</button>
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

describe('NextStepDirective', () => {
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
      By.css('wizard-step[stepTitle="Steptitle 1"] > button[nextStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button[nextStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(
      By.css('wizard-step > button[nextStep]')).length).toBe(2);
  });

  it('should move correctly to the next step', () => {
    const firstStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button[nextStep]')).nativeElement;
    const secondStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button[nextStep]')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);

    // go to second step
    firstStepButton.click();

    expect(wizardState.currentStepIndex).toBe(1);

    // don't go to third step because it doesn't exist
    secondStepButton.click();

    expect(wizardState.currentStepIndex).toBe(1);
  });

  it('should move call finalize correctly when going the next step', () => {
    const firstStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button[nextStep]')).nativeElement;
    const secondStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button[nextStep]')).nativeElement;

    expect(wizardTest.eventLog).toEqual([]);

    // go to second step
    firstStepButton.click();

    expect(wizardTest.eventLog).toEqual(['finalize 1']);

    // don't go to third step because it doesn't exist
    secondStepButton.click();

    expect(wizardTest.eventLog).toEqual(['finalize 1']);
  });
});
