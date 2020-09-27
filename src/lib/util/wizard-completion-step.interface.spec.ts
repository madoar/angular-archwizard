import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ArchwizardModule } from '../archwizard.module';
import { WizardComponent } from '../components/wizard.component';
import { MovingDirection } from './moving-direction.enum';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2' [canExit]="isValid" awOptionalStep (stepEnter)="enterInto($event, 2)"
                      (stepExit)="exitFrom($event, 2)">
        Step 2
      </aw-wizard-step>
      <aw-wizard-completion-step stepTitle='Completion steptitle 3' (stepEnter)="enterInto($event, 3)">
        Step 3
      </aw-wizard-completion-step>
    </aw-wizard>
  `
})
class WizardTestComponent {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public isValid: any = true;

  public eventLog: Array<string> = [];

  public enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  public exitFrom(direction: MovingDirection, source: number): void {
    this.eventLog.push(`exit ${MovingDirection[direction]} ${source}`);
  }
}

describe('WizardCompletionStep', () => {
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

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-step')).length).toBe(2);
    expect(wizardTestFixture.debugElement.queryAll(By.css('aw-wizard-completion-step')).length).toBe(1);
  });

  it('should set the wizard as completed after entering the completion step', fakeAsync(() => {
    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.completed).toBe(true);
  }));

  it('should be unable to leave the completion step', fakeAsync(() => {
    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    wizard.canGoToStep(0).then(result => expect(result).toBe(false));
    wizard.canGoToStep(1).then(result => expect(result).toBe(false));
  }));


  it('should not be able to leave the completion step in any direction', fakeAsync(() => {
    wizardTest.isValid = false;

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);
    expect(wizard.currentStep.canExit).toBe(false);
  }));

  it('should not leave the completion step if it can\'t be exited', fakeAsync(() => {
    wizardTest.isValid = false;

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);

    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'enter Stay 3']);
  }));
});
