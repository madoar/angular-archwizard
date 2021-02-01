import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ArchwizardModule } from '../archwizard.module';
import { WizardComponent } from '../components/wizard.component';
import { MovingDirection } from '../util/moving-direction.enum';

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
      <aw-wizard-completion-step awEnableBackLinks stepTitle='Completion steptitle 3' (stepEnter)="enterInto($event, 3)"
                                 (stepExit)="completionStepExit($event, 3)">
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

  public completionStepExit: (direction: MovingDirection, source: number) => void = this.exitFrom;

  public enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  public exitFrom(direction: MovingDirection, source: number): void {
    this.eventLog.push(`exit ${MovingDirection[direction]} ${source}`);
  }
}

describe('EnableBackLinksDirective', () => {
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

  it('should be able to leave the completion step', fakeAsync(() => {
    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    wizard.canGoToStep(0).then(result => expect(result).toBe(true));
    wizard.canGoToStep(1).then(result => expect(result).toBe(true));
  }));


  it('should be able to leave the completion step in any direction', fakeAsync(() => {
    wizardTest.isValid = false;

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);
    expect(wizard.currentStep.canExit).toBe(true);
  }));

  it('should leave the completion step', fakeAsync(() => {
    wizardTest.isValid = false;

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);

    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'exit Backwards 3', 'enter Backwards 2']);
  }));

  it('should work with changed stepExit value', fakeAsync(() => {
    wizardTest.isValid = false;
    wizardTest.completionStepExit = (direction: MovingDirection, source: number) => {
      wizardTest.eventLog.push(`changed exit ${MovingDirection[direction]} ${source}`);
    };

    expect(wizard.completed).toBe(false);

    wizard.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(2);
    expect(wizard.completed).toBe(true);

    wizard.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizard.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'changed exit Backwards 3', 'enter Backwards 2']);
    expect(wizard.completed).toBe(false);
  }));
});
