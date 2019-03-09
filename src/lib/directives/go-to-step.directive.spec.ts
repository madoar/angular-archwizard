import {Component} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';
/**
 * Created by marc on 09.01.17.
 */
import {GoToStepDirective} from './go-to-step.directive';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1' [canExit]="canExit">
        Step 1
        <button type="button" [awGoToStep]="{stepIndex: 0}" (preFinalize)="finalizeStep(1)">
          Stay at this step
        </button>
        <button type="button" [awGoToStep]="{stepIndex: goToSecondStep}" (preFinalize)="finalizeStep(1)">
          Go to second step
        </button>
        <button type="button" [awGoToStep]="{stepOffset: 2}" (preFinalize)="finalizeStep(1)">
          Go to third step
        </button>
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2' awOptionalStep>
        Step 2
        <button type="button" [awGoToStep]="{stepIndex: 2}" (finalize)="finalizeStep(2)">
          Go to third step
        </button>
        <button type="button" [awGoToStep]="{incorrectKey: 3}" (finalize)="finalizeStep(2)">
          Invalid Button
        </button>
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3'>
        Step 3
        <button type="button" [awGoToStep]="{stepOffset: -2}" (postFinalize)="finalizeStep(3)">
          Go to first step
        </button>
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  public goToSecondStep = 1;

  public canExit = true;

  public eventLog: Array<string> = [];

  finalizeStep(stepIndex: number): void {
    this.eventLog.push(`finalize ${stepIndex}`);
  }
}

describe('GoToStepDirective', () => {
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
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-navigation-bar'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(3);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-step[stepTitle="Steptitle 1"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(3);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-step[stepTitle="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-step[stepTitle="Steptitle 3"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(1);

    expect(wizardTestFixture.debugElement.queryAll(By.directive(GoToStepDirective)).length).toBe(9);
  });

  it('should throw an error when using an invalid targetStep value', fakeAsync(() => {
    const invalidGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('aw-wizard-step[stepTitle="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective))[1].injector.get(GoToStepDirective) as GoToStepDirective;

    expect(() => invalidGoToAttribute.destinationStep)
      .toThrow(new Error(`Input 'targetStep' is neither a WizardStep, StepOffset, StepIndex or StepId`));
  }));
});
