import {OptionalStepDirective} from './optional-step.directive';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ArchwizardModule} from '../archwizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard>
      <wizard-step stepTitle='Steptitle 1'>
        Step 1
      </wizard-step>
      <wizard-step stepTitle='Steptitle 2' optional>
        Step 2
      </wizard-step>
      <wizard-step stepTitle='Steptitle 3'>
        Step 3
      </wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
}

describe('OptionalStepDirective', () => {
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
    expect(wizardTestFixture.debugElement.query(By.directive(OptionalStepDirective))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.directive(OptionalStepDirective)).length).toBe(1);
  });

  it('should set optional correctly', () => {
    expect(wizardState.getStepAtIndex(0).optional).toBe(false);
    expect(wizardState.getStepAtIndex(1).optional).toBe(true);
    expect(wizardState.getStepAtIndex(2).optional).toBe(false);
  });
});
