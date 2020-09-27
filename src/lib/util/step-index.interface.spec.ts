import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ArchwizardModule } from '../archwizard.module';
import { WizardComponent } from '../components/wizard.component';
import { GoToStepDirective } from '../directives/go-to-step.directive';
import { checkWizardState } from './test-utils';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1' [canExit]="canExit">
        Step 1
        <button type="button" [awGoToStep]="{stepIndex: 2}" (preFinalize)="finalizeStep(1)">
          Go to third step
        </button>
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2' awOptionalStep>
        Step 2
        <button type="button" [awGoToStep]="{stepIndex: 1}" (preFinalize)="finalizeStep(2)">
          Stay on second step
        </button>
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3'>
        Step 3
        <button type="button" [awGoToStep]="{stepIndex: 0}" (postFinalize)="finalizeStep(3)">
          Go to first step
        </button>
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public canExit = true;

  public eventLog: Array<string> = [];

  public finalizeStep(stepIndex: number): void {
    this.eventLog.push(`finalize ${stepIndex}`);
  }
}

describe('StepIndex', () => {
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

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(3);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-step[stepTitle="Steptitle 1"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(1);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-step[stepTitle="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(1);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-step[stepTitle="Steptitle 3"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(1);

    expect(wizardTestFixture.debugElement.queryAll(By.directive(GoToStepDirective)).length).toBe(6);
  });

  it('should move to an earlier step correctly', fakeAsync(() => {
    const firstStepGoToButtonEl = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 3"] > button')).nativeElement;

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 2, false, [0], false);

    // click button
    firstStepGoToButtonEl.click();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 0, true, [0], false);
  }));

  it('should move to a later step correctly', fakeAsync(() => {
    const firstStepGoToButtonEl = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 1"] > button')).nativeElement;

    checkWizardState(wizard, 0, false, [], false);

    // click button
    firstStepGoToButtonEl.click();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 2, false, [0], false);
  }));

  it('should stay at current step correctly', fakeAsync(() => {
    const firstStepGoToButtonEl = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 2"] > button')).nativeElement;

    wizard.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, false, [0], false);

    // click button
    firstStepGoToButtonEl.click();
    tick();
    wizardTestFixture.detectChanges();

    checkWizardState(wizard, 1, true, [0, 1], false);
  }));

  it('should return correct destination step for correct targetStep values', fakeAsync(() => {
    const firstGoToAttributeEl = wizardTestFixture.debugElement
      .query(By.css('aw-wizard-step[stepTitle="Steptitle 1"]'))
      .query(By.directive(GoToStepDirective)).injector.get(GoToStepDirective) as GoToStepDirective;

    const secondGoToAttributeEl = wizardTestFixture.debugElement
      .query(By.css('aw-wizard-step[stepTitle="Steptitle 3"]'))
      .query(By.directive(GoToStepDirective)).injector.get(GoToStepDirective) as GoToStepDirective;

    expect(firstGoToAttributeEl.destinationStep).toBe(2);
    expect(secondGoToAttributeEl.destinationStep).toBe(0);
  }));

  it('should not leave current step if the destination step can not be entered', fakeAsync(() => {
    expect(wizard.currentStepIndex).toBe(0);

    wizardTest.canExit = false;
    wizardTestFixture.detectChanges();

    const secondGoToAttributeEl = wizardTestFixture.debugElement
      .query(By.css('aw-wizard-navigation-bar'))
      .query(By.directive(GoToStepDirective)).nativeElement;

    secondGoToAttributeEl.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(0);
  }));
});
