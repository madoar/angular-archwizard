import {NextStepDirective} from './next-step.directive';
import {Component} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
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
        <button type="button" nextStep (postFinalize)="finalizeStep(1)">Go to second step</button>
      </wizard-step>
      <wizard-step stepTitle='Steptitle 2'>
        Step 2
        <button type="button" nextStep (postFinalize)="finalizeStep(2)">Go to first step</button>
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
      By.directive(NextStepDirective)).length).toBe(3);
  });

  it('should move correctly to the next step', fakeAsync(() => {
    const firstStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button[nextStep]')).nativeElement;
    const secondStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button[nextStep]')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);

    // go to second step
    firstStepButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    // don't go to third step because it doesn't exist
    secondStepButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
  }));

  it('should call finalize correctly when going the next step', fakeAsync(() => {
    const firstStepButtons = wizardTestFixture.debugElement.queryAll(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button[nextStep]'));

    expect(wizardTest.eventLog).toEqual([]);

    // go to second step
    firstStepButtons[0].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['finalize 1']);
  }));

  it('should call postFinalize correctly when going the next step', fakeAsync(() => {
    const firstStepButtons = wizardTestFixture.debugElement.queryAll(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button[nextStep]'));

    expect(wizardTest.eventLog).toEqual([]);

    // go to second step
    firstStepButtons[1].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['finalize 1']);
  }));

  it('shouldn\'t call finalize when going to an nonexistent step', fakeAsync(() => {
    const secondStepButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button[nextStep]')).nativeElement;

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual([]);

    // don't go to third step because it doesn't exist
    secondStepButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual([]);
  }));
});
