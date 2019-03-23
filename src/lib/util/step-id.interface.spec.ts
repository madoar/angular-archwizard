import {Component} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {GoToStepDirective} from '../directives/go-to-step.directive';
import {NavigationMode} from '../navigation/navigation-mode.interface';
import {WizardState} from '../navigation/wizard-state.model';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepId='first-step' stepTitle='Steptitle 1' [canExit]="canExit">
        Step 1
        <button type="button" [awGoToStep]="{stepId: 'third-step'}" (preFinalize)="finalizeStep(1)">
          Go to third step
        </button>
      </aw-wizard-step>
      <aw-wizard-step stepId='second-step' stepTitle='Steptitle 2' awOptionalStep>
        Step 2
        <button type="button" [awGoToStep]="{stepId: 'second-step'}" (preFinalize)="finalizeStep(2)">
          Stay on second step
        </button>
      </aw-wizard-step>
      <aw-wizard-step stepId='third-step' stepTitle='Steptitle 3'>
        Step 3
        <button type="button" [awGoToStep]="{stepId: 'first-step'}" (postFinalize)="finalizeStep(3)">
          Go to first step
        </button>
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {
  public canExit = true;

  public eventLog: Array<string> = [];

  public finalizeStep(stepIndex: number): void {
    this.eventLog.push(`finalize ${stepIndex}`);
  }
}

describe('StepId', () => {
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
      .queryAll(By.directive(GoToStepDirective)).length).toBe(1);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-step[stepTitle="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(1);
    expect(wizardTestFixture.debugElement.query(By.css('aw-wizard-step[stepTitle="Steptitle 3"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(1);

    expect(wizardTestFixture.debugElement.queryAll(By.directive(GoToStepDirective)).length).toBe(6);
  });

  it('should move to an earlier step correctly', fakeAsync(() => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 3"] > button')).nativeElement;

    const wizardSteps = wizardState.wizardSteps;

    navigationMode.goToStep(2);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardSteps[0].selected).toBe(false);
    expect(wizardSteps[1].selected).toBe(false);
    expect(wizardSteps[2].selected).toBe(true);

    // click button
    firstStepGoToButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardSteps[0].selected).toBe(true);
    expect(wizardSteps[1].selected).toBe(false);
    expect(wizardSteps[2].selected).toBe(false);
  }));

  it('should move to a later step correctly', fakeAsync(() => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 1"] > button')).nativeElement;

    const wizardSteps = wizardState.wizardSteps;

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardSteps[0].selected).toBe(true);
    expect(wizardSteps[1].selected).toBe(false);
    expect(wizardSteps[2].selected).toBe(false);

    // click button
    firstStepGoToButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardSteps[0].selected).toBe(false);
    expect(wizardSteps[1].selected).toBe(false);
    expect(wizardSteps[2].selected).toBe(true);
  }));

  it('should stay at current step correctly', fakeAsync(() => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('aw-wizard-step[stepTitle="Steptitle 2"] > button')).nativeElement;

    const wizardSteps = wizardState.wizardSteps;

    navigationMode.goToStep(1);
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardSteps[0].selected).toBe(false);
    expect(wizardSteps[1].selected).toBe(true);
    expect(wizardSteps[2].selected).toBe(false);

    // click button
    firstStepGoToButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardSteps[0].selected).toBe(false);
    expect(wizardSteps[1].selected).toBe(true);
    expect(wizardSteps[2].selected).toBe(false);
  }));

  it('should return correct destination step for correct targetStep values', fakeAsync(() => {
    const firstGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('aw-wizard-step[stepTitle="Steptitle 1"]'))
      .query(By.directive(GoToStepDirective)).injector.get(GoToStepDirective) as GoToStepDirective;

    const secondGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('aw-wizard-step[stepTitle="Steptitle 3"]'))
      .query(By.directive(GoToStepDirective)).injector.get(GoToStepDirective) as GoToStepDirective;

    expect(firstGoToAttribute.destinationStep).toBe(2);
    expect(secondGoToAttribute.destinationStep).toBe(0);
  }));

  it('should not leave current step if the destination step can not be entered', fakeAsync(() => {
    expect(wizardState.currentStepIndex).toBe(0);

    wizardTest.canExit = false;
    wizardTestFixture.detectChanges();

    const secondGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('aw-wizard-navigation-bar'))
      .query(By.directive(GoToStepDirective)).nativeElement;

    secondGoToAttribute.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
  }));
});
