import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ViewChild, Component, Host, EventEmitter, forwardRef} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {MovingDirection} from '../util/moving-direction.enum';
import {By} from '@angular/platform-browser';
import {WizardModule} from '../wizard.module';
import {WizardStepDirective} from './wizard-step.directive';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <div wizardStep title='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">
        Step 1
      </div>
      <test-wizard-step wizardStep optionalStep>
        Step 2
      </test-wizard-step>
      <div wizardStep title='Steptitle 3' (stepEnter)="enterInto($event, 3)" (stepExit)="exitFrom($event, 3)">
        Step 3
      </div>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  @ViewChild(forwardRef(() => WizardStepTestComponent))
  public wizardStepTestComponent;

  public eventLog: Array<string> = new Array<string>();

  enterInto(direction: MovingDirection, destination: number): void {
    this.eventLog.push(`enter ${MovingDirection[direction]} ${destination}`);
  }

  exitFrom(direction: MovingDirection, source: number): void {
    this.eventLog.push(`exit ${MovingDirection[direction]} ${source}`);
  }
}

@Component({
  selector: 'test-wizard-step',
  template: `
    Step 2
  `
})
class WizardStepTestComponent {
  public set isValid(valid: any) {
    this.wizardStep.canExit = valid;
  }

  constructor(@Host() private wizardStep: WizardStepDirective, wizard: WizardTestComponent) {
    wizardStep.title = 'Steptitle 2';
    wizardStep.stepEnter.emit = direction => wizard.enterInto(direction, 2);
    wizardStep.stepExit.emit = direction => wizard.exitFrom(direction, 2);
  }
}


describe('WizardStepDirective', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent, WizardStepTestComponent],
      imports: [WizardModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.directive(WizardStepDirective)).length).toBe(3);
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
    wizardTest.wizardStepTestComponent.isValid = false;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.currentStep.canExit).toBe(false);
  });

  it('should not be able to leave the second step in forwards direction', () => {
    wizardTest.wizardStepTestComponent.isValid = direction => direction !== MovingDirection.Forwards;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.canExitStep(wizardTest.wizard.currentStep, MovingDirection.Forwards)).toBe(false);
    expect(wizardTest.wizard.canExitStep(wizardTest.wizard.currentStep, MovingDirection.Backwards)).toBe(true);
    expect(wizardTest.wizard.canExitStep(wizardTest.wizard.currentStep, MovingDirection.Stay)).toBe(true);
  });

  it('should not be able to leave the second step in backwards direction', () => {
    wizardTest.wizardStepTestComponent.isValid = direction => direction !== MovingDirection.Backwards;

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.wizard.canExitStep(wizardTest.wizard.currentStep, MovingDirection.Forwards)).toBe(true);
    expect(wizardTest.wizard.canExitStep(wizardTest.wizard.currentStep, MovingDirection.Backwards)).toBe(false);
    expect(wizardTest.wizard.canExitStep(wizardTest.wizard.currentStep, MovingDirection.Stay)).toBe(true);
  });

  it('should throw error when method "canExit" is malformed', () => {
    wizardTest.wizardStepTestComponent.isValid = 'String';

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(() => wizardTest.wizard.canExitStep(wizardTest.wizard.currentStep, MovingDirection.Forwards))
      .toThrow(new Error(`Input value 'String' is neither a boolean nor a function`));
  });

  it('should not leave the second step in forward direction if it can\'t be exited', () => {
    wizardTest.wizardStepTestComponent.isValid = false;

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
    wizardTest.wizardStepTestComponent.isValid = false;

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
    wizardTest.wizardStepTestComponent.isValid = direction => direction === MovingDirection.Backwards;

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
    wizardTest.wizardStepTestComponent.isValid = direction => direction === MovingDirection.Forwards;

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
    wizardTest.wizardStepTestComponent.isValid = direction => direction === MovingDirection.Forwards;

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
    wizardTest.wizardStepTestComponent.isValid = direction => direction === MovingDirection.Backwards;

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
