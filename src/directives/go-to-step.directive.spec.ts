/**
 * Created by marc on 09.01.17.
 */
import {GoToStepDirective} from './go-to-step.directive';
import {Component} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step stepTitle='Steptitle 1' [canExit]="canExit">
        Step 1
        <button type="button" goToStep="0" (preFinalize)="finalizeStep(1)">Stay at this step</button>
        <button type="button" [goToStep]="goToSecondStep" (preFinalize)="finalizeStep(1)">Go to second step</button>
        <button type="button" [goToStep]="{stepOffset: 2}" (preFinalize)="finalizeStep(1)">Go to third step</button>
      </wizard-step>
      <wizard-step stepTitle='Steptitle 2' optionalStep>
        Step 2
        <button type="button" [goToStep]="'2'" (finalize)="finalizeStep(2)">Go to third step</button>
        <button type="button" [goToStep]="{incorrectKey: 3}" (finalize)="finalizeStep(2)">Invalid Button</button>
      </wizard-step>
      <wizard-step stepTitle='Steptitle 3'>
        Step 3
        <button type="button" [goToStep]="{stepOffset: -2}" (postFinalize)="finalizeStep(3)">Go to first step</button>
      </wizard-step>
    </wizard>
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
    wizardState = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(WizardState);
    navigationMode = wizardState.navigationMode;
  });

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(3);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[stepTitle="Steptitle 1"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(3);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[stepTitle="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[stepTitle="Steptitle 3"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(1);

    expect(wizardTestFixture.debugElement.queryAll(By.directive(GoToStepDirective)).length).toBe(9);
  });

  it('should move to step correctly', fakeAsync(() => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button:nth-child(2)')).nativeElement;
    const secondStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 2"] > button')).nativeElement;

    const wizardSteps = wizardState.wizardSteps;

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardSteps[0].selected).toBe(true);
    expect(wizardSteps[1].selected).toBe(false);
    expect(wizardSteps[2].selected).toBe(false);

    // click button
    firstStepGoToButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
    expect(wizardSteps[0].selected).toBe(false);
    expect(wizardSteps[1].selected).toBe(true);
    expect(wizardSteps[2].selected).toBe(false);

    // click button
    secondStepGoToButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardSteps[0].selected).toBe(false);
    expect(wizardSteps[1].selected).toBe(false);
    expect(wizardSteps[2].selected).toBe(true);
  }));

  it('should jump over an optional step correctly', fakeAsync(() => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button:nth-child(3)')).nativeElement;
    const thirdStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 3"] > button')).nativeElement;

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

    // click button
    thirdStepGoToButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardSteps[0].selected).toBe(true);
    expect(wizardSteps[1].selected).toBe(false);
    expect(wizardSteps[2].selected).toBe(false);
  }));

  it('should stay at current step correctly', fakeAsync(() => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button:nth-child(1)')).nativeElement;

    const wizardSteps = wizardState.wizardSteps;

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardSteps[0].selected).toBe(true);
    expect(wizardSteps[1].selected).toBe(false);
    expect(wizardSteps[2].selected).toBe(false);

    // click button
    firstStepGoToButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardSteps[0].selected).toBe(true);
    expect(wizardSteps[1].selected).toBe(false);
    expect(wizardSteps[2].selected).toBe(false);
  }));

  it('should finalize step correctly', fakeAsync(() => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 1"] > button:nth-child(3)')).nativeElement;
    const thirdStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[stepTitle="Steptitle 3"] > button')).nativeElement;

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardTest.eventLog).toEqual([]);

    // click button
    firstStepGoToButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(2);
    expect(wizardTest.eventLog).toEqual(['finalize 1']);

    // click button
    thirdStepGoToButton.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
    expect(wizardTest.eventLog).toEqual(['finalize 1', 'finalize 3']);
  }));

  it('should throw an error when using an invalid goToStep value', fakeAsync(() => {
    const invalidGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-step[stepTitle="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective))[1].injector.get(GoToStepDirective) as GoToStepDirective;

    expect(() => invalidGoToAttribute.destinationStep)
      .toThrow(new Error(`Input 'goToStep' is neither a WizardStep, StepOffset, number or string`));
  }));

  it('should return correct destination step for correct goToStep values', fakeAsync(() => {
    const firstGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-navigation-bar'))
      .queryAll(By.directive(GoToStepDirective))[0].injector.get(GoToStepDirective) as GoToStepDirective;

    const secondGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-step[stepTitle="Steptitle 1"]'))
      .queryAll(By.directive(GoToStepDirective))[1].injector.get(GoToStepDirective) as GoToStepDirective;

    const thirdGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-step[stepTitle="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective))[0].injector.get(GoToStepDirective) as GoToStepDirective;

    const fourthGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-step[stepTitle="Steptitle 3"]'))
      .queryAll(By.directive(GoToStepDirective))[0].injector.get(GoToStepDirective) as GoToStepDirective;

    expect(firstGoToAttribute.destinationStep).toBe(0);
    expect(secondGoToAttribute.destinationStep).toBe(1);
    expect(thirdGoToAttribute.destinationStep).toBe(2);
    expect(fourthGoToAttribute.destinationStep).toBe(0);
  }));

  it('should not leave current step if it the destination step can not be entered', fakeAsync(() => {
    expect(wizardState.currentStepIndex).toBe(0);

    wizardTest.canExit = false;
    wizardTestFixture.detectChanges();

    const secondGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-navigation-bar'))
      .queryAll(By.directive(GoToStepDirective))[1].nativeElement;

    secondGoToAttribute.click();
    tick();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(0);
  }));
});
