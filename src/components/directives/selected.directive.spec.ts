import {OptionalStepDirective} from './optional-step.directive';
import {Component} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {WizardModule} from '../wizard.module';
import {WizardState} from '../navigation/wizard-state.model';
import {NavigationMode} from '../navigation/navigation-mode.interface';

@Component({
  selector: 'test-wizard',
  template: `
    <wizard navigationMode="free">
      <wizard-step title='Steptitle 1'>
        Step 1
      </wizard-step>
      <wizard-step title='Steptitle 2' selected>
        Step 2
      </wizard-step>
      <wizard-step title='Steptitle 3'>
        Step 3
      </wizard-step>
    </wizard>
  `
})
class WizardTestComponent {
}

describe('SelectedStepDirective', () => {
  let wizardTest: WizardTestComponent;
  let wizardTestFixture: ComponentFixture<WizardTestComponent>;

  let wizardState: WizardState;
  let navigationMode: NavigationMode;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WizardTestComponent],
      imports: [WizardModule]
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
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[selected]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-step[selected]')).length).toBe(1);
  });

  it('should set optional correctly', () => {
    expect(wizardState.defaultStepIndex).toBe(1);
    expect(wizardState.currentStepIndex).toBe(1);
  });

  it('should reset correctly', () => {
    navigationMode.goToStep(0);

    expect(wizardState.currentStepIndex).toBe(0);

    navigationMode.reset();
    wizardTestFixture.detectChanges();

    expect(wizardState.currentStepIndex).toBe(1);
  });
});
