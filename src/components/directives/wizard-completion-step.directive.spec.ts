/**
 * Created by marc on 20.05.17.
 */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ViewChild, Component} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {MovingDirection} from '../util/moving-direction.enum';
import {By} from '@angular/platform-browser';
import {WizardModule} from '../wizard.module';
import {WizardCompletionStepDirective} from './wizard-completion-step.directive';

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
      <div wizardCompletionStep title='Completion steptitle 3' (stepEnter)="enterInto($event, 3)">
        Step 3
      </div>
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

describe('WizardCompletionStepDirective', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
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
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-step')).length).toBe(2);
    expect(wizardTestFixture.debugElement.queryAll(By.directive(WizardCompletionStepDirective)).length).toBe(1);
  });

  it('should have correct step title', () => {
    expect(wizardTest).toBeTruthy();
    expect(wizardTest.wizard.getStepAtIndex(0).title).toBe('Steptitle 1');
    expect(wizardTest.wizard.getStepAtIndex(1).title).toBe('Steptitle 2');
    expect(wizardTest.wizard.getStepAtIndex(2).title).toBe('Completion steptitle 3');
  });

  it('should enter first step after initialisation', () => {
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1']);
  });

  it('should enter completion step after first step', () => {
    expect(wizardTest.wizard.currentStepIndex).toBe(0);

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2']);

    wizardTest.wizard.goToNextStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(2);
    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 2',
      'exit Forwards 2', 'enter Forwards 3']);
  });

  it('should enter completion step after jumping over second optional step', () => {
    wizardTest.wizard.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardTest.eventLog).toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3']);
  });

  it('should set the wizard as completed after entering the completion step', () => {
    wizardTest.wizard.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.completed).toBe(true);
  });

  it('should be unable to leave the completion step', () => {
    wizardTest.wizard.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.canGoToStep(0)).toBe(false);
    expect(wizardTest.wizard.canGoToStep(1)).toBe(false);
  });


  it('should not be able to leave the completion step in any direction', () => {
    wizardTest.isValid = false;

    wizardTest.wizard.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(2);
    expect(wizardTest.wizard.currentStep.canExit).toBe(false);
  });

  it('should not leave the completion step if it can\'t be exited', () => {
    wizardTest.isValid = false;

    wizardTest.wizard.goToStep(2);
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(2);

    wizardTest.wizard.goToPreviousStep();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(2);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'enter Stay 3']);
  });
});
