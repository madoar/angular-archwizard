/**
 * Created by marc on 09.01.17.
 */
import {GoToStepDirective} from './go-to-step.directive';
import {Component, ViewChild} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {ComponentFixture, async, TestBed} from '@angular/core/testing';
import {WizardStepComponent} from '../components/wizard-step.component';
import {WizardNavigationBarComponent} from '../components/wizard-navigation-bar.component';
import {By} from '@angular/platform-browser';
import {OptionalStepDirective} from './optional-step.directive';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step title='Steptitle 1'>
        Step 1
        <button type="button" goToStep="0" (finalize)="finalizeStep(1)">Stay at this step</button>
        <button type="button" [goToStep]="goToSecondStep" (finalize)="finalizeStep(1)">Go to second step</button>
        <button type="button" [goToStep]="{stepOffset: 2}" (finalize)="finalizeStep(1)">Go to third step</button>
      </wizard-step>
      <wizard-step title='Steptitle 2' optionalStep>
        Step 2
        <button type="button" [goToStep]="'2'" (finalize)="finalizeStep(2)">Go to third step</button>
        <button type="button" [goToStep]="{incorrectKey: 3}" (finalize)="finalizeStep(2)">Invalid Button</button>
      </wizard-step>
      <wizard-step title='Steptitle 3'>
        Step 3
        <button type="button" [goToStep]="{stepOffset: -2}" (finalize)="finalizeStep(3)">Go to first step</button>
      </wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;

  public goToSecondStep = 1;

  public eventLog: Array<string> = new Array<string>();

  finalizeStep(stepIndex: number): void {
    this.eventLog.push(`finalize ${stepIndex}`);
  }
}

describe('GoToStepDirective', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardComponent, WizardStepComponent, WizardNavigationBarComponent,
        WizardTestComponent, GoToStepDirective, OptionalStepDirective],
      providers: [WizardStepComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(By.css('wizard-navigation-bar'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(3);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[title="Steptitle 1"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(3);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[title="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[title="Steptitle 3"]'))
      .queryAll(By.directive(GoToStepDirective)).length).toBe(1);

    expect(wizardTestFixture.debugElement.queryAll(By.directive(GoToStepDirective)).length).toBe(9);
  });

  it('should move to step correctly', () => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[title="Steptitle 1"] > button:nth-child(2)')).nativeElement;
    const secondStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[title="Steptitle 2"] > button')).nativeElement;

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step.current')).nativeElement.title).toBe('Steptitle 1');

    // click button
    firstStepGoToButton.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step.current')).nativeElement.title).toBe('Steptitle 2');

    // click button
    secondStepGoToButton.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step.current')).nativeElement.title).toBe('Steptitle 3');
  });

  it('should jump over an optional step correctly', () => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[title="Steptitle 1"] > button:nth-child(3)')).nativeElement;
    const thirdStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[title="Steptitle 3"] > button')).nativeElement;

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step.current')).nativeElement.title).toBe('Steptitle 1');

    // click button
    firstStepGoToButton.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(2);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step.current')).nativeElement.title).toBe('Steptitle 3');

    // click button
    thirdStepGoToButton.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step.current')).nativeElement.title).toBe('Steptitle 1');
  });

  it('should stay at current step correctly', () => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[title="Steptitle 1"] > button:nth-child(1)')).nativeElement;

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step.current')).nativeElement.title).toBe('Steptitle 1');

    // click button
    firstStepGoToButton.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step.current')).nativeElement.title).toBe('Steptitle 1');
  });

  it('should finalize step correctly', () => {
    const firstStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[title="Steptitle 1"] > button:nth-child(3)')).nativeElement;
    const thirdStepGoToButton = wizardTestFixture.debugElement.query(
      By.css('wizard-step[title="Steptitle 3"] > button')).nativeElement;

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTest.eventLog).toEqual([]);

    // click button
    firstStepGoToButton.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(2);
    expect(wizardTest.eventLog).toEqual(['finalize 1']);

    // click button
    thirdStepGoToButton.click();
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
    expect(wizardTest.eventLog).toEqual(['finalize 1', 'finalize 3']);
  });

  it('should throw an error when using an invalid goToStep value', () => {
    const invalidGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-step[title="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective))[1].injector.get(GoToStepDirective) as GoToStepDirective;

    expect(() => invalidGoToAttribute.destinationStep)
      .toThrow(new Error(`Input 'goToStep' is neither a WizardStep, StepOffset, number or string`));
  });

  it('should return correct destination step for correct goToStep values', () => {
    const firstGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-navigation-bar'))
      .queryAll(By.directive(GoToStepDirective))[0].injector.get(GoToStepDirective) as GoToStepDirective;

    const secondGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-step[title="Steptitle 1"]'))
      .queryAll(By.directive(GoToStepDirective))[1].injector.get(GoToStepDirective) as GoToStepDirective;

    const thirdGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-step[title="Steptitle 2"]'))
      .queryAll(By.directive(GoToStepDirective))[0].injector.get(GoToStepDirective) as GoToStepDirective;

    const fourthGoToAttribute = wizardTestFixture.debugElement
      .query(By.css('wizard-step[title="Steptitle 3"]'))
      .queryAll(By.directive(GoToStepDirective))[0].injector.get(GoToStepDirective) as GoToStepDirective;

    expect(firstGoToAttribute.destinationStep).toBe(wizardTest.wizard.getStepAtIndex(0));
    expect(secondGoToAttribute.destinationStep).toBe(1);
    expect(thirdGoToAttribute.destinationStep).toBe(2);
    expect(fourthGoToAttribute.destinationStep).toBe(0);
  });
});
