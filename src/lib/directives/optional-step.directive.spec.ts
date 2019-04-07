import {OptionalStepDirective} from './optional-step.directive';
import {Component, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {WizardComponent} from '../components/wizard.component';

@Component({
  selector: 'aw-test-wizard',
  template: `
    <aw-wizard>
      <aw-wizard-step stepTitle='Steptitle 1'>
        Step 1
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 2' awOptionalStep>
        Step 2
      </aw-wizard-step>
      <aw-wizard-step stepTitle='Steptitle 3'>
        Step 3
      </aw-wizard-step>
    </aw-wizard>
  `
})
class WizardTestComponent {

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
}

describe('OptionalStepDirective', () => {
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardTest: WizardTestComponent;
  let wizard: WizardComponent;
  let wizardState: WizardState;

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
    wizard = wizardTest.wizard;
    wizardState = wizard.model;
  });

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(By.directive(OptionalStepDirective))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.directive(OptionalStepDirective)).length).toBe(1);
  });

  it('should set optional correctly', () => {
    expect(wizardState.getStepAtIndex(0).optional).toBe(false);
    expect(wizardState.getStepAtIndex(1).optional).toBe(true);
    expect(wizardState.getStepAtIndex(2).optional).toBe(false);
  });
});
