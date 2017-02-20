/* tslint:disable:no-unused-variable */

import { PreviousStepDirective } from './previous-step.directive';
import {ViewChild, Component} from '@angular/core';
import {WizardComponent} from '../components/wizard.component';
import {GoToStepDirective} from './go-to-step.directive';
import {WizardNavigationBarComponent} from '../components/wizard-navigation-bar.component';
import {WizardStepComponent} from '../components/wizard-step.component';
import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step title='Steptitle 1'>
        Step 1
        <button type="button" previousStep>Go to zero step</button>
      </wizard-step>
      <wizard-step title='Steptitle 2'>
        Step 2
        <button type="button" previousStep>Go to first step</button>
      </wizard-step>     
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('PreviousStepDirective', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardComponent, WizardStepComponent, WizardNavigationBarComponent, WizardTestComponent, GoToStepDirective, PreviousStepDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[title="Steptitle 1"] > button[previousStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[title="Steptitle 2"] > button[previousStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-step > button[previousStep]')).length).toBe(2);
  });

  it('should move correctly to the previous step', () => {
    const firstStepButton = wizardTestFixture.debugElement.query(By.css('wizard-step[title="Steptitle 1"] > button[previousStep]')).nativeElement;
    const secondStepButton = wizardTestFixture.debugElement.query(By.css('wizard-step[title="Steptitle 2"] > button[previousStep]')).nativeElement;

    expect(wizardTest.wizard.currentStepIndex).toBe(0);

    // don't go to zero (-1) step, because it doesn't exist
    firstStepButton.click();

    expect(wizardTest.wizard.currentStepIndex).toBe(0);

    // move to second step to test the previousStep directive
    wizardTest.wizard.goToStep(1);
    wizardTestFixture.detectChanges();

    expect(wizardTest.wizard.currentStepIndex).toBe(1);

    // go back to first step
    secondStepButton.click();

    expect(wizardTest.wizard.currentStepIndex).toBe(0);
  });
});
