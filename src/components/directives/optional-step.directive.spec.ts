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
}

describe('OptionalStepDirective', () => {
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
    wizardTest = wizardTestFixture.componentInstance;
    wizardState = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(WizardState);
    navigationMode = wizardTestFixture.debugElement.query(By.css('wizard')).injector.get(NavigationMode);

    wizardTestFixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(wizardTestFixture.debugElement.query(By.css('wizard-step[optionalStep]'))).toBeTruthy();
    expect(wizardTestFixture.debugElement.queryAll(By.css('wizard-step[optionalStep]')).length).toBe(1);
  });

  it('should set optional correctly', () => {
    expect(wizardState.getStepAtIndex(0).optional).toBe(false);
    expect(wizardState.getStepAtIndex(1).optional).toBe(true);
    expect(wizardState.getStepAtIndex(2).optional).toBe(false);
  });
});
