import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {WizardStepComponent} from './wizard-step.component';
import {Component} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {By} from '@angular/platform-browser';
import {WizardModule} from '../wizard.module';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step title='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">Step 1</wizard-step>
      <wizard-step title='Steptitle 2' [canExit]="isValid"
                   optionalStep (stepEnter)="enterInto($event, 2)" (stepExit)="exitFrom($event, 2)">Step 2</wizard-step>
      <wizard-step title='Steptitle 3' (stepEnter)="enterInto($event, 3)" (stepExit)="exitFrom($event, 3)">Step 3</wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  public isValid: any = true;

  public eventLog: Array<string> = [];

  enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  exitFrom(direction: MovingDirection, source: number): void {
    this.eventLog.push(`exit ${MovingDirection[direction]} ${source}`);
  }
}

describe('WizardStepComponent', () => {
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
    wizardTest = wizardTestFixture.componentInstance;
    wizardState = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(WizardState);
    navigationMode = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(NavigationMode);

    wizardTestFixture.detectChanges();
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-step')).length).toBe(3);
  });

  it('should have correct step title', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardState.getStepAtIndex(0).title).toBe('Steptitle 1');
    expect(wizardState.getStepAtIndex(1).title).toBe('Steptitle 2');
    expect(wizardState.getStepAtIndex(2).title).toBe('Steptitle 3');
  });

  it('should enter first step after initialisation', () => {
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1']);
  });

  it('should enter second step after first step', () => {
    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2']);
  });

  it('should enter first step after exiting second step', () => {
    navigationMode.goToNextStep();
    navigationMode.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Backwards 2', 'enter Backwards 1']);
  });

  it('should enter third step after jumping over second optional step', () => {
    navigationMode.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3']);
  });

  it('should enter first step after jumping over second optional step two times', () => {
    navigationMode.goToStep(2);
    navigationMode.goToStep(0);
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'exit Backwards 3', 'enter Backwards 1']);
  });

  it('should enter second step after jumping over second optional step and the going back once', () => {
    navigationMode.goToStep(2);
    navigationMode.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'exit Backwards 3', 'enter Backwards 2']);
  });

  it('should stay at first step correctly', () => {
    navigationMode.goToStep(0);
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Stay 1', 'enter Stay 1']);
  });

  it('should not be able to leave the second step in any direction', () => {
    wizardTest.isValid = false;

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep.canExit).toBe(false);
  });

  it('should not be able to leave the second step in forwards direction', () => {
    wizardTest.isValid = direction => direction !== MovingDirection.Forwards;

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep.canExitStep(MovingDirection.Forwards)).toBe(false);
    expect(wizardState.currentStep.canExitStep(MovingDirection.Backwards)).toBe(true);
    expect(wizardState.currentStep.canExitStep(MovingDirection.Stay)).toBe(true);
  });

  it('should not be able to leave the second step in backwards direction', () => {
    wizardTest.isValid = direction => direction !== MovingDirection.Backwards;

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardState.currentStep.canExitStep(MovingDirection.Forwards)).toBe(true);
    expect(wizardState.currentStep.canExitStep(MovingDirection.Backwards)).toBe(false);
    expect(wizardState.currentStep.canExitStep(MovingDirection.Stay)).toBe(true);
  });

  it('should throw error when method "canExit" is malformed', () => {
    wizardTest.isValid = 'String';

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(() => wizardState.currentStep.canExitStep(MovingDirection.Forwards))
      .toThrow(new Error(`Input value 'String' is neither a boolean nor a function`));
  });

  it('should not leave the second step in forward direction if it can\'t be exited', () => {
    wizardTest.isValid = false;

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  });

  it('should not leave the second step in backward direction if it can\'t be exited', () => {
    wizardTest.isValid = false;

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  });

  it('should not leave the second step in forward direction if it can\'t be exited in this direction', () => {
    wizardTest.isValid = direction => direction === MovingDirection.Backwards;

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  });

  it('should not leave the second step in backward direction if it can\'t be exited in this direction', () => {
    wizardTest.isValid = direction => direction === MovingDirection.Forwards;

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  });

  it('should leave the second step in forward direction if it can be exited in this direction', () => {
    wizardTest.isValid = direction => direction === MovingDirection.Forwards;

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Forwards 2', 'enter Forwards 3']);
  });

  it('should leave the second step in backward direction if it can be exited in this direction', () => {
    wizardTest.isValid = direction => direction === MovingDirection.Backwards;

    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Backwards 2', 'enter Backwards 1']);
  });
});
