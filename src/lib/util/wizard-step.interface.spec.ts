import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';
import {MovingDirection} from './moving-direction.enum';
import {WizardStep} from './wizard-step.interface';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step #firstStep stepTitle='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">
        Step 1
      </aw-wizard-step>
      <aw-wizard-step #secondStep stepTitle='Steptitle 2' [canExit]="canExit" [canEnter]="canEnter" awOptionalStep
                      (stepEnter)="enterInto($event, 2)" (stepExit)="exitFrom($event, 2)">
        Step 2
      </aw-wizard-step>
      <aw-wizard-step #thirdStep stepTitle='Steptitle 3' (stepEnter)="enterInto($event, 3)" (stepExit)="exitFrom($event, 3)">
        Step 3
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  public canEnter: any = true;

  public canExit: any = true;

  @ViewChild('firstStep')
  public firstStep: WizardStep;

  @ViewChild('secondStep')
  public secondStep: WizardStep;

  @ViewChild('thirdStep')
  public thirdStep: WizardStep;

  public eventLog: Array<string> = [];

  public enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  public exitFrom(direction: MovingDirection, source: number): void {
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
    expect(wizardState.wizardSteps.length).toBe(3);
  });

  it('should not be a WizardStep', () => {
    expect({stepOffset: 1} instanceof WizardStep).toBe(false);
    expect({title: 'Test stepTitle'} instanceof WizardStep).toBe(false);
  });

  it('should evaluate canEnter with boolean values correctly', fakeAsync(() => {
    wizardTest.secondStep.canEnterStep(MovingDirection.Backwards).then(result => expect(result).toBe(true));
    wizardTest.secondStep.canEnterStep(MovingDirection.Forwards).then(result => expect(result).toBe(true));

    wizardTest.canEnter = true;
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canEnterStep(MovingDirection.Backwards).then(result => expect(result).toBe(true));
    wizardTest.secondStep.canEnterStep(MovingDirection.Forwards).then(result => expect(result).toBe(true));

    wizardTest.canEnter = false;
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canEnterStep(MovingDirection.Backwards).then(result => expect(result).toBe(false));
    wizardTest.secondStep.canEnterStep(MovingDirection.Forwards).then(result => expect(result).toBe(false));
  }));

  it('should evaluate canEnter with functions returning a boolean value correctly', fakeAsync(() => {
    wizardTest.canEnter = (direction) => direction === MovingDirection.Forwards;
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canEnterStep(MovingDirection.Backwards).then(result => expect(result).toBe(false));
    wizardTest.secondStep.canEnterStep(MovingDirection.Forwards).then(result => expect(result).toBe(true));

    wizardTest.canEnter = (direction) => direction === MovingDirection.Backwards;
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canEnterStep(MovingDirection.Backwards).then(result => expect(result).toBe(true));
    wizardTest.secondStep.canEnterStep(MovingDirection.Forwards).then(result => expect(result).toBe(false));
  }));

  it('should evaluate canEnter with functions returning a promise correctly', fakeAsync(() => {
    wizardTest.canEnter = (direction) => Promise.resolve(direction === MovingDirection.Forwards);
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canEnterStep(MovingDirection.Backwards).then(result => expect(result).toBe(false));
    wizardTest.secondStep.canEnterStep(MovingDirection.Forwards).then(result => expect(result).toBe(true));

    wizardTest.canEnter = (direction) => Promise.resolve(direction === MovingDirection.Backwards);
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canEnterStep(MovingDirection.Backwards).then(result => expect(result).toBe(true));
    wizardTest.secondStep.canEnterStep(MovingDirection.Forwards).then(result => expect(result).toBe(false));
  }));

  it('should evaluate canEnter throwing an error correctly', fakeAsync(() => {
    wizardTest.canEnter = 'malformed input';
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canEnterStep(MovingDirection.Backwards)
      .then(result => fail())
      .catch(error => expect(error).toEqual(new Error(`Input value 'malformed input' is neither a boolean nor a function`)));
    wizardTest.secondStep.canEnterStep(MovingDirection.Forwards)
      .then(result => fail())
      .catch(error => expect(error).toEqual(new Error(`Input value 'malformed input' is neither a boolean nor a function`)));

    wizardTest.canEnter = (direction) => Promise.reject(new Error('malformed input'));
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canEnterStep(MovingDirection.Backwards)
      .then(result => fail())
      .catch(error => expect(error).toEqual(new Error(`malformed input`)));
    wizardTest.secondStep.canEnterStep(MovingDirection.Forwards)
      .then(result => fail())
      .catch(error => expect(error).toEqual(new Error(`malformed input`)));
  }));

  it('should evaluate canExit with boolean values correctly', fakeAsync(() => {
    wizardTest.secondStep.canExitStep(MovingDirection.Backwards).then(result => expect(result).toBe(true));
    wizardTest.secondStep.canExitStep(MovingDirection.Forwards).then(result => expect(result).toBe(true));

    wizardTest.canExit = true;
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canExitStep(MovingDirection.Backwards).then(result => expect(result).toBe(true));
    wizardTest.secondStep.canExitStep(MovingDirection.Forwards).then(result => expect(result).toBe(true));

    wizardTest.canExit = false;
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canExitStep(MovingDirection.Backwards).then(result => expect(result).toBe(false));
    wizardTest.secondStep.canExitStep(MovingDirection.Forwards).then(result => expect(result).toBe(false));
  }));

  it('should evaluate canExit with functions returning a boolean value correctly', fakeAsync(() => {
    wizardTest.canExit = (direction) => direction === MovingDirection.Forwards;
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canExitStep(MovingDirection.Backwards).then(result => expect(result).toBe(false));
    wizardTest.secondStep.canExitStep(MovingDirection.Forwards).then(result => expect(result).toBe(true));

    wizardTest.canExit = (direction) => direction === MovingDirection.Backwards;
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canExitStep(MovingDirection.Backwards).then(result => expect(result).toBe(true));
    wizardTest.secondStep.canExitStep(MovingDirection.Forwards).then(result => expect(result).toBe(false));
  }));

  it('should evaluate canExit with functions returning a promise correctly', fakeAsync(() => {
    wizardTest.canExit = (direction) => Promise.resolve(direction === MovingDirection.Forwards);
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canExitStep(MovingDirection.Backwards).then(result => expect(result).toBe(false));
    wizardTest.secondStep.canExitStep(MovingDirection.Forwards).then(result => expect(result).toBe(true));

    wizardTest.canExit = (direction) => Promise.resolve(direction === MovingDirection.Backwards);
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canExitStep(MovingDirection.Backwards).then(result => expect(result).toBe(true));
    wizardTest.secondStep.canExitStep(MovingDirection.Forwards).then(result => expect(result).toBe(false));
  }));

  it('should evaluate canExit throwing an error correctly', fakeAsync(() => {
    wizardTest.canExit = 'malformed input';
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canExitStep(MovingDirection.Backwards)
      .then(result => fail())
      .catch(error => expect(error).toEqual(new Error(`Input value 'malformed input' is neither a boolean nor a function`)));
    wizardTest.secondStep.canExitStep(MovingDirection.Forwards)
      .then(result => fail())
      .catch(error => expect(error).toEqual(new Error(`Input value 'malformed input' is neither a boolean nor a function`)));

    wizardTest.canExit = (direction) => Promise.reject(new Error('malformed input'));
    tick();
    wizardTestFixture.detectChanges();

    wizardTest.secondStep.canExitStep(MovingDirection.Backwards)
      .then(result => fail())
      .catch(error => expect(error).toEqual(new Error(`malformed input`)));
    wizardTest.secondStep.canExitStep(MovingDirection.Forwards)
      .then(result => fail())
      .catch(error => expect(error).toEqual(new Error(`malformed input`)));
  }));

  it('should enter first step after initialisation', () => {
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1']);
  });

  it('should enter second step after first step', fakeAsync(() => {
    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2']);
  }));

  it('should enter first step after exiting second step', fakeAsync(() => {
    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    navigationMode.goToPreviousStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Backwards 2', 'enter Backwards 1']);
  }));

  it('should enter third step after jumping over second optional step', fakeAsync(() => {
    navigationMode.goToStep(wizardState, 2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3']);
  }));

  it('should enter first step after jumping over second optional step two times', fakeAsync(() => {
    navigationMode.goToStep(wizardState, 2);
    tick();
    wizardTestFixture.detectChanges();

    navigationMode.goToStep(wizardState, 0);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'exit Backwards 3', 'enter Backwards 1']);
  }));

  it('should enter second step after jumping over second optional step and the going back once', fakeAsync(() => {
    navigationMode.goToStep(wizardState, 2);
    tick();
    wizardTestFixture.detectChanges();

    navigationMode.goToPreviousStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'exit Backwards 3', 'enter Backwards 2']);
  }));

  it('should stay at first step correctly', fakeAsync(() => {
    navigationMode.goToStep(wizardState, 0);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Stay 1', 'enter Stay 1']);
  }));

  it('should not leave the second step in forward direction if it can\'t be exited', fakeAsync(() => {
    wizardTest.canExit = false;

    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  }));

  it('should not leave the second step in backward direction if it can\'t be exited', fakeAsync(() => {
    wizardTest.canExit = false;

    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToPreviousStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  }));

  it('should not leave the second step in forward direction if it can\'t be exited in this direction', fakeAsync(() => {
    wizardTest.canExit = direction => direction === MovingDirection.Backwards;

    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  }));

  it('should not leave the second step in backward direction if it can\'t be exited in this direction', fakeAsync(() => {
    wizardTest.canExit = direction => direction === MovingDirection.Forwards;

    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToPreviousStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  }));

  it('should leave the second step in forward direction if it can be exited in this direction', fakeAsync(() => {
    wizardTest.canExit = direction => direction === MovingDirection.Forwards;

    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Forwards 2', 'enter Forwards 3']);
  }));

  it('should leave the second step in backward direction if it can be exited in this direction', fakeAsync(() => {
    wizardTest.canExit = direction => direction === MovingDirection.Backwards;

    navigationMode.goToNextStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);

    navigationMode.goToPreviousStep(wizardState);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Backwards 2', 'enter Backwards 1']);
  }));
});
