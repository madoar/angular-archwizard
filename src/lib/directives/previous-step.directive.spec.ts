import {Component} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';
import {PreviousStepDirective} from './previous-step.directive';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1'>
        Step 1
        <button type="button" (finalize)="finalizeStep(1)" awPreviousStep>
          Go to zero step
        </button>
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>
        Step 2
        <button type="button" (finalize)="finalizeStep(2)" awPreviousStep>
          Go to first step
        </button>
        <button type="button" (postFinalize)="finalizeStep(2)" awPreviousStep>
          Go to first step
        </button>
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  public eventLog: Array<string> = [];

  public finalizeStep(stepIndex: number): void {
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

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 1"] > button[awPreviousStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 2"] > button[awPreviousStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(
      By.directive(PreviousStepDirective)).length).toBe(3);
  });

  it('should move correctly to the previous step', fakeAsync(() => {
    const firstStepButton = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 1"] > button[awPreviousStep]')).nativeElement;
    const secondStepButton = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 2"] > button[awPreviousStep]')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);

    // don't go to zero (-1) step, because it doesn't exist
    firstStepButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);

    // move to second step to test the awPreviousStep directive
    navigationMode.goToStep(wizardState, 1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    // go back to first step
    secondStepButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
  }));

  it('should call finalize correctly when going the previous step', fakeAsync(() => {
    const secondStepButtons = wizardTestFixture.debugElement.queryAll(
      By.css('aw-wizard-step[stepTitle="Steptitle 2"] > button[awPreviousStep]'));

    navigationMode.goToStep(wizardState, 1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual([]);

    // go to second step
    secondStepButtons[0].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['finalize 2']);
  }));

  it('should call postFinalize correctly when going the previous step', fakeAsync(() => {
    const secondStepButtons = wizardTestFixture.debugElement.queryAll(
      By.css('aw-wizard-step[stepTitle="Steptitle 2"] > button[awPreviousStep]'));

    navigationMode.goToStep(wizardState, 1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual([]);

    // go to second step
    secondStepButtons[1].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['finalize 2']);
  }));

  it('shouldn\'t call finalize when going to an nonexistent step', fakeAsync(() => {
    const firstStepButton = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 1"] > button[awPreviousStep]')).nativeElement;

    expect(wizardTest.eventLog).toEqual([]);

    // don't go to third step because it doesn't exist
    firstStepButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual([]);
  }));
});
