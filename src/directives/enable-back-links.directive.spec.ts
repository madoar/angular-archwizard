/**
 * Created by marc on 30.06.17.
 */
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Component} from '@angular/core';
import {MovingDirection} from '../util/moving-direction.enum';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step stepTitle='Steptitle 1' (stepEnter)="enterInto($event, 1)" (stepExit)="exitFrom($event, 1)">
        Step 1
      </wizard-step>
      <wizard-step stepTitle='Steptitle 2' [canExit]="isValid"
                   optionalStep (stepEnter)="enterInto($event, 2)" (stepExit)="exitFrom($event, 2)">
        Step 2
      </wizard-step>
      <wizard-completion-step enableBackLinks stepTitle='Completion steptitle 3' (stepEnter)="enterInto($event, 3)"
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
      imports: [ArchwizardModule]
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

  it('should be able to leave the completion step', fakeAsync(() => {
    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    navigationMode.canGoToStep(0).then(result => expect(result).toBe(true));
    navigationMode.canGoToStep(1).then(result => expect(result).toBe(true));
  }));


  it('should be able to leave the completion step in any direction', fakeAsync(() => {
    wizardTest.isValid = false;

    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.currentStep.canExit).toBe(true);
  }));

  it('should leave the completion step', fakeAsync(() => {
    wizardTest.isValid = false;

    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);

    navigationMode.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'exit Backwards 3', 'enter Backwards 2']);
  }));

  it('should work with changed stepExit value', fakeAsync(() => {
    wizardTest.isValid = false;
    wizardTest.completionStepExit = (direction: MovingDirection, source: number) => {
      wizardTest.eventLog.push(`changed exit ${MovingDirection[direction]} ${source}`);
    };

    expect(wizardState.completed).toBe(false);

    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardState.completed).toBe(true);

    navigationMode.goToPreviousStep();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardTest.eventLog)
      .toEqual(['enter Forwards 1', 'exit Forwards 1', 'enter Forwards 3', 'changed exit Backwards 3', 'enter Backwards 2']);
    expect(wizardState.completed).toBe(false);
  }));
});
