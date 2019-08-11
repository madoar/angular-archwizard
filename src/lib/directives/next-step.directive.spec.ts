import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {NextStepDirective} from './next-step.directive';
import {WizardComponent} from '../components/wizard.component';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1'>
        Step 1
        <button type="button" awNextStep (finalize)="finalizeStep(1)">
          Go to second step
        </button>
        <button type="button" awNextStep (postFinalize)="finalizeStep(1)">
          Go to second step
        </button>
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2'>
        Step 2
        <button type="button" awNextStep (postFinalize)="finalizeStep(2)">
          Go to first step
        </button>
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {

  @ViewChild(WizardComponent, {static: false})
  public wizard: WizardComponent;

  public eventLog: Array<string> = [];

  public finalizeStep(stepIndex: number): void {
    this.eventLog.push(`finalize ${stepIndex}`);
  }
}

describe('NextStepDirective', () => {
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

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 1"] > button[awNextStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 2"] > button[awNextStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(
      By.directive(NextStepDirective)).length).toBe(3);
  });

  it('should move correctly to the next step', fakeAsync(() => {
    const firstStepButtonEl = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 1"] > button[awNextStep]')).nativeElement;
    const secondStepButtonEl = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 2"] > button[awNextStep]')).nativeElement;

    expect(wizard.currentStepIndex).toBe(0);

    // go to second step
    firstStepButtonEl.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);

    // don't go to third step because it doesn't exist
    secondStepButtonEl.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
  }));

  it('should call finalize correctly when going the next step', fakeAsync(() => {
    const firstStepButtonEls = wizardTestFixture.debugElement.queryAll(
      By.css('aw-wizard-step[stepTitle="Steptitle 1"] > button[awNextStep]'));

    expect(wizardTest.eventLog).toEqual([]);

    // go to second step
    firstStepButtonEls[0].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['finalize 1']);
  }));

  it('should call postFinalize correctly when going the next step', fakeAsync(() => {
    const firstStepButtonEls = wizardTestFixture.debugElement.queryAll(
      By.css('aw-wizard-step[stepTitle="Steptitle 1"] > button[awNextStep]'));

    expect(wizardTest.eventLog).toEqual([]);

    // go to second step
    firstStepButtonEls[1].nativeElement.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['finalize 1']);
  }));

  it('shouldn\'t call finalize when going to an nonexistent step', fakeAsync(() => {
    const secondStepButtonEl = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 2"] > button[awNextStep]')).nativeElement;

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual([]);

    // don't go to third step because it doesn't exist
    secondStepButtonEl.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual([]);
  }));
});
