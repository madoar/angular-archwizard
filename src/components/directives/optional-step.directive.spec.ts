/* tslint:disable:no-unused-variable */

import { OptionalStepDirective } from './optional-step.directive';
import {Component, ViewChild} from "@angular/core";
import {WizardComponent} from "../components/wizard.component";
import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {WizardStepComponent} from "../components/wizard-step.component";
import {WizardNavigationBarComponent} from "../components/wizard-navigation-bar.component";
import {GoToStepDirective} from "./go-to-step.directive";
import {By} from "@angular/platform-browser";

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step title='Steptitle 1'>
        Step 1
      </wizard-step>
      <wizard-step title='Steptitle 2' optionalStep>
        Step 2
      </wizard-step>  
      <wizard-step title='Steptitle 3'>
        Step 3
      </wizard-step>     
    </wizard>
  `
})
class WizardTestComponent {
  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('OptionalStepDirective', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardComponent, WizardStepComponent, WizardNavigationBarComponent, WizardTestComponent, GoToStepDirective, OptionalStepDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    wizardTestFixture = TestBed.createComponent(WizardTestComponent);
    wizardTest = wizardTestFixture.componentInstance;
    wizardTestFixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[optionalStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-step[optionalStep]')).length).toBe(1);
  });

  it('should set optional correctly', () => {
    expect(wizardTest.wizard.getStepAtIndex(0).optional).toBe(false);
    expect(wizardTest.wizard.getStepAtIndex(1).optional).toBe(true);
    expect(wizardTest.wizard.getStepAtIndex(2).optional).toBe(false);
  });
});
