/**
 * Created by marc on 29.06.17.
 */
import {Component, ViewChild} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {ComponentFixture, async, TestBed} from '@angular/core/testing';
import {WizardStepComponent} from '../components/wizard-step.component';
import {WizardCompletionStepComponent} from '../components/wizard-completion-step.component';
import {WizardModule} from '../wizard.module';
import {WizardStep} from './wizard-step.interface';
import {WizardCompletionStepDirective} from '../directives/wizard-completion-step.directive';
import {WizardStepDirective} from '../directives/wizard-step.directive';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {By} from '@angular/platform-browser';
import {MovingDirection} from './moving-direction.enum';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step stepTitle='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">Step 1</wizard-step>
      <wizard-step stepTitle='Steptitle 2' [canExit]="canExit" [canEnter]="canEnter" optionalStep
                   (stepEnter)="enterInto($event, 2)" (stepExit)="exitFrom($event, 2)">Step 2</wizard-step>
      <wizard-step stepTitle='Steptitle 3' (stepEnter)="enterInto($event, 3)" (stepExit)="exitFrom($event, 3)">Step 3</wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  public canEnter: any = true;

  public canExit: any = true;

  public eventLog: Array<string> = [];

  enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  exitFrom(direction: MovingDirection, source: number): void {
    this.eventLog.push(`exit ${MovingDirection[direction]} ${source}`);
  }
}

describe('WizardStep', () => {
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
    expect(wizardState.wizardSteps.length).toBe(3);
  });

  it('should not be a WizardStep', () => {
    expect({stepOffset: 1} instanceof WizardStep).toBe(false);
    expect({title: 'Test stepTitle'} instanceof WizardStep).toBe(false);
  });

  it('should evaluate canEnter correctly', () => {
    expect(navigationMode.canGoToStep(1)).toBe(true);

    wizardTest.canEnter = true;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(1)).toBe(true);

    wizardTest.canEnter = false;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(1)).toBe(false);

    wizardTest.canEnter = (direction) => direction === MovingDirection.Forwards;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(1)).toBe(true);

    wizardTest.canEnter = (direction) => direction === MovingDirection.Backwards;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(1)).toBe(false);

    wizardTest.canEnter = 'malformed input';
    wizardTestFixture.detectChanges();

    expect(() => navigationMode.canGoToStep(1))
      .toThrow(new Error(`Input value 'malformed input' is neither a boolean nor a function`));
  });

  it('should evaluate canExit correctly', () => {
    navigationMode.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(0)).toBe(true);
    expect(navigationMode.canGoToStep(2)).toBe(true);

    wizardTest.canExit = true;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(0)).toBe(true);
    expect(navigationMode.canGoToStep(2)).toBe(true);

    wizardTest.canExit = false;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(0)).toBe(false);
    expect(navigationMode.canGoToStep(2)).toBe(false);

    wizardTest.canExit = (direction) => direction === MovingDirection.Forwards;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(0)).toBe(false);
    expect(navigationMode.canGoToStep(2)).toBe(true);

    wizardTest.canExit = (direction) => direction === MovingDirection.Backwards;
    wizardTestFixture.detectChanges();

    expect(navigationMode.canGoToStep(0)).toBe(true);
    expect(navigationMode.canGoToStep(2)).toBe(false);

    wizardTest.canExit = 'malformed input';
    wizardTestFixture.detectChanges();

    expect(() => navigationMode.canGoToStep(0))
      .toThrow(new Error(`Input value 'malformed input' is neither a boolean nor a function`));
    expect(() => navigationMode.canGoToStep(2))
      .toThrow(new Error(`Input value 'malformed input' is neither a boolean nor a function`));
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

  it('should not leave the second step in forward direction if it can\'t be exited', () => {
    wizardTest.canExit = false;

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
    wizardTest.canExit = false;

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
    wizardTest.canExit = direction => direction === MovingDirection.Backwards;

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
    wizardTest.canExit = direction => direction === MovingDirection.Forwards;

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
    wizardTest.canExit = direction => direction === MovingDirection.Forwards;

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
    wizardTest.canExit = direction => direction === MovingDirection.Backwards;

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
