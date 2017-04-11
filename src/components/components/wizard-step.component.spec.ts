/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {WizardStepComponent} from './wizard-step.component';
import {ViewChild, Component} from '@angular/core';
import {WizardComponent} from './wizard.component';
import {MovingDirection} from '../util/MovingDirection';
import {WizardNavigationBarComponent} from './wizard-navigation-bar.component';
import {GoToStepDirective} from '../directives/go-to-step.directive';
import {By} from '@angular/platform-browser';
import {OptionalStepDirective} from '../directives/optional-step.directive';

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
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public isValid: any = true;

  public eventLog: Array<string> = new Array<string>();

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardComponent, WizardStepComponent, WizardNavigationBarComponent,
        WizardTestComponent, GoToStepDirective, OptionalStepDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-step')).length).toBe(3);
  });

  it('should have correct step title', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTest.wizard.getStepAtIndex(0).title).toBe('Steptitle 1');
    expect(wizardTest.wizard.getStepAtIndex(1).title).toBe('Steptitle 2');
    expect(wizardTest.wizard.getStepAtIndex(2).title).toBe('Steptitle 3');
  });

  it('should enter first step after initialisation', () => {
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1']);
  });

  it('should enter second step after first step', () => {
    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2']);
  });

  it('should enter first step after exiting second step', () => {
    wizardTest.wizard.goToNextStep();
    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Backwards 2', 'enter Backwards 1']);
  });

  it('should enter third step after jumping over second optional step', () => {
    wizardTest.wizard.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3']);
  });

  it('should enter first step after jumping over second optional step two times', () => {
    wizardTest.wizard.goToStep(2);
    wizardTest.wizard.goToStep(0);
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'exit Backwards 3', 'enter Backwards 1']);
  });

  it('should enter second step after jumping over second optional step and the going back once', () => {
    wizardTest.wizard.goToStep(2);
    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'exit Backwards 3', 'enter Backwards 2']);
  });

  it('should stay at first step correctly', () => {
    wizardTest.wizard.goToStep(0);
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Stay 1', 'enter Stay 1']);
  });

  it('should not be able to leave the second step in any direction', () => {
    wizardTest.isValid = false;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.currentStep.canExitStep(MovingDirection.Forwards)).toBe(false);
    expect(wizardTest.wizard.currentStep.canExitStep(MovingDirection.Backwards)).toBe(false);
    expect(wizardTest.wizard.currentStep.canExitStep(MovingDirection.Stay)).toBe(false);
  });

  it('should not be able to leave the second step in forwards direction', () => {
    wizardTest.isValid = direction => direction !== MovingDirection.Forwards;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.currentStep.canExitStep(MovingDirection.Forwards)).toBe(false);
    expect(wizardTest.wizard.currentStep.canExitStep(MovingDirection.Backwards)).toBe(true);
    expect(wizardTest.wizard.currentStep.canExitStep(MovingDirection.Stay)).toBe(true);
  });

  it('should not be able to leave the second step in backwards direction', () => {
    wizardTest.isValid = direction => direction !== MovingDirection.Backwards;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.currentStep.canExitStep(MovingDirection.Forwards)).toBe(true);
    expect(wizardTest.wizard.currentStep.canExitStep(MovingDirection.Backwards)).toBe(false);
    expect(wizardTest.wizard.currentStep.canExitStep(MovingDirection.Stay)).toBe(true);
  });

  it('should throw error when method "canExit" is malformed', () => {
    wizardTest.isValid = 'String';

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(() => wizardTest.wizard.currentStep.canExitStep(MovingDirection.Forwards))
      .toThrow(new Error(`Input value 'canExit' is neither a boolean nor a function`));
  });

  it('should not leave the second step in forward direction if it can\'t be exited', () => {
    wizardTest.isValid = false;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  });

  it('should not leave the second step in backward direction if it can\'t be exited', () => {
    wizardTest.isValid = false;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);

    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  });

  it('should not leave the second step in forward direction if it can\'t be exited in this direction', () => {
    wizardTest.isValid = direction => direction === MovingDirection.Backwards;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  });

  it('should not leave the second step in backward direction if it can\'t be exited in this direction', () => {
    wizardTest.isValid = direction => direction === MovingDirection.Forwards;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);

    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Stay 2', 'enter Stay 2']);
  });

  it('should leave the second step in forward direction if it can be exited in this direction', () => {
    wizardTest.isValid = direction => direction === MovingDirection.Forwards;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(2);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Forwards 2', 'enter Forwards 3']);
  });

  it('should leave the second step in backward direction if it can be exited in this direction', () => {
    wizardTest.isValid = direction => direction === MovingDirection.Backwards;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);

    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2', 'exit Backwards 2', 'enter Backwards 1']);
  });
});
