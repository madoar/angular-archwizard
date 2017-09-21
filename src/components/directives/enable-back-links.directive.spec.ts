/**
 * Created by marc on 30.06.17.
 */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {By} from '@angular/platform-browser';
import {WizardModule} from '../wizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step title='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">
        Step 1
      </wizard-step>
      <wizard-step title='Steptitle 2' [canExit]="isValid"
                   optionalStep (stepEnter)="enterInto($event, 2)" (stepExit)="exitFrom($event, 2)">
        Step 2
      </wizard-step>
      <wizard-completion-step enableBackLinks title='Completion steptitle 3' (stepEnter)="enterInto($event, 3)"
                              (stepExit)="completionStepExit($event, 3)">
        Step 3
      </wizard-completion-step>
    </wizard>
  `
})
class WizardTestComponent {
  public isValid: any = true;

  public eventLog: Array<string> = [];

  public completionStepExit: (direction: MovingDirection, source: number) => void = this.exitFrom;

  enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  exitFrom(direction: MovingDirection, source: number): void {
    this.eventLog.push(`exit ${MovingDirection[direction]} ${source}`);
  }
}

describe('EnableBackLinksDirective', () => {
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

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-step')).length).toBe(2);
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-completion-step')).length).toBe(1);
  });

  it('should enter first step after initialisation', () => {
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1']);
  });

  it('should enter completion step after first step', () => {
    expect(wizardState.currentStepIndex).toBe(0);

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2']);

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2',
      'exit Forwards 2', 'enter Forwards 3']);
  });

  it('should enter completion step after jumping over second optional step', () => {
    navigationMode.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardState.completed).toBe(true);
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3']);
  });

  it('should be able to leave the completion step', () => {
    navigationMode.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(0)).toBe(true);
    expect(navigationMode.canGoToStep(1)).toBe(true);
  });


  it('should be able to leave the completion step in any direction', () => {
    wizardTest.isValid = false;

    navigationMode.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.currentStep.canExit).toBe(true);
  });

  it('should leave the completion step', () => {
    wizardTest.isValid = false;

    navigationMode.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);

    navigationMode.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'exit Backwards 3', 'enter Backwards 2']);
  });

  it('should work with changed stepExit value', () => {
    wizardTest.isValid = false;
    wizardTest.completionStepExit = (direction: MovingDirection, source: number) => {
      wizardTest.eventLog.push(`changed exit ${MovingDirection[direction]} ${source}`);
    };

    expect(wizardState.completed).toBe(false);

    navigationMode.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.completed).toBe(true);

    navigationMode.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'changed exit Backwards 3', 'enter Backwards 2']);
    expect(wizardState.completed).toBe(false);
  });
});
